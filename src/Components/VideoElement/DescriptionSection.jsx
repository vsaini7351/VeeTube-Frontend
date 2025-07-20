import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function DescriptionSection({ video }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="w-full bg-[#121212] p-4 sm:p-6 rounded-xl shadow-md text-white">
      {/* Section Header */}
      <div className="text-purple-400 font-semibold text-sm mb-2">
        Description
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-2">{video.title}</h1>

      {/* Info */}
     <div className="text-sm text-gray-400 mb-2">
  {video.createdAt
    ? `Uploaded ${formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}`
    : "Upload date not available"} · {video.views} views
</div>


      {/* Collapsed Description Preview */}
      {!expanded && (
        <p className="text-base text-gray-200 mb-2 line-clamp-3">
          {video.description}
        </p>
      )}

      {/* Expand Button */}
      <button
        className="text-sm text-purple-400 hover:underline focus:outline-none"
        onClick={toggleExpand}
      >
        {expanded ? "Show less ▲" : "Show more ▼"}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          {/* Channel Info */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={video.owner?.avatar}
              alt="channel-avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-gray-300 font-medium text-sm">{video.owner?.username}</span>
          </div>

          {/* Full Description */}
          <p className="text-base text-gray-200 whitespace-pre-line">
            {video.description}
          </p>
        </div>
      )}
    </div>
  );
}
