"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaUserLock,
  FaDatabase,
  FaChartBar,
  FaUserCog,
  FaEnvelope,
} from "react-icons/fa";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-xl">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-10"
        >
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                At Medi-Link, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform. Please read this
                privacy policy carefully. If you do not agree with the terms of
                this privacy policy, please do not access the site.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaDatabase className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
                Information We Collect
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-medium mb-4 text-indigo-600">
                    Personal Information
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">
                        Name and contact information
                      </span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">
                        Medical history and prescriptions
                      </span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">
                        Insurance information
                      </span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">Payment details</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-medium mb-4 text-indigo-600">
                    Usage Information
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">Device information</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">Log data</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">Usage patterns</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span className="text-gray-700">
                        Cookies and similar technologies
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaChartBar className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-purple-700">
                How We Use Your Information
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-700">
                    To provide and maintain our service
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-700">
                    To notify you about changes to our service
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-700">
                    To provide customer support
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-700">
                    To gather analysis or valuable information
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-700">
                    To monitor the usage of our service
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-700">
                    To detect, prevent and address technical issues
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaUserLock className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                We have implemented appropriate technical and organizational
                security measures designed to protect the security of any
                personal information we process. However, please also remember
                that we cannot guarantee that the internet itself is 100%
                secure.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaUserCog className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
                Your Rights
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="text-gray-700">
                    Access your personal information
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="text-gray-700">Correct inaccurate data</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="text-gray-700">
                    Request deletion of your data
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="text-gray-700">
                    Object to processing of your data
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span className="text-gray-700">Data portability</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-purple-700">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                If you have any questions about this Privacy Policy, please
                contact us at:
                <br />
                <span className="font-medium text-purple-600">Email:</span>{" "}
                privacy@medilink.com
                <br />
                <span className="font-medium text-purple-600">Phone:</span> +1
                (555) 123-4567
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
