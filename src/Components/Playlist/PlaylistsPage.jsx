import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import EditPlaylistModal from "./EditPlaylist";

export default function PlaylistPage() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [editingPlaylist, setEditingPlaylist] = useState(null);


    const handleUpdate = async (data) => {
        try {
            const res = await axios.patch(`/playlist/${editingPlaylist._id}`, data);
            toast.success("Playlist updated!");
            setEditingPlaylist(null); // close modal
            fetchPlaylists(); // refresh playlist list
        } catch (err) {
            toast.error("Failed to update");
        }
    };


    const fetchPlaylists = async () => {
        try {
            const res = await axios.get("/playlist/");
            setPlaylists(res.data.data.playlists);
        } catch (err) {
            toast.error("Failed to load playlists");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth) fetchPlaylists();
    }, [auth]);

    const handleCreate = async (data) => {
        try {
            const res = await axios.post("/playlist/", data);
            toast.success("Playlist created!");
            reset();
            fetchPlaylists();
        } catch {
            toast.error("Failed to create playlist");
        }
    };

    const handleDelete = async (playlistId) => {
        try {
            await axios.delete(`/playlist/${playlistId}`);
            toast.success("Playlist deleted");
            setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
        } catch {
            toast.error("Failed to delete playlist");
        }
    };



    return (
        <div className="p-6 text-white min-h-screen bg-[#0f0f1b]">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Your Playlists</h2>

            {/* Create Playlist Form */}
            <form
                onSubmit={handleSubmit(handleCreate)}
                className="mb-8 bg-[#1a1a2e] p-6 rounded-xl border border-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.3)] space-y-4"
            >
                <h3 className="text-xl text-purple-300">Create New Playlist</h3>
                <input
                    type="text"
                    placeholder="Playlist Name"
                    {...register("name", { required: true })}
                    className="w-full px-4 py-2 rounded bg-[#111] border border-purple-600 text-white focus:outline-none"
                />
                <textarea
                    placeholder="Description"
                    {...register("description")}
                    className="w-full px-4 py-2 rounded bg-[#111] border border-purple-600 text-white focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <IoMdAdd /> Create
                </button>
            </form>

            {/* Playlist Grid */}
            {loading ? (
                <p className="text-center text-purple-300">Loading...</p>
            ) : playlists.length === 0 ? (
                <p className="text-purple-500">You haven't created any playlists yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            className="bg-[#1a1a2e] rounded-lg border border-purple-600 p-4 shadow-[0_0_10px_rgba(168,85,247,0.4)] group relative hover:shadow-purple-700 transition"
                        >
                            {/* Thumbnail placeholder or you can add actual images */}
                            <div
                                className="h-40 w-full bg-gradient-to-br from-purple-700 to-purple-900 rounded-t-lg flex items-center justify-center text-white text-2xl font-bold tracking-wide"
                                onClick={() => navigate(`/playlist/${playlist._id}`)}
                            >{playlist.name?.slice(0, 1).toUpperCase()} </div>

                            <h4 className="text-xl font-semibold text-purple-300">{playlist.name}</h4>
                            <p className="text-sm text-gray-400">{playlist.description}</p>

                            <div className="flex justify-end mt-4 gap-3">
                                <button onClick={() => setEditingPlaylist(playlist)} className="hover:text-purple-400">
                                    <FaEdit />
                                </button>

                                <button onClick={() => handleDelete(playlist._id)} className="hover:text-red-500">
                                    <FaTrash />
                                </button>
                                {editingPlaylist && (
                                    <EditPlaylistModal
                                        playlist={editingPlaylist}
                                        onClose={() => setEditingPlaylist(null)}
                                        onSubmit={handleUpdate}
                                    />
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
