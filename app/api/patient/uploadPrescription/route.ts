import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const user = await requireUser("PATIENT");
    if (!user || user.role !== "PATIENT" || !user.patient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request body
    const body = await request.json();
    const { patientId, pharmacyId, fileUrl } = body;

    if (!patientId || !pharmacyId || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Verify patient matches logged-in user
    if (patientId !== user.patient.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 4. Verify pharmacy exists
    const pharmacyExists = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
      select: { id: true },
    });

    if (!pharmacyExists) {
      return NextResponse.json(
        { error: "Pharmacy not found" },
        { status: 404 }
      );
    }

    // 5. Create prescription record
    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        pharmacyId,
        fileUrl,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
        pharmacy: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    // 6. Return success response
    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error("[PRESCRIPTIONS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
