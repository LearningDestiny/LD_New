import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const jsonDirectory = path.join(process.cwd(), "public", "data", "forms");
const uploadsDirectory = path.join(process.cwd(), "public", "uploads", "resumes");
const filePath = path.join(jsonDirectory, "internships.json");


export async function GET(request) {
  

  const filePath = path.join(
    process.cwd(),
    'public/data/forms',
    `internships.json`
  );

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Create uploads directory if it doesn't exist
    await fs.mkdir(uploadsDirectory, { recursive: true });

    // Extract text fields
    const textFields = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      state: formData.get("state"),
      city: formData.get("city"),
      university: formData.get("university"),
      graduationYear: formData.get("graduationYear"),
      linkedin: formData.get("linkedin"),
      portfolio: formData.get("portfolio"),
      coverLetter: formData.get("coverLetter"),
      dob: formData.get("dob"),
      internshipName: formData.get("internshipName"),
      internshipDescription: formData.get("internshipDescription"),
      internshipLocation: formData.get("internshipLocation"),
      internshipId : formData.get("internshipId"),
      internshipUrl: formData.get("internshipUrl"),
    };

    // Handle file upload
    const resumeFile = formData.get("resume");
    let resumePath = null;
    
    if (resumeFile) {
      // Sanitize filename and create unique name
      const originalName = resumeFile.name;
      const fileExt = path.extname(originalName);
      const baseName = path.basename(originalName, fileExt);
      const sanitizedName = `${baseName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}${fileExt}`;
      
      const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
      resumePath = path.join(uploadsDirectory, sanitizedName);
      
      // Save file
      await fs.writeFile(resumePath, fileBuffer);
    }

    // Read existing data
    let existingData = [];
    try {
      const fileData = await fs.readFile(filePath, "utf8");
      existingData = JSON.parse(fileData);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    // Create new entry
    const newEntry = {
      id: Date.now().toString(),
      userId: `user_${Date.now()}`,
      internship: {
        name: textFields.internshipName,
        description: textFields.internshipDescription,
        location: textFields.internshipLocation,
        id: textFields.internshipId,
        url: textFields.internshipUrl,
      },
      user: {
        fullname: textFields.fullName,
        email: textFields.email,
        phone: textFields.phone,
        city: textFields.city,
        state: textFields.state,
        country: "India",
        university: textFields.university,
        graduationYear: textFields.graduationYear,
        linkedin: textFields.linkedin,
        portfolio: textFields.portfolio,
        dob: textFields.dob,
      },
      application: {
        coverLetter: textFields.coverLetter,
        resumePath: resumePath ? path.relative(path.join(process.cwd(), "public"), resumePath) : null,
        date: new Date().toISOString().split('T')[0],
      }
    };

    // Add new entry
    existingData.push(newEntry);
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({
      success: true,
      data: {
        id: newEntry.id,
        userId: newEntry.userId,
        resumePath: newEntry.application.resumePath
      }
    });

  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}