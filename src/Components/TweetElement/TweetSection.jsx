import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaUserCircle } from "react-icons/fa";

export default function TweetSection({ tweets }) {
  // even though it's just 1 tweet, keeping array allows reuse
  return tweets.map((tweet) => (
    <div key={tweet._id} className="flex flex-col gap-4">
      {/* Author Info */}
      <div className="flex items-center gap-3">
        {tweet.owner?.avatar ? (
          <img
            src={tweet.owner.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-500" />
        )}
        <div>
          <Link
            to={`/channel/${tweet.owner.username}`}
            className="font-semibold text-white hover:text-purple-400"
          >
            {tweet.owner.username}
          </Link>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(tweet.createdAt))} ago
          </p>
        </div>
      </div>

      {/* Tweet Content */}
      <div className="text-lg text-white whitespace-pre-line">
        {tweet.content}
      </div>

      {/* Optional Image */}
      {tweet.image && (
        <div className="mt-2">
          <img
            src={tweet.image}
            alt="tweet"
            className="w-full max-h-[400px] object-contain rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  ));
}
