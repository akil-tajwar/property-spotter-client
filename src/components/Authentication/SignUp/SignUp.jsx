import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message } from "antd";
import axios from "axios";
import React, { useContext, useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
const { useForm } = Form;

const SignUp = () => {
  const [error, setError] = useState("");
  const { signinWithGoogle, user, setUser } = useContext(AuthContext);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [form] = useForm();

  if (user) {
    if (user.role === "user" || user.role === "spooter") navigate("/");
    if (user?.role !== "user") navigate("/dashboard");
  }
  
  const onFinish = async (values) => {
    try {
      const { name, email, password, confirmPassword } = values;

      // Validate password
      if (!/(?=.*[A-Z]).*[a-z]/.test(password)) {
        setError("Please add at least one uppercase and one lowercase letter");
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setError("Password and Confirm Password do not match");
        return;
      }

      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("role", "user");
      data.append("password", confirmPassword);
      data.append("images", fileList[0].originFileObj);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const url = "http://localhost:5000/signup";
      console.log(data);
      try {
        await axios.post(url, data, config);
        message.success("Signup successful");
        form.resetFields();
        navigate('/loginSignup')
      } catch (error) {
        console.error("Signup failed:", error);
        message.error("Failed to signup. Please try again later.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      message.error("Failed to signup. Please try again later.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    setFileList(e.fileList);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const props = {
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: () => {
      return false;
    },
    fileList,
  };

  const handleGoogleLogin = () => {
    signinWithGoogle()
      .then((result) => {
        const person = result?.user;
        console.log("🚀 ~ .then ~ person:", person);

        if (person) {
          const userData = {
            name: person?.displayName,
            email: person?.email,
            role: "user",
            password: "",
            photoURL: person?.photoURL,
          };

          axios
            .post("http://localhost:5000/signup/google", userData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log("🚀 ~ .then ~ response:", response.data);
              if (!response) {
                message.error("Failed to Signup");
              }
              const { token, user: userData } = response.data;
              message.success("Login successful");
              if (userData) {
                console.log("🚀 ~ handleGoogleLogin ~ userData:", userData);
                setUser(userData);
                localStorage.setItem("access-token", token);
                if (userData?.role === "user" || userData?.role === "spooter") {
                  navigate("/");
                }
                else{
                  navigate("/dashboard");
                }
              }
            })
            .catch((error) => {
              console.error("Error posting user data:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Google sign-in error:", error.message);
      });
  };
  const handleFB = () => {
    facebookSignIn()
      .then((result) => {
        const user = result.user;

        console.log(user);
        const saveUser = {
          name: user?.displayName,
          email: user.email,
          password: "",
          photoURL: user?.photoURL,
          role: "user",
        };
        console.log(saveUser);

        axios
          .post("http://localhost:5000/signup/google", saveUser, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(() => {
            message.success("Login successful"); // Display success message
            if (userData?.role === "user" || userData?.role === "spooter") {
              navigate("/");
            }
            else{
              navigate("/dashboard");
            }
          })
          .catch((error) => {
            console.error("Error posting user data:", error);
          });
      })
      .catch((error) => {
        console.error("Google sign-in error:", error.message);
      });
  };
  return (
    <>
      <Form
        form={form}
        name="property_signup"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <label htmlFor="">Name</label>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input className="bg-[#f5f5f5] rounded p-2 border-slate-300 border w-full" />
        </Form.Item>
        <label htmlFor="">Email</label>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input className="bg-[#f5f5f5] rounded p-2 border-slate-300 border w-full" />
        </Form.Item>
        <label htmlFor="">Password</label>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password className="bg-[#f5f5f5] rounded p-2 border-slate-300 border w-full" />
        </Form.Item>
        <label htmlFor="">Confirm Password</label>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password!" }]}
        >
          <Input.Password className="bg-[#f5f5f5] rounded p-2 border-slate-300 border w-full" />
        </Form.Item>
        <label htmlFor="">Image</label>
        <Form.Item
          name="user_image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload a Image!",
            },
          ]}
        >
          <Upload
            name="logo"
            action="/upload.do"
            listType="picture"
            {...props}
            className=""
          >
            <Button className="w-full" icon={<UploadOutlined />}>
              Click to upload Image
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-[#1d9cb5] rounded text-white font-semibold h-10 mt-3"
          >
            Create New Account
          </Button>
        </Form.Item>
      </Form>
      <div className="flex flex-col text-center gap-2 mb-3">
        <Button
          onClick={handleGoogleLogin}
          className="w-full border-[#1d9cb5] border rounded font-semibold h-10 mt-3 flex justify-center items-center gap-3"
        >
          <FaGoogle size="1em" />
          <span>Continue with Google</span>
        </Button>
        <Button
          onClick={handleFB}
          className="w-full border-[#1d9cb5] border rounded font-semibold h-10 flex justify-center items-center gap-3"
        >
          <FaFacebook size="1em" />
          <span>Continue with Facebook</span>
        </Button>
      </div>
      <div className="text-center">
        <small>
          By continuing I understand and agree with Property24’s{" "}
          <Link to="/forgot-password" className="link link-info">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link to="/forgot-password" className="link link-info">
            Privacy Policy.
          </Link>
        </small>
      </div>
      <p className="text-center pt-8 text-red-700 font-semibold">{error}</p>
    </>
  );
};

export default SignUp;
