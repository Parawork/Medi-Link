import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"

export default function LocatePharmacies() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Locate Pharmacies</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Find Nearby Pharmacies</h2>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input className="pl-10" placeholder="Enter your location" />
                </div>
                <Button className="bg-[#0a2351] hover:bg-[#0a2351]/90">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              <p className="text-gray-500">Enter a location to find pharmacies near you.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

