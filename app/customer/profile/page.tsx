"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/sidebar"
import { Pencil } from "lucide-react"

type UserProfile = {
  username: string
  password: string
  memberSince: string
  name: string
  nicNumber: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  email: string
  phone: string
}

export default function CustomerProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
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

    // Mock profile data
    setProfile({
      username: "johndoe",
      password: "********",
      memberSince: "2023-01-15",
      name: "John Doe",
      nicNumber: "200xxxxxxxxxxxxxxxxx",
      address: {
        street: "Hamilton street",
        city: "Hyderabad",
        province: "Western Province",
        postalCode: "10250",
        country: "India",
      },
      email: "john@gmail.com",
      phone: "+91xxxxxxxxxx",
    })
  }, [router])

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, this would call an API to delete the account
      localStorage.removeItem("user")
      router.push("/login")
    }
  }

  if (!user || !profile) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">User Profile</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                <Image
                  src="/placeholder.svg?height=96&width=96"
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>

            {/* Account Details */}
            <div className="border border-blue-300 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Account Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditingAccount(!isEditingAccount)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Username</label>
                  <Input
                    value={profile.username}
                    disabled={!isEditingAccount}
                    className={!isEditingAccount ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Password</label>
                  <Input
                    type="password"
                    value={profile.password}
                    disabled={!isEditingAccount}
                    className={!isEditingAccount ? "bg-gray-50" : ""}
                  />
                </div>

                {isEditingAccount && (
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                )}

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                  <p className="text-sm">{profile.memberSince}</p>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">User Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditingUser(!isEditingUser)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <Input
                    value={profile.name}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">NIC Number</label>
                  <Input
                    value={profile.nicNumber}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                  <Input
                    value={profile.address.street}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <Input
                    value={profile.address.city}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                  <Input
                    value={profile.address.province}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Postal code</label>
                  <Input
                    value={profile.address.postalCode}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <Input
                    value={profile.address.country}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <Input
                    value={profile.email}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone number</label>
                  <Input
                    value={profile.phone}
                    disabled={!isEditingUser}
                    className={!isEditingUser ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                  <p className="text-sm">{profile.memberSince}</p>
                </div>
              </div>

              {isEditingUser && (
                <div className="mt-4 flex justify-end">
                  <Button className="bg-[#0a2351] hover:bg-[#0a2351]/90">Save Changes</Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

