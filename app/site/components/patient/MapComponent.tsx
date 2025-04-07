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
}) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
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
            availability: pharmacy.availability || randomAvailability(),
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

  // Filtered pharmacies based on search
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatAddress(pharmacy).toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        html: `<div class="user-marker"><div class="pulse"></div></div>`,
        className: "user-location",
        iconSize: [20, 20],
      });

      const userMarker = L.marker([latitude, longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>Your Location</b>");

      (userMarker as any)._isUserMarker = true;
      userMarker.openPopup();

      // Add styles
      const style = document.createElement("style");
      style.innerHTML = `
        .user-marker {
          background-color: #4285F4;
          border-radius: 50%;
          height: 16px;
          width: 16px;
          position: relative;
          box-shadow: 0 0 0 2px white;
        }
        .pulse {
          background-color: rgba(66, 133, 244, 0.3);
          border-radius: 50%;
          height: 30px;
          width: 30px;
          position: absolute;
          top: -7px;
          left: -7px;
          animation: pulse 2s infinite;
        }
        .pharmacy-marker {
          font-size: 22px;
          text-align: center;
          width: 36px;
          height: 36px;
          line-height: 36px;
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        /* Custom popup styles */
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .leaflet-popup-content {
          margin: 10px 14px;
          line-height: 1.5;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #666;
          padding: 8px 10px 0 0;
        }
        /* Zoom control */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
        }
        .leaflet-control-zoom a {
          background-color: white !important;
          color: #333 !important;
        }
      `;
      document.head.appendChild(style);

      // Add pharmacy markers
      if (pharmacies.length > 0) {
        addPharmacyMarkers(map);
      }

      // Cleanup
      return () => {
        map.remove();
        document.head.removeChild(style);
        setMapInstance(null);
      };
    }
  }, [latitude, longitude, size]);

  // Function to add pharmacy markers to map
  const addPharmacyMarkers = useCallback(
    (map: L.Map) => {
      if (!map || pharmacies.length === 0) return;

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && !(layer as any)._isUserMarker) {
          map.removeLayer(layer);
        }
      });

      // Add new markers
      pharmacies.forEach((pharmacy) => {
        const pharmacyIcon = L.divIcon({
          html: `<div class="pharmacy-marker">💊</div>`,
          className: "pharmacy-icon",
          iconSize: [36, 36],
        });

        const lat = pharmacy.geoLocation?.latitude ?? latitude;
        const lng = pharmacy.geoLocation?.longitude ?? longitude;

        L.marker([lat, lng], { icon: pharmacyIcon })
          .addTo(map)
          .bindPopup(
            `
          <div style="font-family: system-ui, sans-serif;">
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${
              pharmacy.name
            }</div>
            <div style="font-size: 13px; color: #666; margin-bottom: 6px;">${formatAddress(
              pharmacy
            )}</div>
            <div style="font-size: 13px; color: #4285F4; font-weight: 500;">${
              pharmacy.distance
            } away</div>
          </div>
        `
          )
          .on("click", () => {
            setSelectedPharmacy(pharmacy);
          });
      });
    },
    [pharmacies, latitude, longitude]
  );

  // Update markers when pharmacies change
  useEffect(() => {
    if (mapInstance && pharmacies.length > 0) {
      addPharmacyMarkers(mapInstance);
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
    <div className="map-container">
      <div className="map-layout">
        {/* Left sidebar with pharmacy list */}
        <div className="pharmacy-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Nearby Pharmacies</h2>
            <div
              className="filter-toggle"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {filterOpen ? "Hide Filters" : "Show Filters"}
            </div>
          </div>

          {filterOpen && (
            <div className="filter-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search pharmacies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="search-icon">🔍</div>
              </div>

              <div className="filter-options">
                <div className="filter-option selected">All</div>
                <div className="filter-option">Open</div>
              </div>
            </div>
          )}

          <p className="subtitle">
            Found {filteredPharmacies.length} pharmacies near you
          </p>

          <div className="pharmacy-list">
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className={`pharmacy-card ${
                  selectedPharmacy?.id === pharmacy.id ? "selected" : ""
                }`}
                onClick={() => handleSelectPharmacy(pharmacy)}
              >
                <div className="pharmacy-card-icon">💊</div>
                <div className="pharmacy-details">
                  <div className="pharmacy-header">
                    <h3>{pharmacy.name}</h3>
                    <div
                      className="availability-badge"
                      style={{
                        backgroundColor: getAvailabilityColor(
                          normalizeAvailability(pharmacy.availability)
                        ),
                      }}
                    >
                      {normalizeAvailability(pharmacy.availability)}
                    </div>
                  </div>
                  <p className="pharmacy-address">{pharmacy.streetAddress}</p>
                  <div className="pharmacy-footer">
                    <p className="pharmacy-distance">
                      {pharmacy.distance} away
                      <span className="travel-time">
                        {estimateTravelTime(
                          parseDistanceValue(pharmacy.distance || "0 km")
                        )}
                      </span>
                    </p>
                    <p className="pharmacy-hours">{pharmacy.openHours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main map area */}
        <div className="map-area">
          <div
            id="map"
            ref={mapRef}
            style={{
              height: "100%",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          ></div>

          <div className="map-overlay">
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-icon user">You</div>
                <span>Your Location</span>
              </div>
              <div className="legend-item">
                <div className="legend-icon pharmacy">💊</div>
                <span>Pharmacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected pharmacy details panel */}
      {selectedPharmacy && (
        <div
          className="pharmacy-details-panel"
          onClick={(e) => {
            // Only navigate if not clicking on a button
            if (!(e.target as HTMLElement).closest("button")) {
              window.location.href = `/site/patient/${selectedPharmacy.name}`;
            }
          }}
        >
          <div className="details-header">
            <div>
              <h2>{selectedPharmacy.name}</h2>
              <div
                className="availability"
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
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation(); // Stop event from propagating to parent
                handleViewAll();
              }}
            >
              ×
            </button>
          </div>

          <div className="details-content">
            <div className="detail-item">
              <div className="detail-icon">📍</div>
              <div>
                <span className="detail-label">Address</span>
                <div className="detail-value">
                  {selectedPharmacy.streetAddress}
                </div>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">🚶</div>
              <div>
                <span className="detail-label">Distance</span>
                <div className="detail-value">{selectedPharmacy.distance}</div>
                <div className="detail-travel-time">
                  {estimateTravelTime(
                    parseDistanceValue(selectedPharmacy.distance || "0 km")
                  )}
                </div>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">🕒</div>
              <div>
                <span className="detail-label">Hours</span>
                <div className="detail-value">{selectedPharmacy.openHours}</div>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">📞</div>
              <div>
                <span className="detail-label">Phone</span>
                <div className="detail-value">{selectedPharmacy.phone}</div>
              </div>
            </div>
          </div>

          <div className="details-actions">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop event from propagating to parent
                window.open(
                  `https://maps.google.com/maps?q=${selectedPharmacy.geoLocation.latitude},${selectedPharmacy.geoLocation.longitude}`,
                  "_blank"
                );
              }}
              className="directions-btn"
            >
              <span className="btn-icon">🧭</span> Get Directions
            </button>
            {/* <button
              className="call-btn"
              onClick={(e) => {
                e.stopPropagation(); // Stop event from propagating to parent
                window.open(`tel:${selectedPharmacy.phone}`, "_blank");
              }}
            >
              <span className="btn-icon">📞</span> Call Pharmacy
            </button> */}
            <Link
              href={`/site/patient/uploadPrescription/${selectedPharmacy.id}`}
              className="call-btn"
            >
              <button className="call-btn">Upload Prescription</button>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .map-container {
          position: relative;
          margin-bottom: 20px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }
        .map-layout {
          display: flex;
          height: 60vh;
          gap: 20px;
          margin-top: 10px;
        }
        .pharmacy-sidebar {
          flex: 0 0 320px;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow-y: auto;
          height: 100%;
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .sidebar-title {
          margin: 0;
          font-size: 22px;
          color: #333;
          font-weight: 600;
        }
        .filter-toggle {
          font-size: 13px;
          color: #4285f4;
          cursor: pointer;
          font-weight: 500;
        }
        .filter-toggle:hover {
          text-decoration: underline;
        }
        .filter-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .search-box {
          position: relative;
          margin-bottom: 12px;
        }
        .search-box input {
          width: 100%;
          padding: 10px 36px 10px 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
        }
        .search-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
        }
        .filter-options {
          display: flex;
          gap: 8px;
        }
        .filter-option {
          flex: 1;
          text-align: center;
          padding: 8px;
          background: white;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          border: 1px solid #eee;
        }
        .filter-option.selected {
          background: #e8f0fe;
          color: #1a73e8;
          border-color: #c2dbff;
          font-weight: 500;
        }
        .subtitle {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }
        .pharmacy-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pharmacy-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: 12px;
          background: #f9f9f9;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .pharmacy-card:hover {
          background: #f3f3f3;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .pharmacy-card.selected {
          background: #e8f0fe;
          border: 1px solid #c2dbff;
        }
        .pharmacy-card-icon {
          background: white;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 22px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .pharmacy-details {
          flex: 1;
        }
        .pharmacy-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .pharmacy-details h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }
        .availability-badge {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          color: white;
          font-weight: 500;
        }
        .pharmacy-address {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #666;
          line-height: 1.4;
        }
        .pharmacy-footer {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }
        .pharmacy-distance {
          margin: 0;
          color: #4285f4;
          font-weight: 500;
          display: flex;
          flex-direction: column;
        }
        .travel-time {
          font-size: 11px;
          font-weight: normal;
          color: #666;
          margin-top: 2px;
        }
        .pharmacy-hours {
          margin: 0;
          color: #666;
        }
        .map-area {
          flex: 1;
          height: 100%;
          position: relative;
        }
        .map-overlay {
          position: absolute;
          bottom: 20px;
          left: 20px;
          z-index: 1000;
        }
        .map-legend {
          background: rgba(255, 255, 255, 0.9);
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 14px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }
        .legend-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 14px;
        }
        .legend-icon.user {
          background: #4285f4;
          color: white;
          font-size: 10px;
          font-weight: bold;
        }
        .legend-icon.pharmacy {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .pharmacy-details-panel {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-top: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .details-header h2 {
          margin: 0 0 8px 0;
          font-size: 22px;
          font-weight: 600;
        }
        .availability {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: white;
        }
        .close-btn {
          background: #f3f3f3;
          border: none;
          font-size: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #666;
          line-height: 1;
        }
        .close-btn:hover {
          background: #e5e5e5;
        }
        .details-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .detail-icon {
          font-size: 20px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .detail-label {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }
        .detail-value {
          font-size: 15px;
          color: #333;
          font-weight: 500;
        }
        .detail-travel-time {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }
        .details-actions {
          display: flex;
          gap: 12px;
        }
        .directions-btn,
        .call-btn {
          flex: 1;
          border: none;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .directions-btn {
          background: #4285f4;
          color: white;
        }
        .directions-btn:hover {
          background: #3b78e7;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
        }
        .call-btn {
          background: #34a853;
          color: white;
        }
        .call-btn:hover {
          background: #2e9549;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(52, 168, 83, 0.3);
        }
        .btn-icon {
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
