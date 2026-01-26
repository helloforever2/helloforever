import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { MessageType, DeliveryType, Milestone, MessageStatus } from "@prisma/client";

// POST /api/messages - Create a new message
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
    const {
      title,
      type,
      content,
      recipientId,
      deliveryType,
      scheduledDate,
      milestone,
      note,
      thumbnail,
      duration,
    } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!type || !["VIDEO", "AUDIO", "TEXT"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be VIDEO, AUDIO, or TEXT" },
        { status: 400 }
      );
    }

    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient is required" },
        { status: 400 }
      );
    }

    if (!deliveryType || !["SPECIFIC_DATE", "UPON_PASSING", "MILESTONE", "SURPRISE"].includes(deliveryType)) {
      return NextResponse.json(
        { error: "Delivery type is required" },
        { status: 400 }
      );
    }

    if (deliveryType === "SPECIFIC_DATE" && !scheduledDate) {
      return NextResponse.json(
        { error: "Scheduled date is required for specific date delivery" },
        { status: 400 }
      );
    }

    if (deliveryType === "MILESTONE" && !milestone) {
      return NextResponse.json(
        { error: "Milestone is required for milestone delivery" },
        { status: 400 }
      );
    }

    // Verify recipient belongs to user
    const recipient = await prisma.recipient.findFirst({
      where: {
        id: recipientId,
        userId: session.user.id,
      },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    // Check free tier limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, messageCount: true },
    });

    if (user?.plan === "FREE" && (user?.messageCount ?? 0) >= 2) {
      return NextResponse.json(
        { error: "Free tier limited to 2 messages. Please upgrade." },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        title: title.trim(),
        type: type as MessageType,
        content: content || null,
        thumbnail: thumbnail || null,
        duration: duration || null,
        recipientId,
        deliveryType: deliveryType as DeliveryType,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        milestone: milestone as Milestone || null,
        note: note || null,
        status: MessageStatus.SCHEDULED,
        userId: session.user.id,
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            relationship: true,
          },
        },
      },
    });

    // Update user message count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { messageCount: { increment: 1 } },
    });

    return NextResponse.json(
      { message: "Message created successfully", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create message error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// PATCH /api/messages - Update a message (e.g., add media URL after upload)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, content, thumbnail } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // Verify message belongs to user
    const existingMessage = await prisma.message.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Update message
    const updateData: { content?: string; thumbnail?: string } = {};
    if (content !== undefined) updateData.content = content;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    const message = await prisma.message.update({
      where: { id },
      data: updateData,
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            relationship: true,
          },
        },
      },
    });

    return NextResponse.json({ message: "Message updated successfully", data: message });
  } catch (error) {
    console.error("Update message error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/messages - Fetch user's messages
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { userId: session.user.id },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            relationship: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
