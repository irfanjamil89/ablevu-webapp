"use client";
import React, { useState, useRef } from 'react';

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
    const [RecordAudioPopup, setRecordAudioPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [aiVoiceConversion, setAiVoiceConversion] = useState<'yes' | 'no' | ''>('');
    
    // Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Try to use the best supported format
            let options = { mimeType: 'audio/webm;codecs=opus' };
            if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                if (MediaRecorder.isTypeSupported('audio/webm')) {
                    options = { mimeType: 'audio/webm' };
                } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                    options = { mimeType: 'audio/mp4' };
                } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                    options = { mimeType: 'audio/ogg;codecs=opus' };
                }
            }
            
            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setRecordedBlob(blob);
                const url = URL.createObjectURL(blob);
                setRecordedUrl(url);
                
                console.log('Recorded format:', mimeType);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
            
            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const resetRecording = () => {
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        setRecordedBlob(null);
        setRecordedUrl(null);
        setRecordingTime(0);
        setFileName('');
        setAiVoiceConversion('');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSaveUpload = () => {
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

    const handleSaveRecording = async () => {
        if (recordedBlob) {
            try {
                // Show loading state (you can add a loading spinner here)
                console.log('Uploading audio...');
                
                // Convert blob to base64
                const reader = new FileReader();
                reader.readAsDataURL(recordedBlob);
                
                reader.onloadend = async () => {
                    const base64Audio = reader.result as string;
                    // Remove the data:audio/webm;base64, prefix
                    const base64Data = base64Audio.split(',')[1];
                    
                    // Prepare API payload
                    const payload = {
                        data: base64Data,
                        fileName: 'audio123',
                        folder: 'audio'
                    };
                    
                    try {
                        // Upload to API
                        const response = await fetch('https://staging-api.qtpack.co.uk/images/upload-base64', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem("access_token")}`,

                            },
                            body: JSON.stringify(payload)
                        });
                        
                        if (!response.ok) {
                            throw new Error('Upload failed');
                        }
                        
                        const result = await response.json();
                        console.log('Upload successful:', result);
                        
                        // Log all the data including the uploaded URL
                        console.log({
                            uploadedUrl: result, // The API response
                            fileName,
                            aiVoiceConversion,
                            businessId,
                            duration: recordingTime,
                            fileSize: recordedBlob.size
                        });
                        
                        alert('Audio uploaded successfully!');
                        
                        setRecordAudioPopup(false);
                        setOpenAudioTourPopup(false);
                        onUpdated?.();
                        
                    } catch (uploadError) {
                        console.error('Upload error:', uploadError);
                        alert('Failed to upload audio. Please try again.');
                    }
                };
                
                reader.onerror = () => {
                    console.error('Error reading file');
                    alert('Error processing audio file.');
                };
                
            } catch (error) {
                console.error('Error in handleSaveRecording:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[600px] p-8 relative">
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

                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Record Audio Tour</h2>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                        To ensure quality and relevance, your Audio will first be sent to the business for approval.
                    </p>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Once you have recorded your voice you can dub it by available AI generated voices.
                    </p>

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

                    <div className="flex gap-4">
                        <button
                            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                            onClick={() => setUploadAudioPopup(true)}
                        >
                            Upload File
                        </button>
                        <button
                            className="flex-1 bg-[#0519CE] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0416b8] transition-colors"
                            onClick={() => setRecordAudioPopup(true)}
                        >
                            Record Audio
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload Audio Popup */}
            {UploadAudioPopup && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[650px] p-8 relative">
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

                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Upload Audio Tour</h2>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            To ensure quality and relevance, your Audio will first be sent to the business for approval.
                        </p>

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

                        <div className="flex gap-4">
                            <button
                                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                onClick={() => setUploadAudioPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-[#0519CE] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0416b8] transition-colors"
                                onClick={handleSaveUpload}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Record Audio Popup */}
            {RecordAudioPopup && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[650px] p-8 relative">
                        <button
                            onClick={() => {
                                if (isRecording) stopRecording();
                                resetRecording();
                                setRecordAudioPopup(false);
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

                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Record Audio Tour</h2>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Click the microphone button to start recording your audio tour.
                        </p>

                        {/* Recording Interface */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative mb-4">
                                <div className={`absolute inset-0 rounded-full blur-xl opacity-60 ${isRecording ? 'bg-red-200 animate-pulse' : 'bg-blue-200'}`}></div>
                                <div className={`relative rounded-full p-8 ${isRecording ? 'bg-red-500' : 'bg-[#0519CE]'}`}>
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

                            {/* Timer */}
                            <div className="text-3xl font-mono font-bold text-gray-900 mb-6">
                                {formatTime(recordingTime)}
                            </div>

                            {/* Recording Controls */}
                            <div className="flex gap-4 mb-6">
                                {!isRecording && !recordedBlob && (
                                    <button
                                        onClick={startRecording}
                                        className="bg-[#0519CE] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0416b8] transition-colors"
                                    >
                                        Start Recording
                                    </button>
                                )}

                                {isRecording && (
                                    <>
                                        {!isPaused ? (
                                            <button
                                                onClick={pauseRecording}
                                                className="bg-yellow-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-yellow-600 transition-colors"
                                            >
                                                Pause
                                            </button>
                                        ) : (
                                            <button
                                                onClick={resumeRecording}
                                                className="bg-green-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
                                            >
                                                Resume
                                            </button>
                                        )}
                                        <button
                                            onClick={stopRecording}
                                            className="bg-red-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
                                        >
                                            Stop
                                        </button>
                                    </>
                                )}

                                {recordedBlob && (
                                    <button
                                        onClick={resetRecording}
                                        className="bg-gray-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                                    >
                                        Record Again
                                    </button>
                                )}
                            </div>

                            {/* Audio Playback */}
                            {recordedUrl && (
                                <audio controls src={recordedUrl} className="w-full mb-6">
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>

                        {/* File Name Input - Only show after recording */}
                        {recordedBlob && (
                            <>
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

                                <div className="mb-8">
                                    <p className="text-gray-900 mb-4 leading-relaxed">
                                        Would you like to convert your audio file into AI generated voice to enhance the audio content?
                                    </p>
                                    <div className="flex gap-8">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="aiVoiceRecord"
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
                                                name="aiVoiceRecord"
                                                value="no"
                                                checked={aiVoiceConversion === 'no'}
                                                onChange={(e) => setAiVoiceConversion(e.target.value as 'no')}
                                                className="w-5 h-5 text-[#0519CE] border-2 border-gray-300 focus:ring-2 focus:ring-[#0519CE]"
                                            />
                                            <span className="text-gray-900">No</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                        onClick={() => {
                                            resetRecording();
                                            setRecordAudioPopup(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 bg-[#0519CE] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0416b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSaveRecording}
                                        disabled={!fileName || !aiVoiceConversion}
                                    >
                                        Save
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AudioTourPopup;