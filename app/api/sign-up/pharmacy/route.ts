import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/utils/db";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Ensure the upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploadedFiles");
const UPLOAD_PATH_PREFIX = "/uploadedFiles";

const signupSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string(),
    phone: z.string().min(1),
    streetAddress: z.string().min(1),
    city: z.string().min(1),
    stateProvince: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    username: z.string().min(1).max(20),
    licenseNumber: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jsonData = Object.fromEntries(formData.entries());

    // Validate input
    const validationResult = signupSchema.safeParse(jsonData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { confirmPassword, ...data } = validationResult.data;
    const licenseFile = formData.get("licenseFile") as File | null;

    // Validate file
    if (!licenseFile) {
      return NextResponse.json(
        { error: "License file is required" },
        { status: 400 }
      );
    }

    // Check if pharmacy already exists
    const existingPharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
          { licenseNumber: data.licenseNumber },
        ],
      },
    });

    if (existingPharmacy) {
      let errorField = "";
      if (existingPharmacy.email === data.email) errorField = "email";
      if (existingPharmacy.username === data.username) errorField = "username";
      if (existingPharmacy.licenseNumber === data.licenseNumber)
        errorField = "license number";

      return NextResponse.json(
        { error: `Pharmacy with this ${errorField} already exists` },
        { status: 409 }
      );
    }

    // Process file upload
    const bytes = await licenseFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExt = path.extname(licenseFile.name);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    const publicUrl = `${UPLOAD_PATH_PREFIX}/${fileName}`;

    // Save file to public/uploads directory
    await writeFile(filePath, buffer);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create pharmacy in database
    const pharmacy = await prisma.pharmacy.create({
      data: {
        ...data,
        password: hashedPassword,
        licenseFile: publicUrl,
        verified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        verified: true,
        licenseNumber: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        pharmacy,
        message: "Pharmacy registered successfully! Awaiting verification.",
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
