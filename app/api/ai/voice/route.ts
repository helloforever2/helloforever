import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cloneVoice, deleteVoice, getVoiceInfo } from "@/lib/voice";
import { getSession } from "@/lib/auth";

// POST - Clone voice from audio samples
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has premium (voice cloning requires premium)
    if (user.plan === "FREE") {
      return NextResponse.json(
        { error: "Voice Preservation requires a premium subscription" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const audioFiles = formData.getAll("audio") as File[];

    if (audioFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one audio file is required" },
        { status: 400 }
      );
    }

    // Convert Files to buffers
    const audioBuffers = await Promise.all(
      audioFiles.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        filename: file.name,
      }))
    );

    // Clone the voice using ElevenLabs
    const voiceId = await cloneVoice(
      `${user.name} - HelloForever`,
      `Voice preservation for ${user.name} on HelloForever`,
      audioBuffers
    );

    // Update user with the new voice ID
    await prisma.user.update({
      where: { id: user.id },
      data: {
        voiceId,
        voiceEnabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      voiceId,
      message: "Voice successfully preserved!",
    });
  } catch (error) {
    console.error("Voice cloning error:", error);
    return NextResponse.json(
      { error: "Failed to preserve voice" },
      { status: 500 }
    );
  }
}

// GET - Get user's voice status
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        voiceId: true,
        voiceEnabled: true,
        plan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let voiceInfo = null;
    if (user.voiceId) {
      try {
        voiceInfo = await getVoiceInfo(user.voiceId);
      } catch {
        // Voice may have been deleted on ElevenLabs side
        voiceInfo = null;
      }
    }

    return NextResponse.json({
      hasVoice: !!user.voiceId,
      voiceEnabled: user.voiceEnabled,
      voiceInfo,
      canUseVoice: user.plan !== "FREE",
    });
  } catch (error) {
    console.error("Get voice status error:", error);
    return NextResponse.json(
      { error: "Failed to get voice status" },
      { status: 500 }
    );
  }
}

// DELETE - Remove user's preserved voice
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.voiceId) {
      return NextResponse.json(
        { error: "No voice to delete" },
        { status: 400 }
      );
    }

    // Delete from ElevenLabs
    try {
      await deleteVoice(user.voiceId);
    } catch {
      // Continue even if ElevenLabs deletion fails
      console.warn("Failed to delete voice from ElevenLabs");
    }

    // Remove from user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        voiceId: null,
        voiceEnabled: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Voice removed successfully",
    });
  } catch (error) {
    console.error("Delete voice error:", error);
    return NextResponse.json(
      { error: "Failed to delete voice" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle voice enabled status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { enabled } = body;

    const user = await prisma.user.update({
      where: { email: session.email },
      data: { voiceEnabled: enabled },
    });

    return NextResponse.json({
      success: true,
      voiceEnabled: user.voiceEnabled,
    });
  } catch (error) {
    console.error("Toggle voice error:", error);
    return NextResponse.json(
      { error: "Failed to update voice settings" },
      { status: 500 }
    );
  }
}
