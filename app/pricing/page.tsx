import {
  Heart,
  Check,
  ArrowRight,
  Sparkles,
  Video,
  Users,
  Shield,
  Clock,
  Mic,
  MessageSquare,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with your first messages",
      features: [
        "3 video or audio messages",
        "Schedule delivery dates",
        "Up to 5 recipients",
        "Bank-level encryption",
        "Email delivery notifications",
        "Basic support",
      ],
      cta: "Start Free",
      href: "/signup",
      popular: false,
      gradient: "from-slate-600 to-slate-700",
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "Unlimited messages and advanced AI features",
      features: [
        "Unlimited messages",
        "Unlimited recipients",
        "AI Conversation Mode",
        "Voice Preservation technology",
        "Priority message delivery",
        "Family sharing (up to 5 members)",
        "Advanced scheduling options",
        "Priority support",
        "No watermarks",
      ],
      cta: "Get Premium",
      href: "/signup?plan=premium",
      popular: true,
      gradient: "from-orange-400 to-orange-500",
    },
    {
      name: "Family",
      price: "$19.99",
      period: "/month",
      description: "For families who want to preserve their legacy together",
      features: [
        "Everything in Premium",
        "Up to 10 family members",
        "Shared family archive",
        "Cross-generational messaging",
        "Family tree integration",
        "Dedicated account manager",
        "Custom branding options",
        "API access",
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const faqs = [
    {
      q: "What happens to my messages if I cancel?",
      a: "Your scheduled messages will still be delivered as planned. You'll always have access to view your messages, but you won't be able to create new ones on the free plan beyond the 3-message limit.",
    },
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Yes! You can change your plan at any time. If you upgrade, you'll get immediate access to premium features. If you downgrade, you'll keep premium features until the end of your billing period.",
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We use bank-level AES-256 encryption for all messages. Your content is encrypted at rest and in transit. Only your designated recipients can access your messages.",
    },
    {
      q: "How does the AI Conversation Mode work?",
      a: "Our AI learns from your messages, writing style, and voice to create a digital presence that your loved ones can interact with. It's designed to feel authentic and comforting.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-700">No credit card required for free plan</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more. Every plan includes our core promise: your messages will be delivered.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl scale-105"
                    : "bg-white border border-slate-200 shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${plan.popular ? "text-white" : "text-slate-900"}`}>
                      {plan.price}
                    </span>
                    <span className={plan.popular ? "text-slate-300" : "text-slate-500"}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 ${plan.popular ? "text-slate-300" : "text-slate-600"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? "text-orange-400" : "text-green-500"}`} />
                      <span className={plan.popular ? "text-slate-200" : "text-slate-600"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
                      : "border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600">
              All plans include these essential features
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Video, title: "HD Video Messages", desc: "Crystal clear quality for your memories" },
              { icon: Shield, title: "Bank-Level Security", desc: "AES-256 encryption for all content" },
              { icon: Clock, title: "Guaranteed Delivery", desc: "Messages delivered exactly when scheduled" },
              { icon: Users, title: "Multiple Recipients", desc: "Send to family, friends, anyone" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Highlight */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Premium Features</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">
                Unlock the Full Power of{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  HelloForever
                </span>
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Premium members get access to our most advanced features, including AI-powered tools that help preserve your unique personality.
              </p>

              <div className="space-y-4">
                {[
                  { icon: MessageSquare, title: "AI Conversation Mode", desc: "Let loved ones interact with your digital presence" },
                  { icon: Mic, title: "Voice Preservation", desc: "Advanced AI captures your unique voice qualities" },
                  { icon: Sparkles, title: "Unlimited Everything", desc: "No limits on messages, recipients, or storage" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                    <Heart className="w-10 h-10 text-white fill-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Premium</h3>
                  <p className="text-slate-600">Most popular choice</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">$9.99</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <Link
                  href="/signup?plan=premium"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-8 text-orange-400" />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Start Your Legacy?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of families preserving their most precious messages. Start free today.
          </p>

          <Link
            href="/signup"
            className="inline-flex px-10 py-5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-lg items-center gap-2 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:-translate-y-1"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
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
