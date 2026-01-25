import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMessageDeliveryEmail } from "@/lib/email";

// This endpoint is called by Vercel Cron daily at 9am
// It checks for scheduled messages that are due and delivers them via email

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const results = {
      delivered: [] as { id: string; title: string; recipientEmail: string }[],
      failed: [] as { id: string; title: string; error: string }[],
    };

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

    console.log(`Found ${messagesToDeliver.length} messages to deliver`);

    for (const message of messagesToDeliver) {
      try {
        // Send email to recipient
        await sendMessageDeliveryEmail({
          recipientEmail: message.recipient.email,
          recipientName: message.recipient.name,
          senderName: message.user.name,
          messageTitle: message.title,
          messageId: message.id,
          messageType: message.type,
          note: message.note,
        });

        // Mark the message as delivered
        await prisma.message.update({
          where: { id: message.id },
          data: {
            status: "DELIVERED",
            deliveredAt: now,
          },
        });

        results.delivered.push({
          id: message.id,
          title: message.title,
          recipientEmail: message.recipient.email,
        });

        console.log(`✅ Delivered: "${message.title}" to ${message.recipient.email}`);
      } catch (error) {
        console.error(`❌ Failed to deliver "${message.title}":`, error);
        results.failed.push({
          id: message.id,
          title: message.title,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Also check for milestone-based messages (birthday deliveries)
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const milestoneMessages = await prisma.message.findMany({
      where: {
        status: "SCHEDULED",
        deliveryType: "MILESTONE",
        milestone: "BIRTHDAY",
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            birthday: true,
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

    for (const message of milestoneMessages) {
      // Check if today is the recipient's birthday
      if (message.recipient.birthday) {
        const birthday = new Date(message.recipient.birthday);
        const birthdayMonth = birthday.getMonth() + 1;
        const birthdayDay = birthday.getDate();

        if (birthdayMonth === todayMonth && birthdayDay === todayDay) {
          try {
            await sendMessageDeliveryEmail({
              recipientEmail: message.recipient.email,
              recipientName: message.recipient.name,
              senderName: message.user.name,
              messageTitle: message.title,
              messageId: message.id,
              messageType: message.type,
              note: message.note,
            });

            await prisma.message.update({
              where: { id: message.id },
              data: {
                status: "DELIVERED",
                deliveredAt: now,
              },
            });

            results.delivered.push({
              id: message.id,
              title: message.title,
              recipientEmail: message.recipient.email,
            });

            console.log(`🎂 Birthday delivery: "${message.title}" to ${message.recipient.email}`);
          } catch (error) {
            console.error(`❌ Failed birthday delivery "${message.title}":`, error);
            results.failed.push({
              id: message.id,
              title: message.title,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary: {
        delivered: results.delivered.length,
        failed: results.failed.length,
      },
      delivered: results.delivered,
      failed: results.failed,
    });
  } catch (error) {
    console.error("Deliver messages cron error:", error);
    return NextResponse.json(
      { error: "Failed to process message deliveries" },
      { status: 500 }
    );
  }
}

// Support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
