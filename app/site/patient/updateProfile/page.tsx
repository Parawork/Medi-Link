// app/profile/page.tsx
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/app/utils/db";
import { PatientProfileForm } from "../../components/patient/PatientProfileForm";

export default async function PatientProfilePage() {
  const user = await requireUser("PATIENT");

  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
  });

  if (!patient) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Patient Profile</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Patient profile not found. Please create your profile.</p>
            {/* You could add a link to a create profile page here */}
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
          <PatientProfileForm initialData={patient} />
        </div>
      </div>
    </div>
  );
}
