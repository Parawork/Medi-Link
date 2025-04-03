"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"
import Link from "next/link"

type OrderStatus = "placed" | "approved" | "processing" | "shipped" | "delivered"

type OrderItem = {
  name: string
  quantity: string
  price: number
}

type OrderDetails = {
  id: string
  pharmacy: {
    name: string
    logo: string
    id: string
  }
  date: string
  estimatedDelivery: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  delivery: {
    address: string
    city: string
    phone: string
  }
}

export default function OrderProgressPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [order, setOrder] = useState<OrderDetails | null>(null)
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

    // Mock fetch order details
    setOrder({
      id: "3354654654526",
      pharmacy: {
        name: "CFC Pharmacy",
        logo: "/images/pharmacy-logo.png",
        id: "CFC123",
      },
      date: "Mar 7 2025",
      estimatedDelivery: "Mar 9, 2025",
      status: "processing",
      items: [
        { name: "Asco Bite 70 ML", quantity: "", price: 540.0 },
        { name: "Facia Premium Capsules (30 Capsules)", quantity: "", price: 390.0 },
        { name: "Aspirin 10 Alternatives", quantity: "", price: 150.0 },
      ],
      total: 1080.0,
      delivery: {
        address: "647 James Bridge Apt. 134 Colombo St.",
        city: "Colombo",
        phone: "+94-415-789",
      },
    })
  }, [router, params.id])

  if (!user || !order) {
    return null // Loading state
  }

  const getStatusStep = (status: OrderStatus): number => {
    const steps: OrderStatus[] = ["placed", "approved", "processing", "shipped", "delivered"]
    return steps.indexOf(status) + 1
  }

  const currentStep = getStatusStep(order.status)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Progress</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6">Order Progress</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 relative">
                  <Image
                    src={order.pharmacy.logo || "/placeholder.svg"}
                    alt={order.pharmacy.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{order.pharmacy.name}</h3>
                  <p className="text-sm text-gray-500">{order.pharmacy.id}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-sm font-medium">Order ID: {order.id}</p>
                </div>
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 rounded-full">
                  Invoice
                </Button>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  <p className="text-xs text-gray-500">Order date: {order.date}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs text-green-600">Estimated delivery: {order.estimatedDelivery}</p>
                </div>
              </div>

              {/* Progress tracker */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Order Placed</span>
                  <span className="text-sm font-medium">Order Approved</span>
                  <span className="text-sm font-medium">Processing</span>
                  <span className="text-sm font-medium">Shipped</span>
                  <span className="text-sm font-medium">Delivered</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-teal-500 rounded-full"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between absolute -top-1 w-full">
                    <div className={`w-4 h-4 rounded-full ${currentStep >= 1 ? "bg-teal-500" : "bg-gray-300"}`}></div>
                    <div className={`w-4 h-4 rounded-full ${currentStep >= 2 ? "bg-teal-500" : "bg-gray-300"}`}></div>
                    <div className={`w-4 h-4 rounded-full ${currentStep >= 3 ? "bg-teal-500" : "bg-gray-300"}`}></div>
                    <div className={`w-4 h-4 rounded-full ${currentStep >= 4 ? "bg-teal-500" : "bg-gray-300"}`}></div>
                    <div className={`w-4 h-4 rounded-full ${currentStep >= 5 ? "bg-teal-500" : "bg-gray-300"}`}></div>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Sun, 5th Mar</span>
                  <span className="text-xs text-gray-500">Mon, 6th Mar</span>
                  <span className="text-xs text-gray-500">Tue, 7th Mar</span>
                  <span className="text-xs text-gray-500">Wed, 8th Mar</span>
                  <span className="text-xs text-gray-500">Thu, 9th Mar</span>
                </div>
              </div>

              {/* Order summary */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>LKR {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>LKR {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Delivery</h3>
                <p className="text-gray-700">{order.delivery.address}</p>
                <p className="text-gray-700">{order.delivery.city}</p>
                <p className="text-gray-700">{order.delivery.phone}</p>
              </div>

              {/* Help section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Need Help</h3>
                <div className="space-y-2">
                  <Link
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                  >
                    <span className="font-medium">Order Issues</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                  >
                    <span className="font-medium">Delivery Info</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                  >
                    <span className="font-medium">Returns</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

