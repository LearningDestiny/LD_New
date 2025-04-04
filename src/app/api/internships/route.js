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

// GET: Fetch all internships
export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (error) {
    console.error("Error loading internships:", error);
    return NextResponse.json({ message: "Failed to load internships" }, { status: 500 });
  }
}

// POST: Add a new internship
export async function POST(req) {
  try {
    await ensureFileExists();
    const formData = await req.formData();
    const title = formData.get("title");
    const company = formData.get("company");
    const stipend = formData.get("stipend");
    const duration = formData.get("duration");
    const description = formData.get("description");
    const summaryDescription = formData.get("summaryDescription");
    const location = formData.get("location");
    const image = formData.get("image");
    const highlights = JSON.parse(formData.get("highlights"));
    const requirements = JSON.parse(formData.get("requirements"));
    const responsibilities = JSON.parse(formData.get("responsibilities"));


    if (!title || !company || !duration || !location ) {
      return NextResponse.json({ message: "Title, company, duration, location are required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const internships = JSON.parse(data);

    let imagePath = "";
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      imagePath = `/images/${Date.now()}_${image.name}`;
      await fs.writeFile(path.join(process.cwd(), "public" + imagePath), imageBuffer);
    }

    const newInternship = {
      id: internships.length ? Math.max(...internships.map(i => i.id)) + 1 : 1,
      title,
      company,
      stipend,
      duration,
      description,
      summaryDescription,
      location,
      image: imagePath,
      highlights,
      requirements,
      responsibilities,
      lastUpdated: new Date().toISOString()
    };

    internships.push(newInternship);
    await fs.writeFile(filePath, JSON.stringify(internships, null, 2), "utf-8");

    return NextResponse.json({ message: "Internship added successfully", image: imagePath }, { status: 201 });
  } catch (error) {
    console.error("Error adding internship:", error);
    return NextResponse.json({ message: "Failed to add internship", error: error.toString() }, { status: 500 });
  }
}

// PUT: Update an existing internship
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
      return NextResponse.json({ message: "Internship ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let internships = JSON.parse(data);

    const internshipIndex = internships.findIndex(internship => internship.id === id);
    if (internshipIndex === -1) {
      return NextResponse.json({ message: "Internship not found" }, { status: 404 });
    }

    // Store old image path before updating
    const oldImagePath = internships[internshipIndex].image;

    // Update only fields that are provided
    const updatedInternship = {
      ...internships[internshipIndex],
      title: formData.get("title") || internships[internshipIndex].title,
      company: formData.get("company") || internships[internshipIndex].company,
      stipend: formData.get("stipend") || internships[internshipIndex].stipend,
      duration: formData.get("duration") || internships[internshipIndex].duration,
      description: formData.get("description") || internships[internshipIndex].description,
      summaryDescription: formData.get("summaryDescription") || internships[internshipIndex].summaryDescription,
      location: formData.get("location") || internships[internshipIndex].location,
      highlights: JSON.parse(formData.get("highlights")) || internships[internshipIndex].highlights,
      requirements: JSON.parse(formData.get("requirements")) || internships[internshipIndex].requirements,
      responsibilities: JSON.parse(formData.get("responsibilities")) || internships[internshipIndex].responsibilities,
      lastUpdated: new Date().toISOString()
    };

    const image = formData.get("image");
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const newImagePath = `/images/${Date.now()}_${image.name}`;
      await fs.writeFile(path.join(process.cwd(), "public" + newImagePath), imageBuffer);

      // Delete old image only if it exists and is different from the new one
      if (oldImagePath && oldImagePath !== newImagePath) {
        try {
          await fs.unlink(path.join(process.cwd(), "public" + oldImagePath));
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      updatedInternship.image = newImagePath;
    }

     // Save updated internship data
    internships[internshipIndex] = updatedInternship;
    await fs.writeFile(filePath, JSON.stringify(internships, null, 2), "utf-8");

    return NextResponse.json({ message: "Internship updated successfully", image: updatedInternship.image }, { status: 200 });
  } catch (error) {
    console.error("Error updating internship:", error);
    return NextResponse.json({ message: "Failed to update internship", error: error.toString() }, { status: 500 });
  }
}

// DELETE: Remove an internship
export async function DELETE(req) {
  try {
    await ensureFileExists();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Internship ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let internships = JSON.parse(data);
    let takeOutInternship = internships.filter(internship => internship.id === id);
    const newInternships = internships.filter(internship => internship.id !== id);

    if (internships.length === newInternships.length) {
      return NextResponse.json({ message: "Internship not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(newInternships, null, 2), "utf-8");
    if(takeOutInternship.length > 0 && takeOutInternship[0]?.image){
      await fs.unlink(path.join(process.cwd(), "public" + takeOutInternship[0].image));
    }
    return NextResponse.json({ message: "Internship deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting internship:", error);
    return NextResponse.json({ message: "Failed to delete internship", error: error.toString() }, { status: 500 });
  }
}
