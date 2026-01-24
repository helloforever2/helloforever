"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Mic,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Mail,
  Heart,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Play,
} from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  email: string;
  relationship: string;
  avatar?: string;
}

interface Message {
  id: string;
  title: string;
  type: "VIDEO" | "AUDIO" | "TEXT";
  content?: string;
  thumbnail?: string;
  duration?: number;
  scheduledDate?: string;
  deliveryType: string;
  status: string;
  deliveredAt?: string;
  viewedAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  recipient: Recipient;
}

const getTypeIcon = (type: string, size: string = "w-6 h-6") => {
  switch (type) {
    case "VIDEO":
      return <Video className={`${size} text-blue-500`} />;
    case "AUDIO":
      return <Mic className={`${size} text-purple-500`} />;
    case "TEXT":
      return <FileText className={`${size} text-slate-500`} />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case "SCHEDULED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
          <Clock className="w-4 h-4" />
          Scheduled
        </span>
      );
    case "DELIVERED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-4 h-4" />
          Delivered
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
          <FileText className="w-4 h-4" />
          Draft
        </span>
      );
    default:
      return null;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatDeliveryType = (type: string) => {
  switch (type) {
    case "SPECIFIC_DATE":
      return "Specific Date";
    case "UPON_PASSING":
      return "Upon Passing";
    case "MILESTONE":
      return "Milestone";
    case "SURPRISE":
      return "Surprise";
    default:
      return type;
  }
};

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch message");
      }

      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchMessage();
    }
  }, [params.id, fetchMessage]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/messages/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      router.push("/dashboard/messages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-900 font-semibold mb-2">Message not found</p>
          <p className="text-slate-600 mb-4">{error}</p>
          <Link
            href="/dashboard/messages"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/dashboard/messages"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Messages
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              {getTypeIcon(message.type, "w-8 h-8")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{message.title}</h1>
              <p className="text-slate-600 mt-1">
                Created {formatDate(message.createdAt)}
              </p>
              <div className="mt-3">
                {getStatusBadge(message.status)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/messages/${message.id}/edit`)}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Message Content</h2>

        {message.type === "TEXT" ? (
          <div className="bg-slate-50 rounded-xl p-6">
            <p className="text-slate-700 whitespace-pre-wrap">
              {message.content || "No content"}
            </p>
          </div>
        ) : message.type === "VIDEO" ? (
          <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
            {message.thumbnail ? (
              <img
                src={message.thumbnail}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
            <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
            {message.duration && (
              <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/70 text-white text-sm">
                {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, "0")}
              </div>
            )}
          </div>
        ) : message.type === "AUDIO" ? (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center text-white">
              <Mic className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-lg font-medium">Audio Message</p>
              {message.duration && (
                <p className="text-white/80 mt-1">
                  Duration: {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, "0")}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {message.note && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm font-medium text-amber-800 mb-1">Personal Note</p>
            <p className="text-amber-700">{message.note}</p>
          </div>
        )}
      </div>

      {/* Recipient Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recipient</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
            {message.recipient.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{message.recipient.name}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {message.recipient.email}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {message.recipient.relationship}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Delivery Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-1">Delivery Type</p>
            <p className="font-medium text-slate-900">
              {formatDeliveryType(message.deliveryType)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Scheduled Date</p>
            <p className="font-medium text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {message.scheduledDate ? formatDate(message.scheduledDate) : "Upon passing"}
            </p>
          </div>
          {message.deliveredAt && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Delivered At</p>
              <p className="font-medium text-green-600">
                {formatDate(message.deliveredAt)}
              </p>
            </div>
          )}
          {message.viewedAt && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Viewed At</p>
              <p className="font-medium text-blue-600">
                {formatDate(message.viewedAt)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
