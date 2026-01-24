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

// PUT /api/recipients - Update a recipient
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, email, phone, relationship, birthday } = body;

    if (!id) {
      return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 });
    }

    // Verify the recipient belongs to the user
    const existingRecipient = await prisma.recipient.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingRecipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const validRelationships = ["CHILD", "SPOUSE", "PARENT", "SIBLING", "FRIEND", "OTHER"];

    const recipient = await prisma.recipient.update({
      where: { id },
      data: {
        name: name?.trim() || existingRecipient.name,
        email: email?.toLowerCase().trim() || existingRecipient.email,
        phone: phone?.trim() || null,
        relationship: validRelationships.includes(relationship) ? relationship : existingRecipient.relationship,
        birthday: birthday ? new Date(birthday) : existingRecipient.birthday,
      },
    });

    return NextResponse.json({ message: "Recipient updated", recipient });
  } catch (error) {
    console.error("Update recipient error:", error);
    return NextResponse.json({ error: "Failed to update recipient" }, { status: 500 });
  }
}

// DELETE /api/recipients - Delete a recipient
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 });
    }

    // Verify the recipient belongs to the user
    const existingRecipient = await prisma.recipient.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingRecipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    await prisma.recipient.delete({ where: { id } });

    return NextResponse.json({ message: "Recipient deleted successfully" });
  } catch (error) {
    console.error("Delete recipient error:", error);
    return NextResponse.json({ error: "Failed to delete recipient" }, { status: 500 });
  }
}
