import React from "react";

const Loading = () => {
  return (
    <div className="w-24 h-24 flex justify-between items-end mx-auto">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-sm bg-purple-500"
          style={{
            animation: "slideUpDown 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
            boxShadow:
              "0 0 8px #a855f7, 0 0 16px #a855f7, 0 0 24px #a855f7",
          }}
        ></div>
      ))}
    </div>
  );
};

export default Loading
