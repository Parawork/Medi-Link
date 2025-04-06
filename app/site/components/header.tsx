"use client"

import { usePathname } from "next/navigation"

export default function PageHeader() {
  const pathname = usePathname()
  
  const getPageTitle = (path: string) => {
    const segments = path.split('/')
    const lastSegment = segments[segments.length - 1]
    
    // Convert the last segment to title case
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  return (
    <header className="bg-[#0a2351] text-white p-4 flex items-center">
      <div className="container mx-auto flex items-center">
        <h1 className="text-xl font-medium">{getPageTitle(pathname)}</h1>
      </div>
    </header>
  )
} 