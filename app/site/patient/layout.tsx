
"use client";

import { useState } from "react";
import PageHeader from "../components/header";
import Sidebar from "../components/patient/patient-sidebar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ 
          marginLeft: collapsed ? '4rem' : '16rem',
          width: collapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)'
        }}
      >
        <PageHeader collapsed={collapsed} />
        <main className="flex-1 p-6 mt-16">{children}</main>
      </div>
    </div>
  );
}