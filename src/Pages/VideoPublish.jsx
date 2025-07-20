import { useForm } from "react-hook-form";
import axios from "../utils/axios";
import { useState } from "react";

const VideoPublish = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail[0]);
    formData.append("videoFile", data.video[0]);

    try {
      setLoading(true);
      await axios.post("/video/publish-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccess(true);
      reset();
    } catch (error) {
      console.error("Video publish failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-900 via-black to-black border border-purple-700 space-y-6"
      >
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-4 font-audiowide">📤 Publish Your Video</h2>

        {/* Title */}
        <div>
          <label className="text-sm mb-1 block">Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full bg-black border border-purple-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-purple-300"
            placeholder="Enter video title..."
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm mb-1 block">Description</label>
          <textarea
            rows={4}
            {...register("description", { required: true })}
            className="w-full bg-black border border-purple-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-purple-300"
            placeholder="Enter video description..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="text-sm mb-1 block">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail", { required: true })}
            className="w-full bg-black text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-700 file:text-white hover:file:bg-purple-800"
          />
          {errors.thumbnail && <p className="text-red-500 text-sm mt-1">Thumbnail is required</p>}
        </div>

        {/* Video */}
        <div>
          <label className="text-sm mb-1 block">Video File</label>
          <input
            type="file"
            accept="video/*"
            {...register("video", { required: true })}
            className="w-full bg-black text-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-700 file:text-white hover:file:bg-purple-800"
          />
          {errors.video && <p className="text-red-500 text-sm mt-1">Video file is required</p>}
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 transition text-white font-audiowide text-md shadow-[0_0_20px_#a855f7] disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Video"}
          </button>
        </div>

        {success && <p className="text-green-400 text-center mt-4">🎉 Video published successfully!</p>}
      </form>
    </div>
  );
};

export default VideoPublish;
