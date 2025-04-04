import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/utils/db";
import { z } from "zod";

const signupSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string(),
    phone: z.string().min(1, "Phone number too short"),
    dateOfBirth: z.string().min(1),

    gender: z.enum(["male", "female"]),
    streetAddress: z.string().min(1, "Address too short"),
    city: z.string().min(2, "City name too short"),
    stateProvince: z.string().min(1, "State/province too short"),
    postalCode: z.string().min(1, "Postal code too short"),
    country: z.string().min(1, "Country name too short"),
    medicalConditions: z.string().optional(),
    allergies: z.string().optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    // Validate input
    const validationResult = signupSchema.safeParse(requestData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { confirmPassword, ...data } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.pharmacy.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.patient.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const dateOfBirthAsDate = new Date(data.dateOfBirth);

    // Create user in database
    const customer = await prisma.patient.create({
      data: {
        ...data,
        dateOfBirth: dateOfBirthAsDate,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        // Only return non-sensitive fields
      },
    });

    return NextResponse.json(
      {
        success: true,
        customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
