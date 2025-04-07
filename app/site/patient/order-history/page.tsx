import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/app/utils/db";

export default async function PatientOderHistory() {
  const user = await requireUser("PATIENT"); // runs server-side

  const orders = await prisma.order.findMany({
    where: {
      patientId: user.patient?.id, // Filter by the logged-in user's patient ID
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

  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: user.patient?.id },
    select: {
      id: true,
      createdAt: true,
      fileUrl: true,
      Order: true,
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

  // Sort the prescriptions after fetching
  // Prescriptions with NO orders first, then by creation date
  const sortedPrescriptions = prescriptions.sort((a, b) => {
    // Check if prescription has any orders
    const aHasOrders = a.Order.length > 0;
    const bHasOrders = b.Order.length > 0;

    if (!aHasOrders && bHasOrders) return -1; // A has no orders, B has orders, so A comes first
    if (aHasOrders && !bHasOrders) return 1; // A has orders, B has no orders, so B comes first

    // If both have the same order status, sort by creation date (desc)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const acceptedOrders = orders.filter((order) => order.status === "ACCEPTED");
  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED"
  );

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Welcome to Medi-Link</h1>
          <p className="text-gray-500 mb-6">
            Bridging Patients & Pharmacies Efficiently
          </p>

          <Tabs defaultValue="accepted">
            <div className="flex gap-4 mb-6">
              <TabsList className="grid w-full grid-cols-3 h-auto p-0 bg-transparent gap-4">
                <TabsTrigger
                  value="prescriptions"
                  className="data-[state=active]:bg-[#0a2351] data-[state=active]:text-white bg-[#b6bdcb] text-[#0a2351] rounded-md py-2"
                >
                  Uploaded Prescriptions
                </TabsTrigger>
                <TabsTrigger
                  value="accepted"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white bg-amber-100 text-amber-500 rounded-md py-2"
                >
                  Accepted Prescriptions
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white bg-teal-100 text-teal-500 rounded-md py-2"
                >
                  Completed Orders
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="prescriptions" className="mt-0">
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Uploaded Prescriptions
                </h2>

                <div className="space-y-4">
                  {prescriptions.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={order.pharmacy.logo || "/placeholder.svg"}
                              alt={order.pharmacy.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {order.pharmacy.name}
                            </h3>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString("en-US")}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.Order.length > 0 ? (
                                  <span className="text-sm text-green-500">
                                    Can view your medications
                                  </span>
                                ) : (
                                  <span className="text-sm text-yellow-500">
                                    Pending: Check again later
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={order.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-300 rounded-full"
                            >
                              View Prescription
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accepted" className="mt-0">
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Accepted Prescriptions
                  </h2>
                  <p className="text-sm text-gray-400">
                    When pharmacists assign medications for you, they will
                    appear here as Orders
                  </p>
                </div>

                <div className="space-y-4">
                  {acceptedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={order.pharmacy.logo || "/placeholder.svg"}
                              alt={order.pharmacy.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {order.pharmacy.name}
                            </h3>
                            <div className="flex gap-1 flex-col">
                              <span className="text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString("en-US")}
                              </span>
                              <span className="text-sm text-green-500">
                                The pharmacy has accepted your prescription
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/site/patient/order-history/order-info/${order.id}`}
                            className="flex items-center text-center px-2 py-1 bg-white ring-1 rounded-full text-red-700 hover:bg-red-700 hover:text-white text-sm font-normal ring-red-700 tracking-tighter"
                          >
                            View Medications
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>

                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={order.pharmacy.logo || "/placeholder.svg"}
                              alt={order.pharmacy.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {order.pharmacy.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {order.createdAt.toLocaleDateString("en-US")}
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
                              className="text-gray-600 border-gray-300 rounded-full"
                            >
                              Order Info
                            </Button>
                          </Link>
                          <div className="bg-teal-600 text-white rounded-full text-sm font-medium items-center flex text-center px-2 py-1">
                            Completed
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
