import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "HelloForever <noreply@helloforever.com>";
const APP_URL = process.env.NEXTAUTH_URL || "https://helloforever-main.vercel.app";

interface SendMessageEmailParams {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  messageTitle: string;
  messageId: string;
  messageType: "VIDEO" | "AUDIO" | "TEXT";
  note?: string | null;
}

export async function sendMessageDeliveryEmail({
  recipientEmail,
  recipientName,
  senderName,
  messageTitle,
  messageId,
  messageType,
  note,
}: SendMessageEmailParams) {
  const viewUrl = `${APP_URL}/view/${messageId}`;

  const messageTypeText = {
    VIDEO: "video message",
    AUDIO: "audio message",
    TEXT: "written message",
  }[messageType];

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You have a message from ${senderName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">💜</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                HelloForever
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 22px; font-weight: 600;">
                Dear ${recipientName},
              </h2>

              <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                ${senderName} has left a special ${messageTypeText} for you. This message was scheduled to be delivered to you today.
              </p>

              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Message Title
                </p>
                <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600;">
                  "${messageTitle}"
                </p>
              </div>

              ${note ? `
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 4px; color: #92400e; font-size: 14px; font-weight: 600;">
                  Personal Note:
                </p>
                <p style="margin: 0; color: #78350f; font-size: 14px; font-style: italic;">
                  "${note}"
                </p>
              </div>
              ` : ""}

              <a href="${viewUrl}" style="display: block; background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-align: center; margin-bottom: 24px;">
                View Your Message
              </a>

              <p style="margin: 0; color: #94a3b8; font-size: 14px; text-align: center;">
                This message was sent with love through HelloForever
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">
                Messages that last forever
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                © 2026 HelloForever. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Dear ${recipientName},

${senderName} has left a special ${messageTypeText} for you. This message was scheduled to be delivered to you today.

Message Title: "${messageTitle}"
${note ? `\nPersonal Note: "${note}"\n` : ""}

View your message here: ${viewUrl}

This message was sent with love through HelloForever.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `💜 ${senderName} has left you a message`,
      html,
      text,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data?.id);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

// Email for notifying when a new message is scheduled
export async function sendMessageScheduledNotification({
  senderEmail,
  senderName,
  recipientName,
  messageTitle,
  scheduledDate,
}: {
  senderEmail: string;
  senderName: string;
  recipientName: string;
  messageTitle: string;
  scheduledDate: Date;
}) {
  const formattedDate = scheduledDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Message Scheduled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">HelloForever</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1e293b;">Message Scheduled Successfully!</h2>
              <p style="color: #475569; line-height: 1.6;">
                Hi ${senderName},<br><br>
                Your message "<strong>${messageTitle}</strong>" for ${recipientName} has been scheduled for delivery on <strong>${formattedDate}</strong>.
              </p>
              <p style="color: #475569; line-height: 1.6;">
                We&apos;ll make sure it reaches them at exactly the right moment.
              </p>
              <a href="${APP_URL}/dashboard/messages" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px;">
                View Your Messages
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: senderEmail,
      subject: `✅ Message scheduled for ${recipientName}`,
      html,
    });

    if (error) throw error;
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error("Failed to send scheduling confirmation:", error);
    // Don't throw - this is a nice-to-have notification
    return { success: false };
  }
}
