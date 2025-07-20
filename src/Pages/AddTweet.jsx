import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "../utils/axios";
import { motion } from "framer-motion";

export default function AddTweet() {
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const content = watch("content") || "";

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/tweet", data);
      if (res?.data?.success) {
        reset();
      }
    } catch (err) {
      console.error("Tweet failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-gradient-to-br from-purple-800/30 to-purple-900/20 border border-purple-700/60 shadow-2xl p-6 rounded-3xl backdrop-blur-md"
      >
        <h1 className="text-2xl md:text-3xl font-audiowide text-white mb-6 text-center">📝 Compose Your Tweet</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register("content", { required: true, maxLength: 280 })}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full resize-none text-white bg-transparent border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/80 px-4 py-3 rounded-xl placeholder-purple-400 text-lg tracking-wide font-light shadow-inner transition-all"
            maxLength={280}
          ></textarea>

          <div className="flex justify-between items-center text-sm text-purple-400">
            <span>{content.length}/280</span>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition"
            >
              {loading ? "Tweeting..." : "Tweet"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
