"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUserMd,
  FaHospital,
  FaUser,
  FaInfoCircle,
  FaEnvelope,
  FaShieldAlt,
  FaFileContract,
} from "react-icons/fa";

export default function PageHeader() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean).slice(0, 3);
    const lastSegment = segments[segments.length - 1];

    // Convert the last segment to title case
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const getPageIcon = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    switch (lastSegment) {
      case "home":
        return <FaHome className="text-blue-300" />;
      case "doctor":
        return <FaUserMd className="text-blue-300" />;
      case "hospital":
        return <FaHospital className="text-blue-300" />;
      case "patient":
        return <FaUser className="text-blue-300" />;
      case "about":
        return <FaInfoCircle className="text-blue-300" />;
      case "contact":
        return <FaEnvelope className="text-blue-300" />;
      case "privacy":
        return <FaShieldAlt className="text-blue-300" />;
      case "terms":
        return <FaFileContract className="text-blue-300" />;
      default:
        return <FaHome className="text-blue-300" />;
    }
  };

  return (
    <motion.header
      className="bg-[#0a2351] text-white p-4 flex items-center h-16 relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 rounded-full -mr-32 -mt-32"></div>
      <div className="container mx-auto flex items-center relative z-10">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            {getPageIcon(pathname)}
          </div>
          <h1 className="text-xl font-medium tracking-wide">
            {getPageTitle(pathname)}
          </h1>
        </motion.div>
      </div>
    </motion.header>
  );
}
