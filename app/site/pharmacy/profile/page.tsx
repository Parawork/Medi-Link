// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Pencil } from "lucide-react"
// import { prisma } from "@/app/utils/db"
// import { requireUser } from "@/lib/requireUser"

// type PharmacyProfile = {
//   username: string
//   password: string
//   memberSince: string
//   name: string
//   licenseNumber: string
//   address: {
//     street: string
//     city: string
//     province: string
//     postalCode: string
//     country: string
//   }
//   email: string
//   phone: string
// }

// export default async function PharmacyProfilePage() {
//   // Fetch the current user
//   const currentUser = await requireUser("PHARMACY")

//   // Fetch pharmacy data
//   const pharmacyData = await prisma.pharmacy.findUnique({
//     where: {
//       userId: currentUser.id,
//     },
//   })

//   if (!currentUser || !pharmacyData) {
//     return null // Handle loading state or redirect
//   }

//   return (
//     <div className="flex min-h-screen bg-white">
//       <div className="flex-1 flex flex-col">

//         <main className="flex-1 p-6">
//           <div className="max-w-3xl mx-auto">
//             {/* Profile Header */}
//             <div className="flex flex-col items-center mb-8">
//               <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
//                 <Image
//                   src="/placeholder.svg?height=96&width=96&text=Pharmacy"
//                   alt="Pharmacy Logo"
//                   width={96}
//                   height={96}
//                   className="object-cover"
//                 />
//               </div>
//               <h2 className="text-xl font-semibold">{pharmacyData.name}</h2>
//               <p className="text-gray-500">{pharmacyData.phone}</p>
//             </div>

//             {/* Pharmacy Details */}
//             <div className="border border-blue-300 rounded-lg p-6 mb-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium">Pharmacy Details</h3>
//                 <Button variant="ghost" size="sm" className="flex items-center gap-1">
//                   <Pencil className="h-4 w-4" />
//                   Edit
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Name</label>
//                   <Input value={pharmacyData.name} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">License Number</label>
//                   <Input value={pharmacyData.licenseNumber} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Street Address</label>
//                   <Input value={pharmacyData.streetAddress} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">City</label>
//                   <Input value={pharmacyData.city} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">State/Province</label>
//                   <Input value={pharmacyData.stateProvince} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
//                   <Input value={pharmacyData.postalCode} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Country</label>
//                   <Input value={pharmacyData.country} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Email</label>
//                   <Input value={currentUser.email} disabled={true} className="bg-gray-50" />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
//                   <Input value={pharmacyData.phone} disabled={true} className="bg-gray-50" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
// </div>
// )
// }

import { prisma } from "@/app/utils/db"
import { requireUser } from "@/lib/requireUser"
import PharmacyProfilePage from "./client"

export default async function PharmacyProfileWrapper() {
  // Fetch the current user
  const currentUser = await requireUser("PHARMACY")

  // Fetch pharmacy data
  const pharmacyData = await prisma.pharmacy.findUnique({
    where: {
      userId: currentUser.id,
    },
  })

  if (!currentUser || !pharmacyData) {
    return null // Handle loading state or redirect
  }

  // Format the data to match the expected shape
  const formattedData = {
    id: pharmacyData.id,
    userId: pharmacyData.userId,
    name: pharmacyData.name,
    licenseNumber: pharmacyData.licenseNumber,
    streetAddress: pharmacyData.streetAddress,
    city: pharmacyData.city,
    stateProvince: pharmacyData.stateProvince,
    postalCode: pharmacyData.postalCode,
    country: pharmacyData.country,
    phone: pharmacyData.phone,
    email: currentUser.email,
    memberSince: pharmacyData.createdAt?.toISOString().split('T')[0] || 'N/A'
  }

  return <PharmacyProfilePage initialData={formattedData} />
}

