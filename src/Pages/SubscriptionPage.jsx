import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";

const SubscriptionPage = () => {
  const { auth } = useAuth();

  const user=auth.user
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`/subscription/u/${user._id}`);
        setChannels(res?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchSubscriptions();
  }, [user]);

  return (
    <div className="min-h-screen px-4 md:px-10 py-10 bg-[#0f0f0f] text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-400 underline underline-offset-8">
        Subscribed Channels
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : channels.length === 0 ? (
        <p className="text-gray-500">You haven’t subscribed to any channels yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {channels.map((channel) => (
            <div
              key={channel._id}
              onClick={() => navigate(`/dashboard/${channel._id}`)}
              className="cursor-pointer bg-[#1a1a2e] rounded-xl p-4 shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:shadow-purple-500 transition-all duration-300 flex flex-col items-center text-center"
            >
              <img
                src={channel.avatar}
                alt={channel.fullName}
                className="w-20 h-20 rounded-full object-cover mb-3 border border-purple-500"
              />
              <h3 className="text-white text-sm font-semibold">{channel.fullName}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
