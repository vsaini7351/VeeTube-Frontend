import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { Search } from "lucide-react";

import { useAuth } from "../../utils/authContext";

export default function Navbar({ onHamburgerClick }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const { auth } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const avatarRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");

    // const handleLogout = async () => {
    //     try {
    //         const res = await axios.post('/user/logout')
    //         if (res?.data.status === 200) console.log("User logged out successfully!")
    //         clearAuthData();
    //         setAuth(null);
    //         navigate("/user");
    //     } catch (error) {
    //         console.error("Login error", error)
    //     }
    // }; // profilemenu me use kar li hai
    // Close menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                showMenu &&
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !avatarRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [showMenu]);

    const loggedIn = !!auth?.user;

    return (

        <nav className="h-[70px] relative w-full px-4 md:pl-8 md:pr-10 lg:pr-12 xl:pr-16 flex items-center justify-between z-20 bg-black text-gray-700 transition-all border-b-2 border-purple-500 shadow-[0_2px_20px_#a855f7]">


            <div className="flex items-center">
                {/* Hamburger Button - only on mobile */}
                <button
                    onClick={onHamburgerClick}
                    className="block md:hidden text-white mr-3"
                >
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Logo */}
                <Link to="/" className="text-indigo-600">
                    <img src="/VeeTubeLogo.svg" alt="Logo" className="h-10 w-auto" />
                </Link>
            </div>



            {/* Search bar for desktop */}
            <div className="flex-1 mx-2 max-w-xs sm:mx-4 sm:max-w-md hidden md:flex">
                <form
                    className="w-full flex justify-center items-center p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
                        }
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-1 rounded-full bg-black border border-purple-600 text-white outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="p-2 group"
                    >
                        <Search
                            className="w-5 h-5 text-purple-400 group-hover:text-white transition duration-300 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]"
                        />
                    </button>
                </form>

            </div>


            <div className="md:hidden ml-auto mr-2.5 ">
                <button onClick={() => setShowSearch(true)} className="text-white hover:text-purple-400 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                </button>
            </div>




            {/* Avatar / Login Button */}

            <div className="relative z-30">

                {/* Search icon for mobile only */}


                {loggedIn ? (
                    <>
                        <img
                            src={auth.user.avatar}
                            alt="Profile"
                            ref={avatarRef}
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="w-10 h-10 rounded-full cursor-pointer border-2 border-purple-500"
                        />
                        {showMenu && (
                            <div ref={menuRef} className="fixed top-0 right-0 z-40">
                                <ProfileMenu
                                    isOpen={showMenu}
                                    onClose={() => setShowMenu(false)}
                                    user={auth.user} // ✅ pass user as prop
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative group flex items-center justify-center">
                        <button
                            onClick={() => navigate("/user/login")}
                            className="relative z-10 font-audiowide text-white text-sm px-6 py-2 rounded-md bg-gradient-to-t from-purple-700/70 to-black border border-purple-500 shadow-md hover:shadow-purple-500/40 transition-all duration-300"
                        >
                            Login
                        </button>

                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-purple-500 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-all" />
                    </div>
                )}
            </div>

            {showSearch && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-start pt-28 z-50 animate-fadeIn">
                    <div className="bg-zinc-900 w-[90%] max-w-md p-6 rounded-2xl shadow-2xl border border-purple-500/60 relative ring-1 ring-purple-400/20 backdrop-blur-lg">

                        {/* Header with Close */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl font-bold tracking-wide">Search</h2>
                            <button
                                onClick={() => setShowSearch(false)}
                                className="text-purple-400 hover:text-white text-2xl font-bold transition-transform hover:scale-110"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Glowing Search Input */}
                        <div className="relative">
                            <form
                                className="w-full flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim()) {
                                        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
                                        setShowSearch(false);
                                    }
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Type to search..."
                                    className="flex-grow px-5 py-3 text-white bg-black/60 border border-purple-700 placeholder-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl text-white transition"
                                >
                                    🔍
                                </button>
                            </form>
                            <div className="absolute inset-0 rounded-xl border border-purple-500 opacity-10 animate-pulse pointer-events-none"></div>
                        </div>
                    </div>
                </div>

            )}


        </nav>
    );
}
