import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Heart, Play, Volume2, FileText, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import StartChatButton from "@/components/StartChatButton";

interface ViewMessagePageProps {
  params: { id: string };
}

export default async function ViewMessagePage({ params }: ViewMessagePageProps) {
  const message = await prisma.message.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      recipient: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!message) {
    notFound();
  }

  // Mark as viewed if not already
  if (!message.viewedAt) {
    await prisma.message.update({
      where: { id: params.id },
      data: { viewedAt: new Date() },
    });
  }

  const formattedDate = message.deliveredAt
    ? new Date(message.deliveredAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Today";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HelloForever
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Message Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200/50 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 px-8 py-12 text-white text-center">
            <p className="text-blue-100 mb-2">A message from</p>
            <h1 className="text-4xl font-bold mb-4">{message.user.name}</h1>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Calendar className="w-4 h-4" />
              <span>Delivered on {formattedDate}</span>
            </div>
          </div>

          {/* Message Content */}
          <div className="p-8 md:p-12">
            {/* Recipient Greeting */}
            <div className="text-center mb-8">
              <p className="text-slate-500 mb-1">For</p>
              <p className="text-2xl font-semibold text-slate-800">{message.recipient.name}</p>
            </div>

            {/* Message Title */}
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
              {message.title}
            </h2>

            {/* Message Type Indicator & Content */}
            <div className="bg-slate-50 rounded-2xl p-8 mb-8">
              {message.type === "VIDEO" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 text-blue-600">
                    <Play className="w-6 h-6" />
                    <span className="font-semibold">Video Message</span>
                  </div>
                  {message.content ? (
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                      <video
                        src={message.content}
                        controls
                        className="w-full h-full"
                        poster={message.thumbnail || undefined}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center">
                      <p className="text-slate-500">Video content unavailable</p>
                    </div>
                  )}
                  {message.duration && (
                    <p className="text-center text-slate-500 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration: {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, "0")}
                    </p>
                  )}
                </div>
              )}

              {message.type === "AUDIO" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 text-purple-600">
                    <Volume2 className="w-6 h-6" />
                    <span className="font-semibold">Audio Message</span>
                  </div>
                  {message.content ? (
                    <div className="bg-white rounded-xl p-6 shadow-inner">
                      <audio src={message.content} controls className="w-full" />
                    </div>
                  ) : (
                    <div className="bg-slate-200 rounded-xl p-8 text-center">
                      <p className="text-slate-500">Audio content unavailable</p>
                    </div>
                  )}
                  {message.duration && (
                    <p className="text-center text-slate-500 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration: {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, "0")}
                    </p>
                  )}
                </div>
              )}

              {message.type === "TEXT" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 text-orange-600">
                    <FileText className="w-6 h-6" />
                    <span className="font-semibold">Written Message</span>
                  </div>
                  <div className="bg-white rounded-xl p-8 shadow-inner">
                    <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {message.content || "No message content"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Note */}
            {message.note && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6 mb-8">
                <p className="text-amber-800 font-semibold mb-2">Personal Note:</p>
                <p className="text-amber-900 italic">&quot;{message.note}&quot;</p>
              </div>
            )}

            {/* AI Conversation Button */}
            <div className="mb-8">
              <StartChatButton messageId={message.id} userName={message.user.name} />
            </div>

            {/* Footer Message */}
            <div className="text-center pt-8 border-t border-slate-100">
              <p className="text-slate-500 mb-4">
                This message was sent with love through HelloForever
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Heart className="w-4 h-4" />
                Create your own forever messages
              </Link>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
          <p className="text-slate-600">
            Want to leave messages for your loved ones?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Start for free
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>&copy; 2026 HelloForever. Messages that last forever.</p>
      </footer>
    </div>
  );
}
