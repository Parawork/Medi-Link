"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import PharmacySidebar from "@/components/pharmacy-sidebar"
import { useToast } from "@/components/ui/use-toast"

type CustomerDetails = {
  id: string
  name: string
  email: string
  avatar: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
  }
  phone: string
  memberSince: string
}

type PrescriptionDetails = {
  id: string
  pharmacyName: string
  pharmacyAddress: string
  pharmacyPhone: string
  pharmacyLicense: string
  date: string
  patientName: string
  patientAddress: string
  patientCity: string
  patientProvince: string
  doctorName: string
  drug: string
  days: number
  refill: number
  din: string
  pricing: {
    base: number
    fee: number
    total: number
  }
  patientPaid: number
  pharmacistSignature: string
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [prescription, setPrescription] = useState<PrescriptionDetails | null>(null)
  const router = useRouter()
  const { toast } = useToast()

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
      avatar: "/placeholder.svg?height=80&width=80",
      address: {
        street: "123 Main Street",
        city: "New York City",
        province: "New York",
        postalCode: "10001",
      },
      phone: "+1xxxxxxxxxx",
      memberSince: "Jan 2023",
    })

    // Mock prescription data
    setPrescription({
      id: "01758488",
      pharmacyName: "THE FIRST PHARMACY",
      pharmacyAddress: "123 MAIN STREET, DOWNTOWN, NY, USA",
      pharmacyPhone: "212-555-5555",
      pharmacyLicense: "LICENSE # 1234",
      date: "March 1, 2024",
      patientName: "YOUR NAME",
      patientAddress: "Your Address",
      patientCity: "Your City",
      patientProvince: "Your Province",
      doctorName: "Dr. A. Lee",
      drug: "DRUG 500MG, 21 Cap",
      days: 7,
      refill: 3,
      din: "12345457",
      pricing: {
        base: 345.4,
        fee: 11.99,
        total: 357.39,
      },
      patientPaid: 357.39,
      pharmacistSignature: "Dr. Smith",
    })
  }, [router, params.id])

  const handleSendMessage = () => {
    if (!message.trim()) return

    toast({
      title: "Message sent",
      description: "Your message has been sent to the customer.",
    })

    setMessage("")
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "The prescription receipt is being downloaded.",
    })
  }

  const handleOrderInfo = () => {
    // Navigate to order details page
    router.push(`/pharmacy/orders/${params.id}`)
  }

  const handleChat = () => {
    // Navigate to chat page
    router.push(`/pharmacy/chat/${params.id}`)
  }

  if (!user || !customer || !prescription) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <PharmacySidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Order</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Order details</h2>

            {/* Prescription Receipt */}
            <div className="mb-6">
              <div className="border-2 border-green-500 rounded-lg p-6 bg-white">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold">{prescription.pharmacyName}</h3>
                  <p className="text-sm">{prescription.pharmacyAddress}</p>
                  <p className="text-sm">
                    {prescription.pharmacyPhone} {prescription.pharmacyLicense}
                  </p>
                </div>

                <div className="text-center font-bold mb-4">OFFICIAL PRESCRIPTION RECEIPT</div>

                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm">Rx: {prescription.id}</p>
                    <p className="text-sm">{prescription.patientName}</p>
                    <p className="text-sm">{prescription.patientAddress}</p>
                    <p className="text-sm">
                      {prescription.patientCity}, {prescription.patientProvince}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">{prescription.date}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm">{prescription.doctorName}</p>
                  <p className="text-sm">{prescription.drug}</p>
                </div>

                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm">DIN: {prescription.din}</p>
                  </div>
                  <div>
                    <p className="text-sm">Days: {prescription.days}</p>
                    <p className="text-sm">Refill: {prescription.refill}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm">Pricing QSCA:</p>
                  <p className="text-sm">
                    $ {prescription.pricing.base.toFixed(2)} + $ {prescription.pricing.fee.toFixed(2)} = ${" "}
                    {prescription.pricing.total.toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-between mb-4">
                  <p className="text-sm">Patient Paid: $ {prescription.patientPaid.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-sm">
                    Pharmacist's Signature: <span className="italic">{prescription.pharmacistSignature}</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={handleDownload}>
                  Download
                </Button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Customer Details</h3>

              <div className="flex">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p>{customer.name}</p>
                  </div>

                  <div className="row-span-4 flex justify-end">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={customer.avatar || "/placeholder.svg"}
                        alt={customer.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-sm">{customer.address.street}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">City</p>
                    <p className="text-sm">{customer.address.city}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">State/Province</p>
                    <p className="text-sm">{customer.address.province}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Postal Code</p>
                    <p className="text-sm">{customer.address.postalCode}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Email address</p>
                    <p className="text-sm">{customer.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone number</p>
                    <p className="text-sm">{customer.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="text-sm">{customer.memberSince}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1 bg-[#0a2351] hover:bg-[#0a2351]/90" onClick={handleChat}>
                  Chat
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/pharmacy/customers/${params.id}`)}
                >
                  View Profile
                </Button>
              </div>
            </div>

            {/* Message Area */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium mb-2">Your message:</h3>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the customer here..."
                className="min-h-[100px] mb-4"
              />
              <div className="flex justify-center">
                <Button className="w-full max-w-[200px] bg-[#0a2351] hover:bg-[#0a2351]/90" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

