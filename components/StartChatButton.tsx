"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2, Sparkles } from "lucide-react";

interface StartChatButtonProps {
  messageId: string;
  userName: string;
}

export default function StartChatButton({ messageId, userName }: StartChatButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startConversation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setError("AI Chat is a premium feature");
        } else {
          setError(data.error || "Failed to start conversation");
        }
        return;
      }

      router.push(data.chatUrl);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 mb-1">AI Conversation Mode</h3>
          <p className="text-slate-600 text-sm mb-4">
            Have a conversation with an AI that captures {userName}&apos;s personality based on the messages they&apos;ve left for you.
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={startConversation}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Start Conversation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
