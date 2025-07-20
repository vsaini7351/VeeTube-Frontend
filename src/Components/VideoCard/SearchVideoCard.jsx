import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const formatted = [
    h > 0 ? String(h).padStart(2, "0") : null,
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ]
    .filter((v) => v !== null)
    .join(":");

  return formatted;
}

const SearchVideoCard = ({ video }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-[#0e0e10] hover:bg-[#1a1a1a] border border-purple-700/40 hover:border-purple-500/70 transition-all duration-300 p-3 rounded-xl shadow-[0_0_10px_#a855f7aa] hover:shadow-[0_0_15px_#c084fcbb]">
      <Link to={`/video/${video._id}`} className="flex-shrink-0 w-full sm:w-60 relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="rounded-lg w-full h-32 sm:h-36 object-cover border-2 border-purple-600/50 group-hover:border-purple-400 transition duration-300"
        />
        <span className="absolute bottom-2 right-2 bg-purple-800/70 text-xs px-1.5 py-0.5 rounded-md text-white font-mono shadow-[0_0_6px_#c084fc]">
          {formatDuration(video.duration) || "0:00"}
        </span>
      </Link>

      <div className="flex flex-col justify-between flex-1 text-white">
        <h3 className="text-lg font-semibold text-purple-400 group-hover:text-purple-300 transition line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{video.description}</p>

        <div className="flex items-center gap-3 mt-3">
          <img
            src={video.owner?.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-purple-600/50"
          />
          <div>
            <p className="text-sm font-medium text-purple-300">{video.owner?.username}</p>
            <p className="text-xs text-gray-400">
              {video.views} views ·{" "}
              {video.createdAt && formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchVideoCard;
