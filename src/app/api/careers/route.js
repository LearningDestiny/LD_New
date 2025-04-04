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

// GET: Fetch all careers
export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (error) {
    console.error("Error loading careers:", error);
    return NextResponse.json({ message: "Failed to load careers" }, { status: 500 });
  }
}

// POST: Add a new career
export async function POST(req) {
  try {
    await ensureFileExists();
    const formData = await req.formData();
    const title = formData.get("title");
    const location = formData.get("location");
    const experience = formData.get("experience");
    const date = formData.get("date");
    const description = formData.get("description");
    // const requirements = JSON.parse(formData.get("requirements"));

    if (!title || !location || !experience || !date) {
      return NextResponse.json({ message: "Title, location, experience, and date are required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const careers = JSON.parse(data);

    const newCareer = {
      id: careers.length ? Math.max(...careers.map(c => c.id)) + 1 : 1,
      title,
      location,
      experience,
      date,
      description,
      // requirements,
    };

    careers.push(newCareer);
    await fs.writeFile(filePath, JSON.stringify(careers, null, 2), "utf-8");

    return NextResponse.json({ message: "Career added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json({ message: "Failed to add career", error: error.toString() }, { status: 500 });
  }
}

// PUT: Update an existing career
export async function PUT(req) {
  try {
    await ensureFileExists();
    let formData;
    const contentType = req.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      formData = await req.formData();
    } else if (contentType?.includes("application/json")) {
      const jsonBody = await req.json();
      formData = new Map(Object.entries(jsonBody));
    } else {
      return NextResponse.json({ message: "Invalid Content-Type" }, { status: 400 });
    }

    const id = Number(formData.get("id"));
    if (!id) {
      return NextResponse.json({ message: "Career ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let careers = JSON.parse(data);

    const careerIndex = careers.findIndex(career => career.id === id);
    if (careerIndex === -1) {
      return NextResponse.json({ message: "Career not found" }, { status: 404 });
    }

    // Update only fields that are provided
    careers[careerIndex] = {
      ...careers[careerIndex],
      title: formData.get("title") || careers[careerIndex].title,
      location: formData.get("location") || careers[careerIndex].location,
      experience: formData.get("experience") || careers[careerIndex].experience,
      date: formData.get("date") || careers[careerIndex].date,
      description: formData.get("description") || careers[careerIndex].description,
      requirements: JSON.parse(formData.get("requirements")) || careers[careerIndex].requirements,
    };

    await fs.writeFile(filePath, JSON.stringify(careers, null, 2), "utf-8");

    return NextResponse.json({ message: "Career updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json({ message: "Failed to update career", error: error.toString() }, { status: 500 });
  }
}

// DELETE: Remove a career
export async function DELETE(req) {
  try {
    await ensureFileExists();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Career ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let careers = JSON.parse(data);
    const newCareers = careers.filter(career => career.id !== id);

    if (careers.length === newCareers.length) {
      return NextResponse.json({ message: "Career not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(newCareers, null, 2), "utf-8");
    return NextResponse.json({ message: "Career deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting career:", error);
    return NextResponse.json({ message: "Failed to delete career", error: error.toString() }, { status: 500 });
  }
}
