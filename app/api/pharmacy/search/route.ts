import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const field = searchParams.get("field") || "name";

  try {
    let whereClause = {};

    if (query) {
      switch (field) {
        case "name":
          whereClause = {
            name: {
              contains: query,
              mode: "insensitive",
            },
          };
          break;
        case "city":
          whereClause = {
            city: {
              contains: query,
              mode: "insensitive",
            },
          };
          break;
        case "address":
          whereClause = {
            OR: [
              {
                streetAddress: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                city: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                stateProvince: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          };
          break;
        default:
          whereClause = {
            name: {
              contains: query,
              mode: "insensitive",
            },
          };
      }
    }

    const pharmacies = await prisma.pharmacy.findMany({
      where: {
        ...whereClause,
      },
      include: {
        geoLocation: true,
      },
      take: 20, // Limit results
    });

    return NextResponse.json(pharmacies);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search pharmacies" },
      { status: 500 }
    );
  }
}
