import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    await clerkClient.users.createPasswordResetLink(userId);

    return Response.json({ message: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
