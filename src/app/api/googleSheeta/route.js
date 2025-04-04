import { google } from 'googleapis';

export async function POST(req) {
  const data = await req.json();

  try {
    // Log the incoming data to verify it's correct
    console.log("Incoming Data:", data);

    // Load the credentials from environment variables
    const credentials = {
      client_email: process.env.GOOGLE_SHEET_3_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEET_3_PRIVATE_KEY.replace(/\\n/g, '\n'),
      project_id: process.env.GOOGLE_SHEET_3_PROJECT_ID,
    };

    const sheets = google.sheets('v4');
    const SPREADSHEET_ID = process.env.NEW_GOOGLE_SHEET_ID;

    // Authorize the API client with the service account
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
      null
    );

    // Log the credentials and spreadsheet ID for debugging
    console.log("Using spreadsheet ID:", SPREADSHEET_ID);
    console.log("Client Email:", credentials.client_email);

    // Append the form data to the sheet
    const res = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',  // Adjust the range if needed (e.g., Sheet1 or Form Responses)
      valueInputOption: 'USER_ENTERED',  // Use USER_ENTERED to handle any sheet formulas or formatting
      resource: {
        values: [Object.values(data)],  // Send form data as values to the sheet
      },
    });

    // Log the response from Google Sheets API
    console.log("Google Sheets Response:", res);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    // Log the error to debug
    console.error('Error occurred while saving to Google Sheets:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
