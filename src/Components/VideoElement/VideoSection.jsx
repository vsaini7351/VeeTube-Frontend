import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function VideoSection({ video }) {
  console.log(video)
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  const handleFullscreen = () => {
    const vid = videoRef.current;
    if (vid.requestFullscreen) {
      vid.requestFullscreen();
    }
  };

  const handleRestart = async () => {
    const vid = videoRef.current;
    vid.currentTime = 0;
    try {
      await vid.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Play interrupted:", err);
    }
  };

  const handleSpeedChange = (delta) => {
    let newSpeed = Math.min(3, Math.max(0.25, speed + delta));
    videoRef.current.playbackRate = newSpeed;
    setSpeed(newSpeed);
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    const progress = (vid.currentTime / vid.duration) * 100;
    setProgress(progress);
  };

  return (
    <div className="w-full rounded-xl relative overflow-hidden border border-gray-800 shadow-[inset_0_0_10px_#a855f7]">


      <video
        ref={videoRef}
        src={video.videoFile}
        poster={video.thumbnail}
        className="w-full rounded-xl bg-black"
        onTimeUpdate={handleTimeUpdate}
        autoPlay
        muted={muted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {/* Progress Bar */}
      <div className="absolute bottom-20 left-0 w-full h-2 bg-gray-700">
        <div
          className="h-full bg-purple-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4 text-white">
        <button onClick={togglePlay}>
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button onClick={toggleMute}>
          {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
        <button onClick={handleRestart}>
          <RotateCcw size={22} />
        </button>
        <button onClick={handleFullscreen}>
          <Maximize size={22} />
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => handleSpeedChange(-0.25)}>
            <ChevronDown size={18} />
          </button>
          <span className="text-sm">{speed}x</span>
          <button onClick={() => handleSpeedChange(0.25)}>
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
