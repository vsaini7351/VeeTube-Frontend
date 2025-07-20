import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../utils/authContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function Sidebar({ isOpen, onClose }) {
    const navigate=useNavigate();
    const [subscribed,setSubscribed]=useState([])
    const {auth}= useAuth()


    useEffect(()=>{

    ;(async()=>{
        if(auth){
        try {
            const res= await axios.get(`/subscription/u/${auth?.user?._id}`)
            const subscribedChannels=res?.data?.data
            setSubscribed(subscribedChannels)
        } catch (error) {
            console.log("Unable to fetch subscribed channels")
        }

    }
    else setSubscribed([]);
    })()
    
  },[auth])


    const handleClick = (url) => {
    if (!auth) {
      toast.error("Please login to view your watch history", {
        position: "top-center",
        theme: "dark",
        autoClose: 3000,
        style: { backgroundColor: "#7f1d1d", color: "white", fontWeight: "bold" },
      });
    } else {
      navigate(url);
    }
  };

  
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const sidebarContent = (
        <div className="h-full w-64 bg-black text-white border-r-2 border-purple-600 px-6 py-4 flex flex-col space-y-4 shadow-lg">

            {/* Nav Links */}
            <div className="space-y-4">
                <p onClick={()=> navigate('/')} className="cursor-pointer text-lg hover:text-purple-600">Home</p>
                <p onClick={()=> handleClick('/subscriptions')} className="cursor-pointer text-lg hover:text-purple-600">Subscription</p>
                <p onClick={()=> handleClick('/your-videos')} className="cursor-pointer text-lg hover:text-purple-600">Your Videos</p>

                <hr className="border-gray-600" />

                <p onClick={()=> handleClick('/watch-history')} className="cursor-pointer text-lg hover:text-purple-600">Watch- History</p>
                <p onClick={()=> handleClick('/playlists')} className="cursor-pointer text-lg hover:text-purple-600">Playlist</p>
                <p onClick={()=> handleClick('/liked-videos')} className="cursor-pointer text-lg hover:text-purple-600">Liked Video</p>
                <p onClick={()=> handleClick('/liked-tweets')} className="cursor-pointer text-lg hover:text-purple-600">Liked Tweets</p>

                <hr className="border-gray-600" />
            </div>

            {/* Subscriptions */}
            <div className="mt-6">
      <p className="text-white font-semibold mb-2">Subscription</p>
      {/* <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-purple-500 rounded-full" />
        <div className="w-24 h-[2px] bg-purple-600" />
      </div> */}

      {/* Scrollable section */}
      <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {!auth ? (
          <p className="text-gray-400 text-sm">Login to get your subscribed channels</p>
        ) : subscribed.length === 0 ? (
          <p className="text-gray-400 text-sm">No subscriptions found</p>
        ) : (
          subscribed.map((channel) => (
            <div
              key={channel._id}
              onClick={() => navigate(`/channel/${channel._id}`)}
              className="flex items-center gap-3 cursor-pointer hover:bg-[#222] p-2 rounded-md transition"
            >
              <img
                src={channel.avatar || "/default-avatar.png"}
                alt={channel.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-white text-lg">{channel.fullName}</span>
            </div>
          ))
        )}
      </div>
    </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 h-full w-64 z-50 bg-black"
                    >
                        <div className="flex justify-end p-2">
                            <button onClick={onClose} className="text-white text-2xl">✖</button>
                        </div>
                        {sidebarContent}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <div className="hidden md:flex h-screen">{sidebarContent}</div>
    );
}
