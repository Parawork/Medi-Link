"use client";

import Link from "next/link";
import React from "react";

type Pharmacy = {
  id: string;
  name: string;
  logo?: string;
  phone: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  verified: boolean;
};

type Props = {
  pharmacy: Pharmacy;
};

const PharmacyCard: React.FC<Props> = ({ pharmacy }) => {
  return (
    <Link href={`/site/patient/${encodeURIComponent(pharmacy.name)}`}>
      <div className="w-full px-4 py-5 bg-gradient-to-br ">
        <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-md border border-gray-300 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {pharmacy.logo ? (
              <img
                src={pharmacy.logo}
                alt={`${pharmacy.name} logo`}
                className="h-24 w-24 object-cover rounded-2xl border shadow-md"
              />
            ) : (
              <div className="h-24 w-24 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-600 font-semibold text-sm shadow-inner">
                No Logo
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {pharmacy.name}
                </h2>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    pharmacy.verified
                      ? "bg-emerald-200 text-emerald-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {pharmacy.verified ? "✅ Verified" : "❌ Not Verified"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm">
                <p>
                  <span className="font-medium text-gray-600">📞 Phone:</span>{" "}
                  {pharmacy.phone}
                </p>
                <div>
                  <span className="font-medium text-gray-600">📍 Address:</span>
                  <br />
                  {pharmacy.streetAddress}, {pharmacy.city},{" "}
                  {pharmacy.stateProvince}
                </div>
                <p>
                  <span className="font-medium text-gray-600">
                    📮 Postal Code:
                  </span>{" "}
                  {pharmacy.postalCode}
                </p>
                <p>
                  <span className="font-medium text-gray-600">🌍 Country:</span>{" "}
                  {pharmacy.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PharmacyCard;
