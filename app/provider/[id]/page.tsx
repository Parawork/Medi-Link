import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProviderDetail({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the provider data based on the ID
  const provider = {
    id: Number.parseInt(params.id),
    name: "Memorial Hospital",
    logo: "/placeholder.svg?height=80&width=80",
    location: "123 Medical Center Dr, Los Angeles, CA 90001",
    phone: "(555) 123-4567",
    email: "contact@memorialhospital.example",
    status: "Active",
    description:
      "Memorial Hospital is a leading healthcare provider offering comprehensive medical services including emergency care, surgery, and specialized treatments.",
    services: ["Emergency Care", "Surgery", "Cardiology", "Pediatrics", "Oncology"],
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Medi Link</h1>
          <div className="flex items-center gap-4">
            <button className="text-sm">Help</button>
            <button className="text-sm">Settings</button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <Link href="/" className="flex items-center text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Link>

        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src={provider.logo || "/placeholder.svg"}
                alt={provider.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold text-gray-800">{provider.name}</h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    provider.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : provider.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {provider.status}
                </span>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{provider.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{provider.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-3">About</h3>
            <p className="text-gray-600">{provider.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Services</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {provider.services.map((service, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span className="text-gray-600">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-primary text-white px-6 py-2 rounded-md font-medium">Contact Provider</button>
        </div>
      </div>
    </main>
  )
}

