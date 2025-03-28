import { NextResponse } from "next/server";
import { google } from "googleapis";

// Google Sheets API yapılandırması
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, interests, verificationCode } = await request.json();

    // E-posta kontrolü
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Aboneler!A:E", // Tüm sütunlar
    });

    const rows = response.data.values || [];
    const emailIndex = rows.findIndex((row) => row[0] === email);
    const newRow = [email, firstName, lastName, interests.join(", "), new Date().toISOString()];

    if (emailIndex === -1) {
      // Yeni kayıt
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Aboneler!A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [newRow],
        },
      });
    } else {
      // Mevcut kaydı güncelle
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Aboneler!A${emailIndex + 1}:E${emailIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [newRow],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 