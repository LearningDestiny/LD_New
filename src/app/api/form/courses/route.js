import { promises as fs } from 'fs';
import { NextResponse } from "next/server";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const jsonDirectory = path.join(process.cwd(), "public","data", "forms");
const filePath = path.join(jsonDirectory, "courses.json");

// Ensure directory and file exist
async function ensureFileExists() {
  try {
    // Check if directory exists
    try {
      await fs.access(jsonDirectory);
    } catch (dirError) {
      await fs.mkdir(jsonDirectory, { recursive: true });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (fileError) {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error ensuring file exists:", error);
    throw error; // Re-throw to handle in the main function
  }
}
export async function GET(request) {
  

  const filePath = path.join(
    process.cwd(),
    'public/data/forms',
    `courses.json`
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
    const data = await request.json();


     // Validate required fields
     const requiredFields = [
        "courseName",
        "courseDescription",
        "courseId",
        "coursePrice",
        "courseInstructor",
        "courseUrl",
        "fullName",
        "email",
        "phone",
        "city",
        "state",
        "country",
        "stream",
        "highestQualification",
        "dob",
      ];
  
      for (const field of requiredFields) {
        if (!data[field]) {
          return new Response(
            JSON.stringify({ success: false, message: `Missing field: ${field}` }),
            { status: 400 }
          );
        }
      }

    // Ensure file structure exists
    await ensureFileExists();
    // Read existing data
    const fileData = await fs.readFile(filePath, "utf8");
    const existingData = JSON.parse(fileData);
    
    // Generate IDs
    const submissionId = uuidv4();
    const userId = data.userId || uuidv4();

    // Create new entry
    const newEntry = {
      id: submissionId,
      course: {
        name: data.courseName,
        description: data.courseDescription,
        id: data.courseId,
        price: data.coursePrice,
        instructor: data.courseInstructor,
        url: data.courseUrl
      },
      user: {
        userId: userId,
        fullname: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        state: data.state,
        country: "India",
        stream: data.stream,
        highest_qualification: data.qualification,
        dob: data.dob
      },
      applicationDate: new Date().toISOString().split('T')[0],
      payment:{
        status: "pending",

      }
    };

    // Add new entry
    existingData.push(newEntry);
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json(
      { 
        success: true, 
        data: {
          id: submissionId,
          userId: userId
        }
      },
      { status: 200 }
    );

    // // Define paths
    // const jsonDirectory = path.join(process.cwd(), 'public','data', 'forms');
    // const filePath = path.join(jsonDirectory, 'courses.json');
    
    // // Read existing data
    // let existingData = [];
    // try {
    //   const fileData = await fs.readFile(filePath, 'utf8');
    //   existingData = JSON.parse(fileData);
    // } catch (err) {
    //   if (err.code !== 'ENOENT') throw err;
    // }
    
    // // Generate IDs
    // const submissionId = uuidv4();
    // const userId = data.userId || uuidv4(); // Use provided userId or generate new
    
    // // Create new entry
    // const newEntry = {
    //   id: submissionId,
    //   userId: userId,
    //   course: {
    //     name: data.courseName,
    //     description: data.courseDescription,
    //     id: data.courseId,
    //     price: data.coursePrice,
    //     instructor: data.courseInstructor,
    //     url: data.courseUrl
    //   },
    //   user: {
    //     fullname: data.fullName,
    //     email: data.email,
    //     phone: data.phone,
    //     city: data.city,
    //     state: data.state,
    //     country: "India", // default or from form
    //     stream: data.stream,
    //     highest_qualification: data.qualification,
    //     dob: data.dob
    //   },
    //   applicationDate: new Date().toISOString().split('T')[0]
    // };
    
    // // Add new entry
    // existingData.push(newEntry);
    
    // // Write back to file
    // await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
    
    // return new Response(JSON.stringify({ 
    //   success: true, 
    //   data: {
    //     id: submissionId,
    //     userId: userId
    //   }
    // }), {
    //   status: 200,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}