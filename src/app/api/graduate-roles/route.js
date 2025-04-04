import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public/data/graduate-roles.json");

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

// GET: Fetch all graduate roles
export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (error) {
    console.error("Error loading graduate roles:", error);
    return NextResponse.json({ message: "Failed to load graduate roles" }, { status: 500 });
  }
}

// POST: Add a new graduate role
export async function POST(req) {
  try {
    await ensureFileExists();
    const formData = await req.formData();
    const title = formData.get("title");
    const location = formData.get("location");
    const experience = formData.get("experience");
    const date = formData.get("date");
    const description = formData.get("description");
    const requirements = JSON.parse(formData.get("requirements"));


    if (!title || !location || !experience || !date) {
      return NextResponse.json({ message: "Title, location, experience, and date are required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const graduateRoles = JSON.parse(data);

    const newGraduateRole = {
      id: graduateRoles.length ? Math.max(...graduateRoles.map(c => c.id)) + 1 : 1,
      title,
      location,
      experience,
      date,
      description,
      requirements
    };

    graduateRoles.push(newGraduateRole);
    await fs.writeFile(filePath, JSON.stringify(graduateRoles, null, 2), "utf-8");

    return NextResponse.json({ message: "Graduate role added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding graduate role:", error);
    return NextResponse.json({ message: "Failed to add graduate role", error: error.toString() }, { status: 500 });
  }
}

// PUT: Update an existing graduate role
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
      return NextResponse.json({ message: "Graduate role ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let graduateRoles = JSON.parse(data);

    const roleIndex = graduateRoles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      return NextResponse.json({ message: "Graduate role not found" }, { status: 404 });
    }

    graduateRoles[roleIndex] = {
      ...graduateRoles[roleIndex],
      title: formData.get("title") || graduateRoles[roleIndex].title,
      location: formData.get("location") || graduateRoles[roleIndex].location,
      experience: formData.get("experience") || graduateRoles[roleIndex].experience,
      date: formData.get("date") || graduateRoles[roleIndex].date,
      description: formData.get("description") || graduateRoles[roleIndex].description,
      requirements: JSON.parse(formData.get("requirements")) || graduateRoles[roleIndex].requirements
    };

    await fs.writeFile(filePath, JSON.stringify(graduateRoles, null, 2), "utf-8");

    return NextResponse.json({ message: "Graduate role updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating graduate role:", error);
    return NextResponse.json({ message: "Failed to update graduate role", error: error.toString() }, { status: 500 });
  }
}

// DELETE: Remove a graduate role
export async function DELETE(req) {
  try {
    await ensureFileExists();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Graduate role ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let graduateRoles = JSON.parse(data);
    const newGraduateRoles = graduateRoles.filter(role => role.id !== id);

    if (graduateRoles.length === newGraduateRoles.length) {
      return NextResponse.json({ message: "Graduate role not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(newGraduateRoles, null, 2), "utf-8");
    return NextResponse.json({ message: "Graduate role deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting graduate role:", error);
    return NextResponse.json({ message: "Failed to delete graduate role", error: error.toString() }, { status: 500 });
  }
}
