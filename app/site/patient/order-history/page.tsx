import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/app/utils/db";

export default async function PharmacyDashboard() {

    const user = await requireUser("PATIENT") // runs server-side

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
          pharmacy: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
    });

    const acceptedOrders = orders.filter((order) => order.status === "ACCEPTED");
    const completedOrders = orders.filter((order) => order.status === "COMPLETED");

  return (
    <div className="flex min-h-screen bg-white">
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Welcome to Medi-Link</h1>
            <p className="text-gray-500 mb-6">
              Bridging Patients & Pharmacies Efficiently
            </p>

            <Tabs defaultValue="accepted" >
              <div className="flex gap-4 mb-6">
                <TabsList className="grid w-full grid-cols-3 h-auto p-0 bg-transparent gap-4">
                  <TabsTrigger
                    value="prescriptions"
                    className="data-[state=active]:bg-[#0a2351] data-[state=active]:text-white bg-[#b6bdcb] text-[#0a2351] rounded-md py-2"
                  >
                    Updated Prescriptions
                  </TabsTrigger>
                  <TabsTrigger
                    value="accepted"
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-white bg-amber-100 text-amber-500 rounded-md py-2"
                  >
                    Accepted Orders
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
                    Updated Prescriptions
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
                              <h3 className="font-medium">{order.pharmacy.name}</h3>
                              <p className="text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString("en-US")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={order.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 border-gray-300 rounded-full"
                                >
                                    Order Info
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
                  <h2 className="text-xl font-semibold mb-4">
                    Accepted Orders
                  </h2>

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
                              <h3 className="font-medium">{order.pharmacy.name}</h3>
                              <p className="text-sm text-gray-500">
                                {order.pharmacy.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/site/patient/order-history/order-info/${order.id}`}>
                                <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 border-gray-300 rounded-full"
                                >
                                    Order Info
                                </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full"
                            >
                              Accepted
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Completed Orders
                  </h2>

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
                              <h3 className="font-medium">{order.pharmacy.name}</h3>
                              <p className="text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString("en-US")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/site/patient/order-history/order-info/${order.id}`}>
                                <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 border-gray-300 rounded-full"
                                >
                                    Order Info
                                </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-600 text-white rounded-full"
                            >
                              Completed
                            </Button>
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

