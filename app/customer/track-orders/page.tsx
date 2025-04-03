"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/sidebar"
import Link from "next/link"

type Order = {
  id: string
  pharmacy: {
    name: string
    logo: string
  }
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "completed"
}

export default function TrackOrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "customer") {
      router.push("/login")
      return
    }

    setUser(parsedUser)

    // Mock orders data
    setOrders([
      {
        id: "3354654654526",
        pharmacy: {
          name: "CFC Pharmacy",
          logo: "/images/pharmacy-logo.png",
        },
        date: "Mar 7, 2025",
        status: "processing",
      },
      {
        id: "2245789654123",
        pharmacy: {
          name: "Healthguard Pharmacy",
          logo: "/placeholder.svg?height=64&width=64&text=HG",
        },
        date: "Mar 4, 2025",
        status: "shipped",
      },
    ])
  }, [router])

  if (!user) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Track Orders</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Track Order Status</h2>

            <div className="relative mb-8 max-w-md mx-auto">
              <div className="flex items-center bg-blue-100 rounded-full p-2 pl-4">
                <Search className="h-5 w-5 text-gray-500 mr-2" />
                <Input
                  className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  placeholder="Search Order"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Active Orders</h3>

              <div className="space-y-6">
                {orders.map((order) => (
                  <Link href={`/customer/track-orders/${order.id}`} key={order.id}>
                    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow">
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
                            <p className="text-sm text-gray-500">{order.date}</p>
                            <div className="flex items-center mt-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                              <span className="text-sm text-teal-600 capitalize">{order.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white">
                            Track Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

