import { prisma } from "@/app/utils/db"
import { requireUser } from "@/lib/requireUser"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

export default async function CustomerProfilePage() {
  // Fetch the current user
  const currentUser = await requireUser("PATIENT")

  // Fetch patient data
  const patientData = await prisma.patient.findUnique({
    where: {
      userId: currentUser.id,
    },
  })

  // Mock profile data (you can replace this with actual data from your database)
  const profile = {
    username: "johndoe",
    password: "********",
    memberSince: "2023-01-15",
    name: currentUser.name || "John Doe",
    nicNumber: "200xxxxxxxxxxxxxxxxx",
    address: {
      street: "Hamilton street",
      city: "Hyderabad",
      province: "Western Province",
      postalCode: "10250",
      country: "India",
    },
    email: currentUser.email || "john@gmail.com",
    phone: "+91xxxxxxxxxx",
  }

  if (!currentUser || !patientData) {
    return null // Handle loading state or redirect
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
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
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Username</label>
                  <Input value={profile.username} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Password</label>
                  <Input type="password" value={profile.password} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                  <p className="text-sm">{profile.memberSince}</p>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Patient Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <Input value={patientData.fullName} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                  <Input value={new Date(patientData.dateOfBirth).toLocaleDateString()} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gender</label>
                  <Input value={patientData.gender || "Not specified"} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <Input value={profile.email} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                  <Input value={patientData.streetAddress} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <Input value={patientData.city} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                  <Input value={patientData.stateProvince} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                  <Input value={patientData.postalCode} disabled={true} className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <Input value={patientData.country} disabled={true} className="bg-gray-50" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

