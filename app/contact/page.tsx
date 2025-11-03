"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    console.log("[v0] Page loaded: Contact")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log("[v0] Contact form submitted:", formData)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-[#fffbf5]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#0f1419]">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e5e7e8] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#014325] text-white rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-[#0f1419]">Location</h3>
                  <p className="text-[#5c6466]">90A Regent Road, Old School Junction</p>
                  <p className="text-[#5c6466]">Freetown, Sierra Leone</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e7e8] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#014325] text-white rounded-lg">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-[#0f1419]">Phone</h3>
                  <a href="tel:+232078891638" className="text-[#5c6466] hover:text-[#014325]">
                    +232 078 891638
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e7e8] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#014325] text-white rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-[#0f1419]">Email</h3>
                  <a href="mailto:info@peesbakery.sl" className="text-[#5c6466] hover:text-[#014325]">
                    info@peesbakery.sl
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e7e8] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#014325] text-white rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-[#0f1419]">Hours</h3>
                  <div className="text-[#5c6466] space-y-1">
                    <p>Monday - Sunday</p>
                    <p className="font-bold text-[#014325]">Open Daily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white border border-[#e5e7e8] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-[#0f1419]">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-3 bg-[#fffbf5] hover:bg-[#014325] hover:text-white rounded-lg transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-[#fffbf5] hover:bg-[#014325] hover:text-white rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-[#fffbf5] hover:bg-[#014325] hover:text-white rounded-lg transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-[#e5e7e8] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-[#0f1419]">Send us a Message</h2>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-[#f0fdf4] border border-[#10b981] rounded-lg text-[#10b981]">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
                  Name <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
                  Email <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium mb-2">
                  Phone (Optional)
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                  placeholder="+232 XX XXX XXXX"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">
                  Subject <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
                  Message <span className="text-[#dc2626]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#014325] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#014325]/90 disabled:bg-[#f2f3f4] disabled:text-[#5c6466] disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
