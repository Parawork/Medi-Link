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
    take: 5, // Filter for pending and completed orders,user.patient.id
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
  });

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-6">
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/locate-pharmacies">
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
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={order.pharmacy.logo || "/placeholder.svg"}
                        alt={order.pharmacy.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{order.pharmacy.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">
                          LKR {order.totalAmount.toFixed(2)}
                        </span>
                        {/* <span className="text-gray-400 line-through text-sm">${order.totalAmount.toFixed(2)}</span> */}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/site/patient/order-history/order-info/${order.id}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-300"
                      >
                        Order Info
                      </Button>
                    </Link>
                    <Link
                      href={`/site/patient/uploadPrescription/${order.pharmacy.id}`}
                    >
                      <Button
                        size="sm"
                        className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white"
                      >
                        Place New Order
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
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
