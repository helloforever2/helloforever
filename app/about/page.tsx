import {
  Heart,
  ArrowRight,
  Users,
  Shield,
  Clock,
  Sparkles,
  Target,
  Award,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Love First",
      description: "Every feature we build starts with one question: does this help people express love to those who matter most?",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your messages are sacred. We use the highest security standards to ensure they reach only the right people at the right time.",
    },
    {
      icon: Clock,
      title: "Reliability",
      description: "When you schedule a message for your daughter's wedding in 2045, we'll be there to deliver it. That's our promise.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "We're constantly pushing the boundaries of what's possible, using AI to help preserve not just words, but personality and presence.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Families Served" },
    { number: "50,000+", label: "Messages Created" },
    { number: "99.9%", label: "Delivery Rate" },
    { number: "25+", label: "Countries" },
  ];

  const team = [
    {
      name: "The Mission",
      role: "Why We Started",
      description: "HelloForever was born from a simple but profound realization: we never know when our last conversation with someone will be. We wanted to give people the power to ensure their most important words would always be heard.",
    },
    {
      name: "The Technology",
      role: "How We Build",
      description: "Our team combines expertise in AI, security, and human-centered design to create a platform that's both powerful and deeply personal. Every line of code is written with your family in mind.",
    },
    {
      name: "The Future",
      role: "Where We're Going",
      description: "We envision a world where no important message goes unsaid. Where families can connect across generations. Where love transcends time itself.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-8">
              <Heart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Our Story</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Helping Families{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Stay Connected
              </span>{" "}
              Forever
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              We believe that love shouldn't be limited by time. HelloForever helps you create messages that will touch hearts for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Target className="w-16 h-16 mx-auto mb-8 text-orange-400" />

          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-relaxed">
            "Our mission is to ensure that no important words go unspoken, and no loving message goes undelivered."
          </h2>

          <p className="text-xl text-slate-300">
            — The HelloForever Team
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-slate-600 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              The HelloForever Story
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              How we're building the future of family connection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full">
                  <div className="text-6xl font-bold text-slate-100 absolute top-4 right-6">
                    0{i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg">
                    {i === 0 && <Heart className="w-6 h-6 text-white" />}
                    {i === 1 && <Award className="w-6 h-6 text-white" />}
                    {i === 2 && <Globe className="w-6 h-6 text-white" />}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{item.role}</p>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">
                Why Families{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Trust Us
                </span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                We understand the weight of responsibility that comes with preserving your most precious messages. That's why we've built HelloForever with the highest standards of security, reliability, and care.
              </p>

              <div className="space-y-4">
                {[
                  "Bank-level AES-256 encryption for all messages",
                  "Redundant storage across multiple secure data centers",
                  "Regular third-party security audits",
                  "GDPR and CCPA compliant",
                  "24/7 monitoring and support",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Enterprise Security</h3>
                    <p className="text-slate-600">Your trust is our priority</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-medium">Encryption</span>
                    <span className="text-green-600 font-semibold">AES-256</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-medium">Uptime</span>
                    <span className="text-green-600 font-semibold">99.99%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-medium">Data Centers</span>
                    <span className="text-green-600 font-semibold">3 Regions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-16 h-16 mx-auto mb-8 text-orange-400" />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Join Our Growing Family
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Thousands of families trust HelloForever to preserve their most precious messages. Start your legacy today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group px-10 py-5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-lg flex items-center gap-2 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 rounded-full border-2 border-slate-600 hover:border-slate-400 transition-all font-semibold text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">HelloForever</span>
            </div>

            <div className="flex items-center gap-8 text-slate-400">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
