import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Extract referral details (assuming metadata contains referrals)
    const userMetadata = user.publicMetadata || {};
    const referrals = userMetadata.referrals || [];

    // Fetch all referred users' data
    const referredUsers = await Promise.all(
      referrals.map(async (refId) => {
        try {
          return await clerkClient.users.getUser(refId);
        } catch {
          return null;
        }
      })
    );

    // Count successful referrals (where paymentCompleted is true in metadata)
    const confirmedReferrals = referredUsers.filter(
      (refUser) => refUser && refUser.publicMetadata?.paymentCompleted
    );

    return NextResponse.json({
      totalReferrals: confirmedReferrals.length,
      rewardsEarned: confirmedReferrals.length * 100, // ₹100 per successful referral
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
