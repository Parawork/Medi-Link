"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
} from "react-icons/fa";

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 py-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
            Contact Us
          </h1>
          <p className="text-gray-600 text-xl">Get in touch with our team</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
            <h2 className="text-3xl font-semibold mb-8 text-blue-700 relative z-10">
              Contact Information
            </h2>
            <div className="space-y-8 relative z-10">
              <div className="flex items-start space-x-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-700 mb-2">
                    Address
                  </h3>
                  <p className="text-gray-600">
                    123 Healthcare Ave, Medical City
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-indigo-700 mb-2">
                    Email
                  </h3>
                  <p className="text-gray-600">support@medilink.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaPhone className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-purple-700 mb-2">
                    Phone
                  </h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
            <h2 className="text-3xl font-semibold mb-8 text-indigo-700 relative z-10">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 font-medium"
              >
                <span>Send Message</span>
                <FaPaperPlane className="text-white" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
