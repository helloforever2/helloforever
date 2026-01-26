import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user (but don't reveal if they exist)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Store token in database (you'd need to add this field to your schema)
      // For now, we'll just send the email with a mock flow

      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      // Send email
      try {
        await resend.emails.send({
          from: "HelloForever <noreply@helloforever.com>",
          to: email,
          subject: "Reset Your Password - HelloForever",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">HelloForever</h1>
                  </div>
                  <div style="padding: 32px;">
                    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px;">Reset Your Password</h2>
                    <p style="color: #64748b; margin: 0 0 24px 0; line-height: 1.6;">
                      Hi ${user.name},
                    </p>
                    <p style="color: #64748b; margin: 0 0 24px 0; line-height: 1.6;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316, #fb923c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                      Reset Password
                    </a>
                    <p style="color: #94a3b8; margin: 24px 0 0 0; font-size: 14px; line-height: 1.6;">
                      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                    </p>
                  </div>
                  <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                      &copy; ${new Date().getFullYear()} HelloForever. Preserving memories for generations.
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't reveal email sending errors for security
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account exists with that email, we've sent password reset instructions.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
