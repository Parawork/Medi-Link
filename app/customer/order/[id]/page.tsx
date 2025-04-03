"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/sidebar"
import { Upload } from "lucide-react"

export default function OrderPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    patientName: "",
    patientAge: "",
    patientContactNumber: "",
    message: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "customer") {
      router.push("/login")
      return
    }

    setUser(parsedUser)

    // Pre-fill form with user data if available
    if (parsedUser.name) {
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name,
        email: parsedUser.email || "",
        patientName: parsedUser.name,
      }))
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would send the form data and file to the server
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to order confirmation or chat
      router.push(`/customer/chat/${params.id}`)
    } catch (error) {
      console.error("Error submitting order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Order</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Order details</h2>

            <form onSubmit={handleSubmit}>
              {/* Your Information */}
              <div className="mb-6">
                <div className="mb-4">
                  <Label htmlFor="name">Your name:</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="eg. John Doe"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="email">Your email:</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="eg. john@example.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="contactNumber">Contact number:</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="eg. 0123456789"
                    required
                  />
                </div>
              </div>

              {/* Prescription Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Prescription information</h3>

                <div className="mb-4">
                  <Label htmlFor="patientName">Patient name:</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="eg. John Doe"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="patientAge">Patient age:</Label>
                  <Input
                    id="patientAge"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    placeholder="eg. 27"
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="patientContactNumber">Contact number:</Label>
                  <Input
                    id="patientContactNumber"
                    name="patientContactNumber"
                    value={formData.patientContactNumber}
                    onChange={handleChange}
                    placeholder="eg. 0123456789"
                    required
                  />
                </div>
              </div>

              {/* Upload Files */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Upload files</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Upload your doctor's prescription</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="prescription"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif,application/pdf"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Choose a file or drag & drop it here</p>
                    <p className="text-xs text-gray-500 mb-4">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("prescription")?.click()}
                    >
                      Browse File
                    </Button>
                  </div>
                </div>
                {file && <p className="mt-2 text-sm text-green-600">File selected: {file.name}</p>}
              </div>

              {/* Message */}
              <div className="mb-6">
                <Label htmlFor="message">Your message:</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full max-w-[200px] bg-[#0a2351] hover:bg-[#0a2351]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

