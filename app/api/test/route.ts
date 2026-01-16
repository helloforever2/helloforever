import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection by counting users
    const userCount = await prisma.user.count();

    return NextResponse.json({
      message: "Database connected",
      userCount,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
