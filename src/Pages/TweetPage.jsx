import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../utils/authContext";
import TweetCard from "../Components/TweetCard/TweetCard";

const LikedTweets = () => {
  const { auth } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [totalLiked, setTotalLiked] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedTweets = async () => {
      try {
        const res = await axios.get("/like/tweets");
        setTweets(res.data.data.tweets);
        setTotalLiked(res.data.data.totalLikedTweets);
      } catch (error) {
        console.error("Failed to fetch liked tweets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedTweets();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">Liked Tweets</h1>
      <p className="text-sm text-gray-400 mb-6">Total: {totalLiked}</p>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : tweets.length === 0 ? (
        <p className="text-center text-gray-500">No liked tweets yet.</p>
      ) : (
        tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
      )}
    </div>
  );
};

export default LikedTweets;
