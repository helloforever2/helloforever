import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createConversation } from "@/lib/ai";

// POST - Start a new conversation (called when recipient wants to chat)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // Get the message to find recipient and user
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        recipient: true,
        user: {
          select: {
            id: true,
            plan: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Check if user has premium (AI features require premium)
    if (message.user.plan === "FREE") {
      return NextResponse.json(
        { error: "AI Conversation requires a premium subscription" },
        { status: 403 }
      );
    }

    // Create or get existing conversation
    const accessToken = await createConversation(
      message.recipientId,
      message.userId
    );

    return NextResponse.json({
      success: true,
      accessToken,
      chatUrl: `/chat/${accessToken}`,
    });
  } catch (error) {
    console.error("Start conversation error:", error);
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 }
    );
  }
}
