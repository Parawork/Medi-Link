"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Clock, MessageSquare, ShoppingCart, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type PharmacyResult = {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  openingHours: string
  image: string
  availability: "Available" | "Partial" | "Unavailable"
  price: number
  estimatedTime: string
}

export default function PrescriptionResults() {
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const pharmacyResults: PharmacyResult[] = [
    {
      id: "pharm-1",
      name: "MediCare Pharmacy",
      address: "123 Health St, San Francisco, CA",
      distance: "0.5 miles",
      rating: 4.8,
      openingHours: "Open until 9:00 PM",
      image: "/placeholder.svg?height=60&width=60",
      availability: "Available",
      price: 45.99,
      estimatedTime: "Ready in 30 mins",
    },
    {
      id: "pharm-2",
      name: "City Drugs",
      address: "456 Wellness Ave, San Francisco, CA",
      distance: "0.8 miles",
      rating: 4.5,
      openingHours: "Open until 8:00 PM",
      image: "/placeholder.svg?height=60&width=60",
      availability: "Partial",
      price: 42.5,
      estimatedTime: "Ready in 1 hour",
    },
    {
      id: "pharm-3",
      name: "Health Plus Pharmacy",
      address: "789 Medical Blvd, San Francisco, CA",
      distance: "1.2 miles",
      rating: 4.7,
      openingHours: "Open until 10:00 PM",
      image: "/placeholder.svg?height=60&width=60",
      availability: "Available",
      price: 48.75,
      estimatedTime: "Ready in 45 mins",
    },
    {
      id: "pharm-4",
      name: "QuickMeds",
      address: "321 Care Lane, San Francisco, CA",
      distance: "1.5 miles",
      rating: 4.3,
      openingHours: "Open until 7:00 PM",
      image: "/placeholder.svg?height=60&width=60",
      availability: "Unavailable",
      price: 0,
      estimatedTime: "Not available",
    },
  ]

  const handleProceed = () => {
    if (!selectedPharmacy) {
      toast({
        title: "No pharmacy selected",
        description: "Please select a pharmacy to proceed.",
        variant: "destructive",
      })
      return
    }

    router.push(`/checkout/${selectedPharmacy}`)
  }

  const getAvailabilityColor = (availability: PharmacyResult["availability"]) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Partial":
        return "bg-yellow-100 text-yellow-800"
      case "Unavailable":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Prescription Results</h1>
          <p className="text-muted-foreground mt-1">
            We found {pharmacyResults.filter((p) => p.availability !== "Unavailable").length} pharmacies that can
            fulfill your prescription
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/upload-prescription">Upload Another Prescription</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Results ({pharmacyResults.length})</TabsTrigger>
          <TabsTrigger value="available">
            Available ({pharmacyResults.filter((p) => p.availability === "Available").length})
          </TabsTrigger>
          <TabsTrigger value="partial">
            Partial ({pharmacyResults.filter((p) => p.availability === "Partial").length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-6">
          {pharmacyResults.map((pharmacy) => (
            <Card
              key={pharmacy.id}
              className={`overflow-hidden transition-all ${
                selectedPharmacy === pharmacy.id ? "ring-2 ring-teal-500" : ""
              }`}
            >
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
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                        <Badge className={getAvailabilityColor(pharmacy.availability)}>{pharmacy.availability}</Badge>
                      </div>
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
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <div className="text-sm">
                            <span className="text-teal-600 font-medium">{pharmacy.distance}</span> from your location
                          </div>
                          <div className="text-sm mt-1">{pharmacy.estimatedTime}</div>
                        </div>
                        {pharmacy.availability !== "Unavailable" && (
                          <div className="text-lg font-bold">${pharmacy.price.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col justify-between items-center p-4 sm:p-6 bg-gray-50 sm:border-l">
                  {pharmacy.availability !== "Unavailable" ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => setSelectedPharmacy(pharmacy.id)}
                        variant={selectedPharmacy === pharmacy.id ? "default" : "outline"}
                      >
                        {selectedPharmacy === pharmacy.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </Button>
                      <div className="hidden sm:block h-4"></div>
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/chat/${pharmacy.id}`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button disabled className="w-full">
                      Not Available
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="available" className="space-y-4 mt-6">
          {pharmacyResults
            .filter((p) => p.availability === "Available")
            .map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className={`overflow-hidden transition-all ${
                  selectedPharmacy === pharmacy.id ? "ring-2 ring-teal-500" : ""
                }`}
              >
                {/* Same card content as above */}
                <div className="flex flex-col sm:flex-row">
                  <div className="p-4 sm:p-6 flex-1">
                    {/* Content same as above */}
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
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                          <Badge className="bg-green-100 text-green-800">Available</Badge>
                        </div>
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
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <div className="text-sm">
                              <span className="text-teal-600 font-medium">{pharmacy.distance}</span> from your location
                            </div>
                            <div className="text-sm mt-1">{pharmacy.estimatedTime}</div>
                          </div>
                          <div className="text-lg font-bold">${pharmacy.price.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col justify-between items-center p-4 sm:p-6 bg-gray-50 sm:border-l">
                    <Button
                      className="w-full"
                      onClick={() => setSelectedPharmacy(pharmacy.id)}
                      variant={selectedPharmacy === pharmacy.id ? "default" : "outline"}
                    >
                      {selectedPharmacy === pharmacy.id ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </Button>
                    <div className="hidden sm:block h-4"></div>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/chat/${pharmacy.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="partial" className="space-y-4 mt-6">
          {pharmacyResults
            .filter((p) => p.availability === "Partial")
            .map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className={`overflow-hidden transition-all ${
                  selectedPharmacy === pharmacy.id ? "ring-2 ring-teal-500" : ""
                }`}
              >
                {/* Same card content as above */}
                <div className="flex flex-col sm:flex-row">
                  <div className="p-4 sm:p-6 flex-1">
                    {/* Content same as above */}
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
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                          <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                        </div>
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
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <div className="text-sm">
                              <span className="text-teal-600 font-medium">{pharmacy.distance}</span> from your location
                            </div>
                            <div className="text-sm mt-1">{pharmacy.estimatedTime}</div>
                          </div>
                          <div className="text-lg font-bold">${pharmacy.price.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col justify-between items-center p-4 sm:p-6 bg-gray-50 sm:border-l">
                    <Button
                      className="w-full"
                      onClick={() => setSelectedPharmacy(pharmacy.id)}
                      variant={selectedPharmacy === pharmacy.id ? "default" : "outline"}
                    >
                      {selectedPharmacy === pharmacy.id ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </Button>
                    <div className="hidden sm:block h-4"></div>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/chat/${pharmacy.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleProceed} disabled={!selectedPharmacy}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}

