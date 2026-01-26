"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  CreditCard,
  Shield,
  Bell,
  AlertTriangle,
  Upload,
  Check,
  Sparkles,
  HardDrive,
  MessageSquare,
  ExternalLink,
  UserPlus,
  Trash2,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";

type TabType = "profile" | "account" | "trustee" | "notifications" | "danger";

const tabs = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "account" as const, label: "Account", icon: CreditCard },
  { id: "trustee" as const, label: "Trustee", icon: Shield },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "danger" as const, label: "Danger Zone", icon: AlertTriangle },
];

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    avatar: "",
    plan: "free",
    storageUsed: 0,
    messagesCreated: 0,
    maxMessages: 3,
  });
  const [trustee, setTrustee] = useState<{ name: string; email: string; relationship: string } | null>(null);

  // Load user data from session and API
  useEffect(() => {
    if (session?.user) {
      const initials = session.user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

      setUser((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: initials,
        plan: (session.user.plan || "free").toLowerCase(),
      }));

      // Fetch additional profile data
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser((prev) => ({
              ...prev,
              phone: data.user.phone || "",
              birthday: data.user.birthday ? data.user.birthday.split("T")[0] : "",
              storageUsed: data.user.storageUsed || 0,
              messagesCreated: data.user.messageCount || 0,
            }));
          }
        })
        .catch(console.error);
    }
  }, [session]);
  const [notifications, setNotifications] = useState({
    messageDelivered: true,
    recipientViewed: true,
    storageAlmostFull: true,
    subscriptionRenewal: false,
  });
  const [showTrusteeForm, setShowTrusteeForm] = useState(false);
  const [newTrustee, setNewTrustee] = useState({
    name: "",
    email: "",
    relationship: "Spouse",
  });

  const handleProfileSave = async () => {
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          birthday: user.birthday,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      // Update session with new name
      await updateSession({ name: user.name });

      // Update avatar initials
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      setUser((prev) => ({ ...prev, avatar: initials }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTrustee = () => {
    if (!newTrustee.name.trim() || !newTrustee.email.trim()) {
      alert("Name and email are required");
      return;
    }
    setTrustee(newTrustee);
    setShowTrusteeForm(false);
    setNewTrustee({ name: "", email: "", relationship: "Spouse" });
  };

  const handleRemoveTrustee = () => {
    if (confirm("Are you sure you want to remove your trustee?")) {
      setTrustee(null);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion requested. You will receive a confirmation email.");
    }
  };

  const getPlanBadge = () => {
    switch (user.plan) {
      case "premium":
        return (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
            Premium
          </span>
        );
      case "premium_plus":
        return (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold">
            Premium Plus
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-sm font-semibold">
            Free
          </span>
        );
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {user.avatar}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{user.name}</h3>
          <p className="text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            value={user.phone}
            onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Birthday</label>
          <input
            type="date"
            value={user.birthday}
            onChange={(e) => setUser((prev) => ({ ...prev, birthday: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
        </div>
      </div>

      {saveError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Profile saved successfully!
        </div>
      )}

      <button
        onClick={handleProfileSave}
        disabled={isSaving}
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Current Plan</p>
            {getPlanBadge()}
          </div>
          {user.plan === "free" ? (
            <Link
              href="/dashboard/upgrade"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade Plan
            </Link>
          ) : (
            <Link
              href="/dashboard/upgrade"
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-white transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Manage Subscription
            </Link>
          )}
        </div>

        {user.plan === "free" && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-blue-100">
            <p className="text-sm text-slate-600 mb-2">
              <strong>Upgrade to Premium</strong> for unlimited messages, AI features, and priority delivery.
            </p>
            <ul className="text-sm text-slate-500 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Unlimited messages
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                AI conversation mode
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Voice preservation
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                10GB storage
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Storage</h4>
            <p className="text-sm text-slate-500">{user.storageUsed}% used</p>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              user.storageUsed > 80
                ? "bg-red-500"
                : user.storageUsed > 60
                ? "bg-orange-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${user.storageUsed}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {user.plan === "free" ? "1GB included with Free plan" : "10GB included with Premium"}
        </p>
      </div>

      {/* Messages Created */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Messages Created</h4>
            <p className="text-sm text-slate-500">
              {user.messagesCreated} {user.plan === "free" && `/ ${user.maxMessages} free messages`}
            </p>
          </div>
        </div>
        {user.plan === "free" && user.messagesCreated >= user.maxMessages && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-sm text-orange-700">
              You&apos;ve used all your free messages. Upgrade to Premium for unlimited messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTrusteeTab = () => (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">What is a Trustee?</h4>
            <p className="text-slate-600 text-sm">
              Your trustee is someone you trust to confirm your passing and trigger the delivery of your
              &quot;Upon My Passing&quot; messages. They won&apos;t be able to see or edit your messages - only release them
              when the time comes.
            </p>
          </div>
        </div>
      </div>

      {/* Current Trustee or Add Form */}
      {trustee && !showTrusteeForm ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {trustee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Your Trustee</p>
                <h4 className="font-semibold text-slate-900">{trustee.name}</h4>
                <p className="text-sm text-slate-500">{trustee.email}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 mt-2">
                  {trustee.relationship}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNewTrustee(trustee);
                  setShowTrusteeForm(true);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemoveTrustee}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Trustee invitation sent</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          {showTrusteeForm ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-slate-900">
                  {trustee ? "Edit Trustee" : "Add Trustee"}
                </h4>
                <button
                  onClick={() => setShowTrusteeForm(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTrustee.name}
                    onChange={(e) => setNewTrustee((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter trustee's full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newTrustee.email}
                    onChange={(e) => setNewTrustee((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter trustee's email"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                  <select
                    value={newTrustee.relationship}
                    onChange={(e) => setNewTrustee((prev) => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Attorney">Attorney</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowTrusteeForm(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTrustee}
                    className="flex-1 px-4 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                  >
                    {trustee ? "Save Changes" : "Send Invitation"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">No Trustee Assigned</h4>
              <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
                Assign a trustee to ensure your &quot;Upon My Passing&quot; messages are delivered when the time
                comes.
              </p>
              <button
                onClick={() => setShowTrusteeForm(true)}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add Trustee
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      <p className="text-slate-600 mb-6">
        Choose which email notifications you&apos;d like to receive.
      </p>

      {[
        {
          key: "messageDelivered" as const,
          title: "Message Delivered",
          description: "Get notified when a scheduled message has been delivered",
        },
        {
          key: "recipientViewed" as const,
          title: "Recipient Viewed",
          description: "Get notified when a recipient views your message",
        },
        {
          key: "storageAlmostFull" as const,
          title: "Storage Almost Full",
          description: "Get notified when your storage is almost full",
        },
        {
          key: "subscriptionRenewal" as const,
          title: "Subscription Renewal",
          description: "Get reminders before your subscription renews",
        },
      ].map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200"
        >
          <div>
            <h4 className="font-medium text-slate-900">{item.title}</h4>
            <p className="text-sm text-slate-500">{item.description}</p>
          </div>
          <button
            onClick={() =>
              setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
            }
            className={`relative w-12 h-7 rounded-full transition-colors ${
              notifications[item.key] ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                notifications[item.key] ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const renderDangerTab = () => (
    <div className="space-y-6">
      <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Delete Account</h4>
            <p className="text-red-700 text-sm mb-4">
              Once you delete your account, there is no going back. All your messages, recipients, and
              data will be permanently removed. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2.5 rounded-xl border-2 border-red-300 text-red-600 font-semibold hover:bg-red-100 transition-colors"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Settings</h2>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600"
                  : "text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300"
              } ${tab.id === "danger" ? "text-red-500 hover:text-red-600" : ""}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "account" && renderAccountTab()}
          {activeTab === "trustee" && renderTrusteeTab()}
          {activeTab === "notifications" && renderNotificationsTab()}
          {activeTab === "danger" && renderDangerTab()}
        </div>
      </div>
    </div>
  );
}
