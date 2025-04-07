"use client";

import React, { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(
  () => import("../../components/patient/MapComponent"),
  { ssr: false } // This prevents server-side rendering
);

export default function Page() {
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  const [distance, setDistance] = useState<number>(5); // Default distance in km
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [medicationAvailability, setMedicationAvailability] =
    useState<string>("High"); // Default availability

  const handleDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(event.target.value));
  };

  const handleAvailabilityChange = (level: string) => {
    setMedicationAvailability(level);
  };

  useEffect(() => {
    // Only access browser APIs on the client side
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        // Hide initial loading animation after getting coordinates
        setTimeout(() => setIsInitialLoad(false), 800);
      });
    }
  }, []);

  const calculateZoomLevel = (distance: number): number => {
    const a = 16.5; // Base zoom level (close to max zoom)
    const b = 1.85; // Rate of zoom decrease
    const zoomLevel = a - b * Math.log(distance + 0.2);
    const roundedZoom = Math.round(zoomLevel * 2) / 2;
    return Math.max(11, Math.min(16, roundedZoom));
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Decorative elements - reduced opacity */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[40%] bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-teal-100 rounded-full blur-3xl"></div>
      </div>

      {/* Initial loading animation overlay */}
      {isInitialLoad && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center flex-col">
          <div className="relative w-24 h-24">
            <div className="absolute w-full h-full rounded-full border-t-4 border-blue-500 animate-spin"></div>
            <div className="absolute w-full h-full rounded-full border-r-4 border-transparent border-dashed animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-blue-700 font-medium animate-pulse">
            Locating Pharmacies Near You
          </p>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10 min-h-screen flex flex-col">
        {/* Header with clean design */}
        <div className="mb-6 relative">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">
                  Find Nearby Pharmacies
                </h1>
                <p className="text-gray-500 mt-1 max-w-xl">
                  Locate medication close to you with real-time availability
                  information
                </p>
              </div>
            </div>

            {/* Always visible search area - removed conditional hiding */}
            <div className="mt-5">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Search Options
                      </h3>
                      <p className="text-sm text-gray-500">
                        Customize your pharmacy search
                      </p>
                    </div>
                  </div>

                  {coordinates.latitude && (
                    <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Location Active
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Search Radius
                      </label>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                        {distance} km
                      </div>
                    </div>

                    {/* Simplified slider */}
                    <div className="h-12 relative flex items-center">
                      <div className="absolute inset-0 rounded-lg bg-gray-200 shadow-inner"></div>
                      <div
                        className="absolute left-0 top-0 bottom-0 rounded-lg bg-blue-400 transition-all ease-out duration-300"
                        style={{
                          width: `${(distance / 20) * 100}%`,
                          opacity: 0.8,
                        }}
                      ></div>

                      <input
                        type="range"
                        id="distance"
                        name="distance"
                        min="1"
                        max="20"
                        value={distance}
                        onChange={handleDistanceChange}
                        className="relative w-full h-2 appearance-none bg-transparent z-10 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:border-blue-600 active:[&::-webkit-slider-thumb]:scale-110 transition-all duration-150"
                      />

                      <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-500 px-2 py-1">
                        <span>1</span>
                        <span>5</span>
                        <span>10</span>
                        <span>15</span>
                        <span>20</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Medication Availability
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["High", "Medium", "Low"].map((level, index) => (
                        <div
                          key={level}
                          className="relative"
                          onClick={() => handleAvailabilityChange(level)}
                        >
                          <div
                            className={`p-3 rounded-lg flex flex-col items-center border ${
                              medicationAvailability === level
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white"
                            } shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full mb-1 ${
                                index === 0
                                  ? "bg-green-500"
                                  : index === 1
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span className="text-xs font-medium text-gray-800">
                              {level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area - cleaner design */}
        <div className="flex-grow mb-6 relative">
          <div className="rounded-xl overflow-hidden relative h-[150vh]">
            {/* Map View */}
            <div className="absolute inset-0">
              {coordinates.latitude !== null &&
              coordinates.longitude !== null ? (
                <MapComponent
                  longitude={coordinates.longitude}
                  latitude={coordinates.latitude}
                  size={calculateZoomLevel(distance)}
                  medicationAvailability={medicationAvailability}
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute w-20 h-20 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                    <div className="absolute w-20 h-20 rounded-full border-4 border-transparent border-b-blue-300 animate-pulse opacity-75"></div>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Locating your position...
                  </p>
                  <p className="text-gray-500 text-sm max-w-xs text-center">
                    Please enable location access to find pharmacies near you
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
