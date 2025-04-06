"use client";
import React, { useEffect, useState, useCallback } from "react";
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
const SAMPLE_PHARMACIES: Omit<Pharmacy, "distance">[] = [
  {
    id: "1",
    name: "City Pharmacy",
    geoLocation: { latitude: 0, longitude: 0 },
    streetAddress: "123 Main St",
    city: "Downtown",
    stateProvince: "",
    postalCode: "",
    country: "",
    phone: "+1 (555) 123-4567",
    availability: randomAvailability(),
    openHours: "8:00 AM - 10:00 PM",
    verified: true,
  },
  {
    id: "2",
    name: "Health Plus",
    geoLocation: { latitude: 0, longitude: 0 },
    streetAddress: "456 Oak Ave",
    city: "Westside",
    stateProvince: "",
    postalCode: "",
    country: "",
    phone: "+1 (555) 987-6543",
    availability: randomAvailability(),
    openHours: "24 hours",
    verified: true,
  },
  {
    id: "3",
    name: "MediCare",
    geoLocation: { latitude: 0, longitude: 0 },
    streetAddress: "789 Pine Rd",
    city: "Northside",
    stateProvince: "",
    postalCode: "",
    country: "",
    phone: "+1 (555) 456-7890",
    availability: randomAvailability(),
    openHours: "9:00 AM - 9:00 PM",
    verified: true,
  },
  {
    id: "4",
    name: "QuickRx Pharmacy",
    geoLocation: { latitude: 0, longitude: 0 },
    streetAddress: "321 Maple Dr",
    city: "Eastside",
    stateProvince: "",
    postalCode: "",
    country: "",
    phone: "+1 (555) 234-5678",
    availability: randomAvailability(),
    openHours: "7:00 AM - 8:00 PM",
    verified: true,
  },
];

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

const formatDistance = (distance: number): string => {
  return distance < 1
    ? `${Math.round(distance * 1000)} m`
    : `${distance.toFixed(1)} km`;
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

  useEffect(() => {
    async function fetchPharmacies() {
      try {
        const res = await fetch("/api/pharmacy"); // adjust to your API route
        const data = await res.json();
        setPharmacies(data);
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPharmacies();
  }, []);

  // Filtered pharmacies based on search
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatAddress(pharmacy).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selection when user changes view
  useEffect(() => {
    setSelectedPharmacy(null);
  }, [size]);

  // Generate pharmacies with calculated distances
  useEffect(() => {
    if (!latitude || !longitude) return;

    console.log("Calculating distances from:", latitude, longitude);

    // Use either API data or sample data if API failed
    const basePharmacies =
      pharmacies.length > 0 ? pharmacies : SAMPLE_PHARMACIES;

    const newPharmacies = basePharmacies.map((pharmacy) => {
      // Generate realistic offsets if needed (for demo/sample data)
      let pharmacyLat, pharmacyLng;

      if (pharmacy.geoLocation?.latitude && pharmacy.geoLocation?.longitude) {
        // Use existing coordinates if they exist
        pharmacyLat = pharmacy.geoLocation.latitude;
        pharmacyLng = pharmacy.geoLocation.longitude;
      } else {
        // Generate random coordinates for demo purposes
        const distance = 0.5 + Math.random() * 2.5;
        const angle = Math.random() * 2 * Math.PI;

        // Convert polar to cartesian coordinates (approximately)
        const latOffset = (distance / 111) * Math.cos(angle);
        const lngOffset =
          (distance / (111 * Math.cos(latitude * (Math.PI / 180)))) *
          Math.sin(angle);

        pharmacyLat = latitude + latOffset;
        pharmacyLng = longitude + lngOffset;
      }

      // Calculate actual distance between user and pharmacy
      const actualDistance = calculateDistance(
        latitude,
        longitude,
        pharmacyLat,
        pharmacyLng
      );

      console.log(
        `Distance to ${pharmacy.name}: ${actualDistance.toFixed(2)} km`
      );

      // Return pharmacy with updated coordinates and distance
      return {
        ...pharmacy,
        geoLocation: {
          latitude: pharmacyLat,
          longitude: pharmacyLng,
        },
        distance: formatDistance(actualDistance),
      };
    });

    // Sort by distance (closest first)
    newPharmacies.sort((a, b) => {
      // Handle different unit formats correctly
      const distA = a.distance!.includes("km")
        ? parseFloat(a.distance!.replace(" km", ""))
        : parseFloat(a.distance!.replace(" m", "")) / 1000;

      const distB = b.distance!.includes("km")
        ? parseFloat(b.distance!.replace(" km", ""))
        : parseFloat(b.distance!.replace(" m", "")) / 1000;

      return distA - distB;
    });

    console.log(
      "Processed pharmacies:",
      newPharmacies.map((p) => `${p.name}: ${p.distance}`)
    );
    setPharmacies(newPharmacies);
  }, [latitude, longitude]);

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

  // Initialize map
  useEffect(() => {
    // Create map instance
    const map = L.map("map", {
      zoomControl: false, // We'll add custom zoom controls
    }).setView([latitude, longitude], size);
    setMapInstance(map);

    // Add tile layer with a more modern map style
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Add zoom controls to bottom right
    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    // Add user marker with pulsing effect
    const userIcon = L.divIcon({
      html: `<div class="user-marker"><div class="pulse"></div></div>`,
      className: "user-location",
      iconSize: [20, 20],
    });

    const userMarker = L.marker([latitude, longitude], { icon: userIcon })
      .addTo(map)
      .bindPopup("<b>Your Location</b>");

    // Store a reference to identify this as user marker
    (userMarker as any)._isUserMarker = true;
    userMarker.openPopup();

    // Add styles for markers and custom elements
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

    // Cleanup
    return () => {
      map.remove();
      document.head.removeChild(style);
      setMapInstance(null);
    };
  }, [latitude, longitude, size]);

  // Add pharmacy markers whenever pharmacies change
  useEffect(() => {
    if (!mapInstance || pharmacies.length === 0) return;

    // Clear existing markers
    mapInstance.eachLayer((layer) => {
      if (layer instanceof L.Marker && !(layer as any)._isUserMarker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Add pharmacy markers
    pharmacies.forEach((pharmacy) => {
      const pharmacyIcon = L.divIcon({
        html: `<div class="pharmacy-marker">💊</div>`,
        className: "pharmacy-icon",
        iconSize: [36, 36],
      });

      // Default to Kurunegala coordinates if geoLocation is null
      const lat = pharmacy.geoLocation?.latitude ?? 7.4847;
      const lng = pharmacy.geoLocation?.longitude ?? 80.3667;

      L.marker([lat, lng], { icon: pharmacyIcon })
        .addTo(mapInstance)
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
  }, [mapInstance, pharmacies]);

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
                          pharmacy.availability
                        ),
                      }}
                    >
                      {"Incoming"}
                    </div>
                  </div>
                  <p className="pharmacy-address">{pharmacy.streetAddress}</p>
                  <div className="pharmacy-footer">
                    <p className="pharmacy-distance">
                      {pharmacy.distance} away
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
        <div className="pharmacy-details-panel">
          <div className="details-header">
            <div>
              <h2>{selectedPharmacy.name}</h2>
              <div
                className="availability"
                style={{
                  backgroundColor: getAvailabilityColor(
                    selectedPharmacy.availability
                  ),
                }}
              >
                Availability: {selectedPharmacy.availability}
              </div>
            </div>
            <button className="close-btn" onClick={handleViewAll}>
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
              onClick={() =>
                window.open(
                  `https://maps.google.com/maps?q=${selectedPharmacy.geoLocation.latitude},${selectedPharmacy.geoLocation.longitude}`,
                  "_blank"
                )
              }
              className="directions-btn"
            >
              <span className="btn-icon">🧭</span> Get Directions
            </button>
            <button className="call-btn">
              <span className="btn-icon">📞</span> Call Pharmacy
            </button>
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
