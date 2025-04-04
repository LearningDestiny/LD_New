import { NextResponse } from "next/server";
const Razorpay = require("razorpay");

export async function POST(request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Razorpay credentials are missing");
      return NextResponse.json({ error: "Payment service configuration error" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const { amount, currency } = await request.json();

    const options = {
      amount: parseInt(amount) * 100, // Convert to smallest currency unit
      currency: currency,
      receipt: "rcp1",
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("Error in order creation:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}