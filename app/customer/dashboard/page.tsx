// app/customer/dashboard/page.tsx (or wherever your route is)
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/sidebar"
import { requireUser } from "@/lib/requireUser"

type Order = {
  id: string
  pharmacy: {
    name: string
    logo: string
  }
  date: string
  price: number
  originalPrice: number
}

export default async function CustomerDashboard() {
  const user = await requireUser("PATIENT") // runs server-side

  const orders: Order[] = [
    {
      id: "order-1",
      pharmacy: {
        name: "CFC Pharmacy",
        logo: "/placeholder.svg?height=64&width=64&text=CFC",
      },
      date: "2023/12/07",
      price: 80.0,
      originalPrice: 125.5,
    },
    {
      id: "order-2",
      pharmacy: {
        name: "Healthguard Pharmacy",
        logo: "/placeholder.svg?height=64&width=64&text=HG",
      },
      date: "2023/12/04",
      price: 99.99,
      originalPrice: 125.5,
    },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Home</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <p className="text-center text-gray-600 mb-6">
            Experience the future of shopping with our AI powered platform
          </p>

          <div className="relative mb-6 max-w-md mx-auto">
            <div className="flex items-center bg-blue-100 rounded-full p-2 pl-4">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <Input
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                placeholder="Find Pharmacy"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white">
              <Search className="mr-2 h-4 w-4" />
              Pharmacies Near Me
            </Button>
            <Link href="/customer/track-orders">
              <Button variant="outline" className="border-[#0a2351] text-[#0a2351]">
                Track Orders
              </Button>
            </Link>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6">
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
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-medium">${order.price.toFixed(2)}</span>
                          <span className="text-gray-400 line-through text-sm">${order.originalPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/customer/order-info/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-600 border-gray-300"
                        >
                          Order Info
                        </Button>
                      </Link>
                      <Button size="sm" className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white">
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
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
