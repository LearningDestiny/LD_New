import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public/data/courses.json");
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

// GET: Fetch all courses
export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (error) {
    console.error("Error loading courses:", error);
    return NextResponse.json({ message: "Failed to load courses" }, { status: 500 });
  }
}

// POST: Add a new course
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
    const roadmap = JSON.parse(formData.get('roadmap'))
    const lectureCount = formData.get('lectureCount')

    if (!title || !price || !duration || !instructor) {
      return NextResponse.json({ message: "Title, price, duration, and instructor are required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const courses = JSON.parse(data);

    let imagePath = "";
    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      imagePath = `/images/${Date.now()}_${image.name}`;
      await fs.writeFile(path.join(process.cwd(), "public" + imagePath), imageBuffer);
    }

    const newCourse = {
      id: courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1,
      title,
      price,
      description,
      duration,
      instructor,
      image: imagePath,
      highlights,
      roadmap,
      lectureCount
    };

    courses.push(newCourse);
    await fs.writeFile(filePath, JSON.stringify(courses, null, 2), "utf-8");

    return NextResponse.json({ message: "Course added successfully", image: imagePath }, { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json({ message: "Failed to add course", error: error.toString() }, { status: 500 });
  }
}

// PUT: Update an existing course
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
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let courses = JSON.parse(data);

    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Store old image path before updating
    const oldImagePath = courses[courseIndex].image;

    // Update course fields
    const updatedCourse = {
      ...courses[courseIndex],
      title: formData.get("title") || courses[courseIndex].title,
      price: formData.get("price") || courses[courseIndex].price,
      description: formData.get("description") || courses[courseIndex].description,
      duration: formData.get("duration") || courses[courseIndex].duration,
      instructor: formData.get("instructor") || courses[courseIndex].instructor,
      highlights: JSON.parse(formData.get("highlights") || courses[courseIndex].highlights),
      roadmap:  JSON.parse(formData.get("roadmap") || courses[courseIndex].roadmap),
      lectureCount : formData.get('lectureCount') || courses[courseIndex]?.lectureCount
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

      updatedCourse.image = newImagePath;
    }

    // Save updated course data
    courses[courseIndex] = updatedCourse;
    await fs.writeFile(filePath, JSON.stringify(courses, null, 2), "utf-8");

    return NextResponse.json({ message: "Course updated successfully", image: updatedCourse.image }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ message: "Failed to update course", error: error.toString() }, { status: 500 });
  }
}

// DELETE: Remove a course
export async function DELETE(req) {
  try {
    await ensureFileExists();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    let courses = JSON.parse(data);
    const takeOutCourse = courses.filter(course => course.id === id);
    const coursePresent = courses.filter(course => course.id === id);
    const filterOutCourse = courses.filter(course => course.id !== id);
    if (coursePresent.length === 0) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Delete image file associated with the course
    const imagePath = takeOutCourse[0].image;
    if (imagePath) {
      try {
        await fs.unlink(path.join(process.cwd(), "public" + imagePath));
      } catch (error) {
        console.error("Error deleting image file:", error);
      }
    }

    // Remove course from list
    await fs.writeFile(filePath, JSON.stringify(filterOutCourse, null, 2), "utf-8");

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ message: "Failed to delete course", error: error.toString() }, { status: 500 });
  }
}
