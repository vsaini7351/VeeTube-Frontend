import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoCard from "../VideoCard/VideoCard";
import TweetCard from "../TweetCard/TweetCard";
import axios from "../../utils/axios"; // your custom axios instance

const ChannelDashboard = () => {
    const navigate= useNavigate()
    const { channelId } = useParams();
    const [channelStats, setChannelStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [activeTab, setActiveTab] = useState("videos");
    const [loading, setLoading] = useState(true);

    const [subscribed, setSubscribed] = useState(false);


    useEffect(() => {
        const fetchSubscribedStatus = async () => {
            try {
                const res = await axios.get(`/subscription/c/${channelId}/subscription-status`);
                setSubscribed(Boolean(res?.data?.data?.isSubscribed))
            } catch {
                setSubscribed(false); // silently fallback
            }
        };

        fetchSubscribedStatus();
    }, []);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, videosRes, tweetsRes] = await Promise.all([
                    axios.get(`/dashboard/${channelId}/stats`),
                    axios.get(`/dashboard/${channelId}/videos`),
                    axios.get(`/dashboard/${channelId}/tweets`)
                ]);

                setChannelStats(statsRes.data.data);
                setVideos(videosRes.data.data.videos);
                setTweets(tweetsRes.data.data.tweets);
            } catch (error) {
                console.error("Error loading channel dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [subscribed]);


    const handleSubscribed = async () => {

        try {
            const res = await axios.post(`/subscription/c/${channelId}/toggle-subscription`);
            setSubscribed(res?.data?.data); // toggle updated value from backend
        } catch (error) {
            console.error("Error subscribing channel", error);
        }

    };

    if (loading || !channelStats) return <div className="text-white p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white pb-10">
            <div className="relative h-60 w-full">
                {/* Cover Image */}
                <img
                    src={channelStats.coverImage}
                    alt="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                {/* Avatar on bottom-left */}
                <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                    <img
                        src={channelStats.avatar}
                        alt="avatar"
                        className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-[0_0_20px_#a855f7]"
                    />
                </div>

                {/* Stats on bottom-right */}
                <div className="absolute bottom-4 right-6 text-white text-sm bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md flex gap-6">
                    <div className="text-center">
                        <p className="font-semibold">{channelStats.noOfVideos}</p>
                        <p className="text-xs text-gray-300">Videos</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">{channelStats.totalViews}</p>
                        <p className="text-xs text-gray-300">Views</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">{channelStats.noOfTweets}</p>
                        <p className="text-xs text-gray-300">Tweets</p>
                    </div>
                </div>
            </div>



            {/* Profile Info */}
            <div className="mt-14 px-6 flex justify-between flex-wrap items-center">
                <div className="mt-3">
                    <h1 className="text-2xl font-bold">{channelStats.fullName}</h1>
                    <p className="text-gray-400">@{channelStats.username}</p>
                    <div className="mt-2 text-gray-400 text-sm">
                        {channelStats.subscribers} Subscribers · {channelStats.subscribedTo} Subscribed To
                    </div>
                </div>
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

            {/* Tabs */}
            <div className="mt-8 px-6 border-b border-gray-700 flex gap-6 text-lg">
                <button
                    onClick={() => setActiveTab("videos")}
                    className={`pb-2 ${activeTab === "videos" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400"}`}
                >
                    Videos
                </button>
                <button
                    onClick={() => setActiveTab("tweets")}
                    className={`pb-2 ${activeTab === "tweets" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400"}`}
                >
                    Tweets
                </button>
            </div>


            <div className="mt-6 px-6">
                {/* Add Button */}
                <div className="mb-4 text-right">
                    {activeTab === "videos" ? (
                        <button
                            onClick={() =>navigate('/video/publish')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                            + Add Video
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/tweet/add')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                            + Add Tweet
                        </button>
                    )}
                </div>
                {/* Content */}
                {activeTab === "videos" ? (

                    videos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {videos.map(video => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No videos yet.</p>
                    )
                ) : (
                    tweets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tweets.map(tweet => (
                                <TweetCard key={tweet._id} tweet={tweet} canDelete={false} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No tweets yet.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ChannelDashboard;
