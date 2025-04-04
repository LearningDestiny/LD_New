import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public/data/workshops.json");
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

// GET: Fetch all workshops
export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (error) {
    console.error("Error loading workshops:", error);
    return NextResponse.json({ message: "Failed to load workshops" }, { status: 500 });
  }
}

// POST: Add a new workshop
export async function POST(req) {
  try {
    await ensureFileExists();
    const formData = await req.formData();
    const title = formData.get("title");
    const price = formData.get("price");
    const description = formData.get("description");
    const duration = formData.get("duration");
    const instructor = formData.get("instructor");
    const image = formData.get("image");
    const highlights = JSON.parse(formData.get("highlights"));
    const rating = formData.get("rating");
    const ratingCount =   formData.get("ratingCount");
    const lectureCount = formData.get("lectureCount");
    const roadmap = JSON.parse(formData.get("roadmap"));
    

    if (!title || !price || !duration || !instructor) {
      return NextResponse.json({ message: "Title, price, duration, and instructor are required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const workshops = JSON.parse(data);

    let imagePath = "";
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      imagePath = `/images/${Date.now()}_${image.name}`;
      await fs.writeFile(path.join(process.cwd(), "public" + imagePath), imageBuffer);
    }

    const newWorkshop = {
      id: workshops.length ? Math.max(...workshops.map(w => w.id)) + 1 : 1,
      title,
      price,
      description,
      duration,
      instructor,
      image: imagePath,
      highlights,
      rating,
      ratingCount,
      lectureCount,
      roadmap

    };

    workshops.push(newWorkshop);
    await fs.writeFile(filePath, JSON.stringify(workshops, null, 2), "utf-8");

    return NextResponse.json({ message: "Workshop added successfully", image: imagePath }, { status: 201 });
  } catch (error) {
    console.error("Error adding workshop:", error);
    return NextResponse.json({ message: "Failed to add workshop", error: error.toString() }, { status: 500 });
  }
}

// PUT: Update an existing workshop
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
      return NextResponse.json({ message: "Workshop ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let workshops = JSON.parse(data);

    const workshopIndex = workshops.findIndex(workshop => workshop.id === id);
    if (workshopIndex === -1) {
      return NextResponse.json({ message: "Workshop not found" }, { status: 404 });
    }

     // Store old image path before updating
     const oldImagePath = workshops[workshopIndex].image;

    const updatedWorkshop = {
      ...workshops[workshopIndex],
      title: formData.get("title") || workshops[workshopIndex].title,
      price: formData.get("price") || workshops[workshopIndex].price,
      description: formData.get("description") || workshops[workshopIndex].description,
      duration: formData.get("duration") || workshops[workshopIndex].duration,
      instructor: formData.get("instructor") || workshops[workshopIndex].instructor,
      highlights: JSON.parse(formData.get("highlights") || workshops[workshopIndex].highlights),
      rating: formData.get("rating") || workshops[workshopIndex].rating,
      ratingCount: formData.get("ratingCount") || workshops[workshopIndex].ratingCount,
      lectureCount: formData.get("lectureCount") || workshops[workshopIndex].lectureCount,
      roadmap: JSON.parse(formData.get("roadmap") || workshops[workshopIndex].roadmap),

    };

    const image = formData.get("image");
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const newImagePath  = `/images/${Date.now()}_${image.name}`;
       await fs.writeFile(path.join(process.cwd(), "public" + newImagePath), imageBuffer);
      
      // Delete old image only if it exists and is different from the new one
      if (oldImagePath && oldImagePath !== newImagePath) {
        try {
          await fs.unlink(path.join(process.cwd(), "public" + oldImagePath));
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      updatedWorkshop.image = newImagePath;
    }

    // Save updated workshop data
    workshops[workshopIndex] = updatedWorkshop;
    await fs.writeFile(filePath, JSON.stringify(workshops, null, 2), "utf-8");

    return NextResponse.json({ message: "Workshop updated successfully", image: updatedWorkshop.image }, { status: 200 });
  } catch (error) {
    console.error("Error updating workshop:", error);
    return NextResponse.json({ message: "Failed to update workshop", error: error.toString() }, { status: 500 });
  }
}

// DELETE: Remove a workshop
export async function DELETE(req) {
  try {
    await ensureFileExists();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Workshop ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let workshops = JSON.parse(data);
    const takeOutWorkshop = workshops.filter(workshop => workshop.id === id);
    const newWorkshops = workshops.filter(workshop => workshop.id !== id);

    if (workshops.length === newWorkshops.length) {
      return NextResponse.json({ message: "Workshop not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(newWorkshops, null, 2), "utf-8");
    if(takeOutWorkshop.length >0 && takeOutWorkshop[0].image){
       await fs.unlink(path.join(process.cwd(), "public" + takeOutWorkshop[0].image)); 
    }
    return NextResponse.json({ message: "Workshop deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return NextResponse.json({ message: "Failed to delete workshop", error: error.toString() }, { status: 500 });
  }
}
