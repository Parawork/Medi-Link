import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PaginationControls from "../../components/pharmacy/PaginationControls";

interface PrescriptionWithPatientAndOrders {
  id: string;
  fileUrl: string;
  createdAt: Date;
  patient: {
    id: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string | null;
    avatar: string | null;
  };
  Order: {
    id: string;
  }[];
}

export default async function PharmacyPrescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const user = await requireUser("PHARMACY");
  const page = resolvedParams["page"] ?? "1";
  const per_page = resolvedParams["per_page"] ?? "10";

  if (!user.pharmacy) {
    return <div>Pharmacy profile not found</div>;
  }

  // Calculate pagination parameters
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const [prescriptions, totalPrescriptions] = await Promise.all([
    prisma.prescription.findMany({
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
            avatar: true,
          },
        },
        Order: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: start,
      take: Number(per_page),
    }) as Promise<PrescriptionWithPatientAndOrders[]>,
    prisma.prescription.count({
      where: {
        pharmacyId: user.pharmacy.id,
      },
    }),
  ]);

  const sortedPrescriptions = prescriptions.sort((a, b) => {
    const aHasOrders = a.Order.length > 0;
    const bHasOrders = b.Order.length > 0;

    if (!aHasOrders && bHasOrders) return -1;
    if (aHasOrders && !bHasOrders) return 1;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">
          Manage Prescriptions
        </h1>
        <Link href="/site/pharmacy/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6 mb-8">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="flex flex-col bg-gray-50 rounded-3xl py-4 px-4 md:py-5 md:px-7 gap-3 md:gap-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 md:px-3">
                <div className="text-base md:text-lg tracking-tighter font-light">
                  Prescription : {prescription.patient.fullName}
                </div>
                <div className="text-xs md:text-sm">
                  {formatPrescriptionDate(prescription.createdAt)}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Prescription thumbnail */}
                <div className="h-[60px] w-[130px] md:h-[70px] md:w-[150px] relative rounded-xl bg-white/20">
                  <Image
                    src={prescription.fileUrl}
                    alt={`Prescription for ${prescription.patient.fullName}`}
                    fill
                    className="object-cover rounded-xl"
                    priority
                  />
                </div>
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 items-center w-full sm:w-auto">
                  {hasOrder(prescription.id) ? (
                    <>
                      <div className="w-full sm:w-auto px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-green-50 text-green-900 ring-1 ring-green-900 text-xs md:text-sm font-bold tracking-tighter text-center">
                        Order Completed
                      </div>
                      <Link
                        href={`/site/pharmacy/orders/${prescription.Order[0].id}`}
                        className="w-full sm:w-auto px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white text-blue-900 ring-1 ring-blue-900 text-xs md:text-sm tracking-tighter hover:bg-blue-900 hover:text-white text-center"
                      >
                        View Order
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/site/pharmacy/order-history/${prescription.id}`}
                      className="w-full sm:w-auto px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white text-blue-900 ring-1 ring-blue-900 text-xs md:text-sm tracking-tighter hover:bg-blue-900 hover:text-white text-center"
                    >
                      Create Order
                    </Link>
                  )}
                </div>
                {/* Patient avatar */}
                <div className="size-[60px] md:size-[70px] relative rounded-full bg-white/20 order-first sm:order-last">
                  <Image
                    src={prescription.patient.avatar || "/images/noAvatar.png"}
                    alt={`${prescription.patient.fullName}'s avatar`}
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 md:py-12 text-gray-500">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-medium">
              No prescriptions found
            </h3>
            <p className="text-xs md:text-sm mt-1">
              {`When you have prescriptions, they'll appear here`}
            </p>
          </div>
        )}
      </div>

      <PaginationControls
        totalItems={totalPrescriptions}
        itemsPerPage={Number(per_page)}
        currentPage={Number(page)}
        basePath="/site/pharmacy/order-history"
      />
    </div>
  );
}
