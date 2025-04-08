import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for order item validation
const OrderItemSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser("PHARMACY");

    if (!user.pharmacy) {
      return NextResponse.json(
        { error: "Pharmacy profile not found" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = z
      .object({
        prescriptionId: z.string().min(1, "Prescription ID is required"),
        items: z.array(OrderItemSchema).min(1, "At least one item is required"),
        notes: z.string().optional(),
      })
      .safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { prescriptionId, items, notes } = validation.data;

    // Verify prescription exists and belongs to this pharmacy
    const prescription = await prisma.prescription.findUnique({
      where: {
        id: prescriptionId,
        pharmacyId: user.pharmacy.id,
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
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found or not authorized" },
        { status: 404 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create transaction for order creation
    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          pharmacyId: user.pharmacy!.id,
          patientId: prescription.patient.id,
          prescriptionId: prescription.id,
          status: "ACCEPTED",
          totalAmount,
          notes: notes || "",
          items: {
            create: items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
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
      });

      return order;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
