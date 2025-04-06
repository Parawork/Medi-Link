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

  const pharmacies = await prisma.pharmacy.findMany({});

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {patient.fullName}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 ">
        {pharmacies.map((pharmacy) => (
          <Link
            key={pharmacy.id}
            href={`/site/patient/${pharmacy.id}`}
            className="flex items-center justify-between h-10 bg-yellow-100"
          >
            <div>Pharmacy Image</div>
            <div className="flex flex-col gap-4">
              <p>{pharmacy.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
