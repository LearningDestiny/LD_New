import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import PDFDocument from "pdfkit";
import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch user details from Clerk
    const clerkResponse = await axios.get(`https://api.clerk.com/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    });
    const user = clerkResponse.data;

    // Fetch payment details from Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentsResponse = await razorpay.payments.all({ email: user.email });
    const payments = paymentsResponse.items;

    // Create a PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      return new Response(pdfData, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="User_${userId}_Details.pdf"`,
        },
      });
    });

    // Add user details
    doc.fontSize(20).text("User Enrollment & Payment Details", { align: "center" }).moveDown();
    doc.fontSize(14).text(`User ID: ${user.id}`);
    doc.text(`Name: ${user.first_name} ${user.last_name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${user.phone_numbers[0]?.phone_number || "N/A"}`);
    doc.moveDown();

    // Add payment details
    doc.fontSize(16).text("Payment History", { underline: true }).moveDown();
    if (payments.length > 0) {
      payments.forEach((payment, index) => {
        doc.fontSize(12).text(`${index + 1}. Payment ID: ${payment.id}`);
        doc.text(`Amount: ₹${payment.amount / 100}`);
        doc.text(`Status: ${payment.status}`);
        doc.text(`Date: ${new Date(payment.created_at * 1000).toLocaleString()}`);
        doc.moveDown();
      });
    } else {
      doc.text("No payment records found.");
    }

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate user details report" }, { status: 500 });
  }
}
