"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"
import { ChevronLeft, MessageSquare, Download } from "lucide-react"
import Link from "next/link"

type OrderDetails = {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "completed"
  pharmacy: {
    id: string
    name: string
    logo: string
    address: string
    phone: string
  }
  items: {
    name: string
    quantity: number
    price: number
  }[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  deliveryAddress: string
  paymentMethod: string
  prescriptionId: string
}

export default function OrderInfoPage({ params }: { params: { id: string } }) {
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

    // Mock order data
    setOrder({
      id: params.id,
      date: "March 7, 2025",
      status: "processing",
      pharmacy: {
        id: "pharm-1",
        name: "CFC Pharmacy",
        logo: "/placeholder.svg?height=64&width=64&text=CFC",
        address: "123 Health St, San Francisco, CA",
        phone: "(555) 123-4567",
      },
      items: [
        { name: "Asco Bite 70 ML", quantity: 1, price: 540.0 },
        { name: "Facia Premium Capsules (30 Capsules)", quantity: 1, price: 390.0 },
        { name: "Aspirin 10 Alternatives", quantity: 1, price: 150.0 },
      ],
      subtotal: 1080.0,
      tax: 86.4,
      deliveryFee: 50.0,
      total: 1216.4,
      deliveryAddress: "647 James Bridge Apt. 134, Colombo St., Colombo",
      paymentMethod: "Credit Card",
      prescriptionId: "RX-12345",
    })
  }, [router, params.id])

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a receipt
    alert("Downloading receipt...")
  }

  const handleChat = () => {
    router.push(`/customer/chat/${order?.pharmacy.id}`)
  }

  if (!user || !order) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Order Information</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/customer/dashboard" className="flex items-center text-blue-600 mb-6">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
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
                    <h2 className="text-xl font-semibold">{order.pharmacy.name}</h2>
                    <p className="text-gray-500">{order.pharmacy.address}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">Order #{order.id}</span>
                  <span className="text-sm text-gray-500">{order.date}</span>
                  <span
                    className={`text-sm mt-1 px-2 py-1 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">LKR {item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>LKR {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>LKR {order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>LKR {order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>LKR {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                <p className="text-gray-700">{order.deliveryAddress}</p>
                <p className="text-gray-700 mt-2">Payment Method: {order.paymentMethod}</p>
                <p className="text-gray-700 mt-2">Prescription ID: {order.prescriptionId}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadReceipt}>
                  <Download className="h-4 w-4" />
                  Download Receipt
                </Button>
                <Button className="bg-[#0a2351] hover:bg-[#0a2351]/90 flex items-center gap-2" onClick={handleChat}>
                  <MessageSquare className="h-4 w-4" />
                  Chat with Pharmacy
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

