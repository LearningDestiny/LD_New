import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId, referral } = await req.json();

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { referral },
    });

    return Response.json({ message: "Referral updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating referral:", error);
    return Response.json({ error: "Failed to update referral" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { userId } = await req.json();

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { referral: null },
    });

    return Response.json({ message: "Referral deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting referral:", error);
    return Response.json({ error: "Failed to delete referral" }, { status: 500 });
  }
}
