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

// export async function GET(request: Request) {
//   try {
//     // 1. Authenticate user
//     const user = await getCurrentUser();
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // 2. Set up query parameters
//     const { searchParams } = new URL(request.url);
//     const patientId = searchParams.get('patientId');
//     const pharmacyId = searchParams.get('pharmacyId');

//     // 3. Build query conditions based on user role
//     let where: any = {};

//     if (user.role === 'PATIENT' && user.patient) {
//       where.patientId = user.patient.id;
//     } else if (patientId) {
//       where.patientId = patientId;
//     }

//     if (pharmacyId) {
//       where.pharmacyId = pharmacyId;
//     }

//     // 4. Fetch prescriptions
//     const prescriptions = await prisma.prescription.findMany({
//       where,
//       include: {
//         patient: {
//           include: {
//             user: {
//               select: {
//                 email: true,
//                 phone: true,
//               }
//             }
//           }
//         },
//         pharmacy: {
//           select: {
//             name: true,
//             phone: true,
//             streetAddress: true,
//             city: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     // 5. Return results
//     return NextResponse.json(prescriptions);

//   } catch (error) {
//     console.error('[PRESCRIPTIONS_GET]', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
