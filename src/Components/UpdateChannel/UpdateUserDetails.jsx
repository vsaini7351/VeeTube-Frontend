import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateUserDetailsPage = () => {
  const { auth,login } = useAuth();
  const user=auth.user
const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.patch("/user/update-user-details", data);
      toast.success("Profile updated successfully!");
         reset(res.data.data);
      // Update user in context
      await login({user: res.data.data}); // set context + localStorage
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile"
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
          Update Profile
        </h2>

        {/* Full Name */}
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            type="text"
            {...register("fullName", { required: "Full name is required" })}
            className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUserDetailsPage;
