import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const user = await requireUser("PHARMACY");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // If there's an existing logo and it's being changed, delete the old one from Cloudinary
    if (data.logo) {
      const existingPharmacy = await prisma.pharmacy.findUnique({
        where: { id: user.pharmacy?.id },
      });

      if (existingPharmacy?.logo && existingPharmacy.logo !== data.logo) {
        try {
          const publicId = existingPharmacy.logo
            .split("/")
            .pop()
            ?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error("Error deleting old logo from Cloudinary:", error);
        }
      }
    }

    const updatedPharmacy = await prisma.pharmacy.update({
      where: { id: user.pharmacy?.id },
      data: {
        name: data.name,
        phone: data.phone,
        streetAddress: data.streetAddress,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
        country: data.country,
        licenseNumber: data.licenseNumber,
        logo: data.logo,
      },
    });

    return NextResponse.json(updatedPharmacy);
  } catch (error) {
    console.error("Error updating pharmacy:", error);
    return NextResponse.json(
      { error: "Failed to update pharmacy data" },
      { status: 500 }
    );
  }
}
