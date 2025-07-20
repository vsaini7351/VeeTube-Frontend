import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/authContext"; // if using AuthContext
import { toast } from "react-toastify";
import { FaThumbsUp, FaShare, FaPlus, FaRegThumbsUp } from "react-icons/fa";
import { MdPlaylistAddCheck } from "react-icons/md";
import { Link } from "react-router-dom";

const VideoActions = ({ video }) => {

    const auth = useAuth();
    const user = auth?.user || null;
    const videoId = video._id;
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [playlists, setPlaylists] = useState([]);
    const [playlistDropdown, setPlaylistDropdown] = useState(false);
    const [addedPlaylistIds, setAddedPlaylistIds] = useState([]);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (!videoId) return;
        fetchLikeStatus();
        fetchLikesCount();
        fetchPlaylists();
    }, [videoId]);

     useEffect(() => {
        const fetchSubscribedStatus = async () => {
            try {
                const res = await axios.get(`/subscription/c/${video.owner._id}/subscription-status`);
                setSubscribed(Boolean(res?.data?.data?.isSubscribed))
            } catch {
                setSubscribed(false); // silently fallback
            }
        };

        fetchSubscribedStatus();
    }, []);

    const handleSubscribed = async () => {

        try {
            const res = await axios.post(`/subscription/c/${video.owner._id}/toggle-subscription`);
            setSubscribed(res?.data?.data); // toggle updated value from backend
        } catch (error) {
            console.error("Error subscribing channel", error);
        }

    };

    const fetchLikeStatus = async () => {
        if (auth) {
            try {
                const res = await axios.get(`/like/v/${videoId}`);
                setLiked(res.data.data.liked);
            } catch (error) {
                console.log("Unable to fetch like status")
            }
        }
        else setLiked(false)

    };

    const fetchLikesCount = async () => {
        try {
            const res = await axios.get(`/like/v/${videoId}/likes`);
            setLikesCount(res.data.data.likeCount);
        } catch (error) {
            console.log("Unable to fetch likes count")
        }
    };

    const fetchPlaylists = async () => {
        try {
            const res = await axios.get("/playlist/");
            setPlaylists(res.data.data.playlists || []);
            const added = res.data.data.playlists
                .filter((p) => p.videos.some((v) => v._id === videoId))
                .map((p) => p._id);

            setAddedPlaylistIds(added);
            console.log(added)
        } catch (error) {
            console.log("Error in playlist fetching")
        }
    };

    const toggleLike = async () => {
        try {
            await axios.post(`/like/v/${videoId}`);
            fetchLikeStatus();
            fetchLikesCount();
        } catch (error) {
            console.log("Unable to toggle like")
        }
    };

    const togglePlaylist = async (playlistId) => {
        try {
            if (addedPlaylistIds.includes(playlistId)) {
                await axios.delete(`/playlist/delete/${videoId}/${playlistId}`);
                toast.success("Removed from playlist");
            } else {
                await axios.patch(`/playlist/add/${videoId}/${playlistId}`);
                toast.success("Added to playlist");
            }
            fetchPlaylists();
        } catch (error) {
            console.log("Unable to toggle playlist option")
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/video/${videoId}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!", {
            position: "top-center",
            theme: "dark",
            autoClose: 3000,
            style: {
                backgroundColor: "#1e1b4b", // deep purple
                color: "white",
                fontWeight: "bold",
            },
        });
    };

    return (
        <div className="mt-4 px-4 py-4 bg-[#1a1a2e] rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* Like, Share, Playlist (Grouped for mobile) */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Like */}
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition"
                        onClick={toggleLike}
                    >
                        {liked ? (
                            <FaThumbsUp className="text-purple-500" />
                        ) : (
                            <FaRegThumbsUp />
                        )}
                        <span>{likesCount}</span>
                    </div>

                    {/* Share */}
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition"
                        onClick={handleShare}
                    >
                        <FaShare />
                        <span>Share</span>
                    </div>

                    {/* Add to Playlist */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 hover:text-purple-400 transition"
                            onClick={() => setPlaylistDropdown(!playlistDropdown)}
                        >
                            <FaPlus />
                            <span>Add to Playlist</span>
                        </button>

                        {playlistDropdown && (
                            <div className="absolute z-10 bg-[#2a2a3a] rounded-lg mt-2 p-2 shadow-lg w-52 border border-purple-600 max-h-64 overflow-y-auto">
                                {playlists.length === 0 ? (
                                    <p className="text-sm text-purple-400 text-center">
                                        First add a playlist
                                    </p>
                                ) : (
                                    playlists.map((playlist) => {
                                        const isAdded = addedPlaylistIds.includes(String(playlist._id));

                                        return (
                                            <div
                                                key={playlist._id}
                                                onClick={() => togglePlaylist(playlist._id)}
                                                className="flex justify-between items-center p-2 hover:bg-purple-700/40 cursor-pointer rounded-md"
                                            >
                                                <span>{playlist.name}</span>
                                                {isAdded && <MdPlaylistAddCheck className="text-purple-400" />}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* Channel Info + Subscribe */}
                <div className="flex items-center gap-4 md:ml-auto">
                    <Link
                        to={`/channel/${video.owner._id}`}
                        className="flex items-center gap-3 hover:opacity-90 transition"
                    >
                        <img
                            src={video.owner.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border border-purple-500"
                        />
                        <div>
                            <p className="font-semibold text-base">{video.owner.username}</p>
                            {/* Optional: Add subscriber count here */}
                        </div>
                    </Link>
                     <button
                    onClick={handleSubscribed}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold mt-4 md:mt-0 transition 
                    ${subscribed
                            ? "bg-gray-700 text-white hover:bg-gray-800"
                            : "bg-purple-700 text-white hover:bg-purple-800"
                        }`}
                >
                    {subscribed ? "Subscribed" : "Subscribe"}
                </button>
                </div>
            </div>
        </div>

    );
};

export default VideoActions;
