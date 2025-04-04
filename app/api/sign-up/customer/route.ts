import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/utils/db";
import { z } from "zod";

const signupSchema = z
  .object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(1, "Phone number too short"),
    dateOfBirth: z.string().min(1),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
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
    role: z.enum(["PATIENT", "PHARMACY"]),
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

    const { confirmPassword, role, ...data } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
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

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create base user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          phone: data.phone,
          role: role,
        },
      });

      // Create patient profile
      const patient = await prisma.patient.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          dateOfBirth: dateOfBirthAsDate,
          gender: data.gender,
          streetAddress: data.streetAddress,
          city: data.city,
          stateProvince: data.stateProvince,
          postalCode: data.postalCode,
          country: data.country,
          medicalConditions: data.medicalConditions,
          allergies: data.allergies,
        },
      });

      return { user, patient };
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        profile: {
          fullName: result.patient.fullName,
        },
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
