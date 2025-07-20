import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/authContext";
import { toast } from "react-toastify";

export default function CommentSection({ comments = [], videoId }) {
  const { auth } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(comments);
  const [likeStatus, setLikeStatus] = useState({});
  const [likesNum, setLikesNum] = useState({});
  const userId = auth?.user?._id;

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContentMap, setEditContentMap] = useState({});

  useEffect(() => {
    setAllComments(comments);
    comments.forEach(async (comment) => {
      try {
        const res = await axios.get(`/like/c/${comment._id}`);
        setLikeStatus((prev) => ({ ...prev, [comment._id]: res.data.data.liked }));

        const res2 = await axios.get(`like/c/${comment._id}/likes`);
        const number = res2?.data?.data?.totalLikes
        setLikesNum((prev) => ({ ...prev, [comment._id]: number }));
      } catch { }
    });
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/comment/video/${videoId}`, {
        content: newComment,
      });
      setAllComments((prev) => [res.data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleLikeToggle = async (commentId) => {
    try {
      await axios.post(`/like/c/${commentId}`);
      setLikeStatus((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
      const res = await axios.get(`like/c/${commentId}/likes`);
      const number = res?.data?.data?.totalLikes
      setLikesNum((prev) => ({ ...prev, [commentId]: number }));

    } catch (err) {
      toast.error("Failed to toggle like");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/comment/${commentId}`);
      setAllComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const handleEdit = async (commentId, newContent) => {
    try {
      const res = await axios.patch(`/comment/${commentId}`, { content: newContent });
      setAllComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content: res.data.data.content } : c))
      );
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to edit comment");
    }
  };

  return (
    <div className="w-full bg-[#111] p-4 sm:p-6 rounded-xl text-white">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      {/* New Comment Box */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-[#1a1a1a] p-2 rounded-md border border-purple-600 text-sm"
        />
        <button
          onClick={handleAddComment}
          className="mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md text-sm"
        >
          Comment
        </button>
      </div>

      {/* Comment List */}
      {allComments.length === 0 ? (
        <p className="text-gray-400">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {allComments.map((comment) => {
            const isOwner = userId === comment.owner._id;
            const isEditing = editingCommentId === comment._id;
            const editContent = editContentMap[comment._id] ?? comment.content;

            return (
              <li key={comment._id} className="border-b border-gray-700 pb-3">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={comment.owner.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{comment.owner.username}</span>
                </div>

                {/* Editable or Static Content */}
                {isEditing ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={(e) =>
                        setEditContentMap((prev) => ({
                          ...prev,
                          [comment._id]: e.target.value,
                        }))
                      }
                      className="w-full bg-[#1a1a1a] p-2 rounded-md text-sm mb-1"
                    />
                    <div className="flex gap-3 mt-1 text-sm">
                      <button
                        onClick={() => {
                          handleEdit(comment._id, editContent);
                          setEditingCommentId(null);
                        }}
                        className="text-purple-400 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="text-gray-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                    <div className="flex gap-3 mt-1 text-sm">
                      {/* 👍 Like Count */}
                      <span className="text-sm text-gray-400">
                        {likesNum[comment._id] || 0} Likes
                      </span>

                      {/* 👍 Like Toggle */}
                      <button
                        onClick={() => handleLikeToggle(comment._id)}
                        className="text-purple-400 hover:underline"
                      >
                        {likeStatus[comment._id] ? "Unlike" : "Like"}
                      </button>
                      {isOwner && (
                        <>
                          <button
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditContentMap((prev) => ({
                                ...prev,
                                [comment._id]: comment.content,
                              }));
                            }}
                            className="text-gray-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>

  );
}
