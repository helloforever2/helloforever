"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Check,
  Sparkles,
  Video,
  Mic,
  MessageSquare,
  HardDrive,
  Shield,
  Users,
  Heart,
  Zap,
  Crown,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with the basics",
    features: [
      { text: "3 messages", included: true },
      { text: "1GB storage", included: true },
      { text: "Text messages only", included: true },
      { text: "Email delivery", included: true },
      { text: "Video & Audio messages", included: false },
      { text: "AI Conversation Mode", included: false },
      { text: "Voice Preservation", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Current Plan",
    popular: false,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    period: "month",
    description: "Perfect for preserving your legacy",
    features: [
      { text: "Unlimited messages", included: true },
      { text: "10GB storage", included: true },
      { text: "Video & Audio messages", included: true },
      { text: "Email & SMS delivery", included: true },
      { text: "AI Conversation Mode", included: true },
      { text: "Voice Preservation", included: true },
      { text: "Milestone deliveries", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Upgrade Now",
    popular: true,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: "premium_plus",
    name: "Premium Plus",
    price: 19.99,
    period: "month",
    description: "For families who want the best",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "50GB storage", included: true },
      { text: "Up to 5 family members", included: true },
      { text: "Advanced AI personality", included: true },
      { text: "Custom delivery schedules", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "White-glove onboarding", included: true },
      { text: "24/7 priority support", included: true },
    ],
    cta: "Go Premium Plus",
    popular: false,
    gradient: "from-orange-500 to-pink-600",
  },
];

const featureHighlights = [
  {
    icon: Video,
    title: "Video Messages",
    description: "Record heartfelt video messages for your loved ones",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: Mic,
    title: "Voice Preservation",
    description: "Clone your voice so AI can speak in your tone",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    icon: MessageSquare,
    title: "AI Conversations",
    description: "Let loved ones chat with an AI version of you",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: Shield,
    title: "Trustee System",
    description: "Designate someone to release messages upon passing",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

export default function UpgradePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = (session?.user?.plan || "free").toLowerCase();

  const handleUpgrade = async (planId: string) => {
    if (planId === "free" || planId === currentPlan) return;

    setSelectedPlan(planId);
    setIsProcessing(true);

    // TODO: Integrate with Stripe
    // For now, show a message
    setTimeout(() => {
      alert("Payment integration coming soon! For now, your plan has been updated to Premium for testing.");
      setIsProcessing(false);
      router.refresh();
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Upgrade Your Plan</h1>
        <p className="text-slate-600">
          Unlock more features to preserve your legacy for generations to come.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {featureHighlights.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-3`}>
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isUpgrade = !isCurrent && plan.id !== "free";

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 transition-all ${
                plan.popular
                  ? "border-blue-500 shadow-xl shadow-blue-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">
                    ${plan.price}
                  </span>
                  <span className="text-slate-500">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.included
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span
                        className={
                          feature.included ? "text-slate-700" : "text-slate-400"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || isProcessing}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                      : isUpgrade
                      ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : isCurrent ? (
                    <>
                      <Check className="w-4 h-4" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      {isUpgrade && <Zap className="w-4 h-4" />}
                      {plan.cta}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Can I cancel anytime?</h3>
            <p className="text-slate-600 text-sm">
              Yes! You can cancel your subscription at any time. Your messages will remain
              scheduled and will still be delivered as planned.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What happens to my messages if I downgrade?</h3>
            <p className="text-slate-600 text-sm">
              Your existing messages are safe. However, you won&apos;t be able to create new
              video/audio messages or use premium features until you upgrade again.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How does Voice Preservation work?</h3>
            <p className="text-slate-600 text-sm">
              Upload audio samples of your voice, and our AI creates a digital voice clone.
              When loved ones use AI Conversation mode, they&apos;ll hear responses in your voice.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Is my data secure?</h3>
            <p className="text-slate-600 text-sm">
              Absolutely. All messages are encrypted at rest and in transit. Only your
              designated recipients can view your messages when delivered.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 text-slate-600 mb-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <span>Trusted by over 10,000 families</span>
        </div>
        <p className="text-slate-500 text-sm">
          Join thousands of families preserving their memories for future generations.
        </p>
      </div>
    </div>
  );
}
