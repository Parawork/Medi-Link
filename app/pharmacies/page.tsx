"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Star, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

type Pharmacy = {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  openingHours: string
  image: string
}

export default function PharmaciesPage() {
  const [location, setLocation] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location) {
      toast({
        title: "Location required",
        description: "Please enter a location or use your current location.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to fetch pharmacies
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data
      setPharmacies([
        {
          id: "pharm-1",
          name: "MediCare Pharmacy",
          address: "123 Health St, San Francisco, CA",
          distance: "0.5 miles",
          rating: 4.8,
          openingHours: "Open until 9:00 PM",
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "pharm-2",
          name: "City Drugs",
          address: "456 Wellness Ave, San Francisco, CA",
          distance: "0.8 miles",
          rating: 4.5,
          openingHours: "Open until 8:00 PM",
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "pharm-3",
          name: "Health Plus Pharmacy",
          address: "789 Medical Blvd, San Francisco, CA",
          distance: "1.2 miles",
          rating: 4.7,
          openingHours: "Open until 10:00 PM",
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "pharm-4",
          name: "QuickMeds",
          address: "321 Care Lane, San Francisco, CA",
          distance: "1.5 miles",
          rating: 4.3,
          openingHours: "Open until 7:00 PM",
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "pharm-5",
          name: "Family Pharmacy",
          address: "567 Remedy Road, San Francisco, CA",
          distance: "2.1 miles",
          rating: 4.9,
          openingHours: "Open until 9:30 PM",
          image: "/placeholder.svg?height=60&width=60",
        },
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pharmacies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    setIsLocating(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would convert coordinates to an address
          setLocation("Current Location")
          setIsLocating(false)

          toast({
            title: "Location detected",
            description: "Using your current location to find nearby pharmacies.",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location error",
            description: "Unable to get your location. Please enter it manually.",
            variant: "destructive",
          })
          setIsLocating(false)
        },
      )
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive",
      })
      setIsLocating(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Find Nearby Pharmacies</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Search Pharmacies</CardTitle>
              <CardDescription>Enter your location to find pharmacies near you</CardDescription>
            </CardHeader>
            <form onSubmit={handleSearch}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="location"
                        placeholder="Enter your location"
                        className="pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={getCurrentLocation} disabled={isLocating}>
                      {isLocating ? "Locating..." : "Use Current"}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search Pharmacies"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {pharmacies.length > 0
              ? `Found ${pharmacies.length} pharmacies near you`
              : "Enter your location to find pharmacies"}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {pharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-4 sm:p-6 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={pharmacy.image || "/placeholder.svg"}
                            alt={pharmacy.name}
                            width={60}
                            height={60}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{pharmacy.address}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium">{pharmacy.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-teal-600 mr-1" />
                              <span className="text-sm">{pharmacy.openingHours}</span>
                            </div>
                          </div>
                          <div className="text-sm mt-2">
                            <span className="text-teal-600 font-medium">{pharmacy.distance}</span> from your location
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-between items-center p-4 sm:p-6 bg-gray-50 sm:border-l">
                      <Button asChild className="w-full">
                        <Link href={`/pharmacies/${pharmacy.id}`}>View Details</Link>
                      </Button>
                      <div className="hidden sm:block h-4"></div>
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/chat/${pharmacy.id}`}>Chat</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {pharmacies.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline">
                    Load More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

