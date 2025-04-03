"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !userType) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would store the initial signup data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store initial signup data (in a real app, use secure methods)
      localStorage.setItem(
        "signupData",
        JSON.stringify({
          fullName,
          email,
          userType,
        }),
      )

      // Redirect to appropriate signup form
      if (userType === "pharmacy") {
        router.push("/signup/pharmacy")
      } else {
        router.push("/signup/customer")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to proceed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a2351] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#0a2351] mb-8">Welcome to Medi-Link</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-[#0a2351]">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#0a2351]">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="test@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="userType" className="block text-sm font-medium text-[#0a2351]">
              User Type
            </label>
            <Select onValueChange={setUserType}>
              <SelectTrigger id="userType" className="w-full p-3 border border-gray-300 rounded-md">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0a2351] hover:bg-[#0a2351]/90 text-white py-3 rounded-md font-medium flex items-center justify-center"
          >
            {isLoading ? "PROCESSING..." : "NEXT"}
            {!isLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#0a2351]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 flex justify-center space-x-4">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/terms-and-conditions" className="hover:underline">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  )
}

