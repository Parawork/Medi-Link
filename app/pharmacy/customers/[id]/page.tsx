"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import PharmacySidebar from "@/components/pharmacy-sidebar"
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

type CustomerProfile = {
  id: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  avatar: string
  memberSince: string
  lastOrder: string
  totalOrders: number
  preferredPayment: string
  allergies: string[]
  medicalConditions: string[]
}

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
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

    // Mock customer data
    setCustomer({
      id: params.id,
      name: "John Doe",
      email: "john@gmail.com",
      phone: "+1 (555) 123-4567",
      address: {
        street: "123 Main Street",
        city: "New York City",
        state: "New York",
        postalCode: "10001",
        country: "USA",
      },
      avatar: "/placeholder.svg?height=120&width=120",
      memberSince: "January 2023",
      lastOrder: "March 1, 2024",
      totalOrders: 12,
      preferredPayment: "Credit Card",
      allergies: ["Penicillin", "Sulfa"],
      medicalConditions: ["Hypertension", "Type 2 Diabetes"],
    })
  }, [router, params.id])

  if (!user || !customer) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <PharmacySidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Customer Profile</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Link href={`/pharmacy/orders/${params.id}`} className="flex items-center text-blue-600 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order
            </Link>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={customer.avatar || "/placeholder.svg"}
                    alt={customer.name}
                    width={120}
                    height={120}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-semibold">{customer.name}</h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 text-gray-600">
                    <div className="flex items-center justify-center md:justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {customer.address.street}, {customer.address.city}, {customer.address.state}{" "}
                      {customer.address.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start mt-2 text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Member since {customer.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Order History</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Last Order:</span>
                      <span>{customer.lastOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span>{customer.totalOrders}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Payment:</span>
                      <span>{customer.preferredPayment}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Allergies</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {customer.allergies.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {customer.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No allergies recorded</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Medical Conditions</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {customer.medicalConditions.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {customer.medicalConditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No medical conditions recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1 bg-[#0a2351] hover:bg-[#0a2351]/90"
                onClick={() => router.push(`/pharmacy/chat/${params.id}`)}
              >
                Message Customer
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => router.push(`/pharmacy/orders/${params.id}`)}>
                View Order Details
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

