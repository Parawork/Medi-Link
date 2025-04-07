"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaFileContract,
  FaLock,
  FaUserShield,
  FaExclamationTriangle,
  FaHistory,
  FaEnvelope,
} from "react-icons/fa";

export default function TermsOfServicePage() {
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
            Terms of Service
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
                <FaFileContract className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                By accessing our website, you agree to be bound by these Terms
                of Service and agree that you are responsible for compliance
                with any applicable local laws. If you do not agree with any of
                these terms, you are prohibited from using or accessing this
                site.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaLock className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
                Use License
              </h2>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Permission is granted to temporarily access the materials
                  (information or software) on Medi-Link's website for personal,
                  non-commercial transitory viewing only.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-gray-700">
                      Modify or copy the materials
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-gray-700">
                      Use the materials for any commercial purpose
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-gray-700">
                      Attempt to decompile or reverse engineer any software
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-gray-700">
                      Remove any copyright or other proprietary notations
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-gray-700">
                      Transfer the materials to another person
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaUserShield className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-purple-700">
                User Account
              </h2>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  To access certain features of the platform, you may be
                  required to create an account. You are responsible for
                  maintaining the confidentiality of your account information
                  and for all activities that occur under your account.
                </p>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-700">
                      You must be at least 18 years old to create an account
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-700">
                      You must provide accurate and complete information
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-700">
                      You are responsible for maintaining the security of your
                      account
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-700">
                      You must notify us immediately of any unauthorized use
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaExclamationTriangle className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                Medical Information
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                The information provided on our platform is for general
                informational purposes only and is not intended as a substitute
                for professional medical advice, diagnosis, or treatment. Always
                seek the advice of your physician or other qualified health
                provider with any questions you may have regarding a medical
                condition.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaExclamationTriangle className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
                Limitations
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                In no event shall Medi-Link or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Medi-Link's website.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaHistory className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-purple-700">
                Revisions and Errata
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                The materials appearing on Medi-Link's website could include
                technical, typographical, or photographic errors. Medi-Link does
                not warrant that any of the materials on its website are
                accurate, complete, or current. Medi-Link may make changes to
                the materials contained on its website at any time without
                notice.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-blue-700">
                Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                If you have any questions about these Terms of Service, please
                contact us at:
                <br />
                <span className="font-medium text-blue-600">Email:</span>{" "}
                legal@medilink.com
                <br />
                <span className="font-medium text-blue-600">Phone:</span> +1
                (555) 123-4567
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
