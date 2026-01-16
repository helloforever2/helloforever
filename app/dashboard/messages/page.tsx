"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Video,
  Mic,
  FileText,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Mail,
  ChevronDown,
  Calendar,
  User,
} from "lucide-react";

// Mock messages data
const mockMessages = [
  {
    id: 1,
    title: "Birthday Message for Sarah",
    recipient: "Sarah Williams",
    scheduledDate: "Mar 15, 2026",
    createdDate: "Jan 10, 2025",
    status: "scheduled",
    type: "video",
    duration: "2:34",
  },
  {
    id: 2,
    title: "Wedding Day Wishes",
    recipient: "Michael Chen",
    scheduledDate: "Jun 20, 2026",
    createdDate: "Jan 8, 2025",
    status: "scheduled",
    type: "video",
    duration: "5:12",
  },
  {
    id: 3,
    title: "Graduation Congratulations",
    recipient: "Emma Williams",
    scheduledDate: "May 28, 2025",
    createdDate: "Dec 15, 2024",
    status: "delivered",
    type: "audio",
    duration: "1:45",
  },
  {
    id: 4,
    title: "Christmas Message 2026",
    recipient: "Family Group",
    scheduledDate: "Dec 25, 2026",
    createdDate: "Jan 5, 2025",
    status: "draft",
    type: "text",
    duration: null,
  },
  {
    id: 5,
    title: "Anniversary Note",
    recipient: "Mom & Dad",
    scheduledDate: "Aug 14, 2026",
    createdDate: "Jan 2, 2025",
    status: "scheduled",
    type: "video",
    duration: "3:21",
  },
  {
    id: 6,
    title: "18th Birthday Message",
    recipient: "Jake Williams",
    scheduledDate: "Nov 3, 2028",
    createdDate: "Dec 28, 2024",
    status: "scheduled",
    type: "audio",
    duration: "4:56",
  },
];

const statusFilters = [
  { value: "all", label: "All Messages" },
  { value: "scheduled", label: "Scheduled" },
  { value: "delivered", label: "Delivered" },
  { value: "draft", label: "Drafts" },
];

const sortOptions = [
  { value: "created", label: "Date Created" },
  { value: "delivery", label: "Delivery Date" },
  { value: "recipient", label: "Recipient" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
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
      return null;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "video":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
          <Video className="w-3 h-3" />
          Video
        </span>
      );
    case "audio":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">
          <Mic className="w-3 h-3" />
          Audio
        </span>
      );
    case "text":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-600">
          <FileText className="w-3 h-3" />
          Text
        </span>
      );
    default:
      return null;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="w-5 h-5 text-blue-500" />;
    case "audio":
      return <Mic className="w-5 h-5 text-purple-500" />;
    case "text":
      return <FileText className="w-5 h-5 text-slate-500" />;
    default:
      return null;
  }
};

export default function MessagesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter messages
  const filteredMessages = mockMessages.filter((message) => {
    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;
    const matchesSearch =
      message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const hasMessages = filteredMessages.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Messages</h2>
          <p className="text-slate-600 mt-1">
            {mockMessages.length} messages total
          </p>
        </div>
        <Link
          href="/dashboard/messages/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Message
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages or recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">
                  {statusFilters.find((f) => f.value === statusFilter)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    {statusFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setStatusFilter(filter.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          statusFilter === filter.value
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {hasMessages ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                          {getTypeIcon(message.type)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {message.title}
                          </p>
                          {message.duration && (
                            <p className="text-sm text-slate-500">
                              {message.duration}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                          {message.recipient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="text-slate-600">
                          {message.recipient}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(message.type)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {message.scheduledDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(message.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
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

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {message.title}
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        To: {message.recipient}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {getTypeBadge(message.type)}
                        {getStatusBadge(message.status)}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 flex-shrink-0">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {message.scheduledDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
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
            {searchQuery || statusFilter !== "all"
              ? "No messages found"
              : "You haven't created any messages yet"}
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Create your first message to get started. Record a video, audio, or write something special for your loved ones."}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Link
              href="/dashboard/messages/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Message
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
