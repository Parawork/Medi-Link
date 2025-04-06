import { prisma } from "@/app/utils/db"
import { requireUser } from "@/lib/requireUser"
import PharmacyProfilePage from "@/app/site/pharmacy/profile/client"

export async function GET(req: Request, { params }: { params: { ID: string } }) {
  const currentUser = await requireUser("PHARMACY")
  const pharmacyData = await prisma.pharmacy.findUnique({
    where: {
      userId: currentUser.id,
    },
  })

  if (!currentUser || !pharmacyData) {
    return new Response(null, { status: 404 }) // Handle loading state or redirect
  }

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

  return new Response(JSON.stringify(formattedData), { status: 200 })
}

export async function PUT(req: Request, { params }: { params: { ID: string } }) {
  const currentUser = await requireUser("PHARMACY")
  const body = await req.json()

  // Ensure the ID matches the user
  if (currentUser.id !== body.userId) {
    return new Response("Unauthorized", { status: 403 })
  }

  try {
    const updatedPharmacy = await prisma.pharmacy.update({
      where: {
        id: params.ID, // Assuming ID is the pharmacy ID
      },
      data: {
        name: body.name,
        licenseNumber: body.licenseNumber,
        streetAddress: body.streetAddress,
        city: body.city,
        stateProvince: body.stateProvince,
        postalCode: body.postalCode,
        country: body.country,
        phone: body.phone,
      },
    })

    return new Response(null, { status: 204 }) // No content
  } catch (error) {
    console.error("Error updating pharmacy:", error)
    return new Response("Failed to update pharmacy", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { ID: string } }) {
  const currentUser = await requireUser("PHARMACY")
  
  // Delete pharmacy logic here
  // ...

  return new Response(null, { status: 204 }) // No content
}