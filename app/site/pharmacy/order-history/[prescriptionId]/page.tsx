import { OrderForm } from "@/app/site/components/pharmacy/OrderForm";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/app/utils/db";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Make sure to import Button

export default async function ReviewOrder({
  params,
}: {
  params: Promise<{ prescriptionId: string }>;
}) {
  const user = await requireUser("PHARMACY");
  const { prescriptionId } = await params;

  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          gender: true,
          streetAddress: true,
          city: true,
          stateProvince: true,
          avatar: true,
        },
      },
    },
  });

  if (!prescription) {
    return <div className="max-w-4xl mx-auto py-8">Prescription not found</div>;
  }

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Format the date using native JavaScript Date methods instead of date-fns
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Helper function to get prescription file name
  const getPrescriptionFileName = () => {
    const patientName = prescription.patient.fullName.replace(/\s+/g, "_");
    const fileExtension = prescription.fileUrl.split(".").pop();
    return `prescription_${patientName}_${prescriptionId}.${fileExtension}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Create Order For Prescription</h1>
        <p className="text-gray-600">Prescription ID: {prescriptionId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Patient Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
          <div className="space-y-3">
            <div className="size-[70px] relative rounded-full bg-white/20">
              <Image
                src={prescription.patient.avatar || "/images/noAvatar.png"}
                alt={`${prescription.patient.fullName}'s avatar`}
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{prescription.patient.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">
                {calculateAge(prescription.patient.dateOfBirth)} years
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">
                {prescription.patient.gender || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">
                {prescription.patient.streetAddress},{" "}
                {prescription.patient.city},{" "}
                {prescription.patient.stateProvince}
              </p>
            </div>
          </div>
        </div>

        {/* Prescription Image */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Prescription</h2>
          <div className="relative aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
            {prescription.fileUrl.endsWith(".pdf") ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-4">
                  <p className="text-gray-500 mb-2">PDF Document</p>
                  <a
                    href={prescription.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View PDF
                  </a>
                </div>
              </div>
            ) : (
              <Image
                src={prescription.fileUrl}
                alt={`Prescription for ${prescription.patient.fullName}`}
                fill
                className="object-contain"
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-4 gap-3">
            <p className="text-sm text-gray-500">
              Uploaded on {formatDate(prescription.createdAt)}
            </p>

            {/* Download button */}
            <a
              href={prescription.fileUrl}
              download={getPrescriptionFileName()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                Download Prescription
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Create Order</h2>
        <OrderForm prescription={prescriptionId} />
      </div>
    </div>
  );
}
