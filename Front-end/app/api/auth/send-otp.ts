import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import redis from "./redis";

const OTP_TTL = 5 * 60; // 5 minutes in seconds
const RATE_LIMIT = 5; // max 5 OTPs per hour
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
  }

  // Rate limiting
  const rateKey = `otp:rate:${email}`;
  const sentCount = await redis.incr(rateKey);
  if (sentCount === 1) {
    await redis.expire(rateKey, RATE_LIMIT_WINDOW);
  }
  if (sentCount > RATE_LIMIT) {
    return NextResponse.json({ success: false, error: "Too many OTP requests. Please try again later." }, { status: 429 });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Store OTP in Redis for 5 minutes
  await redis.set(`otp:${email}`, otp, "EX", OTP_TTL);

  // Send email via Zoho SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: `CareerForge <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your CareerForge OTP Code",
      text: `Your OTP code is: ${otp}\nThis code is valid for 5 minutes.`,
      html: `<p>Your OTP code is: <b>${otp}</b></p><p>This code is valid for 5 minutes.</p>`,
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
  }
} 