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
      })
      .safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { prescriptionId, items } = validation.data;

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
          totalAmount,
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

      // Add any additional business logic here
      // Example: Send notification to patient

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

// export async function GET(request: Request) {
//   try {
//     const user = await requireUser("PHARMACY");

//     if (!user.pharmacy) {
//       return NextResponse.json(
//         { error: "Pharmacy profile not found" },
//         { status: 403 }
//       );
//     }

//     const { searchParams } = new URL(request.url);

//     // Add pagination parameters
//     const page = parseInt(searchParams.get("page") || "1") || 1;
//     const limit = parseInt(searchParams.get("limit") || "10") || 10;
//     const skip = (page - 1) * limit;

//     // Add filtering options
//     const patientId = searchParams.get("patientId");
//     const status = searchParams.get("status");
//     const dateFrom = searchParams.get("dateFrom");
//     const dateTo = searchParams.get("dateTo");

//     // Build where clause
//     const where: any = { pharmacyId: user.pharmacy.id };

//     if (patientId) {
//       where.patientId = patientId;
//     }

//     if (status) {
//       where.status = status;
//     }

//     if (dateFrom || dateTo) {
//       where.createdAt = {};
//       if (dateFrom) where.createdAt.gte = new Date(dateFrom);
//       if (dateTo) where.createdAt.lte = new Date(dateTo);
//     }

//     const [orders, totalCount] = await Promise.all([
//       prisma.order.findMany({
//         where,
//         include: {
//           items: true,
//           Patient: {
//             include: {
//               user: {
//                 select: {
//                   email: true,
//                   phone: true,
//                   username: true,
//                 },
//               },
//             },
//           },
//           pharmacy: true,
//           prescription: true,
//           payment: true,
//           delivery: true,
//         },
//         orderBy: { createdAt: "desc" },
//         skip,
//         take: limit,
//       }),
//       prisma.order.count({ where }),
//     ]);

//     return NextResponse.json({
//       data: orders,
//       pagination: {
//         total: totalCount,
//         page,
//         limit,
//         totalPages: Math.ceil(totalCount / limit),
//       },
//     });
//   } catch (error) {
//     console.error("[ORDERS_GET]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch orders. Please try again." },
//       { status: 500 }
//     );
//   }
// }
