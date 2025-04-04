import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    await clerkClient.users.updateUser(userId, { banned: true });

    return Response.json({ message: "Account deactivated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deactivating account:", error);
    return Response.json({ error: "Failed to deactivate account" }, { status: 500 });
  }
}
