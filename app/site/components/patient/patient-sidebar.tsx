"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavItem from "./NavItem";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Clock,
  User,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import { handleSignOut } from "./signOutAction";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-gradient-to-b from-gray-50 to-gray-45 border-r border-gray-200 shadow-sm flex-shrink-0 transition-all duration-300 h-screen`}
    >
      <div className="h-16 bg-gradient-to-r from-[#0a2351] to-[#1e3a6a] flex items-center justify-between px-4 shadow-md">
        {!collapsed && (
          <h1 className="text-white font-semibold tracking-wide text-lg">
            Medi-Link
          </h1>
        )}
        <button
          className="text-white hover:bg-[#1e3a6a] p-2 rounded-md transition-colors"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="p-3 space-y-1 mt-2">
        <NavItem
          href="/site/patient"
          icon={<Home size={18} />}
          label="Home"
          isActive={isActive("/site/patient")}
          collapsed={collapsed}
        />

        <NavItem
          href="/site/patient/locate-pharmacies"
          icon={<Search size={18} />}
          label="Locate Pharmacies"
          isActive={isActive("/site/patient/locate-pharmacies")}
          collapsed={collapsed}
        />

        <NavItem
          href="/site/patient/order-history"
          icon={<Clock size={18} />}
          label="Order History"
          isActive={isActive("/site/patient/order-history")}
          collapsed={collapsed}
        />

        <NavItem
          href="/site/patient/profile"
          icon={<User size={18} />}
          label="User Profile"
          isActive={isActive("/site/patient/profile")}
          collapsed={collapsed}
        />

        <div
          className={`${
            collapsed ? "mt-8" : "mt-12"
          } border-t border-gray-200 pt-2`}
        >
          <form action={handleSignOut}>
            <button
              type="submit"
              className={`flex items-center gap-3 p-3 rounded-lg w-full 
                text-red-600 hover:bg-red-50 transition-colors duration-200 group`}
            >
              <LogOut
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}

