import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = 'force-dynamic'; // Add this line

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Validate path to prevent directory traversal
    const resolvedPath = path.resolve(
      path.join(process.cwd(), "public", filePath)
    );
    
    if (!resolvedPath.startsWith(path.join(process.cwd(), "public", "uploads"))) {
      return NextResponse.json(
        { error: "Unauthorized file access" },
        { status: 403 }
      );
    }

    // Check if file exists
    try {
      await fs.access(resolvedPath);
    } catch {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read and return file
    const fileBuffer = await fs.readFile(resolvedPath);
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `inline; filename="${path.basename(resolvedPath)}"`);
    
    return new NextResponse(fileBuffer, { 
      status: 200,
      headers 
    });

  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}