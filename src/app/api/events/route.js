import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public/data/events.json");
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

// GET: Fetch all events
export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(filePath, "utf-8");

    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (error) {
    console.error("Error loading events:", error);
    return NextResponse.json({ message: "Failed to load events" }, { status: 500 });
  }
}

// POST: Add a new event
export async function POST(req) {
  try {
    await ensureFileExists();
    const formData = await req.formData();
    const title = formData.get("title");
    const date = formData.get("date");
    const description = formData.get("description");
    const price = formData.get("price");
    const duration = formData.get("duration");
    const summaryDescription = formData.get("summaryDescription");
    const image = formData.get("image");
    const highlights = JSON.parse(formData.get("highlights"));
    const organizer = formData.get("organizer");
    const location = formData.get("location");
    const agenda = JSON.parse(formData.get("agenda"));

    if (!title || !date || !price || !duration) {
      return NextResponse.json({ message: "Title, date, price, and duration are required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const events = JSON.parse(data);

    let imagePath = "";
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      imagePath = `/images/${Date.now()}_${image.name}`;
      await fs.writeFile(path.join(process.cwd(), "public" + imagePath), imageBuffer);
    }

    const newEvent = {
      id: events.length ? Math.max(...events.map(e => e.id)) + 1 : 1,
      title,
      date,
      description,
      price,
      duration,
      summaryDescription,
      image: imagePath,
      highlights: highlights ,
      organizer,
      location,
      agenda
    };

    console.log("newEvent",newEvent,">>>>>>",highlights)

    events.push(newEvent);
    await fs.writeFile(filePath, JSON.stringify(events, null, 2), "utf-8");

    return NextResponse.json({ message: "Event added successfully", image: imagePath }, { status: 201 });
  } catch (error) {
    console.error("Error adding event:", error);
    return NextResponse.json({ message: "Failed to add event", error: error.toString() }, { status: 500 });
  }
}

// PUT: Update an existing event
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
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let events = JSON.parse(data);

    const eventIndex = events.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }


    // Store old image path before updating
    const oldImagePath = events[eventIndex].image;
    
    // Update only fields that are provided
    const updatedEvent = {
      ...events[eventIndex],
      title: formData.get("title") || events[eventIndex].title,
      date: formData.get("date") || events[eventIndex].date,
      description: formData.get("description") || events[eventIndex].description,
      price: formData.get("price") || events[eventIndex].price,
      duration: formData.get("duration") || events[eventIndex].duration,
      summaryDescription: formData.get("summaryDescription") || events[eventIndex].summaryDescription,
      highlights: JSON.parse(formData.get("highlights") || events[eventIndex].highlights),
      organizer: formData.get("organizer") || events[eventIndex].organizer,
      location: formData.get("location") || events[eventIndex].location,
      agenda: JSON.parse(formData.get("agenda") || events[eventIndex].agenda)
    };

    // Handle image update
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

      updatedEvent.image = newImagePath;
    }

    // Save updated event data
    events[eventIndex] = updatedEvent;
    await fs.writeFile(filePath, JSON.stringify(events, null, 2), "utf-8");

    return NextResponse.json({ message: "Event updated successfully", image: updatedEvent.image }, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ message: "Failed to update event", error: error.toString() }, { status: 500 });
  }
}

// DELETE: Remove an event
export async function DELETE(req) {
  try {
    await ensureFileExists();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let events = JSON.parse(data);
    let takeOutEvent = events.filter(event => event.id === id);
    const newEvents = events.filter(event => event.id !== id);

    if (events.length === newEvents.length) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(newEvents, null, 2), "utf-8");
    if(takeOutEvent[0].image){
      await fs.unlink(path.join(process.cwd(), "public" + takeOutEvent[0].image));
    }
    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ message: "Failed to delete event", error: error.toString() }, { status: 500 });
  }
}
