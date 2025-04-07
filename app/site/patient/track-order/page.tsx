import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/app/utils/db";

export default async function TrackOrdersPage() {
  const user = await requireUser("PATIENT"); // runs server-side

  const orders = await prisma.order.findMany({
    where: {
      patientId: user.patient?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      totalAmount: true,
      status: true,
      pharmacy: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Track Order Status</h2>

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-gray-100 p-3 md:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 relative overflow-hidden flex-shrink-0">
                        <Image
                          src={order.pharmacy.logo || "/placeholder.svg"}
                          alt={order.pharmacy.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm md:text-base">
                          {order.pharmacy.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">
                          {order.createdAt.toLocaleDateString("en-US")}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                          <span className="text-xs md:text-sm text-teal-600 capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto mt-3 sm:mt-0">
                      <Link
                        href={`/site/patient/track-order/${order.id}`}
                        className="block w-full sm:w-auto"
                      >
                        <Button
                          size="sm"
                          className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white w-full"
                        >
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
