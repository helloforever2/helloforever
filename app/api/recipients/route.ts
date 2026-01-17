import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { Relationship } from "@prisma/client";

// POST /api/recipients - Create a new recipient
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, phone, relationship, birthday, avatar } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate relationship enum
    const validRelationships = ["CHILD", "SPOUSE", "PARENT", "SIBLING", "FRIEND", "OTHER"];
    if (relationship && !validRelationships.includes(relationship)) {
      return NextResponse.json(
        { error: "Invalid relationship type" },
        { status: 400 }
      );
    }

    // Check if recipient with this email already exists for this user
    const existingRecipient = await prisma.recipient.findFirst({
      where: {
        userId: session.user.id,
        email: email.toLowerCase(),
      },
    });

    if (existingRecipient) {
      return NextResponse.json(
        { error: "A recipient with this email already exists" },
        { status: 409 }
      );
    }

    // Create recipient
    const recipient = await prisma.recipient.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        relationship: (relationship as Relationship) || "OTHER",
        birthday: birthday ? new Date(birthday) : null,
        avatar: avatar || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Recipient created successfully", data: recipient },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create recipient error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/recipients - Fetch user's recipients
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const recipients = await prisma.recipient.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to include messageCount at top level
    const recipientsWithCount = recipients.map((recipient) => ({
      ...recipient,
      messageCount: recipient._count.messages,
      _count: undefined,
    }));

    return NextResponse.json({ recipients: recipientsWithCount });
  } catch (error) {
    console.error("Fetch recipients error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
