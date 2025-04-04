import { NextResponse } from "next/server";
const Razorpay = require("razorpay");

// Supported features and their data files
const FEATURE_CONFIG = {
  Course: {
    dataFile: "courses.json",
    descriptionPrefix: "Course Enrollment"
  },
  Event: {
    dataFile: "events.json",
    descriptionPrefix: "Event Registration"
  },
  Workshop: {
    dataFile: "workshops.json",
    descriptionPrefix: "Workshop Registration"
  },
  // Add other features as needed
};

export async function POST(request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error("Payment service configuration error");
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const { amount, currency, userId, itemId, submissionId, feature,id } = await request.json();
    
    // Validate feature type
    if (!FEATURE_CONFIG[feature]) {
      throw new Error(`Unsupported feature type: ${feature}`);
    }

    const options = {
      amount: parseInt(amount) * 100, // Convert to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        itemId,
        submissionId,
        feature,
        dataFile: FEATURE_CONFIG[feature].dataFile,
        id:id
      }
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ 
      success: true,
      orderId: order.id,
      amount: amount,
      currency: currency,
      description: `${FEATURE_CONFIG[feature].descriptionPrefix} Payment`
    });
    
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ 
      success: false,
      message:error.message,
      error: error.message 
    }, { status: 500 });
  }
}