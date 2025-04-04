import { NextResponse } from "next/server";
import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

const generatedSignature = (razorpayOrderId, razorpayPaymentId) => {
  return crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
};

export async function POST(request) {
  try {
    const { 
      orderCreationId, 
      razorpayPaymentId, 
      razorpaySignature,
      userId,
      itemId,
      submissionId,
      feature,
      dataFile
    } = await request.json();

    // Verify payment signature
    const signature = generatedSignature(orderCreationId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
      throw new Error("Payment verification failed - invalid signature");
    }

    // Update the appropriate JSON file
    const jsonDirectory = path.join(process.cwd(), "public", "data", "forms");
    const filePath = path.join(jsonDirectory, dataFile);
    
    const fileData = await fs.readFile(filePath, "utf8");
    const existingData = JSON.parse(fileData);

    const updatedData = existingData.map(entry => {
      if (entry.id === submissionId) {
        return {
          ...entry,
          payment: {
            status: "completed",
            paymentId: razorpayPaymentId,
            orderId: orderCreationId,
            amount: entry[feature]?.price || entry.price, // Supports different structures
            currency: "INR",
            date: new Date().toISOString(),
            signature: razorpaySignature
          }
        };
      }
      return entry;
    });

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({
      success: true,
      message: "Payment verified and recorded successfully",
      paymentId: razorpayPaymentId,
      feature: feature
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Payment verification failed"
    }, { status: 500 });
  }
}