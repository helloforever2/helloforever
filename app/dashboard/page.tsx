"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Mail,
  Users,
  Calendar,
  Plus,
  UserPlus,
  Shield,
  Video,
  Mic,
  FileText,
  MoreVertical,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  ArrowRight,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

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
  scheduledDate?: string;
  status: string;
  deliveryType: string;
  recipient: Recipient;
  createdAt: string;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          <Clock className="w-3 h-3" />
          Scheduled
        </span>
      );
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Delivered
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          <FileText className="w-3 h-3" />
          Draft
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {status}
        </span>
      );
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "VIDEO":
      return <Video className="w-4 h-4 text-blue-500" />;
    case "AUDIO":
      return <Mic className="w-4 h-4 text-purple-500" />;
    case "TEXT":
      return <FileText className="w-4 h-4 text-slate-500" />;
    default:
      return null;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Upon passing";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "there";

  const [messages, setMessages] = useState<Message[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesRes, recipientsRes] = await Promise.all([
          fetch("/api/messages"),
          fetch("/api/recipients"),
        ]);

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessages(messagesData.messages || []);
        }

        if (recipientsRes.ok) {
          const recipientsData = await recipientsRes.json();
          setRecipientCount(recipientsData.recipients?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasMessages = messages.length > 0;
  const scheduledCount = messages.filter(
    (m) => m.status.toLowerCase() === "scheduled"
  ).length;

  const stats = [
    {
      label: "Messages Created",
      value: messages.length,
      icon: Mail,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Recipients",
      value: recipientCount,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Scheduled Deliveries",
      value: scheduledCount,
      icon: Calendar,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  // Show only the 4 most recent messages
  const recentMessages = messages.slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {userName}!
        </h2>
        <p className="text-slate-600 mt-1">
          {hasMessages
            ? `You have ${messages.length} message${messages.length !== 1 ? "s" : ""} saved`
            : "You haven't created any messages yet"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/messages/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New Message
          </Link>
          <Link
            href="/dashboard/recipients"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add Recipient
          </Link>
          <Link
            href="/dashboard/voice"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all"
          >
            <Mic className="w-5 h-5" />
            Voice Preservation
          </Link>
          <Link
            href="/dashboard/trustee"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all"
          >
            <Shield className="w-5 h-5" />
            Invite Trustee
          </Link>
        </div>
      </div>

      {/* Premium Features Banner */}
      {session?.user?.plan?.toLowerCase() !== "free" && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Features Unlocked</h3>
                <p className="text-purple-100 text-sm">
                  Voice preservation and AI conversations are available for your recipients
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/voice"
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-medium text-sm"
              >
                Preserve Voice
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages */}
      {hasMessages ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Messages
            </h3>
            <Link
              href="/dashboard/messages"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          {getTypeIcon(message.type)}
                        </div>
                        <span className="font-medium text-slate-900">
                          {message.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {message.recipient?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(message.scheduledDate)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(message.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/messages/${message.id}`}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {recentMessages.map((message) => (
              <div key={message.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      {getTypeIcon(message.type)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {message.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        To: {message.recipient?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 pl-13">
                  <p className="text-sm text-slate-500">
                    {formatDate(message.scheduledDate)}
                  </p>
                  {getStatusBadge(message.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Mail className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No messages yet
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Get started by creating your first message. Record a video, audio,
            or write something special for your loved ones.
          </p>
          <Link
            href="/dashboard/messages/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Your First Message
          </Link>
        </div>
      )}
    </div>
  );
}
