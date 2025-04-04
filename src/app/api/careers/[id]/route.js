import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";


const filePath = path.join(process.cwd(), "public/data/careers.json");
// Ensure the JSON file exists
 async function ensureFileExists() {
  try {
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
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
    const careers = JSON.parse(data);
    // Find the course by id
    const career = careers.filter(data => data.id === Number(id));
    if (career.length === 0) {
      return NextResponse.json({ message: "career not found" }, { status: 404 });
    }

    return NextResponse.json(career, { status: 200 });
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json({ message: "Failed to fetch career", error: error.toString() }, { status: 500 });
  }
}