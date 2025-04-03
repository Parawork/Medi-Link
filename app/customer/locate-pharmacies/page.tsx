"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import Sidebar from "@/components/sidebar"
import { Search, MapPin } from "lucide-react"

type Pharmacy = {
  id: string
  name: string
  logo: string
  distance: string
}

export default function LocatePharmaciesPage() {
  const [user, setUser] = useState<any>(null)
  const [searchRadius, setSearchRadius] = useState(5)
  const [isOpenNow, setIsOpenNow] = useState(false)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
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

    // Mock pharmacies data
    setPharmacies([
      {
        id: "1",
        name: "Health Care Pharmacy",
        logo: "/placeholder.svg?height=40&width=40&text=HCP",
        distance: "0.8 km",
      },
      {
        id: "2",
        name: "Healthguard",
        logo: "/placeholder.svg?height=40&width=40&text=HG",
        distance: "1.2 km",
      },
    ])
  }, [router])

  const handleLocateMe = () => {
    // In a real app, this would use the browser's geolocation API
    alert("Locating your position...")
  }

  const handlePlaceNewOrder = (pharmacyId: string) => {
    router.push(`/customer/order/${pharmacyId}`)
  }

  if (!user) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Locate Pharmacies</h1>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="max-w-5xl mx-auto">
            {/* Search bar */}
            <div className="relative mb-6">
              <div className="flex items-center bg-gray-100 rounded-md">
                <div className="absolute left-3">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <Input
                  className="pl-10 bg-gray-100 border-none focus-visible:ring-0"
                  placeholder="Search for a pharmacy name"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#0a2351] hover:bg-[#0a2351]/90"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Location section */}
            <div className="mb-6">
              <h2 className="text-sm font-medium mb-2">Location</h2>
              <div className="flex gap-2">
                <Input className="flex-1" placeholder="Enter Address" />
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-blue-500 text-blue-500"
                  onClick={handleLocateMe}
                >
                  <MapPin className="h-4 w-4" />
                  Locate Me
                </Button>
              </div>
            </div>

            {/* Search radius */}
            <div className="mb-6">
              <h2 className="text-sm font-medium mb-2">Desired Search Radius</h2>
              <div className="flex items-center gap-4">
                <Slider
                  defaultValue={[5]}
                  max={10}
                  step={1}
                  className="flex-1"
                  onValueChange={(value) => setSearchRadius(value[0])}
                />
                <span className="min-w-[60px] text-center">{searchRadius} km</span>
              </div>
            </div>

            {/* Open now */}
            <div className="mb-6">
              <h2 className="text-sm font-medium mb-2">Open Now</h2>
              <Input type="time" className="w-full max-w-[200px]" defaultValue="10:00" />
            </div>

            {/* Map */}
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
              <div className="relative w-full h-[320px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iaFy2OsKCw7FGI8wVReSQrzgLEsKnI.png"
                  alt="Map showing pharmacy locations"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Pharmacies list */}
            <div>
              <h2 className="text-xl font-medium mb-4">Pharmacies found</h2>
              <div className="space-y-4">
                {pharmacies.map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative">
                        <Image
                          src={pharmacy.logo || "/placeholder.svg"}
                          alt={pharmacy.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{pharmacy.name}</h3>
                        <p className="text-sm text-gray-500">{pharmacy.distance}</p>
                      </div>
                    </div>
                    <Button
                      className="bg-[#0a2351] hover:bg-[#0a2351]/90"
                      onClick={() => handlePlaceNewOrder(pharmacy.id)}
                    >
                      Place New Order
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

