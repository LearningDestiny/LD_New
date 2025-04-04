// GoogleSheetService.js
import { google } from "googleapis";
import { join } from "path";


const sheets = google.sheets("v4");

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: join(__dirname, "path/to/your/service-account-key.json"), // Path to your service account key file
  scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Scopes for Sheets API
});

async function appendData(data) {
  const authClient = await auth.getClient();
  const spreadsheetId = "1Ofv_aqtrPPquN9RqnvsLuhEmCRAf9gdFOo96aYBiMZE/edit?gid=0#gid=0"; // Replace with your Google Sheets ID
  const range = "Sheet1!A1"; // Replace with the correct range or use a dynamic range
  const valueInputOption = "RAW";

  const resource = {
    values: [data],
  };

  try {
    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log("Data appended successfully");
  } catch (error) {
    console.error("Error appending data to Google Sheets:", error);
    throw new Error("Failed to append data");
  }
}

export default { appendData };