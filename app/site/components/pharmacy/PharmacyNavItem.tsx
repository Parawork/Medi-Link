"use client";
import React from "react";
import NavItem from "../patient/NavItem"; // Importing the existing NavItem

interface PharmacyNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}

const PharmacyNavItem: React.FC<PharmacyNavItemProps> = ({
  href,
  icon,
  label,
  isActive,
  collapsed,
}) => {
  return (
    <NavItem
      href={href}
      icon={icon}
      label={label}
      isActive={isActive}
      collapsed={collapsed}
    />
  );
};

export default PharmacyNavItem; 