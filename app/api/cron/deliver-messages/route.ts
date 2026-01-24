import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// This endpoint should be called by a cron job (e.g., Vercel Cron)
// It checks for scheduled messages that are due and marks them as delivered

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended for security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find all scheduled messages where the scheduled date has passed
    const messagesToDeliver = await prisma.message.findMany({
      where: {
        status: "SCHEDULED",
        deliveryType: "SPECIFIC_DATE",
        scheduledDate: {
          lte: now,
        },
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const deliveredMessages = [];

    for (const message of messagesToDeliver) {
      // In a real implementation, you would send an email here
      // using a service like SendGrid, Resend, or AWS SES
      //
      // Example:
      // await sendEmail({
      //   to: message.recipient.email,
      //   subject: `A message from ${message.user.name}`,
      //   body: generateMessageEmail(message),
      // });

      // Mark the message as delivered
      await prisma.message.update({
        where: { id: message.id },
        data: {
          status: "DELIVERED",
          deliveredAt: now,
        },
      });

      deliveredMessages.push({
        id: message.id,
        title: message.title,
        recipientEmail: message.recipient.email,
      });

      console.log(`Delivered message "${message.title}" to ${message.recipient.email}`);
    }

    return NextResponse.json({
      success: true,
      delivered: deliveredMessages.length,
      messages: deliveredMessages,
    });
  } catch (error) {
    console.error("Deliver messages error:", error);
    return NextResponse.json(
      { error: "Failed to deliver messages" },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
