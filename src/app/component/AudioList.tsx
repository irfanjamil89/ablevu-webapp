import React, { useState } from 'react';
import { Play, Trash2, Volume2, Smile } from 'lucide-react';

interface AudioFile {
  id: number;
  name: string;
  isPlaying: boolean;
  volume: number;
}

interface AudioListProps {
  initialAudioFiles?: AudioFile[];
  onAudioDeleted?: (id: number) => void;
  onAudioPlayed?: (id: number, isPlaying: boolean) => void;
  onVolumeChanged?: (id: number, volume: number) => void;
}

const AudioList: React.FC<AudioListProps> = ({
  initialAudioFiles,
  onAudioDeleted,
  onAudioPlayed,
  onVolumeChanged
}) => {
  const defaultAudioFiles: AudioFile[] = [
    { id: 1, name: 'sample', isPlaying: false, volume: 70 },
   
  ];

  const [audioFiles, setAudioFiles] = useState<AudioFile[]>(
    initialAudioFiles || defaultAudioFiles
  );

  const handlePlayPause = (id: number) => {
    setAudioFiles(audioFiles.map(audio => {
      if (audio.id === id) {
        const newIsPlaying = !audio.isPlaying;
        onAudioPlayed?.(id, newIsPlaying);
        return { ...audio, isPlaying: newIsPlaying };
      }
      return audio;
    }));
  };

  const handleVolumeChange = (id: number, newVolume: number) => {
    setAudioFiles(audioFiles.map(audio => {
      if (audio.id === id) {
        onVolumeChanged?.(id, newVolume);
        return { ...audio, volume: newVolume };
      }
      return audio;
    }));
  };

  const handleDelete = (id: number) => {
    setAudioFiles(audioFiles.filter(audio => audio.id !== id));
    onAudioDeleted?.(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 ">
      <div className="space-y-4">
        {audioFiles.map((audio) => (
          <div
            key={audio.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4"
          >
            {/* Emoji Icon */}
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Smile className="w-6 h-6" />
            </button>

            {/* Delete Icon */}
            <button
              onClick={() => handleDelete(audio.id)}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Audio Name */}
            <div className="flex-1 text-gray-900 font-medium">
              {audio.name}
            </div>

            {/* Play Button */}
            <button
              onClick={() => handlePlayPause(audio.id)}
              className={`rounded-full p-4 transition-colors ${
                audio.isPlaying
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <Play
                className={`w-6 h-6 ${
                  audio.isPlaying ? 'text-white' : 'text-blue-600'
                }`}
                fill={audio.isPlaying ? 'currentColor' : 'none'}
              />
            </button>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 w-64">
              <input
                type="range"
                min="0"
                max="100"
                value={audio.volume}
                onChange={(e) => handleVolumeChange(audio.id, parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${audio.volume}%, #e5e7eb ${audio.volume}%, #e5e7eb 100%)`
                }}
              />
              <Volume2 className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default AudioList;