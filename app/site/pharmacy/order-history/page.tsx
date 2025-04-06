import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export default async function PharmacyPrescriptionsPage() {
  const user = await requireUser("PHARMACY");

  if (!user.pharmacy) {
    return <div>Pharmacy profile not found</div>;
  }

  const prescriptions = await prisma.prescription.findMany({
    where: {
      pharmacyId: user.pharmacy.id,
    },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          gender: true,
          dateOfBirth: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Prescriptions</h1>

      <div className="flex flex-col gap-6">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="flex flex-col">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div>Prescription {prescription.patient.fullName}</div>
              <div>{`1 day ago... or if today 16.40`}</div>
            </div>
            <Link
              href={`/site/pharmacy/order-history/${prescription.id}`}
              className="flex items-center justify-between h-4 w-4 bg-blue-500"
            >
              <div>
                <Image
                  src={prescription.fileUrl}
                  alt=""
                  width={12}
                  height={12}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
