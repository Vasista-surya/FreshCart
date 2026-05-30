import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi'
import { useToast } from '../context/ToastContext'

const contactInfo = [
  { icon: HiOutlineMail, label: 'Email', value: 'support@freshcart.com', href: 'mailto:support@freshcart.com' },
  { icon: HiOutlinePhone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: HiOutlineLocationMarker, label: 'Address', value: 'Mumbai, Maharashtra, India' },
  { icon: HiOutlineClock, label: 'Hours', value: 'Mon - Sat: 8AM - 10PM' },
]

export default function Contact() {
  const { addToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    addToast('Message sent successfully! We\'ll get back to you soon.', 'success')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3">Get in Touch</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Have a question or feedback? We'd love to hear from you. Fill out the form below or reach us directly.</p>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact info */}
        <div className="md:col-span-2 space-y-4">
          {contactInfo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-4 flex items-start gap-3"
            >
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">{item.label}</h3>
                {item.href ? (
                  <a href={item.href} className="text-sm text-brand-600 hover:underline">{item.value}</a>
                ) : (
                  <p className="text-sm text-gray-500">{item.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-3"
        >
          <form onSubmit={handleSubmit} className="card p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="input-field" id="contact-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input-field" id="contact-email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required className="input-field" id="contact-subject" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className="input-field resize-none" id="contact-message" />
            </div>
            <button type="submit" className="btn-primary" id="contact-submit">Send Message</button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
