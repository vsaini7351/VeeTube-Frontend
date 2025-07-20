import { Link ,useNavigate} from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const VideoCard = ({ video }) => {
  const navigate=useNavigate()
  return (
    <Link
      to={`/video/${video._id}`}
      className="bg-[#1a1a1a] border border-purple-600 rounded-lg overflow-hidden shadow hover:shadow-purple-700 transition-all duration-300 group"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video relative border border-purple-500">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Video Info */}
      <div onClick={(e)=>{
         e.stopPropagation();
    navigate(`/channel/${video.owner._id}`);

      }} className="p-3 flex gap-3">
        {/* Placeholder Avatar */}
        <img
          src={video.owner.avatar}
          alt="Channel"
          className="h-9 w-9 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2">
            {video.title}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">{video?.owner?.username || "Unknown creator" }</p>
          <p className="text-gray-500 text-xs">
            {video.views} views •{" "}
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  );
};

// Helper: convert seconds to mm:ss
function formatDuration(duration) {
  if (!duration || typeof duration !== "number") return "00:00";
  const mins = Math.floor(duration / 60);
  const secs = Math.floor(duration % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default VideoCard;
