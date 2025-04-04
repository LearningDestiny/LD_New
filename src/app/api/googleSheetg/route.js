import { google } from 'googleapis';

export async function POST(req) {
    try {
        // Parse incoming request data
        const data = await req.json();

        // Ensure required environment variables are loaded
        if (
            !process.env.GOOGLE_CLIENT_EMAIL ||
            !process.env.GOOGLE_PRIVATE_KEY ||
            !process.env.GD_SPREADSHEET_ID
        ) {
            throw new Error("Missing required environment variables");
        }

        // Check the private key format
        console.log("Raw Private Key:", process.env.GOOGLE_PRIVATE_KEY);

        // Ensure correct formatting of private key
        const formattedPrivateKey = process.env.GOOGLE_PRIVATE_KEY.split("\\n").join("\n");
        console.log("Formatted Private Key:", formattedPrivateKey);

        // Initialize Google Sheets API credentials
        const auth = new google.auth.JWT(
            process.env.GOOGLE_CLIENT_EMAIL,
            null,
            formattedPrivateKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });

        // Define the spreadsheet ID and the range where data will be appended
        const SPREADSHEET_ID = process.env.GD_SPREADSHEET_ID;
        const range = 'Sheet1!A1'; // Adjust based on your sheet structure

        // Prepare the data to be appended
        const values = [Object.values(data)];
        const resource = { values };

        // Append data to the Google Sheet
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'RAW',
            resource,
        });

        // Respond with success
        return new Response(
            JSON.stringify({
                success: true,
                data: response.data,
                message: "Data appended successfully",
            }),
            { status: 200 }
        );
    } catch (error) {
        // Respond with error details
        console.error("Error appending data to Google Sheets:", error.message);
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message,
            }),
            { status: 500 }
        );
    }
}
