import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const referralCode = uuidv4();

    // Store referralCode in DB if needed

    return NextResponse.json({ referralCode });
  } catch (error) {
    console.error("Error generating referral code:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
