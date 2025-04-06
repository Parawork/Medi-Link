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

  return <div className="container mx-auto p-4">{/* Header Section */}</div>;
}
