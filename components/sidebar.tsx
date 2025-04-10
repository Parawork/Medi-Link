"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Clock, User, LogOut, Menu } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={`${collapsed ? "w-[60px]" : "w-[200px]"} bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300`}
    >
      <div className="h-16 bg-[#0a2351] flex items-center justify-center">
        <button className="text-white" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <nav className="p-3 space-y-2">
        <Link
          href="/customer/dashboard"
          className={`flex items-center gap-3 p-3 rounded-md ${
            isActive("/customer/dashboard") ? "bg-blue-200 text-blue-800" : "hover:bg-gray-100"
          }`}
        >
          <Home size={18} />
          {!collapsed && <span>Home</span>}
        </Link>

        <Link
          href="/customer/locate-pharmacies"
          className={`flex items-center gap-3 p-3 rounded-md ${
            isActive("/customer/locate-pharmacies") ? "bg-blue-200 text-blue-800" : "hover:bg-gray-100"
          }`}
        >
          <Search size={18} />
          {!collapsed && <span>Locate Pharmacies</span>}
        </Link>

        <Link
          href="/customer/order-history"
          className={`flex items-center gap-3 p-3 rounded-md ${
            isActive("/customer/order-history") || isActive("/customer/track-orders")
              ? "bg-blue-200 text-blue-800"
              : "hover:bg-gray-100"
          }`}
        >
          <Clock size={18} />
          {!collapsed && <span>Order History</span>}
        </Link>

        <Link
          href="/customer/profile"
          className={`flex items-center gap-3 p-3 rounded-md ${
            isActive("/customer/profile") ? "bg-blue-200 text-blue-800" : "hover:bg-gray-100"
          }`}
        >
          <User size={18} />
          {!collapsed && <span>User Profile</span>}
        </Link>

        <Link
          href="/logout"
          className={`flex items-center gap-3 p-3 rounded-md ${collapsed ? "" : "mt-4"} bg-red-100 text-red-600 hover:bg-red-200`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </nav>
    </div>
  )
}

