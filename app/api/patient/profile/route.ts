// app/api/patient/profile/route.ts

import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const user = await requireUser("PATIENT");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Handle avatar cleanup if changing
    if (data.avatar) {
      const existingPatient = await prisma.patient.findUnique({
        where: { id: user.patient?.id },
      });

      if (existingPatient?.avatar && existingPatient.avatar !== data.avatar) {
        try {
          const publicId = existingPatient.avatar
            .split("/")
            .pop()
            ?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error("Error deleting old avatar from Cloudinary:", error);
        }
      }
    }

    // Handle geolocation update or creation
    let geoLocationData = {};
    if (data.geoLocation) {
      geoLocationData = {
        geoLocation: {
          upsert: {
            create: {
              lat: data.geoLocation.lat,
              lng: data.geoLocation.lng,
            },
            update: {
              lat: data.geoLocation.lat,
              lng: data.geoLocation.lng,
            },
          },
        },
      };
      delete data.geoLocation;
    }

    // Explicitly exclude dateOfBirth from updates
    const { dateOfBirth, ...updateData } = data;

    const updatedPatient = await prisma.patient.update({
      where: { id: user.patient?.id },
      data: {
        ...updateData,
        ...geoLocationData,
      },
      include: {
        geoLocation: true,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient data" },
      { status: 500 }
    );
  }
}
