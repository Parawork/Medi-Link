import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { latitude, longitude, pharmacyId } = body;

    if (!latitude || !longitude || !pharmacyId) {
      return NextResponse.json(
        { error: "Latitude, longitude, and pharmacyId are required" },
        { status: 400 }
      );
    }

    // Get the pharmacy associated with the user
    const pharmacy = await prisma.pharmacy.findUnique({
      where: {
        id: pharmacyId,
      },
    });

    if (!pharmacy) {
      return NextResponse.json(
        { error: "Pharmacy not found" },
        { status: 404 }
      );
    }

    let geoLocation;

    if (pharmacy.geoLocationId) {
      // Check if the pharmacy already has a geolocation
      const existingGeoLocation = await prisma.geoLocation.findFirst({
        where: {
          id: pharmacy.geoLocationId,
        },
      });

      if (existingGeoLocation) {
        // Update the existing geolocation
        geoLocation = await prisma.geoLocation.update({
          where: {
            id: existingGeoLocation.id,
          },
          data: {
            latitude,
            longitude,
          },
        });
      } else {
        // Create the new geolocation
        geoLocation = await prisma.$transaction(async (prisma) => {
          const newGeoLocation = await prisma.geoLocation.create({
            data: {
              latitude,
              longitude,
            },
          });

          // Update the pharmacy with the new geolocation
          await prisma.pharmacy.update({
            where: {
              id: pharmacyId,
            },
            data: {
              geoLocationId: newGeoLocation.id,
            },
          });

          return newGeoLocation;
        });
      }
    } else {
      // Create the new geolocation
      geoLocation = await prisma.$transaction(async (prisma) => {
        const newGeoLocation = await prisma.geoLocation.create({
          data: {
            latitude,
            longitude,
          },
        });

        // Update the pharmacy with the new geolocation
        await prisma.pharmacy.update({
          where: {
            id: pharmacyId,
          },
          data: {
            geoLocationId: newGeoLocation.id,
          },
        });

        return newGeoLocation;
      });
    }

    return NextResponse.json(geoLocation, { status: 201 });
  } catch (error) {
    console.error("Error creating geolocation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
