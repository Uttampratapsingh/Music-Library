import SearchBar from "./components/SearchBar"
import TrackList from "./components/TrackList";
import PlayerBar from "./components/PlayerBar";
import { useState, useRef, useEffect } from "react";
import { toast } from 'react-hot-toast';


const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  // Play current track when index or tracks change
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.src = tracks[currentTrackIndex].previewUrl;
      audioRef.current.play();
    }
  }, [currentTrackIndex, tracks]);

  // audioPlayer object similar to what useAudioPlayer hook would provide
  const audioPlayer = {
    audioRef,
    play: () => audioRef.current && audioRef.current.play(),
    pause: () => audioRef.current && audioRef.current.pause(),
    isPlaying: audioRef.current ? !audioRef.current.paused : false,
    currentTime: audioRef.current ? audioRef.current.currentTime : 0,
    duration: audioRef.current ? audioRef.current.duration : 0,
    seek: (time) => {
      if (audioRef.current) audioRef.current.currentTime = time;
    },
  };

  const searchTracks = async (query) => {
    setIsLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodedQuery}&media=music&limit=500`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }

      const data = await response.json();

      const formattedTracks = data.results
        .filter((item) => item.previewUrl) // Only include tracks with previews
        .map((item) => ({
          trackId: item.trackId,
          trackName: item.trackName,
          artistName: item.artistName,
          collectionName: item.collectionName,
          artworkUrl100: item.artworkUrl100,
          previewUrl: item.previewUrl,
        }));

      setTracks(formattedTracks);
      setCurrentTrackIndex(0);

      if (formattedTracks.length === 0) {
        toast({
          title: "No results found",
          description: "Try searching with different keywords.",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to fetch songs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
  };



  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-200 via-pink-100 to-purple-200'>
        <div className='max-w-6xl mx-auto px-4 py-8 pb-32'>
          {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🎵 Music Player
              </h1>
              <p className="text-gray-600 text-lg">
                Discover and play 30-second previews from the iTunes library
              </p>
            </div>
          {/* Searchbar*/}
          <div className="mb-8">
            <SearchBar onSearch={searchTracks} isLoading={isLoading} />
          </div>

          {/* Track List */}
          <div className="mb-8">
            <TrackList
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              onTrackSelect={handleTrackSelect}
              isLoading={isLoading}
            />
          </div>
        </div>
        {/* Welcome Message when no tracks */}
          {tracks.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎶</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to Music Player
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Search for your favorite songs, artists, or albums to start listening 
                to 30-second previews from iTunes.
              </p>
            </div>
          )}
          {/* Player Bar */}
          {tracks.length > 0 && (
            <PlayerBar
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              onTrackChange={setCurrentTrackIndex}
              audioPlayer={audioPlayer}
            />
          )}
    </div>
  )
}

export default App