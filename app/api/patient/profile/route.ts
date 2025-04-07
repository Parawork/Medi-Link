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

    // Handle dateOfBirth
    // Convert ISO string to Date object for Prisma
    const dateOfBirth = data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : undefined;

    // If there's an existing avatar and it's being changed, you could delete the old one from Cloudinary
    if (data.avatar) {
      const existingPatient = await prisma.patient.findUnique({
        where: { userId: user.id },
      });

      if (existingPatient?.avatar && existingPatient.avatar !== data.avatar) {
        try {
          // Delete old avatar logic here if needed
          // Similar to what you've done with pharmacy logos
          const publicId = existingPatient.avatar
            .split("/")
            .pop()
            ?.split(".")[0];
          if (publicId) {
            // Uncomment if you have cloudinary configured
            // await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error("Error deleting old avatar from Cloudinary:", error);
        }
      }
    }

    console.log("Updating patient profile with data:", {
      ...data,
      dateOfBirth: dateOfBirth?.toISOString(),
    });

    const updatedPatient = await prisma.patient.update({
      where: { userId: user.id },
      data: {
        fullName: data.fullName,
        dateOfBirth: dateOfBirth, // Pass the Date object to Prisma
        gender: data.gender,
        avatar: data.avatar,
        streetAddress: data.streetAddress,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
        country: data.country,
        medicalConditions: data.medicalConditions,
        allergies: data.allergies,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient profile:", error);
    return NextResponse.json(
      { error: "Failed to update patient profile" },
      { status: 500 }
    );
  }
}
