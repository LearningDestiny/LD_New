import { google } from "googleapis";

export async function POST(req) {
  try {
    const data = await req.json(); // Parse incoming form data

    // Load environment variables
    const credentials = {
      client_email: process.env.SHEET2_CLIENT_EMAIL,
      private_key: process.env.SHEET2_PRIVATE_KEY.replace(/\\n/g, "\n"),
      project_id: process.env.SHEET2_PROJECT_ID,
    };

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });
    const SPREADSHEET_ID = process.env.SHEET2_SPREADSHEET_ID;

    // Append data to the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1", // Adjust the range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [Object.values(data)], // Send form data as values to the sheet
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Data added successfully!",
        spreadsheetResponse: response.data,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding data to Google Sheets:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
