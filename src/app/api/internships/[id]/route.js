import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public/data/internships.json");
const imagesDir = path.join(process.cwd(), "public/images");

// Ensure the JSON file and images directory exist
 async function ensureFileExists() {
  try {
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
    }
    const imagesExists = await fs.access(imagesDir).then(() => true).catch(() => false);
    if (!imagesExists) {
      await fs.mkdir(imagesDir, { recursive: true });
    }
  } catch (error) {
    console.error("Error ensuring file exists:", error);
  }
}

export async function GET(req, { params }) {
  try {
    await ensureFileExists()
    const { id } = params; // Extract the dynamic id from the URL
    const data = await fs.readFile(filePath, "utf-8");
    const internships = JSON.parse(data);
    // Find the event by id
    const internship = internships.filter(internship => internship.id === Number(id));
    if (internship.length === 0) {
      return NextResponse.json({ message: "internship not found" }, { status: 404 });
    }

    return NextResponse.json(internship, { status: 200 });
  } catch (error) {
    console.error("Error fetching internship:", error);
    return NextResponse.json({ message: "Failed to fetch internship", error: error.toString() }, { status: 500 });
  }
}