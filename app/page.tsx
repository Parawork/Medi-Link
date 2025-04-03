"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a2351] flex flex-col items-center justify-center p-4">
      <div className="text-center text-white mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Medi-Link</h1>
        <p className="text-xl md:text-2xl">Bridging Patients & Pharmacies Effortlessly</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-white text-[#0a2351] hover:bg-gray-100 px-8 py-6 text-lg">
          <Link href="/login">Login</Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
        >
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}

