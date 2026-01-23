import {
  Video,
  Calendar,
  Heart,
  MessageSquare,
  Sparkles,
  Mic,
  Users,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Star,
  Mail,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Preserve your voice, forever</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Messages That Last{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Forever
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Leave video messages for loved ones. Deliver them at the perfect moment—even after you&apos;re gone.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/signup"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg flex items-center gap-2 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1"
              >
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="group px-8 py-4 rounded-full border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all font-semibold text-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5 text-blue-600" />
                Learn More
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Delivered on your schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Trusted by 10,000+ families</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-20 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50 border border-slate-200">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-12 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white/80 text-lg font-medium">Record your message today</p>
                  <p className="text-white/60 text-sm mt-2">It will reach them when they need it most</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three simple steps to create messages that will touch hearts for generations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Video,
                step: "01",
                title: "Record Your Messages",
                description: "Create heartfelt video or audio messages for your loved ones. Say what matters most, in your own voice.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Calendar,
                step: "02",
                title: "Schedule Delivery",
                description: "Choose when your messages arrive—birthdays, anniversaries, milestones, or after you're gone.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Heart,
                step: "03",
                title: "They Receive Your Love",
                description: "Your loved ones receive your message at exactly the right moment, wrapped in your love.",
                color: "from-orange-400 to-orange-500",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-6xl font-bold text-slate-100 absolute top-4 right-6">
                    {item.step}
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Powered by AI,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Delivered with Love
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced technology meets heartfelt connection
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: MessageSquare,
                title: "AI Conversation Mode",
                description: "Our AI helps preserve your personality, letting loved ones have meaningful conversations with your digital presence.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Sparkles,
                title: "Surprise Delivery",
                description: "Schedule messages for future birthdays, graduations, weddings, or any milestone you want to celebrate with them.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Mic,
                title: "Voice Preservation",
                description: "Advanced AI captures the unique qualities of your voice, preserving how you sound for future generations.",
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: Users,
                title: "Family Legacy",
                description: "Create a lasting family archive. Share stories, wisdom, and love across generations.",
                color: "bg-pink-100 text-pink-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-700">No credit card required</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Start Free Today
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Record your first 3 messages completely free. Upgrade to Premium for unlimited messages, AI features, and priority delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/signup"
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg flex items-center gap-2 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-full border-2 border-slate-300 hover:border-blue-400 hover:bg-white transition-all font-semibold text-lg"
            >
              View Full Pricing
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
            <span>✓ 3 free messages</span>
            <span>✓ Video & audio</span>
            <span>✓ Scheduled delivery</span>
            <span>✓ Secure encryption</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-8 text-orange-400" />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Start Your Legacy Today
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            The words you share today become treasured gifts tomorrow. Don&apos;t wait to tell the people you love what they mean to you.
          </p>

          <Link
            href="/signup"
            className="group px-10 py-5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-lg flex items-center gap-2 mx-auto shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:-translate-y-1"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-slate-400 mt-8 text-sm">
            Join 10,000+ people preserving their most important messages
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">HelloForever</span>
            </div>

            <div className="flex items-center gap-8 text-slate-400">
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="mailto:hello@helloforever.com" className="hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-slate-800 text-slate-500 text-sm">
            © 2026 HelloForever. All rights reserved. Made with love for the ones you love.
          </div>
        </div>
      </footer>
    </div>
  );
}
