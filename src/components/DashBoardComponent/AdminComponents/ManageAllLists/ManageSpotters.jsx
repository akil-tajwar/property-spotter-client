import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../Provider/AuthProvider";

const ManageSpotters = () => {
    const [spotters, setSpotters] = useState([]);
    const [spotterData, setSpotterData] = useState(null);
    const [openEditModal, setEditModal] = useState(false);
    const [openListModal, setListModal] = useState(false);
    const [imagePath, setImagePath] = useState("")
    const [tableData, setTableData] = useState([]);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        fetch("http://localhost:5000/spotters")
            .then((res) => res.json())
            .then((data) => setSpotters(data));
    });
    const handleEditModal = (spotter) => {
        setEditModal(true);
        setSpotterData(spotter);
    };
    const handleListModal = (spotter) => {
        setListModal(true);
        const email = spotter?.email;
        fetch(`http://localhost:5000/all-list/${email}`)
            .then((res) => res.json())
            .then((data) => setTableData(data));
    };
    const closeListModal = () => {
        setListModal(false);
        setTableData([]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", e.target.name.value);
        formData.append("email", e.target.email.value);
        formData.append("password", e.target.password.value);
        formData.append("images", imagePath);
        // console.log(e.target.files[0]);
        const res = await fetch(
            `http://localhost:5000/update/${spotterData.email}`,
            {
                method: "PUT",
                body: formData,
            }
        );
        setEditModal(false);
        setSpotterData(null);
        setImagePath("")
        toast.success("Successfully updated");
    };
    const [PayoutModal, setPayoutModal] = useState(false);
    const [PayoutModalData, setPayoutModalData] = useState([]);
    const handlePayoutModal = (spotter) => {
        setPayoutModal(true);
        const email = spotter?.email;
        fetch(`http://localhost:5000/all-list/${email}`)
            .then((res) => res.json())
            .then((data) => setPayoutModalData(data));
    };
    const closePayoutModal = () => {
        setPayoutModal(false);
        setPayoutModalData([]);
    };

    const [AllocatePayoutModal, setAllocatePayoutModal] = useState(false);
    const [AllocatePayoutModalData, setAllocatePayoutModalData] = useState([]);
    const handleAllocatePayoutModal = (spotter) => {
        setAllocatePayoutModal(true);
        const email = spotter?.email;
        fetch(`http://localhost:5000/all-list/${email}`)
            .then((res) => res.json())
            .then((data) => setAllocatePayoutModalData(data));
    };
    const closeAllocatePayoutModal = () => {
        setAllocatePayoutModal(false);
        setAllocatePayoutModalData([]);
    };
    return (
        <div className="p-6">
            <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-7">
                <div className="flex justify-center shadow-xl border-2 border-primary p-4 rounded-md mb-7">
                    <div className="text-center">
                        <h4 className="text-xl font-medium ">
                            Hello,
                            <span className="text-3xl font-bold text-primary uppercase">
                                {user?.name}
                            </span>
                        </h4>
                        <p>{"Here's what's going on"}</p>
                    </div>
                </div>
                <div className="flex justify-center items-center shadow-xl border-2 border-primary p-4 rounded-md mb-7">
                    <h4 className="text-2xl font-medium">
                        Total Spotter:{" "}
                        <span className="text-3xl text-primary font-bold">
                            {spotters.length}
                        </span>
                    </h4>
                </div>
            </div>
            <div className="shadow-2xl border-2 border-primary p-5 rounded-md">
                <div className="flex justify-between"></div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {/* head */}
                        <thead>
                            <tr className="font-semibold text-base text-center">
                                <th>Image</th>
                                <th>Spooter Name</th>
                                <th>Spooter Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spotters.map((spotter, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50 transition duration-300"
                                >
                                    <td className="py-4 px-6 border-b">
                                        <img src={spotter?.photoURL} alt="" />
                                    </td>
                                    <td className="py-4 px-6 border-b">
                                        {spotter?.name}
                                    </td>
                                    <td className="py-4 px-6 border-b">
                                        {spotter?.email}
                                    </td>
                                    <td className="py-4 px-6 border-b">
                                        <div className="relative flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEditModal(spotter)
                                                }
                                                className="bg-primary text-sm text-white  px-3 py-2"
                                            >
                                                Edit
                                            </button>
                                            <div
                                                onClick={() =>
                                                    setEditModal(false)
                                                }
                                                className={`fixed z-[100] flex items-center justify-center ${
                                                    openEditModal
                                                        ? "opacity-1 visible"
                                                        : "invisible opacity-0"
                                                } inset-0 h-full w-full bg-black/20 backdrop-blur-sm duration-100`}
                                            >
                                                <div
                                                    onClick={(e_) =>
                                                        e_.stopPropagation()
                                                    }
                                                    className={`absolute top-10 w-full rounded-lg bg-white  drop-shadow-2xl sm:w-[500px] ${
                                                        openEditModal
                                                            ? "opacity-1 translate-y-0 duration-300"
                                                            : "-translate-y-20 opacity-0 duration-150"
                                                    }`}
                                                >
                                                    <form
                                                        onSubmit={handleUpdate}
                                                        className="px-5 pb-5 pt-3 lg:pb-10 lg:pt-5 lg:px-10 h-96 overflow-y-scroll"
                                                    >
                                                        <svg
                                                            onClick={() =>
                                                                setEditModal(
                                                                    false
                                                                )
                                                            }
                                                            className="mx-auto mr-0 w-10 cursor-pointer fill-black dark:fill-white"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <g strokeWidth="0"></g>
                                                            <g
                                                                id="SVGRepo_tracerCarrier"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            ></g>
                                                            <g id="SVGRepo_iconCarrier">
                                                                <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"></path>
                                                            </g>
                                                        </svg>
                                                        <div className="space-y-5">
                                                            {/* Input fields for name, city, and country */}
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Name"
                                                                    defaultValue={
                                                                        spotterData?.name
                                                                    }
                                                                    className="border border-black py-3 px-5 w-full"
                                                                />
                                                                <h1 className="absolute -top-2 left-4 px-1 bg-white text-sm">
                                                                    Spotter Name
                                                                </h1>
                                                            </div>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="email"
                                                                    placeholder="Email"
                                                                    defaultValue={
                                                                        spotterData?.email
                                                                    }
                                                                    className="border border-black py-3 px-5 w-full"
                                                                />
                                                                <h1 className="absolute -top-2 left-4 px-1 bg-white text-sm">
                                                                    Spotter
                                                                    Email
                                                                </h1>
                                                            </div>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="password"
                                                                    placeholder="*********"
                                                                    className="border border-black py-3 px-5 w-full"
                                                                />
                                                                <h1 className="absolute -top-2 left-4 px-1 bg-white text-sm">
                                                                    Password
                                                                </h1>
                                                            </div>
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    name="images"
                                                                    onChange={(e)=>setImagePath(e.target.value)}
                                                                    className="file-input file-input-bordered w-full"
                                                                />
                                                            </div>
                                                            {/* Submit button */}
                                                            <button
                                                                type="submit"
                                                                className="border-2 bg-black text-white border-black py-3 px-5 w-full"
                                                            >
                                                                Submit Now
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleListModal(spotter)
                                                }
                                                className="bg-green-500 text-sm text-white  px-3 py-2"
                                            >
                                                View Lists
                                            </button>
                                            <div
                                                onClick={() => closeListModal()}
                                                className={`fixed z-[100] flex items-center justify-center ${
                                                    openListModal
                                                        ? "opacity-1 visible"
                                                        : "invisible opacity-0"
                                                } inset-0 h-full w-full bg-black/20 backdrop-blur-sm duration-100`}
                                            >
                                                <div
                                                    onClick={(e_) =>
                                                        e_.stopPropagation()
                                                    }
                                                    className={`absolute top-10 w-full rounded-lg bg-white  drop-shadow-2xl sm:w-[750px] ${
                                                        openListModal
                                                            ? "opacity-1 translate-y-0 duration-300"
                                                            : "-translate-y-20 opacity-0 duration-150"
                                                    }`}
                                                >
                                                    <table className="min-w-[90%] shadow-md  border mx-auto border-gray-100  my-6">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Owner Name
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Bathroom
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Bedroom
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Sell Time
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Status
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tableData.map(
                                                                (item) => (
                                                                    <tr>
                                                                        <td className="py-4 px-6 border-b">
                                                                            {
                                                                                item.houseOwnerName
                                                                            }
                                                                        </td>
                                                                        <td className="py-4 px-6 border-b">
                                                                            {
                                                                                item.bathroom
                                                                            }
                                                                        </td>
                                                                        <td className="py-4 px-6 border-b">
                                                                            {
                                                                                item.bedroom
                                                                            }
                                                                        </td>
                                                                        <td className="py-4 px-6 border-b">
                                                                            {
                                                                                item.sellTime
                                                                            }
                                                                        </td>
                                                                        <td className="py-4 px-6 border-b">
                                                                            {
                                                                                item.status
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handlePayoutModal(spotter)
                                                }
                                                className="bg-amber-500 text-sm text-white  px-3 py-2"
                                            >
                                                Payout
                                            </button>
                                            <div
                                                onClick={() =>
                                                    closePayoutModal()
                                                }
                                                className={`fixed z-[100] flex items-center justify-center ${
                                                    PayoutModal
                                                        ? "opacity-1 visible"
                                                        : "invisible opacity-0"
                                                } inset-0 h-full w-full bg-black/20 backdrop-blur-sm duration-100`}
                                            >
                                                <div
                                                    onClick={(e_) =>
                                                        e_.stopPropagation()
                                                    }
                                                    className={`absolute top-10 w-full rounded-lg bg-white  drop-shadow-2xl sm:w-[750px] ${
                                                        PayoutModal
                                                            ? "opacity-1 translate-y-0 duration-300"
                                                            : "-translate-y-20 opacity-0 duration-150"
                                                    }`}
                                                >
                                                    <table className="min-w-[90%] shadow-md  border mx-auto border-gray-100  my-6">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Owner Name
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Bathroom
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Bedroom
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Sell Time
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Status
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {PayoutModalData?.filter(
                                                                (data) =>
                                                                    data.status ==
                                                                    "sold"
                                                            ).map((item) => (
                                                                <tr>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.houseOwnerName
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.bathroom
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.bedroom
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.sellTime
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.status
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleAllocatePayoutModal(
                                                        spotter
                                                    )
                                                }
                                                className="bg-primary text-sm text-white  px-3 py-2"
                                            >
                                                Allocate a payout
                                            </button>
                                            <div
                                                onClick={() =>
                                                    closeAllocatePayoutModal()
                                                }
                                                className={`fixed z-[100] flex items-center justify-center ${
                                                    AllocatePayoutModal
                                                        ? "opacity-1 visible"
                                                        : "invisible opacity-0"
                                                } inset-0 h-full w-full bg-black/20 backdrop-blur-sm duration-100`}
                                            >
                                                <div
                                                    onClick={(e_) =>
                                                        e_.stopPropagation()
                                                    }
                                                    className={`absolute top-10 w-full rounded-lg bg-white  drop-shadow-2xl sm:w-[750px] ${
                                                        AllocatePayoutModal
                                                            ? "opacity-1 translate-y-0 duration-300"
                                                            : "-translate-y-20 opacity-0 duration-150"
                                                    }`}
                                                >
                                                    <table className="min-w-[90%] shadow-md  border mx-auto border-gray-100  my-6">
                                                        <thead>
                                                            <tr className="bg-primary text-white">
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Owner Name
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Bathroom
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Bedroom
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Sell Time
                                                                </th>
                                                                <th className="py-3 px-6 text-left border-b">
                                                                    Status
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {AllocatePayoutModalData?.filter(
                                                                (data) =>
                                                                    data.status ==
                                                                    "pending mandate"
                                                            ).map((item) => (
                                                                <tr>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.houseOwnerName
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.bathroom
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.bedroom
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.sellTime
                                                                        }
                                                                    </td>
                                                                    <td className="py-4 px-6 border-b">
                                                                        {
                                                                            item.status
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageSpotters;
