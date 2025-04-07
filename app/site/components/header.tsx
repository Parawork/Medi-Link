"use client";

import { usePathname } from "next/navigation";

interface HeaderProps {
  collapsed: boolean;
}

export default function PageHeader({ collapsed }: HeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean).slice(0, 3);
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header 
      className="fixed top-0 w-full bg-[#0a2351] text-white p-4 h-16 z-10 transition-all duration-300"
      style={{ 
        width: collapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)',
        left: collapsed ? '4rem' : '16rem'
      }}
    >
      <div className="container mx-auto flex items-center h-full">
        <h1 className="text-xl font-medium">
          {getPageTitle(pathname)}
        </h1>
      </div>
    </header>
  );
}