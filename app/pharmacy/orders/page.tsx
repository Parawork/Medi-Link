"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PharmacySidebar from "@/components/pharmacy-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Order = {
  id: number
  name: string
  date: string
  avatar: string
  status: "pending" | "accepted" | "completed"
}

export default function PharmacyOrdersPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "pharmacy") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
  }, [router])

  if (!user) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <PharmacySidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Order History</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Orders</h2>

              <div className="flex gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input className="pl-10" placeholder="Search orders" />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-transparent gap-4 mb-6">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-[#0a2351] data-[state=active]:text-white bg-gray-100 text-gray-700 rounded-md py-2"
                >
                  All Orders
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-red-100 text-red-500 rounded-md py-2"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="accepted"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white bg-amber-100 text-amber-500 rounded-md py-2"
                >
                  Accepted
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white bg-teal-100 text-teal-500 rounded-md py-2"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {[...pendingOrders, ...acceptedOrders, ...completedOrders].map((order) => (
                  <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
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
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 rounded-full">
                          Order Info
                        </Button>
                        <Button
                          size="sm"
                          className={`${
                            order.status === "pending"
                              ? "bg-red-500 hover:bg-red-600"
                              : order.status === "accepted"
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-teal-500 hover:bg-teal-600"
                          } text-white rounded-full`}
                        >
                          {order.status === "pending"
                            ? "Pending"
                            : order.status === "accepted"
                              ? "Accepted"
                              : "Completed"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
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
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 rounded-full">
                          Order Info
                        </Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-full">
                          Pending
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="accepted" className="space-y-4">
                {acceptedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
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
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 rounded-full">
                          Order Info
                        </Button>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full">
                          Accepted
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
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
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 rounded-full">
                          Order Info
                        </Button>
                        <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white rounded-full">
                          Completed
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
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
]

const acceptedOrders: Order[] = [
  {
    id: 3,
    name: "S.Yathushan",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
  {
    id: 4,
    name: "H.H.Himala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "accepted",
  },
]

const completedOrders: Order[] = [
  {
    id: 5,
    name: "R.Ridhmi",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
  {
    id: 6,
    name: "J.K. Sumathipala",
    date: "2023/03/07",
    avatar: "/placeholder.svg?height=64&width=64",
    status: "completed",
  },
]

