import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import SearchCard from "../VideoCard/SearchVideoCard"; // Update path if different
import { FaTrash } from "react-icons/fa";

export default function PlaylistVideoPage() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylist = async () => {
    try {
      const res = await axios.get(`/playlist/${playlistId}`);
      setPlaylist(res.data.data.playlist);
    } catch {
      toast.error("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (videoId) => {
    try {
      await axios.delete(`/playlist/delete/${videoId}/${playlistId}`);
      toast.success("Video removed from playlist");
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch {
      toast.error("Failed to remove video");
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  return (
    <div className="p-6 text-white min-h-screen bg-[#0f0f1b]">
      {loading ? (
        <p className="text-center text-purple-300">Loading playlist...</p>
      ) : !playlist ? (
        <p className="text-center text-red-400">Playlist not found</p>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-4 text-purple-400">
            {playlist.name}
          </h2>
          <p className="mb-6 text-gray-400">{playlist.description}</p>

          {playlist.videos.length === 0 ? (
            <p className="text-purple-500">No videos in this playlist.</p>
          ) : (
            <div className="space-y-4">
              {playlist.videos.map((video) => (
                <div
                  key={video._id}
                  className="relative group hover:shadow-purple-600 transition-shadow"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/video/${video._id}`)}
                  >
                    <SearchCard video={video} />
                  </div>

                  {/* Remove button */}
                  <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-400 bg-[#1a1a2e] p-2 rounded-full z-10"
                    onClick={() => handleRemove(video._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
