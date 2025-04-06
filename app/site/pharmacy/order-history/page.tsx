import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PrescriptionWithPatientAndOrders {
  id: string;
  fileUrl: string;
  createdAt: Date;
  patient: {
    id: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string | null;
  };
  Order: {
    id: string;
  }[];
}

export default async function PharmacyPrescriptionsPage() {
  const user = await requireUser("PHARMACY");

  if (!user.pharmacy) {
    return <div>Pharmacy profile not found</div>;
  }

  const prescriptions = (await prisma.prescription.findMany({
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
      Order: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as PrescriptionWithPatientAndOrders[];

  const hasOrder = (prescriptionId: string) => {
    const prescription = prescriptions.find((p) => p.id === prescriptionId);
    return prescription?.Order?.length ? prescription.Order.length > 0 : false;
  };

  const formatPrescriptionDate = (date: Date) => {
    const now = new Date();
    const prescriptionDate = new Date(date);

    // Check if the date is today
    const isToday =
      prescriptionDate.getDate() === now.getDate() &&
      prescriptionDate.getMonth() === now.getMonth() &&
      prescriptionDate.getFullYear() === now.getFullYear();

    if (isToday) {
      // Format as HH:mm
      return prescriptionDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      // Calculate time difference
      const diffMs = now.getTime() - prescriptionDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes < 60) {
        return diffMinutes <= 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
      } else if (diffDays < 30) {
        return diffDays === 1 ? "yesterday" : `${diffDays} days ago`;
      } else {
        // Format as date if more than a month ago
        return prescriptionDate.toLocaleDateString();
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-6">Manage Prescriptions</h1>
        <Link href="/site/pharmacy/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="flex flex-col bg-blue-200 h-[180px] rounded-3xl py-5 px-7 gap-4"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-3">
              <div className="text-lg font-bold">
                Prescription for {prescription.patient.fullName}
              </div>
              <div className="text-sm">
                {formatPrescriptionDate(prescription.createdAt)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Prescription thumbnail */}
              <div className="h-[70px] w-[150px] relative rounded-xl bg-white/20">
                <Image
                  src={prescription.fileUrl}
                  alt={`Prescription for ${prescription.patient.fullName}`}
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-8 items-center">
                {hasOrder(prescription.id) ? (
                  <>
                    <Button variant="outline" disabled>
                      Order Completed
                    </Button>
                    <Link
                      href={`/site/pharmacy/orders/${prescription.Order[0].id}`}
                    >
                      <Button>View Order</Button>
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/site/pharmacy/order-history/${prescription.id}`}
                  >
                    <Button>Create Order</Button>
                  </Link>
                )}
              </div>

              {/* Patient avatar */}
              <div className="size-[70px] relative rounded-full bg-white/20">
                <Image
                  src="/default-avatar.png"
                  alt={`${prescription.patient.fullName}'s avatar`}
                  fill
                  className="object-cover rounded-full"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
