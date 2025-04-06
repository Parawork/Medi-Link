import { prisma } from "@/app/utils/db"
import { requireUser } from "@/lib/requireUser"
import PatientProfilePage from "./client"

export default async function PatientProfileWrapper() {
  // Fetch the current user
  const currentUser = await requireUser("PATIENT")

  // Fetch patient data with related user info
  const patientData = await prisma.patient.findUnique({
    where: {
      userId: currentUser.id,
    },
    include: {
      user: true,
      geoLocation: true,
    },
  })

  if (!currentUser || !patientData) {
    return null // Handle loading state or redirect
  }

  // Format the data to match the expected shape
  const formattedData = {
    id: patientData.id,
    userId: patientData.userId,
    fullName: patientData.fullName,
    dateOfBirth: patientData.dateOfBirth.toISOString(),
    gender: patientData.gender,
    streetAddress: patientData.streetAddress,
    city: patientData.city,
    stateProvince: patientData.stateProvince,
    postalCode: patientData.postalCode,
    country: patientData.country,
    medicalConditions: patientData.medicalConditions,
    allergies: patientData.allergies,
    geoLocation: patientData.geoLocation,
    email: patientData.user.email,
    memberSince: patientData.user.createdAt.toISOString().split('T')[0],
    phone: patientData.user.phone || 'N/A'
  }

  return <PatientProfilePage initialData={formattedData} />
}