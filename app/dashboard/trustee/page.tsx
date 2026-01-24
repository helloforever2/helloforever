"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  UserPlus,
  Mail,
  User,
  Heart,
  Trash2,
  Edit,
  Check,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";

interface Trustee {
  id: string;
  name: string;
  email: string;
  relationship: string;
  notified: boolean;
  createdAt: string;
}

const relationships = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Friend",
  "Attorney",
  "Other",
];

export default function TrusteePage() {
  const [trustee, setTrustee] = useState<Trustee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    relationship: "Spouse",
  });

  // Fetch trustee on mount
  useEffect(() => {
    fetchTrustee();
  }, []);

  const fetchTrustee = async () => {
    try {
      const response = await fetch("/api/trustees");
      const data = await response.json();
      if (data.trustee) {
        setTrustee(data.trustee);
      }
    } catch (err) {
      console.error("Failed to fetch trustee:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/trustees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save trustee");
      }

      setTrustee(data.trustee);
      setSuccess("Trustee saved successfully!");
      setShowForm(false);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trustee");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    if (trustee) {
      setFormData({
        name: trustee.name,
        email: trustee.email,
        relationship: trustee.relationship,
      });
      setIsEditing(true);
      setShowForm(true);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your trustee?")) return;

    try {
      const response = await fetch("/api/trustees", { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to remove trustee");
      }

      setTrustee(null);
      setSuccess("Trustee removed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove trustee");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormData({ name: "", email: "", relationship: "Spouse" });
    setError("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Trustee</h2>
        <p className="text-slate-600 mt-1">
          Your trustee will be notified to deliver your messages when the time comes.
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">What is a Trustee?</p>
          <p>
            A trustee is someone you trust to confirm your passing and trigger the delivery
            of your scheduled messages. They will receive a unique verification code that
            allows them to initiate the delivery process.
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Trustee Card or Form */}
      {trustee && !showForm ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {trustee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{trustee.name}</h3>
                <p className="text-slate-600">{trustee.email}</p>
                <p className="text-sm text-slate-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {trustee.relationship}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {trustee.notified && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                <Mail className="w-4 h-4" />
                Notification sent
              </span>
            </div>
          )}
        </div>
      ) : showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-900">
            {isEditing ? "Edit Trustee" : "Add Trustee"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter trustee's full name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter trustee's email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Relationship
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
              {relationships.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Trustee
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Trustee Added</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Add someone you trust to ensure your messages are delivered at the right time.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add Trustee
          </button>
        </div>
      )}
    </div>
  );
}
