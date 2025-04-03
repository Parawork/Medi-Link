"use client"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/sidebar"

export default function RecentOrders() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Home</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-gray-600 mb-6">
              Experience the future of shopping with our AI powered platform
            </p>

            <div className="relative mb-6 max-w-md mx-auto">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input className="pl-10 bg-blue-50 border-blue-100 rounded-md" placeholder="Find Pharmacy" />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <Button className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white">
                <Search className="mr-2 h-4 w-4" />
                Pharmacies Near Me
              </Button>
              <Button variant="outline" className="border-[#0a2351] text-[#0a2351]">
                Track Orders
              </Button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src="/placeholder.svg?height=64&width=64&text=CFC"
                        alt="CFC Pharmacy"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">CFC Pharmacy</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">$80.00</span>
                        <span className="text-gray-400 line-through text-sm">$125.50</span>
                      </div>
                      <p className="text-sm text-gray-500">2023/12/07</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      Order Info
                    </Button>
                    <Button size="sm" className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Place New Order
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src="/placeholder.svg?height=64&width=64&text=HG"
                        alt="Healthguard Pharmacy"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Healthguard Pharmacy</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">$99.99</span>
                        <span className="text-gray-400 line-through text-sm">$125.50</span>
                      </div>
                      <p className="text-sm text-gray-500">2023/12/04</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      Order Info
                    </Button>
                    <Button size="sm" className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Place New Order
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

