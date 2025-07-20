import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../utils/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "../../utils/axios";


export default function ProfileMenu({ isOpen, onClose }) {
    const navigate = useNavigate();
    const menuRef = useRef();
    const { auth, logout } = useAuth()

    const user = auth?.user

    const handleLogout = async () => {

        try {
            const res = await axios.post('/user/logout')
            if (res?.data.status === 200) console.log("User logged out successfully!")
            logout();
            navigate("/user/login");

        } catch (error) {
            console.error("Login error", error)
        }

    }

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 w-72 h-full bg-black text-white z-50 p-6 border-l-2 border-purple-700 shadow-2xl"
                >
                    <div className="flex flex-col items-center text-center space-y-5">
                        <img
                            src={user?.avatar}
                            alt="User Avatar"
                            className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-md"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                            <p className="text-sm text-purple-400">@{user?.username}</p>
                        </div>

                        <button
                            onClick={() => {
                                navigate(`/channel/${user._id}`);
                                onClose(); // Close the menu when navigating
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-audiowide shadow transition-all"
                        >
                            View your channel
                        </button>
                    </div>

                    <div className="mt-8 bg-black border border-purple-500 rounded-xl p-4 shadow-[0_0_10px_#9333ea] space-y-4">

                        <ul className="text-white text-sm space-y-2 list-disc list-inside">
                            <li onClick={()=>navigate('/user/update-details')} className=" cursor-pointer hover:text-purple-400 transition">Update your Details</li>
                            <li onClick={()=>navigate('/user/update-avatar')} className=" cursor-pointer hover:text-purple-400 transition">Update your Avatar</li>
                            <li onClick={()=>navigate('/user/update-cover')} className=" cursor-pointer hover:text-purple-400 transition">Update your CoverImage</li>
                        </ul>

                        <hr className="border-purple-700 opacity-40" />

                        <div className="grid grid-cols-1 gap-3 mt-3">
                            <button onClick={()=>navigate("/tweet/add")} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-900 transition shadow-[0_0_10px_#a855f7]">
                                <span className="text-xl">📝</span>
                                <span className="text-sm font-semibold">Add Tweet</span>
                            </button>

                            <button onClick={()=>navigate("/video/publish")} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-900 transition shadow-[0_0_10px_#a855f7]">
                                <span className="text-xl">📤</span>
                                <span className="text-sm font-semibold">Publish Video</span>
                            </button>

                            <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-900 transition shadow-[0_0_10px_#a855f7]">
                                <span className="text-xl">🎨</span>
                                <span className="text-sm font-semibold">Customize Channel</span>
                            </button>

                            <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-900 transition shadow-[0_0_10px_#a855f7]">
                                <span className="text-xl">📊</span>
                                <span className="text-sm font-semibold">View Analytics</span>
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-0 w-full text-center">
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-400 hover:text-red-500 transition font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
