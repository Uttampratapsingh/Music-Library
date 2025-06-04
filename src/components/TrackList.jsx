import React from 'react';

const TrackList = ({ tracks, currentTrackIndex, onTrackSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ring-0 bg-white rounded-md shadow"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No songs found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tracks.map((track, index) => (
        <div
          key={track.trackId}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 rounded-md shadow ${
            currentTrackIndex === index
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onTrackSelect(index)}
        >
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={track.artworkUrl100}
                alt={track.collectionName}
                className="w-16 h-16 rounded-md object-cover shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {track.trackName}
                </h3>
                <p className="text-gray-600 truncate">{track.artistName}</p>
                <p className="text-gray-500 text-sm truncate">{track.collectionName}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
