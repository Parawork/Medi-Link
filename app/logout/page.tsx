"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function LogoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Clear user data
    localStorage.removeItem("user")

    // Show toast
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })

    // Redirect to login page
    router.push("/login")
  }, [router, toast])

  return (
    <div className="min-h-screen bg-[#0a2351] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p>Please wait while we log you out.</p>
      </div>
    </div>
  )
}

