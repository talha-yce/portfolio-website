import { NextResponse } from "next/server";
import { Resend } from "resend";
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

// Resend yapılandırması
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, recaptchaToken } = await request.json();

    // reCAPTCHA doğrulama
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      {
        method: "POST",
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: "reCAPTCHA doğrulaması başarısız oldu" },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Aboneler!A:A", // E-posta sütunu
    });

    const rows = response.data.values || [];
    const emailExists = rows.some((row) => row[0] === email);

    // Doğrulama kodu oluşturma
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // E-posta gönderimi
    await resend.emails.send({
      from: "Bülten Sistemi <onboarding@resend.dev>",
      to: email,
      subject: "Bülten Aboneliği Doğrulama Kodu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Bülten Aboneliği Doğrulama</h1>
          <p>Merhaba,</p>
          <p>Bülten aboneliğinizi tamamlamak için doğrulama kodunuz:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #007bff; margin: 0;">${verificationCode}</h2>
          </div>
          <p>Bu kodu web sitesindeki forma girerek aboneliğinizi tamamlayabilirsiniz.</p>
          <p style="color: #666; font-size: 0.9em;">Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    });

    // Doğrulama kodunu ve e-posta durumunu döndür
    return NextResponse.json({
      verificationCode,
      emailExists,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 