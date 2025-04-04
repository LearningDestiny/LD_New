import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const referralsMap = new Map(); // { referrerId: { referrals: [], rewards } }

export async function POST(req) {
  try {
    // Authenticate user with Clerk
    const { userId: referrerId } = auth();
    if (!referrerId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { friendId, paymentCompleted } = await req.json();

    if (!friendId || paymentCompleted === undefined) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    // Fetch or initialize referral data for referrer
    if (!referralsMap.has(referrerId)) {
      referralsMap.set(referrerId, { referrals: [], rewards: 0 });
    }
    const referrerData = referralsMap.get(referrerId);

    if (paymentCompleted) {
      if (!referrerData.referrals.includes(friendId)) {
        referrerData.referrals.push(friendId);
        referrerData.rewards += 100; // ₹100 reward for successful referral
      }

      return NextResponse.json(
        { message: "Payment confirmed, referral updated!", newRewards: referrerData.rewards },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Payment not completed yet" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating referral:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
