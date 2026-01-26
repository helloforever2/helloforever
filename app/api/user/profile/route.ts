import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Get user profile
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthday: true,
        avatar: true,
        plan: true,
        storageUsed: true,
        messageCount: true,
        voiceId: true,
        voiceEnabled: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, birthday } = body;

    // Validate name
    if (name !== undefined && (!name || name.trim().length < 2)) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: {
      name?: string;
      phone?: string | null;
      birthday?: Date | null;
    } = {};

    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone || null;
    if (birthday !== undefined) {
      updateData.birthday = birthday ? new Date(birthday) : null;
    }

    const user = await prisma.user.update({
      where: { email: session.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthday: true,
        avatar: true,
        plan: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
