"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, User, LogOut, Menu } from "lucide-react";
import { handleSignOut } from "../patient/signOutAction";

export default function PharmacySidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`${
        collapsed ? "w-[60px]" : "w-[200px]"
      } bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300`}
    >
      <div className="h-16 bg-[#0a2351] flex items-center justify-center">
        <button className="text-white" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <nav className="p-3 space-y-2">
        <Link
          href="/site/pharmacy"
          className={`flex items-center gap-3 p-3 rounded-md ${
            isActive("/site/pharmacy")
              ? "bg-blue-200 text-blue-800"
              : "hover:bg-gray-100"
          }`}
        >
          <Home size={18} />
          {!collapsed && <span>Home</span>}
        </Link>

        <Link
          href="/site/pharmacy/order-history"
          className={`flex items-center gap-3 p-3 rounded-md ${
            isActive("/site/pharmacy/order-history")
              ? "bg-blue-200 text-blue-800"
              : "hover:bg-gray-100"
          }`}
        >
          <Clock size={18} />
          {!collapsed && <span>Order History</span>}
        </Link>

        <Link
          href="/site/pharmacy/updateProfile"
          className={`flex items-center gap-3 p-3 rounded-md ${
            isActive("/site/pharmacy/updateProfile")
              ? "bg-blue-200 text-blue-800"
              : "hover:bg-gray-100"
          }`}
        >
          <User size={18} />
          {!collapsed && <span>User Profile</span>}
        </Link>

        <form action={handleSignOut}>
          <button
            type="submit"
            className={`flex items-center gap-3 p-3 rounded-md w-full ${
              collapsed ? "" : "mt-4"
            } hover:bg-red-100 text-red-600 `}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </nav>
    </div>
  );
}
