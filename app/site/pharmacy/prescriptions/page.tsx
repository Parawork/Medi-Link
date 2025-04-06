import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import Link from "next/link";
import { format } from "date-fns";

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
      <h1 className="text-2xl font-bold mb-6">Patient Prescriptions</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium">
          <div className="col-span-3">Patient</div>
          <div className="col-span-2">Gender</div>
          <div className="col-span-2">Age</div>
          <div className="col-span-3">Uploaded</div>
          <div className="col-span-2">Actions</div>
        </div>

        {prescriptions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No prescriptions found
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-3 font-medium">
                {prescription.patient.fullName}
              </div>
              <div className="col-span-2 text-gray-600">
                {prescription.patient.gender || "N/A"}
              </div>
              <div className="col-span-2 text-gray-600">
                {calculateAge(prescription.patient.dateOfBirth)} years
              </div>
              {/* <div className="col-span-3 text-gray-600">
                {format(new Date(prescription.createdAt), "MMM d, yyyy h:mm a")}
              </div> */}
              <div className="col-span-2">
                <Link
                  href={`/site/pharmacy/prescriptions/${prescription.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
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
