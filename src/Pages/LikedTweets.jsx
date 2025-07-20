import { useEffect, useState } from "react";
import axios from "../utils/axios";
import TweetCard from "../Components/TweetCard/TweetCard";
import { useAuth } from "../utils/authContext";

export default function LikedTweets() {
  const { auth } = useAuth();
  const [likedTweets, setLikedTweets] = useState([]);
  const [totalLiked, setTotalLiked] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedTweets = async () => {
      try {
        const res = await axios.get("/like/tweets");
        setLikedTweets(res.data.data.tweets);
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
    <div className="min-h-screen px-4 sm:px-8 py-8 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-300 mb-2">Liked Tweets</h1>
        <p className="text-sm text-purple-400 mb-6">
          Total: {totalLiked} {totalLiked === 1 ? "tweet" : "tweets"}
        </p>

        {loading ? (
          <p className="text-purple-500">Loading liked tweets...</p>
        ) : likedTweets.length === 0 ? (
          <p className="text-gray-400">You haven't liked any tweets yet.</p>
        ) : (
          likedTweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        )}
      </div>
    </div>
  );
}
