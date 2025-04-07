// components/PharmacyCard.tsx
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, ArrowRight } from "lucide-react";

export default function PharmacyCard({ pharmacy }: { pharmacy: any }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="p-5">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 relative rounded-full overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm">
            <Image
              src={pharmacy.logo || "/images/default-pharmacy.png"}
              alt={pharmacy.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {pharmacy.name}
            </h3>

            <div className="space-y-1.5">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p>{pharmacy.streetAddress}</p>
                  <p>
                    {pharmacy.city}, {pharmacy.stateProvince}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">{pharmacy.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t px-5 py-3 bg-gray-50">
        <Link
          href={`/site/patient/uploadPrescription/${pharmacy.id}`}
          className="text-sm font-medium text-blue-900 flex items-center justify-between group"
        >
          <span>View Pharmacy</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
