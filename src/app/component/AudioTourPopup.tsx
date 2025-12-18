"use client";
import React, { useState } from 'react';

export type BusinessProfile = {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipcode: string | null;
    email: string | null;
    phone_number: string | null;
    website: string | null;
};

interface AudioTourPopupProps {
    businessId: string;
    setOpenAudioTourPopup: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdated?: () => void;
}

const AudioTourPopup: React.FC<AudioTourPopupProps> = ({
    businessId,
    setOpenAudioTourPopup,
    onUpdated,
}) => {
    const [UploadAudioPopup, setUploadAudioPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [aiVoiceConversion, setAiVoiceConversion] = useState<'yes' | 'no' | ''>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
        }
    };

    const handleSave = () => {
        // Add your save logic here
        console.log({
            selectedFile,
            fileName,
            aiVoiceConversion,
            businessId
        });
        setUploadAudioPopup(false);
        setOpenAudioTourPopup(false);
        onUpdated?.();
    };

    return (
        <>
            <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[600px] p-8 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => setOpenAudioTourPopup(false)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Record Audio Tour</h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        To ensure quality and relevance, your Audio will first be sent to the business for approval.
                    </p>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Once you have recorded your voice you can dub it by available AI generated voices.
                    </p>

                    {/* Microphone Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-60"></div>
                            <div className="relative bg-[#0519CE] rounded-full p-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                            onClick={() => setUploadAudioPopup(true)}
                        >
                            Upload File
                        </button>
                        <button
                            className="flex-1 bg-[#0519CE] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0416b8] transition-colors"
                        >
                            Record Audio
                        </button>
                    </div>
                </div>
            </div>

            {UploadAudioPopup && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[650px] p-8 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setUploadAudioPopup(false);
                                setOpenAudioTourPopup(false);
                            }}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Upload Audio Tour</h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            To ensure quality and relevance, your Audio will first be sent to the business for approval.
                        </p>

                        {/* Audio File Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-900 font-medium mb-2">Audio File</label>
                            <input
                                type="file"
                                accept=".mp3,.wav"
                                className="hidden"
                                id="audio-upload"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="audio-upload"
                                className="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                {selectedFile ? (
                                    <span className="text-gray-700">{selectedFile.name}</span>
                                ) : (
                                    <span className="text-gray-400">Upload an audio file... (.mp3, .wav)</span>
                                )}
                            </label>
                        </div>

                        {/* File Name Input */}
                        <div className="mb-6">
                            <label className="block text-gray-900 font-medium mb-2">File Name</label>
                            <input
                                type="text"
                                placeholder="Enter..."
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0519CE] transition-colors"
                            />
                        </div>

                        {/* AI Voice Conversion Question */}
                        <div className="mb-8">
                            <p className="text-gray-900 mb-4 leading-relaxed">
                                Would you like to convert your audio file into AI generated voice to enhance the audio content?
                            </p>
                            <div className="flex gap-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="aiVoice"
                                        value="yes"
                                        checked={aiVoiceConversion === 'yes'}
                                        onChange={(e) => setAiVoiceConversion(e.target.value as 'yes')}
                                        className="w-5 h-5 text-[#0519CE] border-2 border-gray-300 focus:ring-2 focus:ring-[#0519CE]"
                                    />
                                    <span className="text-gray-900">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="aiVoice"
                                        value="no"
                                        checked={aiVoiceConversion === 'no'}
                                        onChange={(e) => setAiVoiceConversion(e.target.value as 'no')}
                                        className="w-5 h-5 text-[#0519CE] border-2 border-gray-300 focus:ring-2 focus:ring-[#0519CE]"
                                    />
                                    <span className="text-gray-900">No</span>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                onClick={() => setUploadAudioPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-[#0519CE] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0416b8] transition-colors"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AudioTourPopup;