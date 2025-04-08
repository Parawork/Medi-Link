"use client";
import React, { useState } from "react";

const UploadLocation = ({ pharmacyId }: { pharmacyId: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleUpdateLocation = async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setSubmitError("Geolocation is not supported by your browser");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const response = await fetch("/api/pharmacy/geolocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          pharmacyId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save location");
      }

      setSubmitSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "GeolocationPositionError") {
          const geoError = error as unknown as GeolocationPositionError;
          switch (geoError.code) {
            case 1:
              setSubmitError(
                "Please allow location access in your browser settings"
              );
              break;
            case 2:
              setSubmitError("Location information is unavailable");
              break;
            case 3:
              setSubmitError("Location request timed out");
              break;
            default:
              setSubmitError("An error occurred while getting your location");
          }
        } else {
          setSubmitError(error.message);
        }
      } else {
        setSubmitError("Failed to update location");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-location">
      <h2 className="text-xl font-bold mb-4">Location</h2>{" "}
      <p className="text-sm text-gray-500 mb-4">
        You must in your pharmacy to update your location
      </p>
      <div className="space-y-4">
        <button
          onClick={handleUpdateLocation}
          disabled={isSubmitting}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? "Updating Location..." : "Update Location"}
        </button>

        {submitError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}

        {submitSuccess && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">
              Location updated successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadLocation;
