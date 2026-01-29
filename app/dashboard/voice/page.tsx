"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Upload, Trash2, Volume2, Loader2, CheckCircle, AlertCircle, MicOff, Play, Square } from "lucide-react";

interface AudioFile {
  file: File;
  url: string;
}

export default function VoicePreservationPage() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<{
    hasVoice: boolean;
    voiceEnabled: boolean;
    canUseVoice: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [testClicks, setTestClicks] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Fetch voice status on mount
  useEffect(() => {
    fetch("/api/ai/voice")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setVoiceStatus(data);
        }
      })
      .catch(() => {
        // Ignore errors on initial load
      });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("audio/") &&
        file.size < 25 * 1024 * 1024 // 25MB limit
    );

    if (validFiles.length !== files.length) {
      setError("Some files were skipped. Only audio files under 25MB are accepted.");
    }

    const newAudioFiles: AudioFile[] = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setAudioFiles((prev) => [...prev, ...newAudioFiles]);
  };

  const removeFile = (index: number) => {
    // Stop playing if this file is playing
    if (playingIndex === index) {
      stopPlayback();
    }
    // Revoke URL to free memory
    URL.revokeObjectURL(audioFiles[index].url);
    setAudioFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const playAudio = (index: number) => {
    // Stop current playback if any
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    const audio = new Audio(audioFiles[index].url);
    audioPlayerRef.current = audio;
    setPlayingIndex(index);

    audio.onended = () => {
      setPlayingIndex(null);
      audioPlayerRef.current = null;
    };

    audio.onerror = () => {
      setPlayingIndex(null);
      audioPlayerRef.current = null;
      setError("Failed to play audio. The file may be corrupted.");
    };

    audio.play().catch(() => {
      setPlayingIndex(null);
      setError("Failed to play audio.");
    });
  };

  const stopPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setPlayingIndex(null);
  };

  // Cleanup audio player on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  // Get supported MIME type for recording (Safari uses different formats)
  const getSupportedMimeType = (): { mimeType: string; extension: string } => {
    const types = [
      { mimeType: "audio/webm;codecs=opus", extension: "webm" },
      { mimeType: "audio/webm", extension: "webm" },
      { mimeType: "audio/mp4", extension: "m4a" },
      { mimeType: "audio/mpeg", extension: "mp3" },
      { mimeType: "audio/ogg;codecs=opus", extension: "ogg" },
      { mimeType: "audio/wav", extension: "wav" },
      { mimeType: "", extension: "webm" }, // Let browser choose default
    ];

    for (const type of types) {
      if (type.mimeType === "" || MediaRecorder.isTypeSupported(type.mimeType)) {
        return type;
      }
    }
    return { mimeType: "", extension: "webm" };
  };

  const startRecording = async () => {
    setError(null);
    setSuccess(null);
    setIsStartingRecording(true);

    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support audio recording. Please update your browser or try Safari on iOS 14.3+.");
      setIsStartingRecording(false);
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Check if MediaRecorder is supported
      if (typeof MediaRecorder === "undefined") {
        setError("Your browser does not support audio recording. Please update to iOS 14.3+ or try a different browser.");
        stream.getTracks().forEach((track) => track.stop());
        setIsStartingRecording(false);
        return;
      }

      // Get supported format
      const { mimeType, extension } = getSupportedMimeType();

      // Create MediaRecorder with appropriate options
      const options: MediaRecorderOptions = {};
      if (mimeType) {
        options.mimeType = mimeType;
      }

      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch {
        // Fallback: try without options
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Use the actual MIME type from the recorder if available
        const actualMimeType = mediaRecorder.mimeType || mimeType || "audio/webm";
        const actualExtension = actualMimeType.includes("mp4") ? "m4a" :
                               actualMimeType.includes("ogg") ? "ogg" :
                               actualMimeType.includes("wav") ? "wav" : extension;

        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        const file = new File([blob], `recording-${Date.now()}.${actualExtension}`, {
          type: actualMimeType,
        });
        const url = URL.createObjectURL(blob);
        setAudioFiles((prev) => [...prev, { file, url }]);
        stream.getTracks().forEach((track) => track.stop());
        setSuccess("Recording saved! Click play to listen, or record more samples.");
      };

      mediaRecorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording - use timeslice for better compatibility
      mediaRecorder.start(1000);
      setIsRecording(true);
      setIsStartingRecording(false);
    } catch (err) {
      setIsStartingRecording(false);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Microphone access denied. On iPhone: Go to Settings > Safari > Microphone and allow access for this site.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("No microphone found. Please check your device settings.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setError("Microphone is busy. Please close other apps using the microphone (like Phone or FaceTime) and try again.");
        } else if (err.name === "OverconstrainedError") {
          setError("Could not access your microphone with the required settings.");
        } else if (err.name === "SecurityError") {
          setError("Microphone access is blocked. Make sure you're using HTTPS.");
        } else {
          setError(`Microphone error: ${err.message}`);
        }
      } else {
        setError("Failed to access microphone. Please check your browser settings and try again.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVoice = async () => {
    if (audioFiles.length === 0) {
      setError("Please add at least one audio sample");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      audioFiles.forEach((af) => {
        formData.append("audio", af.file);
      });

      const res = await fetch("/api/ai/voice", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to preserve voice");
      }

      setSuccess("Your voice has been preserved successfully!");
      setVoiceStatus((prev) => prev ? { ...prev, hasVoice: true, voiceEnabled: true } : null);
      // Cleanup URLs before clearing
      audioFiles.forEach((af) => URL.revokeObjectURL(af.url));
      setAudioFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to preserve voice");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteVoice = async () => {
    if (!confirm("Are you sure you want to delete your preserved voice?")) {
      return;
    }

    try {
      const res = await fetch("/api/ai/voice", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete voice");
      }

      setSuccess("Voice deleted successfully");
      setVoiceStatus((prev) => prev ? { ...prev, hasVoice: false, voiceEnabled: false } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete voice");
    }
  };

  const toggleVoice = async () => {
    try {
      const res = await fetch("/api/ai/voice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !voiceStatus?.voiceEnabled }),
      });

      if (!res.ok) {
        throw new Error("Failed to update voice settings");
      }

      setVoiceStatus((prev) =>
        prev ? { ...prev, voiceEnabled: !prev.voiceEnabled } : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update settings");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Voice Preservation</h1>
        <p className="text-slate-600">
          Preserve your voice so your loved ones can hear AI responses in your own voice.
        </p>
      </div>

      {/* Debug Test Button - Remove after testing */}
      <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl">
        <p className="text-yellow-800 mb-3 font-medium">Debug: Test if buttons work (clicks: {testClicks})</p>
        <button
          type="button"
          onClick={() => {
            setTestClicks(prev => prev + 1);
            alert("Button clicked! Touch is working.");
          }}
          className="w-full py-4 bg-yellow-500 text-white font-bold text-lg rounded-xl active:bg-yellow-600"
          style={{ touchAction: "manipulation" }}
        >
          TAP HERE TO TEST
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Loading State */}
      {voiceStatus === null && (
        <div className="mb-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          <p className="text-slate-600">Loading voice settings...</p>
        </div>
      )}

      {/* Premium Check */}
      {voiceStatus && !voiceStatus.canUseVoice && (
        <div className="mb-6 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <h3 className="font-bold text-amber-900 mb-2">Premium Feature</h3>
          <p className="text-amber-800">
            Voice Preservation is a premium feature. Upgrade your plan to preserve your voice
            for AI conversations.
          </p>
        </div>
      )}

      {/* Existing Voice */}
      {voiceStatus?.hasVoice && (
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Volume2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Voice Preserved</h3>
                <p className="text-slate-600">Your voice is ready for AI conversations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleVoice}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  voiceStatus.voiceEnabled
                    ? "bg-purple-100 text-purple-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {voiceStatus.voiceEnabled ? "Enabled" : "Disabled"}
              </button>
              <button
                onClick={deleteVoice}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete voice"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section - Show when loading, when no voice exists, or when user can update */}
      {(voiceStatus === null || !voiceStatus.hasVoice || voiceStatus.canUseVoice) && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {voiceStatus?.hasVoice ? "Update Your Voice" : "Preserve Your Voice"}
          </h2>

          <p className="text-slate-600 mb-6">
            Upload audio recordings of yourself speaking clearly. For best results:
          </p>

          <ul className="text-slate-600 mb-8 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Record at least 1-2 minutes of clear speech</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Speak naturally, as if talking to a loved one</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Use a quiet environment with minimal background noise</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Multiple samples help capture your natural voice better</span>
            </li>
          </ul>

          {/* Recording / Upload Options */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              onTouchEnd={(e) => {
                e.preventDefault();
                if (!isUploading && !isStartingRecording) {
                  if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }
              }}
              disabled={isUploading || isStartingRecording}
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all cursor-pointer select-none ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : isStartingRecording
                  ? "bg-purple-400 text-white cursor-wait"
                  : "bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:shadow-lg active:scale-95"
              } disabled:opacity-50`}
            >
              {isStartingRecording ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting...
                </>
              ) : isRecording ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Record Voice
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onTouchEnd={(e) => {
                e.preventDefault();
                if (!isUploading && !isRecording) {
                  fileInputRef.current?.click();
                }
              }}
              disabled={isUploading || isRecording}
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold border-2 border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer select-none active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              Upload Audio Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.m4a,.mp3,.wav,.ogg,.webm,.aac"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {audioFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">
                Your Audio Samples ({audioFiles.length} file{audioFiles.length !== 1 ? "s" : ""})
              </h3>
              <div className="space-y-2">
                {audioFiles.map((af, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      playingIndex === index ? "bg-purple-100 border border-purple-300" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => playingIndex === index ? stopPlayback() : playAudio(index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          playingIndex === index
                            ? "bg-purple-500 text-white"
                            : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                        }`}
                        title={playingIndex === index ? "Stop" : "Play"}
                      >
                        {playingIndex === index ? (
                          <Square className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>
                      <div>
                        <span className="text-slate-700 font-medium">{af.file.name}</span>
                        <span className="text-slate-400 text-sm ml-2">
                          ({(af.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={uploadVoice}
            disabled={audioFiles.length === 0 || isUploading || isRecording}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preserving Your Voice...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Preserve My Voice
              </>
            )}
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-slate-50 rounded-2xl p-6">
        <h3 className="font-bold text-slate-900 mb-3">How Voice Preservation Works</h3>
        <p className="text-slate-600 mb-4">
          Using advanced AI voice cloning technology from ElevenLabs, we create a digital
          representation of your voice. When your loved ones use the AI Conversation feature,
          they will hear responses in a voice that sounds like you.
        </p>
        <p className="text-slate-500 text-sm">
          <strong>Privacy:</strong> Your voice data is securely processed and stored. You can
          delete your preserved voice at any time.
        </p>
      </div>
    </div>
  );
}
