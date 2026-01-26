"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Send, Loader2, MessageCircle, Sparkles, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  audioUrl?: string | null;
  createdAt: string;
}

interface ConversationData {
  id: string;
  userName: string;
  userAvatar: string | null;
  recipientName: string;
  relationship: string;
  messages: Message[];
}

export default function ChatPage({ params }: { params: { token: string } }) {
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const playAudio = (audioBase64: string, messageId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
    audioRef.current = audio;
    setIsPlayingAudio(messageId);

    audio.onended = () => {
      setIsPlayingAudio(null);
    };

    audio.onerror = () => {
      setIsPlayingAudio(null);
      console.error("Audio playback failed");
    };

    audio.play().catch(() => {
      setIsPlayingAudio(null);
    });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingAudio(null);
    }
  };

  useEffect(() => {
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/ai/chat?token=${params.token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load conversation");
        return;
      }

      setConversation(data.conversation);
      setMessages(data.conversation.messages);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isSending) return;

    const userMessage = input.trim();
    setInput("");
    setIsSending(true);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: params.token,
          message: userMessage,
          includeVoice: voiceEnabled,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      const messageId = `ai-${Date.now()}`;

      // Add AI response
      const aiMessage: Message = {
        id: messageId,
        role: "ASSISTANT",
        content: data.response,
        audioUrl: data.audioBase64 ? `data:audio/mpeg;base64,${data.audioBase64}` : null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Auto-play audio if available and voice is enabled
      if (data.audioBase64 && voiceEnabled) {
        playAudio(data.audioBase64, messageId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Conversation Not Found</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to HelloForever
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HelloForever
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (isPlayingAudio) stopAudio();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  voiceEnabled
                    ? "bg-purple-100 text-purple-600"
                    : "bg-slate-100 text-slate-400"
                }`}
                title={voiceEnabled ? "Voice enabled" : "Voice disabled"}
              >
                {voiceEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{conversation?.userName}</p>
                <p className="text-sm text-slate-500">AI Conversation</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {conversation?.userName?.charAt(0) || "?"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Talk with {conversation?.userName}
              </h2>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                This AI conversation is powered by the messages and memories {conversation?.userName} has left for you.
                It&apos;s a way to feel connected even when they can&apos;t be here.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> This is an AI representation based on {conversation?.userName}&apos;s messages.
                  While it aims to capture their essence, it&apos;s not a replacement for real communication.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "USER"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white shadow-md border border-slate-100 rounded-bl-md"
                  }`}
                >
                  {message.role === "ASSISTANT" && (
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {conversation?.userName?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {conversation?.userName}
                        </span>
                      </div>
                      {message.audioUrl && (
                        <button
                          onClick={() => {
                            if (isPlayingAudio === message.id) {
                              stopAudio();
                            } else {
                              const audioData = message.audioUrl?.replace("data:audio/mpeg;base64,", "");
                              if (audioData) playAudio(audioData, message.id);
                            }
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            isPlayingAudio === message.id
                              ? "bg-purple-500 text-white"
                              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          }`}
                          title={isPlayingAudio === message.id ? "Stop" : "Play voice"}
                        >
                          {isPlayingAudio === message.id ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  <p className={`whitespace-pre-wrap ${message.role === "ASSISTANT" ? "text-slate-700" : ""}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white shadow-md border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-slate-500 text-sm">{conversation?.userName} is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && conversation && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={sendMessage} className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${conversation?.userName}...`}
              disabled={isSending}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              {isSending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </form>
          <p className="text-xs text-slate-400 text-center mt-2">
            Powered by AI • Responses are generated based on {conversation?.userName}&apos;s messages
          </p>
        </div>
      </div>
    </div>
  );
}
