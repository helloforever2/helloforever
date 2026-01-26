import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUploadUrl, getPublicUrl, generateMediaKey } from "@/lib/s3";

/**
 * Generate a presigned URL for uploading media files
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, contentType, type } = body;

    if (!messageId || !contentType || !type) {
      return NextResponse.json(
        { error: "messageId, contentType, and type are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["video", "audio"].includes(type)) {
      return NextResponse.json(
        { error: "type must be 'video' or 'audio'" },
        { status: 400 }
      );
    }

    // Validate content type
    const validVideoTypes = ["video/webm", "video/mp4", "video/quicktime"];
    const validAudioTypes = ["audio/webm", "audio/mpeg", "audio/mp4", "audio/wav"];
    const validTypes = type === "video" ? validVideoTypes : validAudioTypes;

    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { error: `Invalid content type for ${type}` },
        { status: 400 }
      );
    }

    // Determine file extension from content type
    const extensionMap: Record<string, string> = {
      "video/webm": "webm",
      "video/mp4": "mp4",
      "video/quicktime": "mov",
      "audio/webm": "webm",
      "audio/mpeg": "mp3",
      "audio/mp4": "m4a",
      "audio/wav": "wav",
    };
    const extension = extensionMap[contentType] || "webm";

    // Generate unique key and presigned URL
    const key = generateMediaKey(session.userId, messageId, type, extension);
    const uploadUrl = await getUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("Upload URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
