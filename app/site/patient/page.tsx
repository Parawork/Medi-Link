import Image from "next/image";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/app/utils/db";

export default async function CustomerDashboard() {
  const user = await requireUser("PATIENT"); // runs server-side

  console.log("User:", user.patient?.id); // Log the user object to see its structure

  const orders = await prisma.order.findMany({
    where: {
      patientId: user.patient?.id, // Filter by the logged-in user's patient ID
      // status: "COMPLETED"
    },
    take: 5,

    select: {
      id: true,
      createdAt: true,
      totalAmount: true,
      pharmacy: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-6">
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/site/patient/locate-pharmacies">
            <Button className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white">
              <Search className="mr-2 h-4 w-4" />
              Pharmacies Near Me
            </Button>
          </Link>
          <Link href={`/site/patient/track-order/`}>
            <Button
              variant="outline"
              className="border-[#0a2351] text-[#0a2351]"
            >
              Track Orders
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl font-semibold">
              Recent Responses From Pharmacies
            </h2>
            <p className="text-sm">
              Orders that have been created from pharmacies according to your
              prescriptions
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 relative flex-shrink-0 mb-4">
                      <Image
                        src={order.pharmacy.logo || "/placeholder.svg"}
                        alt={order.pharmacy.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm md:text-base">
                        {order.pharmacy.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium text-sm md:text-base">
                          LKR {order.totalAmount.toFixed(2)}
                        </span>
                        {/* <span className="text-gray-400 line-through text-xs md:text-sm">${order.totalAmount.toFixed(2)}</span> */}
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                    <Link
                      href={`/site/patient/order-history/order-info/${order.id}`}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-300 w-full"
                      >
                        Order Info
                      </Button>
                    </Link>
                    <Link
                      href={`/site/patient/uploadPrescription/${order.pharmacy.id}`}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        size="sm"
                        className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white w-full"
                      >
                        Upload Prescription
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
