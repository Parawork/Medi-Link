import { prisma } from "@/app/utils/db";
import { signOut } from "@/lib/auth";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PatientDashboard() {
  const user = await requireUser("PATIENT");

  // Fetch complete patient data with all relations
  const patient = await prisma.patient.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      geoLocation: true,
      prescriptions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5, // Only get the 5 most recent prescriptions
      },
    },
  });

  if (!patient) {
    redirect("/auth/complete-profile");
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {patient.fullName}</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
            redirect("/login");
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Date of Birth</p>
            <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium">Gender</p>
            <p>{patient.gender || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Address</h2>
        <div className="space-y-2">
          <p>{patient.streetAddress}</p>
          <p>
            {patient.city}, {patient.stateProvince} {patient.postalCode}
          </p>
          <p>{patient.country}</p>
        </div>
      </div>

      {/* Medical Information Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Medical Conditions</p>
            <p className="whitespace-pre-line">
              {patient.medicalConditions || "None reported"}
            </p>
          </div>
          <div>
            <p className="font-medium">Allergies</p>
            <p className="whitespace-pre-line">
              {patient.allergies || "None reported"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
