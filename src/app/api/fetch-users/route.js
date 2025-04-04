import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const users = await clerkClient.users.getUserList();
    
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
