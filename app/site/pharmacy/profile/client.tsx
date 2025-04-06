"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type PharmacyProfile = {
  id: string
  userId: string
  name: string
  licenseNumber: string
  streetAddress: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
  phone: string
  email: string
  memberSince: string
}

export default function PharmacyProfilePage({ 
  initialData 
}: { 
  initialData: PharmacyProfile 
}) {
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [isEditingPharmacy, setIsEditingPharmacy] = useState(false)
  const [profile, setProfile] = useState<PharmacyProfile>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePharmacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pharmacy/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Pharmacy details updated successfully",
      })
      setIsEditingPharmacy(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update pharmacy details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/pharmacy/${profile.id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete account')
        }

        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted",
        })
        router.push('/login')
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to delete account",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col">

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                <Image
                  src="/placeholder.svg?height=96&width=96&text=PH"
                  alt="Pharmacy Logo"
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
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <Input
                    name="email"
                    value={profile.email}
                    disabled={!isEditingAccount}
                    className={!isEditingAccount ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Password</label>
                  <Input
                    type="password"
                    value="********"
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>

                {isEditingAccount && (
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push('/reset-password')}>
                      Change Password
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
                      Delete Account
                    </Button>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                  <p className="text-sm">{profile.memberSince || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Pharmacy Details */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Pharmacy Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditingPharmacy(!isEditingPharmacy)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <Input
                    name="name"
                    value={profile.name}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">License Number</label>
                  <Input
                    name="licenseNumber"
                    value={profile.licenseNumber}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                  <Input
                    name="streetAddress"
                    value={profile.streetAddress}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <Input
                    name="city"
                    value={profile.city}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                  <Input
                    name="stateProvince"
                    value={profile.stateProvince}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Postal code</label>
                  <Input
                    name="postalCode"
                    value={profile.postalCode}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <Input
                    name="country"
                    value={profile.country}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone number</label>
                  <Input
                    name="phone"
                    value={profile.phone}
                    disabled={!isEditingPharmacy}
                    className={!isEditingPharmacy ? "bg-gray-50" : ""}
                    onChange={handlePharmacyChange}
                  />
                </div>
              </div>

              {isEditingPharmacy && (
                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setProfile(initialData)
                      setIsEditingPharmacy(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[#0a2351] hover:bg-[#0a2351]/90" 
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}