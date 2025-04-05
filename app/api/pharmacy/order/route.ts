import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await requireUser("PHARMACY");

    if (!user || user.role !== "PHARMACY" || !user.pharmacy) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prescriptionId, items } = body;

    if (!prescriptionId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify prescription exists and belongs to a patient
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { Patient: true },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (total: number, item: { price: number; quantity: number }) =>
        total + item.price * item.quantity,
      0
    );

    // Create the order
    const order = await prisma.order.create({
      data: {
        pharmacyId: user.pharmacy.id,
        patientId: prescription.Patient.id,
        prescriptionId: prescription.id,
        totalAmount,
        items: {
          create: items.map(
            (item: { name: string; price: number; quantity: number }) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })
          ),
        },
      },
      include: {
        items: true,
        Patient: true,
        pharmacy: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await requireUser("PHARMACY");

    if (!user || !["PHARMACY", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get("pharmacyId");
    const patientId = searchParams.get("patientId");

    let where = {};

    if (user.role === "PHARMACY" && user.pharmacy) {
      where = { pharmacyId: user.pharmacy.id };
    } else if (pharmacyId) {
      where = { pharmacyId };
    }

    if (patientId) {
      where = { ...where, patientId };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        Patient: {
          include: {
            user: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
        pharmacy: true,
        prescription: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
