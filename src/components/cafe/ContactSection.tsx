'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Twitter,
  Navigation,
} from 'lucide-react'

/* ─── FAQ data ─── */
const faqItems = [
  {
    question: 'Do you take walk-ins?',
    answer:
      'Yes, walk-ins are always welcome! While we recommend making a reservation during peak hours (especially weekends), you can always stop by and we will do our best to seat you promptly. Our bar area is also available for casual visits.',
  },
  {
    question: 'Can I book for private events?',
    answer:
      'We host private events for groups of 10 to 80 guests. Our events team can customize menus, d\u00e9cor, and entertainment to suit your occasion \u2014 from corporate meetings and birthday celebrations to intimate gatherings. Contact us at least two weeks in advance to plan your event.',
  },
  {
    question: 'Do you offer catering?',
    answer:
      'Yes, we offer full catering services for off-site events. Our catering menu features our most popular artisan dishes, specialty coffee stations, and curated dessert selections. We deliver within a 30-mile radius and can accommodate dietary restrictions.',
  },
  {
    question: 'What dietary options are available?',
    answer:
      'We offer vegan, gluten-free, dairy-free, and nut-free options across our menu. Each dish is clearly labeled, and our baristas are trained to prepare allergen-safe beverages. If you have specific dietary needs, please let our staff know and we will be happy to accommodate you.',
  },
]

/* ─── Auto-responses for live chat ─── */
const quickReplyResponses: Record<string, string> = {
  Menu:
    'Our menu features artisan coffee, specialty drinks, and gourmet dishes. You can explore our full menu above, or ask our baristas for today\u2019s specials!',
  Hours:
    'We\u2019re open Mon\u2013Fri 7 AM\u201310 PM, Saturday 8 AM\u201311 PM, and Sunday 8 AM\u20139 PM. We\u2019re currently open \u2014 come on in! \u2615',
  Reservation:
    'You can make a reservation through the Reservation section on our website, or call us at +1 (555) 123-4567. We recommend booking at least 24 hours in advance for weekends.',
}

/* ─── Subject options ─── */
const subjects = [
  'General Inquiry',
  'Reservation',
  'Private Event',
  'Feedback',
  'Partnership',
]

/* ─── Form state type ─── */
interface FormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

/* ================================================================
   ContactSection
   ================================================================ */
export default function ContactSection() {
  /* ── form ── */
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [toastVisible, setToastVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  /* ── faq ── */
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  /* ── live chat ── */
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: 'Hi! How can we help?' },
  ])
  const [chatInput, setChatInput] = useState('')

  /* ── helpers ── */
  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!form.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // simulate network request
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setErrors({})
    showToast()
  }

  const showToast = () => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3500)
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return
    setChatMessages((prev) => [...prev, { role: 'user', text }])
    setChatInput('')
    // simulate bot response
    setTimeout(() => {
      const response =
        quickReplyResponses[text] ??
        'Thanks for your message! A member of our team will get back to you shortly. In the meantime, feel free to explore our menu or make a reservation.'
      setChatMessages((prev) => [...prev, { role: 'bot', text: response }])
    }, 800)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendChatMessage(chatInput)
  }

  const handleQuickReply = (label: string) => {
    sendChatMessage(label)
  }

  /* ── Determine if currently open ── */
  const getIsOpen = () => {
    const now = new Date()
    const day = now.getDay() // 0=Sun
    const hour = now.getHours()
    if (day >= 1 && day <= 5) return hour >= 7 && hour < 22
    if (day === 6) return hour >= 8 && hour < 23
    return hour >= 8 && hour < 21
  }
  const isOpen = getIsOpen()

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <section id="contact" className="py-20 px-6 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-foreground mb-4">
          Get in <span className="text-gold-500">Touch</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We&apos;d love to hear from you. Whether you have a question, feedback, or simply want to say hello, reach out to us.
        </p>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* ════════════════════════ LEFT COLUMN ════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Visit Us heading */}
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            Visit Us
          </h3>

          {/* Address card */}
          <div className="glass rounded-xl p-4 hover:shadow-float transition-shadow duration-300">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Address</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  123 Artisan Lane, Coffee District,<br />New York, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Phone card */}
          <div className="glass rounded-xl p-4 hover:shadow-float transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Phone</p>
                <a
                  href="tel:+15551234567"
                  className="text-gold-500 hover:text-gold-600 transition-colors text-sm"
                >
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          {/* Email card */}
          <div className="glass rounded-xl p-4 hover:shadow-float transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Email</p>
                <a
                  href="mailto:hello@aurumcoffee.com"
                  className="text-gold-500 hover:text-gold-600 transition-colors text-sm"
                >
                  hello@aurumcoffee.com
                </a>
              </div>
            </div>
          </div>

          {/* Business hours card */}
          <div className="glass rounded-xl p-4 hover:shadow-float transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">Business Hours</p>
                {isOpen && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Currently Open
                  </span>
                )}
              </div>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-border/40">
                  <td className="py-2 text-muted-foreground">Monday &ndash; Friday</td>
                  <td className="py-2 text-right font-medium text-foreground">7:00 AM &ndash; 10:00 PM</td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="py-2 text-muted-foreground">Saturday</td>
                  <td className="py-2 text-right font-medium text-foreground">8:00 AM &ndash; 11:00 PM</td>
                </tr>
                <tr className="border-t border-border/40">
                  <td className="py-2 text-muted-foreground">Sunday</td>
                  <td className="py-2 text-right font-medium text-foreground">8:00 AM &ndash; 9:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Social media row */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground mr-1">Follow us</span>
            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-gold-500 hover:shadow-float transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-gold-500 hover:shadow-float transition-all duration-300"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-gold-500 hover:shadow-float transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Mini map placeholder */}
          <div
            className="relative rounded-xl overflow-hidden h-48 shadow-soft"
            style={{
              background: 'linear-gradient(135deg, #e0cba8 0%, #c9a87a 40%, #b08850 100%)',
            }}
          >
            {/* Decorative grid lines to mimic a map */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage:
                  'linear-gradient(rgba(26,14,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(26,14,8,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
            </div>
            {/* Decorative "roads" */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-coffee-700/20" />
            <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-coffee-700/20" />
            <div className="absolute top-0 bottom-0 right-1/4 w-[2px] bg-coffee-700/20" />
            <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-coffee-700/15" />

            {/* Pin icon & text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-float mb-3">
                <Navigation className="w-6 h-6 text-gold-500" />
              </div>
              <span className="text-white font-semibold text-sm drop-shadow-md">View on Maps</span>
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════ RIGHT COLUMN — FORM ════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass rounded-2xl p-6 md:p-8 shadow-soft flex flex-col gap-5"
          >
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-1">
              Send Us a Message
            </h3>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={`input-skeuomorphic rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 ${
                  errors.name ? 'border-red-400 focus:border-red-400' : ''
                }`}
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={`input-skeuomorphic rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 ${
                  errors.email ? 'border-red-400 focus:border-red-400' : ''
                }`}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Phone (optional) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
                Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="input-skeuomorphic rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200"
              />
            </div>

            {/* Subject select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-subject" className="text-sm font-medium text-foreground">
                Subject
              </label>
              <select
                id="contact-subject"
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                className="input-skeuomorphic rounded-lg px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Tell us what's on your mind..."
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className={`input-skeuomorphic rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 resize-none ${
                  errors.message ? 'border-red-400 focus:border-red-400' : ''
                }`}
              />
              {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 gradient-gold text-white font-semibold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 shadow-float"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* ════════════════════════ FAQ SECTION ════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground text-center mb-8">
          Frequently Asked Questions
        </h3>
        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden bg-white shadow-soft transition-shadow duration-300 hover:shadow-float"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-xl"
                aria-expanded={openFaq === index}
              >
                <span className="font-semibold text-foreground pr-4">{item.question}</span>
                <motion.span
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gold-500" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ════════════════════════ SUCCESS TOAST ════════════════════════ */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-gold rounded-xl px-6 py-3 shadow-float flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">Message sent successfully! We&apos;ll get back to you soon.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════ LIVE SUPPORT WIDGET ════════════════════════ */}
      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setChatOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-float flex items-center justify-center transition-colors duration-200"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open live chat"
      >
        <AnimatePresence mode="wait">
          {chatOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl leading-none select-none"
            >
              &times;
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat popup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-30 w-80 glass rounded-2xl shadow-float flex flex-col overflow-hidden"
            style={{ maxHeight: '28rem' }}
          >
            {/* Chat header */}
            <div className="gradient-coffee px-5 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Aurum Support</p>
                <p className="text-white/60 text-xs">Typically replies instantly</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[180px] max-h-[280px]">
              <AnimatePresence initial={false}>
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'gradient-gold text-white rounded-br-md'
                          : 'bg-white shadow-soft text-foreground rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick replies */}
            {chatMessages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {Object.keys(quickReplyResponses).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleQuickReply(label)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-gold-500/40 text-gold-600 hover:bg-gold-500 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat input */}
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2 p-3 border-t border-border/30">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 input-skeuomorphic rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}