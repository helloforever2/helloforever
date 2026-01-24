import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

// GET - Fetch user's trustee
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trustee = await prisma.trustee.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ trustee });
  } catch (error) {
    console.error("Get trustee error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trustee" },
      { status: 500 }
    );
  }
}

// POST - Create or update trustee
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, relationship } = body;

    if (!name || !email || !relationship) {
      return NextResponse.json(
        { error: "Name, email, and relationship are required" },
        { status: 400 }
      );
    }

    // Upsert trustee (create or update)
    const trustee = await prisma.trustee.upsert({
      where: { userId: session.user.id },
      update: {
        name,
        email: email.toLowerCase(),
        relationship,
      },
      create: {
        userId: session.user.id,
        name,
        email: email.toLowerCase(),
        relationship,
      },
    });

    return NextResponse.json({
      message: "Trustee saved successfully",
      trustee,
    });
  } catch (error) {
    console.error("Save trustee error:", error);
    return NextResponse.json(
      { error: "Failed to save trustee" },
      { status: 500 }
    );
  }
}

// DELETE - Remove trustee
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.trustee.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: "Trustee removed successfully" });
  } catch (error) {
    console.error("Delete trustee error:", error);
    return NextResponse.json(
      { error: "Failed to remove trustee" },
      { status: 500 }
    );
  }
}
