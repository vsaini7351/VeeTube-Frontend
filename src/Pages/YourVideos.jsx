import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../utils/authContext";
import Loading from "../Components/PreLoader/Loading";

const YourVideosPage = () => {
    const {auth}= useAuth()
  const channelId=auth.user._id
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const LIMIT = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors,isSubmitting  },
  } = useForm();

  const fetchVideos = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/dashboard/${channelId}/videos?page=${page}&limit=${LIMIT}`);
                const newVideos = res?.data?.data?.videos || [];
                setVideos((prev) => [...prev, ...newVideos]);
            } catch (err) {
                console.error("Failed to fetch videos", err);
            } finally {
                setLoading(false);
            }
        }

  useEffect(() => {
        fetchVideos();
    }, [channelId, page]);

     const handleInfiniteScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight &&
            !loading
        ) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);
        return () => window.removeEventListener("scroll", handleInfiniteScroll);
    }, [loading]);

  const openEditModal = (video) => {
    setEditingVideo(video);
    reset({ title: video.title, description: video.description });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (!data.title && !data.description && !data.thumbnail) return;
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.thumbnail[0]) formData.append("thumbnail", data.thumbnail[0]);

    try {
      await axios.patch(`/video/update-video/${editingVideo._id}`, formData);
      setVideos([]);
      setPage(1)
      fetchVideos();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVideo = async (id) => {
    try {
      await axios.delete(`/video/delete-video/${id}`);
      setVideos([]);
      setPage(1)
      fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-6 py-10 text-white">
      <h2 className="text-2xl mb-6 font-bold text-purple-400">Your Videos</h2>
       {videos.length === 0 ? (
                <p className="text-gray-400">No videos uploaded yet.</p>
            ) :
      (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-[#1a1a2e] rounded-xl p-4 shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-700"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h3 className="text-xl font-semibold mb-1">{video.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{video.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              Views: {video.views} | Published: {video.isPublished ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Uploaded {formatDistanceToNow(new Date(video.createdAt))} ago
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => openEditModal(video)}
                className="px-4 py-1 bg-purple-600 rounded hover:bg-purple-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteVideo(video._id)}
                className="px-4 py-1 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>)}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
  <div className="bg-[#1a1a2e] border border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] p-6 rounded-xl w-[90%] max-w-md">
    <h2 className="text-xl mb-4 text-purple-400 font-bold">Edit Video</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      
      <div className="flex flex-col">
        <label className="text-sm text-purple-300 mb-1">Title</label>
        <input
          placeholder="Title"
          defaultValue={editingVideo.title}
          {...register("title")}
          className="bg-transparent border-b border-purple-500 px-2 py-1 outline-none text-white placeholder-gray-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-purple-300 mb-1">Description</label>
        <textarea
          placeholder="Description"
          defaultValue={editingVideo.description}
          {...register("description")}
          className="bg-transparent border-b border-purple-500 px-2 py-1 outline-none text-white placeholder-gray-500"
        ></textarea>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-purple-300 mb-1">Thumbnail</label>
        <input
          type="file"
          {...register("thumbnail")}
          className="text-sm text-gray-300"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Save Changes"}
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

export default YourVideosPage;
