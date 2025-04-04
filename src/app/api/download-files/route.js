import { NextResponse } from "next/server";
import { google } from "googleapis";
import JSZip from "jszip";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // Fetch user's uploaded files
    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    // Fetch files from Google Drive folder (Assume files are stored in a specific folder)
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const response = await drive.files.list({
      q: `'${folderId}' in parents and name contains '${userId}'`,
      fields: "files(id, name, mimeType, webContentLink)",
    });

    if (!response.data.files.length) {
      return NextResponse.json({ error: "No files found" }, { status: 404 });
    }

    // Create ZIP if multiple files
    const zip = new JSZip();
    for (const file of response.data.files) {
      const fileResponse = await fetch(file.webContentLink);
      const blob = await fileResponse.arrayBuffer();
      zip.file(file.name, blob);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="User_${userId}_Files.zip"`,
        "Content-Type": "application/zip",
      },
    });
  } catch (error) {
    console.error("Error downloading files:", error);
    return NextResponse.json({ error: "Failed to download files" }, { status: 500 });
  }
}
