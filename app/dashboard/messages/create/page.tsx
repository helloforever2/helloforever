"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Mic,
  FileText,
  Check,
  Upload,
  X,
  Play,
  Square,
  Pause,
  User,
  Calendar,
  Clock,
  Gift,
  Sparkles,
  ChevronDown,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";

// Types
type MessageType = "video" | "audio" | "text" | null;
type DeliveryType = "specific" | "passing" | "milestone" | "surprise" | null;

interface Recipient {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone?: string;
  birthday?: string;
}

interface FormData {
  messageType: MessageType;
  title: string;
  note: string;
  content: string;
  recipient: Recipient | null;
  deliveryType: DeliveryType;
  deliveryDate: string;
  milestone: string;
}

// Mock existing recipients
const existingRecipients: Recipient[] = [
  { id: "1", name: "Sarah Williams", relationship: "Child", email: "sarah@example.com", birthday: "2000-03-15" },
  { id: "2", name: "Michael Chen", relationship: "Friend", email: "michael@example.com" },
  { id: "3", name: "Emma Williams", relationship: "Child", email: "emma@example.com", birthday: "2005-05-28" },
];

// Progress Steps
const steps = [
  { number: 1, title: "Type" },
  { number: 2, title: "Content" },
  { number: 3, title: "Recipient" },
  { number: 4, title: "Schedule" },
  { number: 5, title: "Review" },
];

export default function CreateMessagePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    messageType: null,
    title: "",
    note: "",
    content: "",
    recipient: null,
    deliveryType: null,
    deliveryDate: "",
    milestone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Video/Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<"record" | "upload">("record");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Recipient form states
  const [showNewRecipientForm, setShowNewRecipientForm] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [newRecipient, setNewRecipient] = useState({
    name: "",
    relationship: "Child",
    email: "",
    phone: "",
    birthday: "",
  });

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setHasRecording(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.messageType) {
          newErrors.messageType = "Please select a message type";
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          newErrors.title = "Please enter a title for your message";
        }
        if (formData.messageType === "text" && !formData.content.trim()) {
          newErrors.content = "Please enter your message content";
        }
        if ((formData.messageType === "video" || formData.messageType === "audio") && !hasRecording && !uploadedFile) {
          newErrors.content = `Please ${activeTab === "record" ? "record" : "upload"} your ${formData.messageType}`;
        }
        break;
      case 3:
        if (!formData.recipient) {
          newErrors.recipient = "Please select or add a recipient";
        }
        break;
      case 4:
        if (!formData.deliveryType) {
          newErrors.deliveryType = "Please select a delivery schedule";
        }
        if (formData.deliveryType === "specific" && !formData.deliveryDate) {
          newErrors.deliveryDate = "Please select a delivery date";
        }
        if (formData.deliveryType === "milestone" && !formData.milestone) {
          newErrors.milestone = "Please select a milestone event";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = (asDraft: boolean = false) => {
    const finalData = {
      ...formData,
      status: asDraft ? "draft" : "scheduled",
      hasRecording,
      uploadedFile,
      recordingDuration: recordingTime,
    };
    console.log("Message saved:", finalData);
    alert(asDraft ? "Message saved as draft!" : "Message scheduled successfully!");
  };

  const filteredRecipients = existingRecipients.filter(
    (r) =>
      r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const handleAddNewRecipient = () => {
    if (!newRecipient.name.trim() || !newRecipient.email.trim()) {
      setErrors({ newRecipient: "Name and email are required" });
      return;
    }
    const recipient: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
    };
    setFormData((prev) => ({ ...prev, recipient }));
    setShowNewRecipientForm(false);
    setNewRecipient({ name: "", relationship: "Child", email: "", phone: "", birthday: "" });
  };

  // Step 1: Choose Message Type
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">What type of message do you want to create?</h2>
        <p className="text-slate-600">Choose the format that best expresses your message</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { type: "video" as const, icon: Video, title: "Video", desc: "Record or upload a video message", color: "blue" },
          { type: "audio" as const, icon: Mic, title: "Audio", desc: "Record or upload audio", color: "purple" },
          { type: "text" as const, icon: FileText, title: "Text", desc: "Write a text message", color: "orange" },
        ].map((option) => (
          <button
            key={option.type}
            onClick={() => {
              setFormData((prev) => ({ ...prev, messageType: option.type }));
              setErrors({});
            }}
            className={`p-8 rounded-2xl border-2 transition-all duration-200 text-left group hover:shadow-lg ${
              formData.messageType === option.type
                ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                formData.messageType === option.type
                  ? `bg-${option.color}-500`
                  : `bg-${option.color}-100 group-hover:bg-${option.color}-200`
              }`}
            >
              <option.icon
                className={`w-8 h-8 ${
                  formData.messageType === option.type ? "text-white" : `text-${option.color}-600`
                }`}
              />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{option.title}</h3>
            <p className="text-slate-600">{option.desc}</p>
            {formData.messageType === option.type && (
              <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium">
                <Check className="w-5 h-5" />
                Selected
              </div>
            )}
          </button>
        ))}
      </div>

      {errors.messageType && (
        <p className="text-red-500 text-sm flex items-center gap-2 justify-center">
          <AlertCircle className="w-4 h-4" />
          {errors.messageType}
        </p>
      )}
    </div>
  );

  // Step 2: Content Input
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Create your {formData.messageType} message
        </h2>
        <p className="text-slate-600">Take your time - this message will mean the world to them</p>
      </div>

      {/* Title Field */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Message Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Birthday Message for Sarah"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Content Area - Changes based on type */}
      {formData.messageType === "video" && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("record")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "record" ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Record
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "upload" ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upload
            </button>
          </div>

          {activeTab === "record" ? (
            <div className="bg-slate-900 rounded-2xl overflow-hidden">
              {/* Camera Preview */}
              <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center relative">
                {!hasRecording ? (
                  <>
                    <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                      <Video className="w-12 h-12 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-lg">Camera will appear here</p>
                    <p className="text-slate-500 text-sm mt-1">Click record to start</p>

                    {isRecording && (
                      <>
                        {/* Recording indicator */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-red-500 font-medium">Recording</span>
                        </div>
                        {/* Timer */}
                        <div className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-lg">
                          <span className="text-white font-mono text-xl">{formatTime(recordingTime)}</span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Recorded preview */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <Check className="w-10 h-10 text-green-500" />
                      </div>
                      <p className="text-green-400 text-lg font-medium">Recording saved!</p>
                      <p className="text-slate-400 mt-2">Duration: {formatTime(recordingTime)}</p>
                      <button className="mt-4 px-6 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-center gap-4">
                {!isRecording && !hasRecording && (
                  <button
                    onClick={handleStartRecording}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg shadow-red-500/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-white" />
                  </button>
                )}
                {isRecording && (
                  <button
                    onClick={handleStopRecording}
                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2 animate-pulse"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    Stop Recording ({formatTime(recordingTime)})
                  </button>
                )}
                {hasRecording && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setHasRecording(false);
                        setRecordingTime(0);
                      }}
                      className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Re-record
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
              {!uploadedFile ? (
                <>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">Drag & drop your video here</p>
                  <p className="text-slate-500 mb-4">or</p>
                  <button
                    onClick={() => setUploadedFile("my-video.mp4")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Browse Files
                  </button>
                  <p className="text-sm text-slate-400 mt-4">Max 500MB for free tier. Upgrade for more.</p>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mx-auto">
                    <Video className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="font-medium text-slate-900">{uploadedFile}</p>
                  <p className="text-sm text-slate-500">24.5 MB</p>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {formData.messageType === "audio" && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("record")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "record" ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Record
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "upload" ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upload
            </button>
          </div>

          {activeTab === "record" ? (
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-8">
              {/* Waveform visualization placeholder */}
              <div className="h-32 flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all ${
                      isRecording ? "bg-purple-400 animate-pulse" : "bg-slate-600"
                    }`}
                    style={{
                      height: isRecording
                        ? `${Math.random() * 80 + 20}%`
                        : hasRecording
                        ? `${Math.sin(i * 0.3) * 40 + 50}%`
                        : "20%",
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center mb-6">
                <span className="text-4xl font-mono text-white">{formatTime(recordingTime)}</span>
                {isRecording && <p className="text-purple-400 mt-2 animate-pulse">Recording...</p>}
                {hasRecording && <p className="text-green-400 mt-2">Recording saved!</p>}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isRecording && !hasRecording && (
                  <button
                    onClick={handleStartRecording}
                    className="w-16 h-16 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center shadow-lg shadow-purple-500/30"
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </button>
                )}
                {isRecording && (
                  <button
                    onClick={handleStopRecording}
                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    Stop Recording
                  </button>
                )}
                {hasRecording && (
                  <div className="flex gap-3">
                    <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Play
                    </button>
                    <button
                      onClick={() => {
                        setHasRecording(false);
                        setRecordingTime(0);
                      }}
                      className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Re-record
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer">
              {!uploadedFile ? (
                <>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">Drag & drop your audio here</p>
                  <p className="text-slate-500 mb-4">or</p>
                  <button
                    onClick={() => setUploadedFile("my-audio.mp3")}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Browse Files
                  </button>
                  <p className="text-sm text-slate-400 mt-4">Supports MP3, WAV, M4A. Max 100MB.</p>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center mx-auto">
                    <Mic className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="font-medium text-slate-900">{uploadedFile}</p>
                  <p className="text-sm text-slate-500">3.2 MB</p>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {formData.messageType === "text" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your heartfelt message here..."
              rows={10}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
            />
            <div className="flex justify-between mt-2 text-sm text-slate-500">
              <span>{formData.content.length} characters</span>
              <span>No limit</span>
            </div>
          </div>
          {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
        </div>
      )}

      {/* Note Field */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Personal Note <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          value={formData.note}
          onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="Add a note for yourself (won't be shown to recipient)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
        />
      </div>

      {errors.content && formData.messageType !== "text" && (
        <p className="text-red-500 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.content}
        </p>
      )}
    </div>
  );

  // Step 3: Choose Recipient
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Who is this message for?</h2>
        <p className="text-slate-600">Select an existing recipient or add someone new</p>
      </div>

      {!showNewRecipientForm ? (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
              placeholder="Search recipients..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          {/* Existing Recipients */}
          <div className="space-y-3">
            {filteredRecipients.map((recipient) => (
              <button
                key={recipient.id}
                onClick={() => setFormData((prev) => ({ ...prev, recipient }))}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                  formData.recipient?.id === recipient.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {recipient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{recipient.name}</p>
                  <p className="text-sm text-slate-500">
                    {recipient.relationship} &bull; {recipient.email}
                  </p>
                </div>
                {formData.recipient?.id === recipient.id && (
                  <Check className="w-6 h-6 text-blue-500" />
                )}
              </button>
            ))}
          </div>

          {/* Add New Recipient */}
          <button
            onClick={() => setShowNewRecipientForm(true)}
            className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600"
          >
            <Plus className="w-5 h-5" />
            Add New Recipient
          </button>
        </>
      ) : (
        /* New Recipient Form */
        <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Add New Recipient</h3>
            <button
              onClick={() => setShowNewRecipientForm(false)}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
              <select
                value={newRecipient.relationship}
                onChange={(e) => setNewRecipient((prev) => ({ ...prev, relationship: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option>Child</option>
                <option>Spouse</option>
                <option>Parent</option>
                <option>Sibling</option>
                <option>Friend</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={newRecipient.phone}
                onChange={(e) => setNewRecipient((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Birthday (optional)</label>
              <input
                type="date"
                value={newRecipient.birthday}
                onChange={(e) => setNewRecipient((prev) => ({ ...prev, birthday: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {errors.newRecipient && (
            <p className="text-red-500 text-sm">{errors.newRecipient}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowNewRecipientForm(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 font-medium hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNewRecipient}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Add Recipient
            </button>
          </div>
        </div>
      )}

      {errors.recipient && (
        <p className="text-red-500 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.recipient}
        </p>
      )}
    </div>
  );

  // Step 4: Schedule Delivery
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">When should this message be delivered?</h2>
        <p className="text-slate-600">Choose the perfect moment for your message to arrive</p>
      </div>

      <div className="space-y-4">
        {/* Specific Date */}
        <button
          onClick={() => setFormData((prev) => ({ ...prev, deliveryType: "specific" }))}
          className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
            formData.deliveryType === "specific"
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                formData.deliveryType === "specific" ? "bg-blue-500" : "bg-blue-100"
              }`}
            >
              <Calendar
                className={`w-6 h-6 ${formData.deliveryType === "specific" ? "text-white" : "text-blue-600"}`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Specific Date</h3>
              <p className="text-sm text-slate-600">Deliver on a date you choose</p>
            </div>
            {formData.deliveryType === "specific" && <Check className="w-6 h-6 text-blue-500" />}
          </div>
        </button>

        {formData.deliveryType === "specific" && (
          <div className="ml-16 p-4 bg-slate-50 rounded-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select delivery date</label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, deliveryDate: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>}
          </div>
        )}

        {/* Upon My Passing */}
        <button
          onClick={() => setFormData((prev) => ({ ...prev, deliveryType: "passing" }))}
          className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
            formData.deliveryType === "passing"
              ? "border-purple-500 bg-purple-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                formData.deliveryType === "passing" ? "bg-purple-500" : "bg-purple-100"
              }`}
            >
              <Clock
                className={`w-6 h-6 ${formData.deliveryType === "passing" ? "text-white" : "text-purple-600"}`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Upon My Passing</h3>
              <p className="text-sm text-slate-600">Your trustee will release this message</p>
            </div>
            {formData.deliveryType === "passing" && <Check className="w-6 h-6 text-purple-500" />}
          </div>
        </button>

        {formData.deliveryType === "passing" && (
          <div className="ml-16 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-sm text-purple-700">
              <strong>Note:</strong> You&apos;ll need to assign a trustee who can confirm your passing and release
              this message. You can do this in the Trustee section.
            </p>
          </div>
        )}

        {/* Milestone Event - Premium */}
        <button
          onClick={() => setFormData((prev) => ({ ...prev, deliveryType: "milestone" }))}
          className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
            formData.deliveryType === "milestone"
              ? "border-orange-500 bg-orange-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                formData.deliveryType === "milestone" ? "bg-orange-500" : "bg-orange-100"
              }`}
            >
              <Gift
                className={`w-6 h-6 ${formData.deliveryType === "milestone" ? "text-white" : "text-orange-600"}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900">Milestone Event</h3>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold">
                  PREMIUM
                </span>
              </div>
              <p className="text-sm text-slate-600">Birthday, wedding, graduation, and more</p>
            </div>
            {formData.deliveryType === "milestone" && <Check className="w-6 h-6 text-orange-500" />}
          </div>
        </button>

        {formData.deliveryType === "milestone" && (
          <div className="ml-16 p-4 bg-slate-50 rounded-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select milestone</label>
            <select
              value={formData.milestone}
              onChange={(e) => setFormData((prev) => ({ ...prev, milestone: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Choose an event...</option>
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding Day</option>
              <option value="graduation">Graduation</option>
              <option value="anniversary">Anniversary</option>
              <option value="first-child">Birth of First Child</option>
              <option value="retirement">Retirement</option>
            </select>
            {errors.milestone && <p className="text-red-500 text-sm mt-1">{errors.milestone}</p>}
          </div>
        )}

        {/* Surprise Me - Premium */}
        <button
          onClick={() => setFormData((prev) => ({ ...prev, deliveryType: "surprise" }))}
          className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
            formData.deliveryType === "surprise"
              ? "border-pink-500 bg-pink-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                formData.deliveryType === "surprise" ? "bg-pink-500" : "bg-pink-100"
              }`}
            >
              <Sparkles
                className={`w-6 h-6 ${formData.deliveryType === "surprise" ? "text-white" : "text-pink-600"}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900">Surprise Me</h3>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold">
                  PREMIUM
                </span>
              </div>
              <p className="text-sm text-slate-600">Random delivery within a time window</p>
            </div>
            {formData.deliveryType === "surprise" && <Check className="w-6 h-6 text-pink-500" />}
          </div>
        </button>
      </div>

      {errors.deliveryType && (
        <p className="text-red-500 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.deliveryType}
        </p>
      )}
    </div>
  );

  // Step 5: Review & Save
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Message</h2>
        <p className="text-slate-600">Make sure everything looks perfect before saving</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Message Type & Title */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  formData.messageType === "video"
                    ? "bg-blue-100"
                    : formData.messageType === "audio"
                    ? "bg-purple-100"
                    : "bg-orange-100"
                }`}
              >
                {formData.messageType === "video" && <Video className="w-7 h-7 text-blue-600" />}
                {formData.messageType === "audio" && <Mic className="w-7 h-7 text-purple-600" />}
                {formData.messageType === "text" && <FileText className="w-7 h-7 text-orange-600" />}
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                  {formData.messageType} Message
                </p>
                <h3 className="text-xl font-bold text-slate-900">{formData.title}</h3>
                {formData.note && <p className="text-sm text-slate-500 mt-1">Note: {formData.note}</p>}
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          {/* Content Preview */}
          {formData.messageType === "text" && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <p className="text-slate-700 whitespace-pre-wrap line-clamp-4">{formData.content}</p>
            </div>
          )}
          {(formData.messageType === "video" || formData.messageType === "audio") && hasRecording && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {formData.messageType === "video" ? "Video" : "Audio"} recorded
                </p>
                <p className="text-sm text-slate-500">Duration: {formatTime(recordingTime)}</p>
              </div>
            </div>
          )}
          {(formData.messageType === "video" || formData.messageType === "audio") && uploadedFile && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">File uploaded</p>
                <p className="text-sm text-slate-500">{uploadedFile}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recipient */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {formData.recipient?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Recipient</p>
                <h3 className="text-lg font-bold text-slate-900">{formData.recipient?.name}</h3>
                <p className="text-sm text-slate-500">
                  {formData.recipient?.relationship} &bull; {formData.recipient?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(3)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delivery Schedule */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  formData.deliveryType === "specific"
                    ? "bg-blue-100"
                    : formData.deliveryType === "passing"
                    ? "bg-purple-100"
                    : formData.deliveryType === "milestone"
                    ? "bg-orange-100"
                    : "bg-pink-100"
                }`}
              >
                {formData.deliveryType === "specific" && <Calendar className="w-7 h-7 text-blue-600" />}
                {formData.deliveryType === "passing" && <Clock className="w-7 h-7 text-purple-600" />}
                {formData.deliveryType === "milestone" && <Gift className="w-7 h-7 text-orange-600" />}
                {formData.deliveryType === "surprise" && <Sparkles className="w-7 h-7 text-pink-600" />}
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Delivery</p>
                <h3 className="text-lg font-bold text-slate-900">
                  {formData.deliveryType === "specific" && `On ${new Date(formData.deliveryDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                  {formData.deliveryType === "passing" && "Upon My Passing"}
                  {formData.deliveryType === "milestone" && `On their ${formData.milestone}`}
                  {formData.deliveryType === "surprise" && "Surprise Delivery"}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(4)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => handleSave(true)}
          className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSave(false)}
          className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
        >
          Save Message
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/messages"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-bold text-slate-900">Create Message</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.number < currentStep) setCurrentStep(step.number);
                  }}
                  disabled={step.number > currentStep}
                  className={`flex items-center gap-2 ${
                    step.number < currentStep
                      ? "cursor-pointer"
                      : step.number === currentStep
                      ? "cursor-default"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      step.number < currentStep
                        ? "bg-green-500 text-white"
                        : step.number === currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span
                    className={`hidden sm:block text-sm font-medium ${
                      step.number <= currentStep ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      step.number < currentStep ? "bg-green-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
