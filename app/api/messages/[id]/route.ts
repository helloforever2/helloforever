import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

// GET /api/messages/[id] - Get a single message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = await prisma.message.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
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
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Get message error:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

// PUT /api/messages/[id] - Update a message
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingMessage = await prisma.message.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, scheduledDate, status } = body;

    const message = await prisma.message.update({
      where: { id: params.id },
      data: {
        title: title?.trim() || existingMessage.title,
        content: content !== undefined ? content : existingMessage.content,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : existingMessage.scheduledDate,
        status: status || existingMessage.status,
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

    return NextResponse.json({ message: "Message updated", data: message });
  } catch (error) {
    console.error("Update message error:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/[id] - Delete a message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingMessage = await prisma.message.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await prisma.message.delete({ where: { id: params.id } });

    // Decrement user's message count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { messageCount: { decrement: 1 } },
    });

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
