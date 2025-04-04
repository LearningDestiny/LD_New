import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs'; // Correct module for createReadStream
import fsPromises from 'fs/promises'; // For async file operations
import path from 'path';
import os from 'os';

// Log the raw private key
console.log("Raw Private Key:", process.env.GOOGLE_PRIVATE_KEY);

// Ensure private key is correctly formatted
const formattedPrivateKey = process.env.GOOGLE_PRIVATE_KEY?.split("\\n").join("\n");

// Log the formatted private key for debugging
console.log("Formatted Private Key:", formattedPrivateKey);

const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.split("\\n").join("\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
};

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
  );

  await jwtClient.authorize();
  return jwtClient;
}

async function uploadFile(authClient, filePath, fileName, mimeType) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  const fileMetadata = {
    name: fileName,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath), // Use correct fs module
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  return response.data.id;
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('resume');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = os.tmpdir(); // Use the system's temp directory
    const filePath = path.join(tempDir, file.name);

    await fsPromises.writeFile(filePath, buffer); // Correct usage for async write

    // Upload to Google Drive
    const authClient = await authorize();
    const fileId = await uploadFile(authClient, filePath, file.name, file.type);

    // Clean up temp file
    await fsPromises.unlink(filePath);

    return NextResponse.json({ message: 'File uploaded successfully', fileId });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
