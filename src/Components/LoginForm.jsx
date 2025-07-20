import { useState } from "react";
import axios from "../utils/axios";

import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../utils/authContext";


const LoginForm = () => {
  const {params}= useParams()
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  const [isLogin, setIsLogin] = useState(params==='login'); // for toggle button , toggleLogin=true, means login page par aaye direct

  const handleLoginSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);
    try {
      const res = await axios.post("/user/login", { email, password });

      await login(res.data.data); // set context + localStorage
      navigate("/"); // optionally: navigate("/", { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const { register, handleSubmit, formState: { errors }, reset, } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("username", data.username);
      formData.append("avatar", data.avatar[0]); // File input gives array

      if (data.coverImage?.[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }
      setLoading(true);
      const res = await axios.post("/user/register", formData);
      console.log("Signup Success:", res.data);
      await login(res.data.data); // context handles localStorage too
      reset();
      navigate("/"); // optionally: navigate("/", { replace: true });

    } catch (err) {

      setError(err.response?.data?.message || "SignUp failed");
    } finally {
      setLoading(false)
    }
  };


  return (
    <div className="font-poppins bg-[#000000] text-[#c4c3ca] min-h-screen overflow-x-hidden relative">
      <section className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          {/* Toggle Header */}
          <div className="text-center mb-6">
            <h6 className="text-base uppercase font-bold tracking-wider space-x-6 flex justify-center">
              <span
                className={`cursor-pointer transition-colors duration-300 ${isLogin ? "text-yellow-300" : "text-gray-400"
                  }`}
                onClick={() => setIsLogin(true)}
              >
                Log In
              </span>
              <span
                className={`cursor-pointer transition-colors duration-300 ${!isLogin ? "text-yellow-300" : "text-gray-400"
                  }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </span>
            </h6>

            <div
              onClick={() => setIsLogin((prev) => !prev)}
              className="block w-16 h-4 bg-yellow-300 rounded-full mx-auto mt-3 relative cursor-pointer"
            >
              <span
                className={`absolute w-9 h-9 bg-[#1f1f2e] text-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.5)] text-lg rounded-full flex items-center justify-center transition-transform duration-500 -top-2 left-[-10px] ${isLogin ? "translate-x-0" : "translate-x-11"
                  }`}
              >
                <i className="uil uil-exchange"></i>
              </span>
            </div>
          </div>

          {/* Flip Card */}
          <div className="relative w-full h-[400px] [perspective:800px]">
            <div
              className={`flip-card absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${!isLogin ? "rotate-y-180" : ""
                }`}
            >
              {/* Login Card */}
              <div className="absolute w-full h-full bg-[#2a2b38] shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-[#a855f7]
 bg-[url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat.svg')] bg-bottom bg-no-repeat bg-[length:300%] rounded-lg [backface-visibility:hidden] flex items-center justify-center">
                <form className="w-full px-6" onSubmit={handleLoginSubmit}>
                  <h4 className="text-lg font-semibold mb-6 text-center">Log In</h4>

                  <div className="relative mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring-[#a855f7]"
                      placeholder="Your Email"
                    />
                    <i className="uil uil-at absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                  </div>

                  <div className="relative mb-6">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring-[#a855f7]"
                      placeholder="Your Password"
                    />
                    <i className="uil uil-lock-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-transparent hover:border hover:border-[#a855f7] hover:text-[#a855f7] transition-shadow  hover:shadow-[0_0_10px_rgba(168,85,247,0.7)] bg-yellow-300 text-[#102770] font-bold px-6 py-2  "
                  >
                    {loading ? "Logging in..." : "Submit"}
                  </button>

                  {error && (
                    <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
                  )}

                  <p className="text-sm mt-4 text-center">
                    <a href="#" className="hover:text-yellow-300 transition">
                      Forgot your password?
                    </a>
                  </p>
                </form>
              </div>

              {/* Signup Card */}
              {/* Signup Card */}
              <div className="shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-[#a855f7] absolute w-full h-[620px] bg-[#2a2b38] bg-[url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat.svg')] bg-bottom bg-no-repeat bg-[length:300%] rounded-lg rotate-y-180 [backface-visibility:hidden] flex items-center justify-center overflow-y-auto px-2">

                <form className="w-full px-6" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                  <h4 className="text-xl font-semibold mb-6 text-center text-yellow-300">Sign Up</h4>

                  {/* Full Name */}
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm mb-1 ml-1 text-yellow-300">Full Name</label>
                    <div className="relative">
                      <input
                        id="fullName"
                        type="text"
                        {...register("fullName", { required: "Full name is required" })}
                        className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring-[#a855f7]"
                        placeholder="Your Full Name"
                      />
                      <i className="uil uil-user absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm mb-1 ml-1 text-yellow-300">Username</label>
                    <div className="relative">
                      <input id="username"
                        type="text"
                        {...register("username", { required: "Username is required" })}
                        className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring-[#a855f7]"
                        placeholder="Choose a Username"
                      />
                      <i className="uil uil-user-circle absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.username.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm mb-1 ml-1 text-yellow-300">Email</label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring-[#a855f7]"
                        placeholder="Your Email"
                      />
                      <i className="uil uil-at absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm mb-1 ml-1 text-yellow-300">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        {...register("password", { required: "Password is required" })}
                        className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring-[#a855f7]"
                        placeholder="Your Password"
                      />
                      <i className="uil uil-lock-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="mb-4">
                    <label htmlFor="avatar" className="block text-sm mb-1 ml-1 text-yellow-300">Avatar (Required)</label>
                    <div className="relative">
                      <input
                        id="avatar"
                        type="file"
                        {...register("avatar", { required: "Avatar is required" })}
                        accept="image/*"
                        className="w-full pl-12 py-2 text-sm bg-[#1f2029] text-gray-300 rounded shadow-md outline-none focus:ring-[#a855f7]"
                      />
                      <i className="uil uil-image-v text-yellow-300 absolute left-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
                    </div>
                    {errors.avatar && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.avatar.message}</p>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div className="mb-6">
                    <label htmlFor="coverImage" className="block text-sm mb-1 ml-1 text-yellow-300">Cover Image (Optional)</label>
                    <div className="relative">
                      <input
                        id="coverImage"
                        type="file"
                        {...register("coverImage")}
                        accept="image/*"
                        className="w-full pl-12 py-2 text-sm bg-[#1f2029] text-gray-300 rounded shadow-md outline-none focus:ring-[#a855f7]"
                      />
                      <i className="uil uil-image text-yellow-300 absolute left-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
                  )}


                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-yellow-300 text-[#102770] font-bold px-6 py-2 rounded  hover:bg-transparent hover:border hover:border-[#a855f7] hover:text-[#a855f7] transition-shadow shadow-md hover:shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-[#102770]" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "Submit"}

                  </button>

                </form>

              </div>

              {/* <div className="absolute w-full h-full bg-[#2a2b38] bg-[url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat.svg')] bg-bottom bg-no-repeat bg-[length:300%] rounded-lg rotate-y-180 [backface-visibility:hidden] flex items-center justify-center">
                <form className="w-full px-6" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                  <h4 className="text-lg font-semibold mb-6 text-center">Sign Up</h4>

                   <div className="relative mb-4">
                    <input
                      type="text"
                      {...register("fullName", { required: "Full name is required" })}
                      className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring"
                      placeholder="Your Full Name"
                    />
                    <i className="uil uil-user absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                  </div>

                  <div className="relative mb-4">
                    <input
                      type="text"
                      {...register("username", { required: "Username is required" })}
                      className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring"
                      placeholder="Choose a Username"
                    />
                    <i className="uil uil-user-circle absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                  </div>

                  <div className="relative mb-4">
                    <input
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring"
                      placeholder="Your Email"
                    />
                    <i className="uil uil-at absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                  </div>

                  <div className="relative mb-4">
                    <input
                      type="password"
                      {...register("password", { required: "Password is required" })}
                      className="w-full pl-12 py-3 bg-[#1f2029] text-sm rounded shadow-md outline-none focus:ring"
                      placeholder="Your Password"
                    />
                    <i className="uil uil-lock-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-300 text-xl"></i>
                  </div>

                  <div className="relative mb-4">
                    <input
                      type="file"
                      {...register("avatar", { required: "Avatar is required" })}
                      accept="image/*"
                      className="w-full pl-12 py-2 text-sm bg-[#1f2029] text-gray-300 rounded shadow-md outline-none focus:ring"
                    />
                    <i className="uil uil-image-v text-yellow-300 absolute left-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
                  </div>

                  <div className="relative mb-6">
                    <input
                      type="file"
                      {...register("coverImage")}
                      accept="image/*"
                      className="w-full pl-12 py-2 text-sm bg-[#1f2029] text-gray-300 rounded shadow-md outline-none focus:ring"
                    />
                    <i className="uil uil-image text-yellow-300 absolute left-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
                  </div>

                  <button
                    type="submit"
                    className="bg-yellow-300 text-[#102770] font-bold px-6 py-2 rounded shadow-md hover:bg-[#102770] hover:text-yellow-300 transition"
                  >
                    Submit
                  </button>
                </form>

              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;
