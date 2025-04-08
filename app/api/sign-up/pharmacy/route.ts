import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/utils/db";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(1, "Pharmacy name too short"),
    licenseNumber: z.string().min(1, "License number required"),
    streetAddress: z.string().min(1, "Address too short"),
    city: z.string().min(1, "City name too short"),
    stateProvince: z.string().min(1, "State/province too short"),
    postalCode: z.string().min(1, "Postal code too short"),
    country: z.string().min(1, "Country name too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number too short"),
    username: z.string().min(1, "Username must be at least 3 characters"),
    password: z.string().min(1, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["PATIENT", "PHARMACY", "ADMIN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form data
    const formDataObj = Object.fromEntries(formData.entries());
    const { confirmPassword, role, ...data } = formDataObj;

    // Validate input
    const validationResult = signupSchema.safeParse({
      ...data,
      confirmPassword,
      role: "PHARMACY", // Force role to be PHARMACY for this endpoint
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: data.email as string },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: data.username as string },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const existingPharmacyByLicense = await prisma.pharmacy.findUnique({
      where: { licenseNumber: data.licenseNumber as string },
    });

    if (existingPharmacyByLicense) {
      return NextResponse.json(
        { error: "License number already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password as string, 12);

    // Create user and pharmacy in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create base user
      const user = await prisma.user.create({
        data: {
          email: data.email as string,
          username: data.username as string,
          password: hashedPassword,
          phone: data.phone as string,
          role: "PHARMACY",
        },
      });

      // Create pharmacy profile
      const pharmacy = await prisma.pharmacy.create({
        data: {
          userId: user.id,
          name: data.name as string,
          phone: data.phone as string,
          licenseNumber: data.licenseNumber as string,
          streetAddress: data.streetAddress as string,
          city: data.city as string,
          stateProvince: data.stateProvince as string,
          postalCode: data.postalCode as string,
          country: data.country as string,
          verified: false, // Initially not verified
        },
      });

      return { user, pharmacy };
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        pharmacy: {
          name: result.pharmacy.name,
          licenseNumber: result.pharmacy.licenseNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pharmacy signup error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
