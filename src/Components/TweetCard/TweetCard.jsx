import { useState, useEffect } from "react";
import { FaHeart, FaTrash, FaEdit } from "react-icons/fa";
import { LuHeart } from "react-icons/lu";
import { useAuth } from "../../utils/authContext";
import axios from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';

const TweetCard = ({ tweet }) => {

  const navigate = useNavigate();
  const { auth } = useAuth()
  const user = auth?.user?._id

  const canDelete = user === tweet.owner._id

  const [liked, setLiked] = useState(false);
  const [likesNum, setLikesNum] = useState(0)
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(`/like/t/${tweet._id}`);
        setLiked(res?.data?.data?.liked || false)

        const res2 = await axios.get(`/like/t/${tweet._id}/likes`)
        const number = res2.data.data.likeCount
        setLikesNum(number)
      } catch {
        setLiked(false); // silently fallback
        setLikesNum(0);
      }
    };

    fetchLikeStatus();
  }, [tweet._id]);




  const handleLike = async () => {

    try {
      const res = await axios.post(`/like/t/${tweet._id}`);
      setLiked(res?.data?.data); // toggle updated value from backend
      const res2 = await axios.get(`/like/t/${tweet._id}/likes`)
      const number = res2.data.data.likeCount
      setLikesNum(number)

    } catch (error) {
      console.error("Error liking tweet", error);
    }

  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(`/tweet/${tweet._id}`, { content: editedContent });
      toast.success("Tweet updated!");
      setIsEditing(false);
      navigate(0); // Refresh the current page
    } catch (error) {
      console.error("Edit failed", error);
      toast.error("Failed to update tweet.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/tweet/${tweet._id}`);
      toast.success("Tweet deleted!");
      navigate(0); // ✅ Refreshes the current route
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete tweet.");
    }

  };

  return (

    <div className="neon-border p-[2px] rounded-2xl mb-6 max-w-xl w-full mx-auto flex items-center">

      <div className="bg-black bg-opacity-80 backdrop-blur-md rounded-2xl p-5 text-white flex flex-col justify-between min-h-48 w-full">

        <div className="flex items-center gap-3">
          <img
            src={tweet.owner.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
          />
          <h2 className="font-semibold text-lg text-purple-300">
            @{tweet.owner.username}
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center text-center px-2">
          <p className="mt-4 text-purple-200 text-base leading-relaxed">
            {tweet.content}
          </p>
        </div>


        <div className="flex justify-between items-center mt-5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm font-bold transition ${liked ? "text-pink-500" : "text-purple-400"
              } hover:scale-105`}
          >
            <span>{likesNum}</span>
            {liked ? <FaHeart /> : <LuHeart />}
          </button>

          <div className="flex gap-3 items-center">
            {canDelete && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:text-blue-500 transition hover:scale-105"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 transition hover:scale-105"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-xl text-purple-300 font-semibold">Edit Tweet</h3>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 bg-[#0f0f1a] border border-purple-500 rounded-lg text-white resize-none"
              rows={5}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default TweetCard;
