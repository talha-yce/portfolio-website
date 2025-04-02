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
  projectId: "my-web-site-453510",
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

// Resend yapılandırması
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, interests, language } = await request.json();

    console.log("Gelen istek:", { email, firstName, lastName, interests, language });

    // Doğrulama kodu oluşturma
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Oluşturulan doğrulama kodu:", verificationCode);

    // E-posta gönderimi
    const emailResponse = await resend.emails.send({
      from: "Bülten Sistemi <bulten@talha-yuce.site>",
      to: [email],
      subject: language === "tr" ? "Bülten Aboneliği Doğrulama Kodu" : "Newsletter Subscription Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">${language === "tr" ? "Hoş Geldiniz!" : "Welcome!"} 🎉</h1>
            <p style="color: #7f8c8d; font-size: 18px;">${language === "tr" 
              ? `Sayın ${firstName} ${lastName}, bülten aboneliğinizi tamamlamak için doğrulama kodunuz:`
              : `Dear ${firstName} ${lastName}, your verification code to complete your newsletter subscription:`}</p>
          </div>

          <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
              <h2 style="color: #3498db; margin: 0;">${verificationCode}</h2>
            </div>
          </div>

          <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">${language === "tr" ? "Seçtiğiniz İlgi Alanları" : "Your Selected Interests"}</h2>
            <ul style="color: #34495e; line-height: 1.6;">
              ${interests.map((interest: "web" | "oyun" | "yapay_zeka") => {
                const interestText: Record<"web" | "oyun" | "yapay_zeka", string> = {
                  web: language === "tr" ? "Web Geliştirme" : "Web Development",
                  oyun: language === "tr" ? "Oyun Geliştirme" : "Game Development",
                  yapay_zeka: language === "tr" ? "Yapay Zeka" : "Artificial Intelligence"
                };
                return `<li>${interestText[interest]}</li>`;
              }).join("")}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #7f8c8d; font-size: 14px;">${language === "tr" 
              ? "Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız."
              : "This email was sent automatically. Please do not reply."}</p>
          </div>
        </div>
      `,
    });

    console.log("E-posta gönderim yanıtı:", emailResponse);

    // E-posta kontrolü ve kayıt
    try {
      // Önce mevcut kayıtları kontrol et
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sayfa1!A:E", // Tüm sütunlar (doğrulama kodu için E sütunu eklendi)
      });

      const rows = response.data.values || [];
      const emailExists = rows.some((row) => row[2] === email); // E-posta 3. sütunda

      if (!emailExists) {
        // Yeni kayıt ekle
        const newRow = [
          firstName, // 1. sütun: Ad
          lastName,  // 2. sütun: Soyad
          email,     // 3. sütun: E-posta
          interests.join(", "), // 4. sütun: İlgi Alanları
          verificationCode // 5. sütun: Doğrulama Kodu
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: "Sayfa1!A:E",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [newRow],
          },
        });
      } else {
        // Mevcut kaydı güncelle
        const rowIndex = rows.findIndex((row) => row[2] === email);
        const updatedRow = [
          firstName, // 1. sütun: Ad
          lastName,  // 2. sütun: Soyad
          email,     // 3. sütun: E-posta
          interests.join(", "), // 4. sütun: İlgi Alanları
          verificationCode // 5. sütun: Doğrulama Kodu
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `Sayfa1!A${rowIndex + 1}:E${rowIndex + 1}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [updatedRow],
          },
        });
      }

      // Doğrulama kodunu ve e-posta durumunu döndür
      return NextResponse.json({
        verificationCode,
        emailExists,
      });
    } catch (sheetsError) {
      console.error("Google Sheets hatası:", sheetsError);
      // Sheets hatası olsa bile e-posta gönderildiği için başarılı yanıt döndür
      return NextResponse.json({
        verificationCode,
        emailExists: false,
      });
    }
  } catch (error) {
    console.error("Hata detayı:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu", details: error instanceof Error ? error.message : "Bilinmeyen hata" },
      { status: 500 }
    );
  }
} 