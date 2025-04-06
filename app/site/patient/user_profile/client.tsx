"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type PatientProfile = {
  id: string
  userId: string
  fullName: string
  dateOfBirth: string
  gender?: string
  streetAddress: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
  medicalConditions?: string
  allergies?: string
  geoLocation?: {
    id: string
    lat: number
    lng: number
  }
  email: string
  memberSince: string
  phone: string
}

export default function PatientProfilePage({ 
  initialData 
}: { 
  initialData: PatientProfile 
}) {
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profile, setProfile] = useState<PatientProfile>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/patient/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          streetAddress: profile.streetAddress,
          city: profile.city,
          stateProvince: profile.stateProvince,
          postalCode: profile.postalCode,
          country: profile.country,
          medicalConditions: profile.medicalConditions,
          allergies: profile.allergies,
          phone: profile.phone
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Patient profile updated successfully",
      })
      setIsEditingProfile(false)
      router.refresh()
    } catch (error) {
      console.error("Error during profile update:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-200 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=96&width=96&text=PT"
                  alt="Patient Avatar"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">{profile.fullName}</h2>
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
                    value={profile.email}
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <Input
                    name="phone"
                    value={profile.phone}
                    disabled={!isEditingAccount}
                    className={!isEditingAccount ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                  <p className="text-sm">{profile.memberSince}</p>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <Input
                    name="fullName"
                    value={profile.fullName}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth.split('T')[0]}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gender</label>
                  <Input
                    name="gender"
                    value={profile.gender || ''}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                  <Input
                    name="streetAddress"
                    value={profile.streetAddress}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <Input
                    name="city"
                    value={profile.city}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                  <Input
                    name="stateProvince"
                    value={profile.stateProvince}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                  <Input
                    name="postalCode"
                    value={profile.postalCode}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <Input
                    name="country"
                    value={profile.country}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Medical Conditions</label>
                  <Textarea
                    name="medicalConditions"
                    value={profile.medicalConditions || ''}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Allergies</label>
                  <Textarea
                    name="allergies"
                    value={profile.allergies || ''}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? "bg-gray-50" : ""}
                    onChange={handleProfileChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {isEditingProfile && (
              <div className="mt-6 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setProfile(initialData)
                    setIsEditingProfile(false)
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
        </main>
      </div>
    </div>
  )
}