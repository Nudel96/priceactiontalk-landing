// src/app/api/verify-stripe/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Stripe Secret Key holen
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

// DEBUG: Key im Terminal ausgeben (nur zum Test!)
console.log("DEBUG KEY:", STRIPE_SECRET_KEY);

export async function GET(request: NextRequest) {
  // Session-ID aus der URL holen
  const searchParams = new URL(request.url).searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId || !STRIPE_SECRET_KEY) {
    return NextResponse.json({ success: false, message: "Missing session_id or Stripe key." }, { status: 400 });
  }

  // Stripe importieren
  const stripe = require("stripe")(STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session && session.payment_status === "paid") {
      return NextResponse.json({ success: true, email: session.customer_email });
    }
    return NextResponse.json({ success: false, message: "Not paid or session not found." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Stripe error." }, { status: 500 });
  }
}
