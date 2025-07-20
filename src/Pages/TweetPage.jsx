import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../utils/authContext";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
import Loading from "../Components/PreLoader/Loading";

const YourTweetsPage = () => {
  const { auth } = useAuth();
  const userId = auth.user._id;
  const [tweets, setTweets] = useState([]);
  const [editingTweet, setEditingTweet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const fetchTweets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/dashboard/${userId}/tweets?page=${page}&limit=${LIMIT}`);
      const newTweets = res?.data?.data?.tweets || [];
      setTweets((prev) => [...prev, ...newTweets]);
    } catch (err) {
      console.error("Failed to fetch tweets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [page, userId]);

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [loading]);

  const openEditModal = (tweet) => {
    setEditingTweet(tweet);
    reset({ content: tweet.content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTweet(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!data.content) return;
    try {
      await axios.patch(`/tweet/update-tweet/${editingTweet._id}`, {
        content: data.content,
      });
      setTweets([]);
      setPage(1);
      fetchTweets();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTweet = async (id) => {
    try {
      await axios.delete(`/tweet/delete-tweet/${id}`);
      setTweets([]);
      setPage(1);
      fetchTweets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-6 py-10 text-white">
      <h2 className="text-2xl mb-6 font-bold text-purple-400">Your Tweets</h2>
      {tweets.length === 0 ? (
        <p className="text-gray-400">No tweets posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-[#1a1a2e] rounded-xl p-4 shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-700"
            >
              <p className="text-lg font-medium mb-2">{tweet.content}</p>
              <p className="text-sm text-gray-500 mb-2">
                Likes: {tweet.likes?.length || 0} | Replies: {tweet.replies?.length || 0}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Posted {formatDistanceToNow(new Date(tweet.createdAt))} ago
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => openEditModal(tweet)}
                  className="px-4 py-1 bg-purple-600 rounded hover:bg-purple-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTweet(tweet._id)}
                  className="px-4 py-1 bg-red-600 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#1a1a2e] border border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-xl mb-4 text-purple-400 font-bold">Edit Tweet</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <textarea
                placeholder="Edit your tweet..."
                {...register("content")}
                className="bg-transparent border-b border-purple-500 px-2 py-1 outline-none text-white placeholder-gray-500"
              ></textarea>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="text-sm text-gray-400 hover:underline"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="h-20 flex justify-center items-center">
        {loading && <Loading />}
      </div>
    </div>
  );
};

export default YourTweetsPage;
