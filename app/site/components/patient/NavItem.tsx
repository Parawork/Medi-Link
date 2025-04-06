"use  client";
import React from "react";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isActive,
  collapsed,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
          ${
            isActive
              ? "bg-blue-100 text-blue-700 font-medium"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
          ${collapsed ? "justify-center" : ""}`}
    >
      <div className={`${isActive ? "text-blue-700" : "text-gray-500"}`}>
        {icon}
      </div>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export default NavItem;
