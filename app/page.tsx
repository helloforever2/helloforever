import {
  Sparkles,
  Zap,
  Shield,
  Heart,
  ArrowRight,
  Star,
  Check,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HelloForever</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
          </div>
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-medium text-sm">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/30 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[128px]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">Now in Public Beta</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Build Something{" "}
              <span className="gradient-text">Beautiful</span>
              <br />
              That Lasts{" "}
              <span className="gradient-text">Forever</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create stunning digital experiences with our powerful platform.
              Simple enough for beginners, powerful enough for experts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg shadow-violet-500/25">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 transition-all font-semibold text-lg">
                Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-900 flex items-center justify-center text-sm font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-slate-400">
                  Loved by <span className="text-white font-semibold">10,000+</span> creators
                </span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="gradient-border rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10">
              <div className="bg-slate-900 p-2">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-slate-800/50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center animate-float">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <p className="text-slate-400 text-lg">Your amazing project lives here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute left-0 top-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to help you create, launch, and scale your ideas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Built for speed with optimized performance that keeps your users engaged.",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: Shield,
                title: "Secure by Default",
                description: "Enterprise-grade security to protect your data and your users.",
                color: "from-emerald-400 to-cyan-500",
              },
              {
                icon: Heart,
                title: "Made with Love",
                description: "Crafted with attention to every detail for the best experience.",
                color: "from-pink-400 to-rose-500",
              },
              {
                icon: Sparkles,
                title: "AI Powered",
                description: "Intelligent features that adapt and learn from your needs.",
                color: "from-violet-400 to-purple-500",
              },
              {
                icon: Check,
                title: "Easy Integration",
                description: "Connect with your favorite tools in just a few clicks.",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: Star,
                title: "Premium Support",
                description: "24/7 dedicated support team ready to help you succeed.",
                color: "from-amber-400 to-yellow-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 relative">
        <div className="absolute right-0 top-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[128px]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by{" "}
              <span className="gradient-text">Creators</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              See what our community has to say about their experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Product Designer",
                content: "HelloForever transformed how I build products. The intuitive interface and powerful features saved me countless hours.",
                avatar: "SC",
              },
              {
                name: "Marcus Johnson",
                role: "Startup Founder",
                content: "I launched my MVP in just 2 weeks. The platform is incredibly well-designed and the support team is amazing.",
                avatar: "MJ",
              },
              {
                name: "Emily Rodriguez",
                role: "Creative Director",
                content: "The best decision I made for my agency. Our clients love the results and we've doubled our output.",
                avatar: "ER",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Get{" "}
              <span className="gradient-text">Started?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of creators building amazing things. Start free, upgrade when you need to.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg shadow-violet-500/25">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 transition-all font-semibold text-lg">
                Talk to Sales
              </button>
            </div>
            <p className="text-slate-500 mt-6 text-sm">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HelloForever</span>
            </div>
            <div className="flex items-center gap-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-slate-500 text-sm">
            &copy; 2024 HelloForever. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
