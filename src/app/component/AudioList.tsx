import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Trash2, Volume2, VolumeX, Smile } from 'lucide-react';

interface AudioTour {
  id: string;
  name: string;
  link_url: string | null;
  business_id: string;
  active: boolean;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
}

interface AudioListProps {
  items: AudioTour[];
  onAudioDeleted?: (id: string) => void;
}

const AudioList: React.FC<AudioListProps> = ({
  items,
  onAudioDeleted
}) => {
  const [audioTours, setAudioTours] = useState<AudioTour[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Helper function to get detailed error messages
  const getMediaErrorMessage = (code: number): string => {
    switch (code) {
      case 1: return 'MEDIA_ERR_ABORTED - Download aborted by user';
      case 2: return 'MEDIA_ERR_NETWORK - Network error while downloading';
      case 3: return 'MEDIA_ERR_DECODE - Error decoding audio file';
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - Audio format not supported or file not found';
      default: return 'Unknown media error';
    }
  };
      // Filter out tours without audio files
      useEffect(() => {
       const toursWithAudio = (items ?? []).filter(t => t.link_url);
      setAudioTours(toursWithAudio);
        const validIds = new Set(toursWithAudio.map(t => t.id));
        Object.keys(audioRefs.current).forEach(id => {
    if (!validIds.has(id)) {
      audioRefs.current[id].pause();
      audioRefs.current[id].src = '';
      delete audioRefs.current[id];
    }
  });

      // Initialize progress and muted state
      const initialProgress: Record<string, number> = {};
      const initialMuted: Record<string, boolean> = {};
      toursWithAudio.forEach(tour => {
        initialProgress[tour.id] = 0;
        initialMuted[tour.id] = false;
      });
      setProgress(initialProgress);
      setMuted(initialMuted);
      }, [items]);

  // Initialize audio element for a tour
  const getAudioElement = (tour: AudioTour): HTMLAudioElement => {
    if (!audioRefs.current[tour.id]) {
      const audio = new Audio(tour.link_url!);
      audio.volume = 0.7; // Set default volume to 70%

      // Update progress as audio plays
      audio.ontimeupdate = () => {
        if (audio.duration) {
          const progressPercent = (audio.currentTime / audio.duration) * 100;
          setProgress(prev => ({ ...prev, [tour.id]: progressPercent }));
        }
      };

      // Store duration when metadata loads
      audio.onloadedmetadata = () => {
        setDurations(prev => ({ ...prev, [tour.id]: audio.duration }));
      };

      // Handle audio end
      audio.onended = () => {
        setPlayingId(null);
        setProgress(prev => ({ ...prev, [tour.id]: 0 }));
      };

      // Handle errors
      audio.onerror = (e) => {
        const errorMsg = audio.error 
          ? `Error code ${audio.error.code}: ${getMediaErrorMessage(audio.error.code)}`
          : 'Unknown error';
        setPlayingId(null);
      };

      audioRefs.current[tour.id] = audio;
    }
    return audioRefs.current[tour.id];
  };

  const handlePlayPause = async (tour: AudioTour) => {
    const audio = getAudioElement(tour);

    if (playingId === tour.id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Stop any currently playing audio and wait for it to fully pause
      if (playingId && audioRefs.current[playingId]) {
        const previousAudio = audioRefs.current[playingId];
        previousAudio.pause();
        // Reset the previous audio to prevent lingering play promises
        previousAudio.currentTime = previousAudio.currentTime;
      }

      // Play new audio and handle the promise properly
      try {
        setPlayingId(tour.id);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (err) {
        // Ignore AbortError which happens when play is interrupted
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error playing audio:', err);
        }
        setPlayingId(null);
      }
    }
  };

  // Handle seeking through audio
  const handleProgressChange = (id: string, newProgress: number) => {
    const audio = audioRefs.current[id];
    if (audio && audio.duration) {
      const newTime = (newProgress / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(prev => ({ ...prev, [id]: newProgress }));
    }
  };

  // Toggle mute/unmute
  const handleMuteToggle = (tour: AudioTour) => {
    // Initialize audio element if it doesn't exist yet
    const audio = getAudioElement(tour);
    
    // Toggle mute state
    const newMutedState = !audio.muted;
    audio.muted = newMutedState;
    setMuted(prev => ({ ...prev, [tour.id]: newMutedState }));
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setOpenDeleteModal(true);
  };

  const confirmDeleteAction = async () => {
    if (!deleteTargetId) return;

    try {
      // Stop and cleanup audio if playing
      if (audioRefs.current[deleteTargetId]) {
        audioRefs.current[deleteTargetId].pause();
        audioRefs.current[deleteTargetId].src = '';
        delete audioRefs.current[deleteTargetId];
      }

      if (playingId === deleteTargetId) {
        setPlayingId(null);
      }

      // Remove from state
      setAudioTours(prev => prev.filter(tour => tour.id !== deleteTargetId));
      onAudioDeleted?.(deleteTargetId);

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}business-audio-tour/delete/${deleteTargetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });

      setOpenDeleteModal(false);
      setDeleteTargetId(null);
      setOpenSuccessModal(true);

    } catch (err) {
      console.error('Error deleting audio tour:', err);
      setOpenDeleteModal(false);
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  if (audioTours.length === 0) {
    return (
      <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center">
        <img src="/assets/images/audio.avif" alt="" />
        <p className="mt-4 font-medium text-[#6d6d6d]">
          No Audio Tour to show
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4">
          {audioTours.map((tour) => {
            const currentProgress = progress[tour.id] || 0;
            const duration = durations[tour.id] || 0;
            const currentTime = (currentProgress / 100) * duration;
            const isMuted = muted[tour.id] || false;

            return (
              <div
                key={tour.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4"
              >
                {/* Emoji Icon */}
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile className="w-6 h-6" />
                </button>

                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(tour.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Delete audio tour"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Audio Name */}
                <div className="flex-1">
                  <div className="text-gray-900 font-medium">{tour.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(tour.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={() => handlePlayPause(tour)}
                  className={`rounded-full p-4 transition-colors ${
                    playingId === tour.id
                      ? 'bg-[#0519CE] hover:bg-[#0519CE]'
                      : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                  title={playingId === tour.id ? 'Pause' : 'Play'}
                >
                  {playingId === tour.id ? (
                    <Pause className="w-6 h-6 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-6 h-6 text-[#0519CE]" fill="currentColor" />
                  )}
                </button>

                {/* Progress Bar with Time */}
                <div className="flex items-center gap-3 w-64">
                  <span className="text-xs text-gray-600 w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentProgress}
                    onChange={(e) => handleProgressChange(tour.id, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0519CE 0%, #0519CE ${currentProgress}%, #e5e7eb ${currentProgress}%, #e5e7eb 100%)`
                    }}
                    title="Seek audio"
                  />
                  <span className="text-xs text-gray-600 w-10">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Mute/Unmute Toggle Button */}
                <button
                  onClick={() => handleMuteToggle(tour)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-red-500" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2 text-gray-800">Delete Audio Tour?</h2>
            <p className="mb-4 text-gray-600">This action cannot be undone.</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setOpenDeleteModal(false);
                  setDeleteTargetId(null);
                }}
                className="px-5 py-2 w-full border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-5 py-2 w-full bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {openSuccessModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
            <div className="flex justify-center mb-4">
              <div className="bg-[#0519CE] rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2">Deleted Successfully!</h2>
            <p className="mb-4">The audio tour has been removed.</p>
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#0416b8]"
              onClick={() => setOpenSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioList;