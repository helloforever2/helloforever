"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  X,
  Upload,
  MessageSquare,
  Users,
} from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone?: string;
  birthday?: string;
  messagesCount: number;
  avatar?: string;
}

// Mock recipients data
const mockRecipients: Recipient[] = [
  {
    id: "1",
    name: "Sarah Williams",
    relationship: "Child",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    birthday: "2000-03-15",
    messagesCount: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    relationship: "Friend",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    messagesCount: 2,
  },
  {
    id: "3",
    name: "Emma Williams",
    relationship: "Child",
    email: "emma.w@example.com",
    birthday: "2005-05-28",
    messagesCount: 3,
  },
  {
    id: "4",
    name: "Robert Williams",
    relationship: "Spouse",
    email: "robert@example.com",
    phone: "+1 (555) 345-6789",
    birthday: "1975-11-20",
    messagesCount: 8,
  },
];

const relationshipColors: Record<string, string> = {
  Child: "bg-blue-100 text-blue-700",
  Spouse: "bg-pink-100 text-pink-700",
  Parent: "bg-purple-100 text-purple-700",
  Sibling: "bg-green-100 text-green-700",
  Friend: "bg-orange-100 text-orange-700",
  Other: "bg-slate-100 text-slate-700",
};

const avatarColors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-pink-500 to-pink-600",
  "from-orange-500 to-orange-600",
  "from-green-500 to-green-600",
  "from-cyan-500 to-cyan-600",
];

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>(mockRecipients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Child",
    email: "",
    phone: "",
    birthday: "",
  });

  const filteredRecipients = recipients.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const index = parseInt(id) % avatarColors.length;
    return avatarColors[index];
  };

  const handleOpenModal = (recipient?: Recipient) => {
    if (recipient) {
      setEditingRecipient(recipient);
      setFormData({
        name: recipient.name,
        relationship: recipient.relationship,
        email: recipient.email,
        phone: recipient.phone || "",
        birthday: recipient.birthday || "",
      });
    } else {
      setEditingRecipient(null);
      setFormData({
        name: "",
        relationship: "Child",
        email: "",
        phone: "",
        birthday: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecipient(null);
    setFormData({
      name: "",
      relationship: "Child",
      email: "",
      phone: "",
      birthday: "",
    });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required");
      return;
    }

    if (editingRecipient) {
      // Update existing
      setRecipients((prev) =>
        prev.map((r) =>
          r.id === editingRecipient.id
            ? { ...r, ...formData }
            : r
        )
      );
    } else {
      // Add new
      const newRecipient: Recipient = {
        id: Date.now().toString(),
        ...formData,
        messagesCount: 0,
      };
      setRecipients((prev) => [...prev, newRecipient]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this recipient?")) {
      setRecipients((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const hasRecipients = recipients.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recipients</h2>
          <p className="text-slate-600 mt-1">
            {hasRecipients
              ? `${recipients.length} recipient${recipients.length !== 1 ? "s" : ""} saved`
              : "Manage the people who will receive your messages"}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Recipient
        </button>
      </div>

      {hasRecipients ? (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipients..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          {/* Recipients Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipients.map((recipient) => (
              <div
                key={recipient.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAvatarColor(
                        recipient.id
                      )} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {getInitials(recipient.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{recipient.name}</h3>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          relationshipColors[recipient.relationship] || relationshipColors.Other
                        }`}
                      >
                        {recipient.relationship}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(recipient)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(recipient.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{recipient.email}</span>
                  </div>
                  {recipient.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{recipient.phone}</span>
                    </div>
                  )}
                  {recipient.birthday && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>
                        {new Date(recipient.birthday).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-500">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">
                    {recipient.messagesCount} message{recipient.messagesCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipients.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No recipients found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No recipients yet</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Add your first recipient to get started. These are the people who will receive
            your heartfelt messages.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Your First Recipient
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleCloseModal}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingRecipient ? "Edit Recipient" : "Add New Recipient"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Photo Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    {formData.name ? (
                      <span className="text-2xl font-bold text-slate-500">
                        {getInitials(formData.name)}
                      </span>
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Relationship
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                >
                  <option value="Child">Child</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Birthday <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData((prev) => ({ ...prev, birthday: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                {editingRecipient ? "Save Changes" : "Save Recipient"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
