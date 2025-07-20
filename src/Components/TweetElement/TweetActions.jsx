import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../utils/authContext";
import { FaThumbsUp, FaRegThumbsUp, FaShareAlt } from "react-icons/fa";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";

export default function TweetActions({ tweet }) {
  const { auth } = useAuth();
  const userId = auth?.user?._id;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const tweetId = tweet._id;
  const ownerId = tweet.owner._id;

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const res = await axios.get(`/like/t/${tweetId}`);
        const res2 = await axios.get(`/like/t/${tweetId}/likes`);
        setLiked(res.data.data.liked);
        setLikesCount(res2.data.data.totalLikes);
      } catch (err) {
        console.error("Like info failed", err);
      }
    };

    const fetchSubscribe = async () => {
      try {
        const res = await axios.get(`/user/is-subscribe/${ownerId}`);
        setSubscribed(res.data.data.subscribed);
      } catch (err) {
        console.error("Subscribe info failed", err);
      }
    };

    fetchLike();
    fetchSubscribe();
  }, [tweetId, ownerId]);

  const handleLike = async () => {
    try {
      await axios.post(`/like/t/${tweetId}`);
      const res2 = await axios.get(`/like/t/${tweetId}/likes`);
      setLiked(!liked);
      setLikesCount(res2.data.data.totalLikes);
    } catch {
      toast.error("Like failed");
    }
  };

  const handleSubscribe = async () => {
    try {
      await axios.post(`/user/subscribe/${ownerId}`);
      setSubscribed(!subscribed);
      toast.success(subscribed ? "Unsubscribed" : "Subscribed");
    } catch {
      toast.error("Subscribe failed");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Tweet URL copied!");
  };

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleLike}>
        {liked ? <FaThumbsUp className="text-purple-500" /> : <FaRegThumbsUp />}
        <span>{likesCount}</span>
      </div>

      <div className="flex items-center gap-2 cursor-pointer" onClick={handleShare}>
        <FaShareAlt />
        <span>Share</span>
      </div>

      {ownerId !== userId && (
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleSubscribe}>
          {subscribed ? (
            <>
              <FiUserCheck className="text-green-400" />
              <span>Subscribed</span>
            </>
          ) : (
            <>
              <FiUserPlus />
              <span>Subscribe</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
