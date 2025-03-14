import React, { useState } from 'react'
import Navbar from './Navbar'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, Plus, BatteryCharging, MapPinned, Building2 } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: localStorage.getItem('name') || "",
    email: localStorage.getItem('email') || "",
    message: ''
  })

  const [joinFormData, setJoinFormData] = useState({
    ownerName: '',
    businessName: '',
    stationLocation: '',
    contactNumber: '',
    email: '',
    stationType: 'car',
    numberOfPorts: '1',
    additionalInfo: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent successfully!')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleJoinSubmit = (e) => {
    e.preventDefault()
    toast.success('Application submitted successfully! We will contact you soon.')
    setJoinFormData({
      ownerName: '',
      businessName: '',
      stationLocation: '',
      contactNumber: '',
      email: '',
      stationType: 'car',
      numberOfPorts: '1',
      additionalInfo: ''
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-900/20 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className=" sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about our services? We're here to help and answer any question you might have.
          </p>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 sm:h-2 sm:w-2 bg-blue-500/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          {[
            { icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Phone", content: "+91 7990761430" },
            { icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Email", content: "contact@volthub.com" },
            { icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Address", content: "143 - Volthub, Northern Companies, Vesu, Surat - 394210 " }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg text-blue-400">
                  {item.icon}
                </div>
                <div>
                  <h3 className=" sm:text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 md:mb-16">
          {/* Contact Form - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4 sm:rows-6"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Join With Us Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">Join With Us</h2>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-sm text-gray-400">Want to add your charging station to our network? Fill out the form below and we'll get back to you!</p>
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Owner Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={joinFormData.ownerName}
                      onChange={(e) => setJoinFormData({ ...joinFormData, ownerName: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={joinFormData.businessName}
                      onChange={(e) => setJoinFormData({ ...joinFormData, businessName: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Station Location</label>
                  <input
                    type="text"
                    name="stationLocation"
                    value={joinFormData.stationLocation}
                    onChange={(e) => setJoinFormData({ ...joinFormData, stationLocation: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    placeholder="Full address of your station"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={joinFormData.contactNumber}
                      onChange={(e) => setJoinFormData({ ...joinFormData, contactNumber: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={joinFormData.email}
                      onChange={(e) => setJoinFormData({ ...joinFormData, email: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Station Type</label>
                    <select
                      name="stationType"
                      value={joinFormData.stationType}
                      onChange={(e) => setJoinFormData({ ...joinFormData, stationType: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    >
                      <option value="car">Car Charging</option>
                      <option value="bike">Bike Charging</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Ports</label>
                    <select
                      name="numberOfPorts"
                      value={joinFormData.numberOfPorts}
                      onChange={(e) => setJoinFormData({ ...joinFormData, numberOfPorts: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Information</label>
                  <textarea
                    name="additionalInfo"
                    value={joinFormData.additionalInfo}
                    onChange={(e) => setJoinFormData({ ...joinFormData, additionalInfo: e.target.value })}
                    rows="3 sm:rows-4"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    placeholder="Any additional details about your station..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <BatteryCharging className="w-4 h-4 sm:w-5 sm:h-5" />
                  Submit Application
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Join Our Network?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <MapPinned className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Increased Visibility",
                description: "Get listed on our platform and reach thousands of EV owners in your area."
              },
              {
                icon: <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Business Growth",
                description: "Expand your customer base and increase revenue through our booking platform."
              },
              {
                icon: <BatteryCharging className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Smart Management",
                description: "Access our station management tools and analytics dashboard."
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 text-center"
              >
                <div className="inline-flex p-2 sm:p-3 bg-green-500/10 rounded-lg text-green-400 mb-3 sm:mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  )
}

export default Contact