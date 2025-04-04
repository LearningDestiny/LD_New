import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Mock database for tracking user rewards (Replace with actual DB later)
const userRewards = new Map(); // { userId: { rewards, redemptionHistory } }

export async function POST(req) {
  try {
    // Authenticate user with Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { redeemType } = await req.json();
    if (!redeemType) {
      return NextResponse.json({ message: "Redeem type is required" }, { status: 400 });
    }

    // Fetch user rewards data (initialize if not present)
    if (!userRewards.has(userId)) {
      userRewards.set(userId, { rewards: 0, redemptionHistory: [] });
    }
    const userData = userRewards.get(userId);

    if (userData.rewards < 10) {
      return NextResponse.json({ message: "Not enough referral points to redeem" }, { status: 400 });
    }

    // Deduct 10 points and add redemption record
    userData.rewards -= 10;
    userData.redemptionHistory.push({
      type: redeemType,
      date: new Date().toISOString(),
      amount: 1000, // ₹1000 value of redemption
    });

    return NextResponse.json({
      message: `Successfully redeemed ₹1000 as ${redeemType}`,
      newRewards: userData.rewards,
    });
  } catch (error) {
    console.error("Error processing redemption:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
