"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PharmacySidebar from "@/components/pharmacy-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Order = {
  id: number;
  name: string;
  date: string;
  avatar: string;
  status: "pending" | "accepted" | "completed";
};

export default function PharmacyDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const router = useRouter();

  const handleOrderInfo = (orderId: number) => {
    router.push(`/pharmacy/orders/${orderId}`);
  };

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <PharmacySidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Home</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Welcome to Medi-Link</h1>
            <p className="text-gray-500 mb-6">
              Bridging Patients & Pharmacies Efficiently
            </p>

            <div className="relative mb-6">
              <div className="flex items-center bg-blue-100 rounded-full p-2 pl-4">
                <Search className="h-5 w-5 text-gray-500 mr-2" />
                <Input
                  className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  placeholder={
                    activeTab === "pending"
                      ? "Check Pending Orders"
                      : activeTab === "accepted"
                      ? "Search Accepted Order"
                      : "Search Completed Orders"
                  }
                />
              </div>
            </div>

            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <div className="flex gap-4 mb-6">
                <TabsList className="grid w-full grid-cols-3 h-auto p-0 bg-transparent gap-4">
                  <TabsTrigger
                    value="pending"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-red-100 text-red-500 rounded-md py-2"
                  >
                    Pending Orders
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

              <TabsContent value="pending" className="mt-0">
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>

                  <div className="space-y-4">
                    {pendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                              <Image
                                src={order.avatar || "/placeholder.svg"}
                                alt={order.name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{order.name}</h3>
                              <p className="text-sm text-gray-500">
                                {order.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-300 rounded-full"
                              onClick={() => handleOrderInfo(order.id)}
                            >
                              Order Info
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                            >
                              Pending
                            </Button>
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
                                src={order.avatar || "/placeholder.svg"}
                                alt={order.name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{order.name}</h3>
                              <p className="text-sm text-gray-500">
                                {order.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-300 rounded-full"
                              onClick={() => handleOrderInfo(order.id)}
                            >
                              Order Info
                            </Button>
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
                                src={order.avatar || "/placeholder.svg"}
                                alt={order.name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{order.name}</h3>
                              <p className="text-sm text-gray-500">
                                {order.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-300 rounded-full"
                              onClick={() => handleOrderInfo(order.id)}
                            >
                              Order Info
                            </Button>
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
    </div>
  );
}

const pendingOrders: Order[] = [
  {
    id: 1,
    name: "L.G.L Karinda",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
  {
    id: 2,
    name: "K.H. Wijayawardana",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
  {
    id: 3,
    name: "S.Yathushan",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
  {
    id: 4,
    name: "H.H.Himala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
  {
    id: 5,
    name: "R.Ridhmi",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
  {
    id: 6,
    name: "J.K. Sumathipala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
  {
    id: 7,
    name: "S.Jayasinghe",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
  {
    id: 8,
    name: "L.H.Edirisinghe",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "pending",
  },
];

const acceptedOrders: Order[] = [
  {
    id: 9,
    name: "L.G.L Karinda",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 10,
    name: "K.H. Wijayawardana",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 11,
    name: "S.Yathushan",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 12,
    name: "H.H.Himala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 13,
    name: "R.Ridhmi",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 14,
    name: "J.K. Sumathipala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 15,
    name: "S.Jayasinghe",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 16,
    name: "L.H.Edirisinghe",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
];

const completedOrders: Order[] = [
  {
    id: 17,
    name: "L.G.L Karinda",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 18,
    name: "K.H. Wijayawardana",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 19,
    name: "S.Yathushan",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 20,
    name: "H.H.Himala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 21,
    name: "R.Ridhmi",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 22,
    name: "J.K. Sumathipala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 23,
    name: "S.Jayasinghe",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 24,
    name: "L.H.Edirisinghe",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
];
