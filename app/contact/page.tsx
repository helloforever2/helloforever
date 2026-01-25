"use client";

import { useState } from "react";
import {
  Heart,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  Clock,
  HelpCircle,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@helloforever.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9am-6pm EST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "San Francisco, CA",
      description: "By appointment only",
    },
  ];

  const quickLinks = [
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Find answers to common questions",
      href: "#",
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Learn how to use HelloForever",
      href: "#",
    },
    {
      icon: MessageSquare,
      title: "Community",
      description: "Join our user community",
      href: "#",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-8">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Get in Touch</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            We&apos;d Love to{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions about HelloForever? Want to share feedback? We&apos;re here to help and always eager to connect.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-200 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-blue-600 font-medium mb-1">{item.content}</p>
                <p className="text-slate-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-slate-600 mb-8">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-slate-600 mb-6">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 font-medium hover:text-blue-700"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="press">Press Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Side Info */}
            <div className="space-y-8">
              {/* Response Time */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Quick Response Time</h3>
                    <p className="text-slate-600">
                      We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Resources</h3>
                <div className="space-y-4">
                  {quickLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <link.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-blue-600 transition-colors">{link.title}</h4>
                        <p className="text-slate-500 text-sm">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="bg-slate-900 rounded-2xl p-8 text-white">
                <h3 className="font-bold text-lg mb-2">Frequently Asked Questions</h3>
                <p className="text-slate-300 mb-4">
                  Find answers to the most common questions about HelloForever.
                </p>
                <Link
                  href="/pricing#faq"
                  className="inline-flex items-center gap-2 text-orange-400 font-medium hover:text-orange-300 transition-colors"
                >
                  View FAQs
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">
            Based in San Francisco, Serving the World
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Our team works remotely from around the globe, united by our mission to help families stay connected forever.
          </p>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">25+</p>
                <p className="text-slate-600">Countries</p>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">24/7</p>
                <p className="text-slate-600">Support</p>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">10K+</p>
                <p className="text-slate-600">Happy Families</p>
              </div>
            </div>
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
