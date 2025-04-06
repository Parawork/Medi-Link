import { prisma } from "@/app/utils/db";
import { signOut } from "@/lib/auth";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import PharmacyCard from "../components/patient/PharmacyCard";

type Pharmacy = {
  id: string;
  name: string;
  logo?: string;
  phone: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  verified: boolean;
};

type Props = {
  pharmacies: Pharmacy[];
};

const PharmacyList: React.FC<Props> = ({ pharmacies }) => {
  return (
    <div className="grid gap-4 p-4">
      {pharmacies.map((pharmacy) => (
        <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
      ))}
    </div>
  );
};

export default async function PatientPage() {
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

  // Fetch pharmacies
  const pharmacies = await prisma.pharmacy.findMany({});

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Available Pharmacies</h1>
      <PharmacyList pharmacies={pharmacies} />
    </div>
  );
}
