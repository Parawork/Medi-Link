import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";

export async function GET() {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      select: {
        id: true,
        name: true,
        streetAddress: true,
        city: true,
        stateProvince: true,
        postalCode: true,
        country: true,
        phone: true,
        verified: true,
        quality: true,
        geoLocation: {
          select: {
            latitude: true,
            longitude: true,
          },
        },
        availability: {
          select: {
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
            isOpen: true,
          },
        },
      },
    });

    return NextResponse.json(pharmacies);
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return NextResponse.json(
      { error: "Failed to fetch pharmacies" },
      { status: 500 }
    );
  }
}
