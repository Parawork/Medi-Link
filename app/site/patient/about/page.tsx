"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaRocket,
  FaHeartbeat,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
            About Medi-Link
          </h1>
          <p className="text-gray-600 text-xl">
            Connecting Healthcare, Empowering Lives
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-10 mb-12 shadow-xl border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <h2 className="text-3xl font-semibold mb-6 text-blue-700 relative z-10">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg relative z-10">
            At Medi-Link, we are dedicated to revolutionizing healthcare
            accessibility by creating a seamless bridge between patients and
            pharmacies. Our platform empowers individuals to manage their
            medications efficiently while ensuring healthcare providers can
            deliver optimal care.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-24 -mt-24 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full -ml-16 -mb-16 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaRocket className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To become the leading healthcare connectivity platform, making
                quality healthcare accessible to everyone through innovative
                technology and seamless integration.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full -mr-24 -mt-24 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full -ml-16 -mb-16 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">
                Our Values
              </h3>
              <ul className="text-gray-700 leading-relaxed space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Innovation in Healthcare
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Patient-Centric Approach
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Integrity and Trust
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Excellence in Service
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <h2 className="text-3xl font-semibold mb-8 text-purple-700 relative z-10">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeartbeat className="text-white text-3xl" />
              </div>
              <h4 className="text-4xl font-bold text-blue-700 mb-2">10K+</h4>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
              <h4 className="text-4xl font-bold text-indigo-700 mb-2">500+</h4>
              <p className="text-gray-600">Partner Pharmacies</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <h4 className="text-4xl font-bold text-purple-700 mb-2">50K+</h4>
              <p className="text-gray-600">Prescriptions Managed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
