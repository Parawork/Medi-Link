"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Define interfaces
type Pharmacy = {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  geoLocation: {
    latitude: number;
    longitude: number;
  };
  availability: string;
  distance?: string;
  openHours?: string;
};

interface MapComponentProps {
  latitude: number;
  longitude: number;
  size: number;
  medicationAvailability?: string;
}

// Helper function to generate random availability
const randomAvailability = () => {
  const options = ["High", "Medium", "Low"];
  return options[Math.floor(Math.random() * options.length)];
};

// Sample pharmacy data with random availability
// const SAMPLE_PHARMACIES: Omit<Pharmacy, "distance">[] = [
//   {
//     id: "1",
//     name: "City Pharmacy",
//     geoLocation: { latitude: 0, longitude: 0 },
//     streetAddress: "123 Main St",
//     city: "Downtown",
//     stateProvince: "",
//     postalCode: "",
//     country: "",
//     phone: "+1 (555) 123-4567",
//     availability: randomAvailability(),
//     openHours: "8:00 AM - 10:00 PM",
//     verified: true,
//   },
//   {
//     id: "2",
//     name: "Health Plus",
//     geoLocation: { latitude: 0, longitude: 0 },
//     streetAddress: "456 Oak Ave",
//     city: "Westside",
//     stateProvince: "",
//     postalCode: "",
//     country: "",
//     phone: "+1 (555) 987-6543",
//     availability: randomAvailability(),
//     openHours: "24 hours",
//     verified: true,
//   },
//   {
//     id: "3",
//     name: "MediCare",
//     geoLocation: { latitude: 0, longitude: 0 },
//     streetAddress: "789 Pine Rd",
//     city: "Northside",
//     stateProvince: "",
//     postalCode: "",
//     country: "",
//     phone: "+1 (555) 456-7890",
//     availability: randomAvailability(),
//     openHours: "9:00 AM - 9:00 PM",
//     verified: true,
//   },
//   {
//     id: "4",
//     name: "QuickRx Pharmacy",
//     geoLocation: { latitude: 0, longitude: 0 },
//     streetAddress: "321 Maple Dr",
//     city: "Eastside",
//     stateProvince: "",
//     postalCode: "",
//     country: "",
//     phone: "+1 (555) 234-5678",
//     availability: randomAvailability(),
//     openHours: "7:00 AM - 8:00 PM",
//     verified: true,
//   },
// ];

// Helper functions
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Format distance with improved readability
const formatDistance = (distance: number): string => {
  if (distance < 1) {
    // Less than 1km, show in meters with more precision
    return `${Math.round(distance * 1000)} m`;
  } else if (distance < 10) {
    // Medium distances with 1 decimal place
    return `${distance.toFixed(1)} km`;
  } else {
    // Longer distances with no decimal places
    return `${Math.round(distance)} km`;
  }
};

// Add estimated travel time based on distance
const estimateTravelTime = (distance: number): string => {
  // Walking speed ~5 km/h
  const walkingMinutes = Math.round((distance / 5) * 60);

  // Driving speed ~30 km/h in urban areas
  const drivingMinutes = Math.round((distance / 30) * 60);

  if (distance < 1) {
    return `~${walkingMinutes} min walk`;
  } else if (distance < 3) {
    return `~${walkingMinutes} min walk or ${drivingMinutes} min drive`;
  } else {
    return `~${drivingMinutes} min drive`;
  }
};

// Get color for availability badge
const getAvailabilityColor = (availability: string | undefined): string => {
  switch (availability) {
    case "High":
      return "#34a853"; // Green
    case "Medium":
      return "#fbbc05"; // Yellow
    case "Low":
      return "#ea4335"; // Red
    default:
      return "#a0a0a0"; // Gray
  }
};

// Helper function to format the address
const formatAddress = (pharmacy: Pharmacy): string => {
  return `${pharmacy.streetAddress}, ${pharmacy.city}, ${pharmacy.stateProvince}, ${pharmacy.postalCode}, ${pharmacy.country}`;
};

// Add this mapping to handle different availability formats
const normalizeAvailability = (availability: any): string => {
  if (!availability) return randomAvailability();

  // If it's already a string value
  if (typeof availability === "string") {
    if (["High", "Medium", "Low"].includes(availability)) {
      return availability;
    }
    // Parse other string formats
    if (availability.toLowerCase().includes("high")) return "High";
    if (availability.toLowerCase().includes("medium")) return "Medium";
    if (availability.toLowerCase().includes("low")) return "Low";
  }

  // If it's an array (from Prisma schema), use the first one or generate
  if (Array.isArray(availability) && availability.length > 0) {
    const status = availability[0].status;
    if (status) return status;
  }

  // Default to random
  return randomAvailability();
};

const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  size,
  medicationAvailability,
}) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showOpenOnly, setShowOpenOnly] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const hasLoadedPharmacies = useRef(false);

  // Load pharmacies only once
  useEffect(() => {
    if (!latitude || !longitude || hasLoadedPharmacies.current) return;

    async function fetchPharmacies() {
      try {
        const res = await fetch("/api/pharmacy");
        const data = await res.json();

        if (data && data.length > 0) {
          // Transform API data to ensure it has all required fields
          const processedData = data.map((pharmacy: any) => ({
            ...pharmacy,
            availability: pharmacy.quality || randomAvailability(),
            openHours: pharmacy.openHours || "9:00 AM - 6:00 PM",
            geoLocation: pharmacy.geoLocation || {
              latitude: latitude + (Math.random() - 0.5) * 0.05,
              longitude: longitude + (Math.random() - 0.5) * 0.05,
            },
          }));

          const pharmaciesWithDistances = addDistancesToPharmacies(
            processedData,
            latitude,
            longitude
          );
          setPharmacies(pharmaciesWithDistances);
        } else {
          // Create sample data if API returns empty
          createSamplePharmacies();
        }
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error);
        // Create sample data if API fails
        createSamplePharmacies();
      } finally {
        setLoading(false);
        hasLoadedPharmacies.current = true;
      }
    }

    fetchPharmacies();
  }, [latitude, longitude]);

  // Function to add distances to pharmacies
  const addDistancesToPharmacies = (
    pharmacyList: Pharmacy[],
    userLat: number,
    userLng: number
  ) => {
    return pharmacyList
      .map((pharmacy) => {
        const pharmacyLat =
          pharmacy.geoLocation?.latitude ||
          userLat + (Math.random() - 0.5) * 0.05;
        const pharmacyLng =
          pharmacy.geoLocation?.longitude ||
          userLng + (Math.random() - 0.5) * 0.05;

        const distance = calculateDistance(
          userLat,
          userLng,
          pharmacyLat,
          pharmacyLng
        );

        return {
          ...pharmacy,
          geoLocation: {
            latitude: pharmacyLat,
            longitude: pharmacyLng,
          },
          distance: formatDistance(distance),
        };
      })
      .sort((a, b) => {
        const distA = parseDistanceValue(a.distance || "0 km");
        const distB = parseDistanceValue(b.distance || "0 km");
        return distA - distB;
      });
  };

  // Function to create sample pharmacy data
  function createSamplePharmacies() {
    if (!latitude || !longitude) return;

    // Helper to create a random point at a specific distance
    const createPointAtDistance = (distance: number) => {
      const angle = Math.random() * 2 * Math.PI;
      const latOffset = (distance / 111) * Math.cos(angle);
      const lngOffset =
        (distance / (111 * Math.cos(latitude * (Math.PI / 180)))) *
        Math.sin(angle);

      return {
        latitude: latitude + latOffset,
        longitude: longitude + lngOffset,
      };
    };

    const samplePharmacies = [
      {
        id: "1",
        name: "City Pharmacy",
        streetAddress: "123 Main St",
        city: "Downtown",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 123-4567",
        availability: randomAvailability(),
        openHours: "8:00 AM - 10:00 PM",
        verified: true,
        geoLocation: createPointAtDistance(0.5), // Very close (0.5 km)
      },
      {
        id: "2",
        name: "Health Plus",
        streetAddress: "456 Oak Ave",
        city: "Westside",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 987-6543",
        availability: randomAvailability(),
        openHours: "24 hours",
        verified: true,
        geoLocation: createPointAtDistance(1.8), // Medium distance (1.8 km)
      },
      {
        id: "3",
        name: "MediCare",
        streetAddress: "789 Pine Rd",
        city: "Northside",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 456-7890",
        availability: randomAvailability(),
        openHours: "9:00 AM - 9:00 PM",
        verified: true,
        geoLocation: createPointAtDistance(3.5), // Further away (3.5 km)
      },
      {
        id: "4",
        name: "QuickRx Pharmacy",
        streetAddress: "321 Maple Dr",
        city: "Eastside",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 234-5678",
        availability: randomAvailability(),
        openHours: "7:00 AM - 8:00 PM",
        verified: true,
        geoLocation: createPointAtDistance(5.2), // Quite far (5.2 km)
      },
      {
        id: "5",
        name: "Community Drugs",
        streetAddress: "555 Elm St",
        city: "Southside",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 765-4321",
        availability: randomAvailability(),
        openHours: "8:30 AM - 7:00 PM",
        verified: true,
        geoLocation: createPointAtDistance(2.3), // Moderate distance (2.3 km)
      },
      {
        id: "6",
        name: "Metro Pharmacy",
        streetAddress: "789 Central Ave",
        city: "Midtown",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 321-9876",
        availability: randomAvailability(),
        openHours: "9:00 AM - 8:00 PM",
        verified: true,
        geoLocation: createPointAtDistance(7.8), // Far away (7.8 km)
      },
      {
        id: "7",
        name: "Neighborhood Pharmacy",
        streetAddress: "123 Residential Blvd",
        city: "Suburb",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 444-3333",
        availability: randomAvailability(),
        openHours: "8:00 AM - 6:00 PM",
        verified: true,
        geoLocation: createPointAtDistance(10.5), // Very far (10.5 km)
      },
      {
        id: "8",
        name: "University Medical Supply",
        streetAddress: "456 Campus Dr",
        city: "College Area",
        stateProvince: "",
        postalCode: "",
        country: "",
        phone: "+1 (555) 222-1111",
        availability: randomAvailability(),
        openHours: "7:30 AM - 9:00 PM",
        verified: true,
        geoLocation: createPointAtDistance(0.8), // Close (0.8 km)
      },
    ];

    const pharmaciesWithDistances = addDistancesToPharmacies(
      samplePharmacies,
      latitude,
      longitude
    );
    setPharmacies(pharmaciesWithDistances);
  }

  // Filtered pharmacies based on search and open status
  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatAddress(pharmacy).toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by medication availability if provided
    const matchesAvailability =
      !medicationAvailability ||
      normalizeAvailability(pharmacy.availability) === medicationAvailability;

    if (showOpenOnly) {
      // Check if pharmacy is currently open based on openHours
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      // Simple check if pharmacy is open 24 hours
      if (pharmacy.openHours?.toLowerCase().includes("24 hours")) {
        return matchesSearch && matchesAvailability;
      }

      // For other hours, we'll assume they're open if they have hours listed
      // This is a simplified approach - in a real app, you'd parse the hours properly
      return (
        matchesSearch &&
        matchesAvailability &&
        pharmacy.openHours &&
        pharmacy.openHours.length > 0
      );
    }

    return matchesSearch && matchesAvailability;
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    // Workaround for SSR and Leaflet compatibility
    if (typeof window !== "undefined") {
      // Create map instance
      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([latitude, longitude], size);

      setMapInstance(map);

      // Add tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(map);

      // Add zoom controls
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add user marker
      const userIcon = L.divIcon({
        html: `<div class="bg-[#4285F4] rounded-full h-4 w-4 relative shadow-[0_0_0_2px_white]">
                <div class="bg-[#4285F4]/30 rounded-full h-[30px] w-[30px] absolute -top-[7px] -left-[7px] animate-pulse"></div>
              </div>`,
        className: "user-location",
        iconSize: [20, 20],
      });

      const userMarker = L.marker([latitude, longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>Your Location</b>");

      (userMarker as any)._isUserMarker = true;
      userMarker.openPopup();

      // Add pharmacy markers
      if (pharmacies.length > 0) {
        addPharmacyMarkers(map);
      }

      // Cleanup
      return () => {
        map.remove();
        setMapInstance(null);
      };
    }
  }, [latitude, longitude, size]);

  // Function to add pharmacy markers to map
  const addPharmacyMarkers = useCallback(
    (map: L.Map | null) => {
      if (!map || !map._container || pharmacies.length === 0) return;

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && !(layer as any)._isUserMarker) {
          map.removeLayer(layer);
        }
      });

      // Add new markers
      pharmacies.forEach((pharmacy) => {
        const pharmacyIcon = L.divIcon({
          html: `<div class="bg-white rounded-full h-9 w-9 flex items-center justify-center shadow-md text-2xl">💊</div>`,
          className: "pharmacy-icon",
          iconSize: [36, 36],
        });

        const lat = pharmacy.geoLocation?.latitude ?? latitude;
        const lng = pharmacy.geoLocation?.longitude ?? longitude;

        try {
          L.marker([lat, lng], { icon: pharmacyIcon })
            .addTo(map)
            .bindPopup(
              `
            <div class="font-sans">
              <div class="font-semibold text-base mb-1">${pharmacy.name}</div>
              <div class="text-sm text-gray-600 mb-1.5">${formatAddress(
                pharmacy
              )}</div>
              <div class="text-sm text-[#4285F4] font-medium">${
                pharmacy.distance
              } away</div>
            </div>
          `
            )
            .on("click", () => {
              setSelectedPharmacy(pharmacy);
            });
        } catch (error) {
          console.error("Error adding marker:", error);
        }
      });
    },
    [pharmacies, latitude, longitude]
  );

  // Update markers when pharmacies change
  useEffect(() => {
    if (mapInstance && pharmacies.length > 0) {
      // Use a small delay to ensure the map is fully initialized
      const timer = setTimeout(() => {
        if (mapInstance && mapInstance._container) {
          addPharmacyMarkers(mapInstance);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mapInstance, pharmacies, addPharmacyMarkers]);

  // Reset selection when user changes view
  useEffect(() => {
    setSelectedPharmacy(null);
  }, [size]);

  // Helper function to parse distance value from string (either km or m format)
  const parseDistanceValue = (distanceStr: string): number => {
    if (distanceStr.includes("km")) {
      return parseFloat(distanceStr.replace(" km", ""));
    } else if (distanceStr.includes("m")) {
      return parseFloat(distanceStr.replace(" m", "")) / 1000;
    }
    return 0;
  };

  // Handle pharmacy selection
  const handleSelectPharmacy = useCallback(
    (pharmacy: Pharmacy) => {
      setSelectedPharmacy(pharmacy);
      if (mapInstance) {
        mapInstance.setView(
          [pharmacy.geoLocation.latitude, pharmacy.geoLocation.longitude],
          size
        );
      }
    },
    [mapInstance, size]
  );

  // Handle "view all" to reset map view
  const handleViewAll = useCallback(() => {
    setSelectedPharmacy(null);
    if (mapInstance && latitude && longitude) {
      mapInstance.setView([latitude, longitude], size);
    }
  }, [mapInstance, latitude, longitude, size]);

  return (
    <div className="mb-5 font-sans">
      <div className="flex h-[60vh] gap-5 mt-2.5">
        {/* Left sidebar with pharmacy list */}
        <div className="flex-none w-120 bg-white rounded-2xl p-5 shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="m-0 text-[22px] text-gray-800 font-semibold">
              Nearby Pharmacies
            </h2>
            <div
              className="text-sm text-[#4285f4] cursor-pointer font-medium hover:underline"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {filterOpen ? "Hide Filters" : "Show Filters"}
            </div>
          </div>

          {filterOpen && (
            <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search pharmacies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm"
                />
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-sm">
                  🔍
                </div>
              </div>

              <div className="flex gap-2">
                <div
                  className={`flex-1 text-center py-2 px-2 rounded-md text-sm cursor-pointer border transition-colors ${
                    !showOpenOnly
                      ? "bg-blue-50 text-blue-600 border-blue-200 font-medium"
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  }`}
                  onClick={() => setShowOpenOnly(false)}
                >
                  All
                </div>
                <div
                  className={`flex-1 text-center py-2 px-2 rounded-md text-sm cursor-pointer border transition-colors ${
                    showOpenOnly
                      ? "bg-blue-50 text-blue-600 border-blue-200 border-blue-200 font-medium"
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  }`}
                  onClick={() => setShowOpenOnly(true)}
                >
                  Open
                </div>
              </div>
            </div>
          )}

          <p className="m-0 mb-4 text-gray-500 text-sm">
            Found {filteredPharmacies.length}{" "}
            {filteredPharmacies.length === 1 ? "pharmacy" : "pharmacies"} near
            you
          </p>

          <div className="flex flex-col gap-3.5">
            {filteredPharmacies.length > 0 ? (
              filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className={`flex items-start gap-3.5 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md ${
                    selectedPharmacy?.id === pharmacy.id
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 border border-transparent hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectPharmacy(pharmacy)}
                >
                  <div className="bg-white w-10 h-10 flex items-center justify-center rounded-lg text-2xl shadow-sm">
                    💊
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="m-0 mb-1 text-base font-semibold truncate pr-2">
                        {pharmacy.name}
                      </h3>
                      <div
                        className="text-xs py-0.5 px-1.5 rounded text-white font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: getAvailabilityColor(
                            normalizeAvailability(pharmacy.availability)
                          ),
                        }}
                      >
                        {normalizeAvailability(pharmacy.availability)}
                      </div>
                    </div>
                    <p className="m-0 mb-2 text-sm text-gray-600 leading-tight truncate">
                      {pharmacy.streetAddress}
                    </p>
                    <div className="flex justify-between text-xs">
                      <div className="flex flex-col text-[#4285f4] font-medium">
                        <span className="whitespace-nowrap">
                          {pharmacy.distance} away
                        </span>
                        <span className="font-normal text-[11px] text-gray-500 mt-0.5 whitespace-nowrap">
                          {estimateTravelTime(
                            parseDistanceValue(pharmacy.distance || "0 km")
                          )}
                        </span>
                      </div>
                      <div className="text-gray-500 whitespace-nowrap">
                        {pharmacy.openHours}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No pharmacies found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Main map area */}
        <div className="flex-1 relative">
          <div
            id="map"
            ref={mapRef}
            className="h-full rounded-xl shadow-lg"
          ></div>

          <div className="absolute bottom-5 left-5 z-[1000]">
            <div className="bg-white/90 py-2 px-3 rounded-lg shadow-md flex gap-3.5">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4285f4] text-white text-[10px] font-bold">
                  You
                </div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow text-sm">
                  💊
                </div>
                <span>Pharmacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected pharmacy details panel */}
      {selectedPharmacy && (
        <div
          className="bg-white rounded-2xl p-5 mt-5 shadow-lg cursor-pointer"
          onClick={(e) => {
            // Only navigate if not clicking on a button
            if (!(e.target as HTMLElement).closest("button")) {
              window.location.href = `/site/patient/${selectedPharmacy.name}`;
            }
          }}
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="m-0 mb-2 text-[22px] font-semibold">
                {selectedPharmacy.name}
              </h2>
              <div
                className="inline-block py-1 px-2.5 rounded-md text-sm font-medium text-white"
                style={{
                  backgroundColor: getAvailabilityColor(
                    normalizeAvailability(selectedPharmacy.availability)
                  ),
                }}
              >
                Availability:{" "}
                {normalizeAvailability(selectedPharmacy.availability)}
              </div>
            </div>
            <button
              className="bg-gray-100 border-none text-2xl w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation(); // Stop event from propagating to parent
                handleViewAll();
              }}
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="flex items-start gap-3">
              <div className="text-2xl w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                📍
              </div>
              <div className="min-w-0">
                <span className="block text-sm text-gray-500 mb-1">
                  Address
                </span>
                <div className="text-base text-gray-800 font-medium truncate">
                  {selectedPharmacy.streetAddress}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                🚶
              </div>
              <div className="min-w-0">
                <span className="block text-sm text-gray-500 mb-1">
                  Distance
                </span>
                <div className="text-base text-gray-800 font-medium">
                  {selectedPharmacy.distance}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {estimateTravelTime(
                    parseDistanceValue(selectedPharmacy.distance || "0 km")
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                🕒
              </div>
              <div className="min-w-0">
                <span className="block text-sm text-gray-500 mb-1">Hours</span>
                <div className="text-base text-gray-800 font-medium truncate">
                  {selectedPharmacy.openHours}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                📞
              </div>
              <div className="min-w-0">
                <span className="block text-sm text-gray-500 mb-1">Phone</span>
                <div className="text-base text-gray-800 font-medium truncate">
                  {selectedPharmacy.phone}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop event from propagating to parent
                window.open(
                  `https://maps.google.com/maps?q=${selectedPharmacy.geoLocation.latitude},${selectedPharmacy.geoLocation.longitude}`,
                  "_blank"
                );
              }}
              className="bg-[#4285f4] text-white w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-transform duration-200 hover:bg-[#3b78e7] hover:translate-y-[-2px] hover:shadow-lg"
            >
              <span className="text-xl">🧭</span> Get Directions
            </button>

            <Link
              href={`/site/patient/uploadPrescription/${selectedPharmacy.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#34a853] text-white rounded-lg text-base font-medium transition-transform duration-200 hover:bg-[#2e9549] hover:translate-y-[-2px] hover:shadow-lg"
            >
              <button className="w-full h-full">Upload Prescription</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
