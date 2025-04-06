// app/dashboard/patient/profile/page.tsx
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { PatientProfileForm } from "../../components/patient/PatientProfileForm";

export default async function PatientProfilePage() {
  const user = await requireUser("PATIENT");

  const patient = await prisma.patient.findUnique({
    where: { id: user.patient?.id },
    include: {
      geoLocation: true,
    },
  });

  if (!patient) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Patient Profile</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Patient profile not found. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Patient Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <PatientProfileForm
            initialData={{
              ...patient,
              dateOfBirth: patient.dateOfBirth.toISOString(), // Convert to string for client
            }}
          />
        </div>
      </div>
    </div>
  );
}
