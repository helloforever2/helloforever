import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearSession();

    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
