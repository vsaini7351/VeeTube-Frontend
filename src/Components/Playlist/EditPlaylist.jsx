// components/EditPlaylistModal.jsx
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const EditPlaylistModal = ({ playlist, onClose, onSubmit }) => {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (playlist) {
      setValue("name", playlist.name);
      setValue("description", playlist.description);
    }
  }, [playlist, setValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1a1a2e] border border-purple-600 p-6 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-purple-400 text-2xl mb-4">Edit Playlist</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Playlist Name"
            {...register("name", { required: true })}
            className="bg-transparent border border-purple-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <textarea
            placeholder="Description"
            {...register("description")}
            rows={3}
            className="bg-transparent border border-purple-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-1.5 border border-gray-400 rounded hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
