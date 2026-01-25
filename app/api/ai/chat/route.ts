import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse, getConversationByToken } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, message } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await getConversationByToken(accessToken);

    if (!conversation) {
      return NextResponse.json(
        { error: "Invalid or expired conversation" },
        { status: 404 }
      );
    }

    // Generate AI response
    const response = await generateChatResponse(conversation.id, message.trim());

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("AI chat error:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

// GET - Retrieve conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    const conversation = await getConversationByToken(accessToken);

    if (!conversation) {
      return NextResponse.json(
        { error: "Invalid or expired conversation" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        userName: conversation.recipient.user.name,
        userAvatar: conversation.recipient.user.avatar,
        recipientName: conversation.recipient.name,
        relationship: conversation.recipient.relationship,
        messages: conversation.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve conversation" },
      { status: 500 }
    );
  }
}
