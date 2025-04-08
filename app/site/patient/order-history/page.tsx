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
    orderBy: {
      createdAt: "desc",
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
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">
            Welcome to Medi-Link
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            Bridging Patients & Pharmacies Efficiently
          </p>

          <Tabs defaultValue="accepted">
            <div className="flex mb-4 sm:mb-6">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-0 bg-transparent gap-2 sm:gap-4">
                <TabsTrigger
                  value="prescriptions"
                  className="data-[state=active]:bg-[#0a2351] data-[state=active]:text-white bg-[#b6bdcb] text-[#0a2351] rounded-md py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  Uploaded Prescriptions
                </TabsTrigger>
                <TabsTrigger
                  value="accepted"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white bg-amber-100 text-amber-500 rounded-md py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  Accepted Prescriptions
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white bg-teal-100 text-teal-500 rounded-md py-1.5 sm:py-2 text-xs sm:text-sm"
                >
                  Completed Orders
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="prescriptions" className="mt-0">
              <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-6">
                <div className="flex flex-col mb-3 sm:mb-4 gap-1 sm:gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Uploaded Prescriptions
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {`Pending: Pharmacist hasn't checked your prescription. So no
                    Order created yet.`}
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {prescriptions.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={order.pharmacy.logo || "/placeholder.svg"}
                              alt={order.pharmacy.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">
                              {order.pharmacy.name}
                            </h3>
                            <div className="flex flex-col gap-0.5 sm:gap-1">
                              <p className="text-xs sm:text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString("en-US")}
                              </p>
                              <p className="text-xs sm:text-sm">
                                {order.Order.length > 0 ? (
                                  <span className="text-green-500">
                                    Can view your medications
                                  </span>
                                ) : (
                                  <span className="text-yellow-500">
                                    Pending: Check again later
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                          <Link
                            href={order.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full sm:w-auto"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-300 rounded-full w-full text-xs sm:text-sm"
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
              <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-6">
                <div className="flex flex-col gap-1 mb-3 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-4">
                    Accepted Prescriptions
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    When pharmacists assign medications for you, they will
                    appear here as Orders
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {acceptedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={order.pharmacy.logo || "/placeholder.svg"}
                              alt={order.pharmacy.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">
                              {order.pharmacy.name}
                            </h3>
                            <div className="flex gap-0.5 sm:gap-1 flex-col">
                              <span className="text-xs sm:text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString("en-US")}
                              </span>
                              <span className="text-xs sm:text-sm text-green-500">
                                The pharmacy has accepted your prescription
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                          <Link
                            href={`/site/patient/order-history/order-info/${order.id}`}
                            className="block w-full sm:w-auto"
                          >
                            <div className="flex items-center justify-center text-center px-3 py-1.5 bg-white ring-1 rounded-full text-red-700 hover:bg-red-700 hover:text-white text-xs sm:text-sm font-normal ring-red-700 tracking-tighter w-full">
                              View Medications
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-6">
                <div className="flex flex-col mb-3 sm:mb-4 gap-1 sm:gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Completed Orders
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    When you make a payment for an Order they will appear here
                    as Completed Orders
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {completedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={order.pharmacy.logo || "/placeholder.svg"}
                              alt={order.pharmacy.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">
                              {order.pharmacy.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {order.createdAt.toLocaleDateString("en-US")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <Link
                            href={`/site/patient/order-history/order-info/${order.id}`}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-300 rounded-full w-full text-xs sm:text-sm"
                            >
                              Order Info
                            </Button>
                          </Link>
                          <div className="bg-teal-600 text-white rounded-full text-xs sm:text-sm font-medium items-center flex justify-center text-center px-3 py-1.5 w-full sm:w-auto">
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
