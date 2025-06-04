import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";

const PlayerBar = ({ tracks, currentTrackIndex, onTrackChange }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // default to 30s preview

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    // auto-play when track changes
    audio.src = currentTrack?.previewUrl || "";
    audio.play().then(() => setIsPlaying(true)).catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [currentTrack]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      onTrackChange(currentTrackIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      onTrackChange(currentTrackIndex + 1);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <audio ref={audioRef} />
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Current Track Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <img
              src={currentTrack.artworkUrl100}
              alt={currentTrack.collectionName}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate">
                {currentTrack.trackName}
              </h4>
              <p className="text-gray-600 truncate">{currentTrack.artistName}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentTrackIndex === 0}
                className="p-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                <FaStepBackward className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlayPause}
                className="rounded-full w-12 h-12 p-0 bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                {isPlaying ? (
                  <FaPause className="h-6 w-6" />
                ) : (
                  <FaPlay className="h-6 w-6 ml-1" />
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={currentTrackIndex === tracks.length - 1}
                className="p-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                <FaStepForward className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full max-w-md">
              <span className="text-xs text-gray-500 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                value={currentTime}
                max={duration || 30}
                step="0.1"
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs text-gray-500 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
