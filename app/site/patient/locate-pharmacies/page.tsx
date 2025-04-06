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

  const handleDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(event.target.value));
  };

  useEffect(() => {
    // Only access browser APIs on the client side
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    }
  }, []);

  const calculateZoomLevel = (distance: number): number => {
    // More precise logarithmic calculation optimized for 1-20km range
    // Base formula: zoomLevel = a - b * ln(distance)
    // where a and b are calibrated constants

    // Calibrated for mapping 1-20km to zoom levels 16-11
    const a = 16.5; // Base zoom level (close to max zoom)
    const b = 1.85; // Rate of zoom decrease

    // Apply natural logarithm with offset to handle small distances better
    const zoomLevel = a - b * Math.log(distance + 0.2);

    // Round to nearest 0.5 for smoother transitions
    const roundedZoom = Math.round(zoomLevel * 2) / 2;

    // Ensure zoom stays within practical bounds
    return Math.max(11, Math.min(16, roundedZoom));
  };

  return (
    <div className="container">
      <h1 className="page-title">Find Nearby Pharmacies</h1>

      <div className="distance-control">
        <label htmlFor="distance" className="distance-label">
          Search radius: <span className="distance-value">{distance} km</span>
        </label>
        <input
          type="range"
          id="distance"
          name="distance"
          min="1"
          max="20"
          value={distance}
          onChange={handleDistanceChange}
          className="distance-slider"
        />
      </div>

      <div className="map-wrapper">
        {coordinates.latitude !== null && coordinates.longitude !== null ? (
          <MapComponent
            longitude={coordinates.longitude}
            latitude={coordinates.latitude}
            size={calculateZoomLevel(distance)}
          />
        ) : (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Locating you and finding nearby pharmacies...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 0 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          margin: 24px 0;
          color: #333;
        }

        .distance-control {
          margin-bottom: 24px;
          background: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .distance-label {
          display: block;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .distance-value {
          color: #4285f4;
          font-weight: 600;
        }

        .distance-slider {
          width: 100%;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          -webkit-appearance: none;
        }

        .distance-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4285f4;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        .distance-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4285f4;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        .map-wrapper {
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 40px;
        }

        .loading-container {
          height: 75vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top: 4px solid #4285f4;
          border-radius: 50%;
          margin-bottom: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
