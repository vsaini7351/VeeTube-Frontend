import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateCoverPage = () => {
  const { auth, login } = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", data.coverImage[0]);

      const res = await axios.patch("/user/update-cover", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Cover updated successfully!");
      await login({ user: res.data.data }); // Update context + localStorage
      reset();
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update cover"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4 py-10 text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-[#1a1a2e] p-8 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] space-y-6"
      >
        <h2 className="text-2xl font-bold text-purple-400 text-center">
          Update Cover Image
        </h2>

        {/* Current Cover */}
        <div className="flex justify-center">
          <img
            src={user.coverImage}
            alt="Current Cover"
            className="w-full h-32 object-cover rounded-lg border-4 border-purple-500 shadow-md"
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm mb-1">Select New Cover Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("coverImage", { required: "Cover image is required" })}
            className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-600 file:hover:bg-purple-700"
          />
          {errors.coverImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.coverImage.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
        >
          {isSubmitting ? "Updating..." : "Update Cover"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCoverPage;
