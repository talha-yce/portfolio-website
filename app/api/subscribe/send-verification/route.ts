import { NextResponse } from "next/server";
import { Resend } from "resend";
import { google } from "googleapis";
import { getDictionary } from "@/lib/i18n/dictionaries";

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

// Güvenlik limitleri
const MAX_CODE_REQUESTS_PER_HOUR = 5; // Saat başına maksimum kod gönderme limiti
const CODE_REQUEST_WINDOW_MS = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)

// Resend yapılandırması
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, interests, language } = await request.json();
    const dictionary = await getDictionary(language as "tr" | "en");

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
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #0c0c0d;">
          <div style="background-color: #0c0c0d; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">${dictionary.newsletter.selectedInterests}</h2>
            <ul style="color: #34495e; line-height: 1.6;">
              ${interests.map((interest: "web" | "oyun" | "yapay_zeka") => {
                const interestText: Record<"web" | "oyun" | "yapay_zeka", string> = {
                  web: dictionary.newsletter.webDevelopment,
                  oyun: dictionary.newsletter.gameDevelopment,
                  yapay_zeka: dictionary.newsletter.artificialIntelligence
                };
                return `<li>${interestText[interest]}</li>`;
              }).join("")}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #7f8c8d; font-size: 14px;">${dictionary.newsletter.autoEmailMessage}</p>
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
        range: "Sayfa1!A:I", // I sütununa kadar genişletildi (kod istekleri ve zamanları için)
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((row) => row[2] === email); // E-posta 3. sütunda
      const emailExists = rowIndex !== -1;
      
      // Kod isteklerini kontrol et
      if (emailExists) {
        const existingRow = rows[rowIndex];
        const codeRequestsStr = existingRow[7] || "[]"; // 8. sütun: Kod istekleri zamanları
        
        try {
          const codeRequests = JSON.parse(codeRequestsStr);
          const now = new Date().getTime();
          
          // Son 1 saatteki istekleri filtrele
          const recentRequests = codeRequests.filter(
            (timestamp: number) => now - timestamp < CODE_REQUEST_WINDOW_MS
          );
          
          // Limit kontrolü
          if (recentRequests.length >= MAX_CODE_REQUESTS_PER_HOUR) {
            return NextResponse.json(
              { 
                error: "Çok fazla doğrulama kodu isteği gönderdiniz. Lütfen bir süre bekleyin.",
                rateLimited: true 
              },
              { status: 429 } // Too Many Requests
            );
          }
          
          // Yeni isteği ekle
          recentRequests.push(now);
          
          // Kod istekleri zamanlarını güncelle
          existingRow[7] = JSON.stringify(recentRequests);
        } catch (e) {
          // JSON parse hatası durumunda yeni bir dizi başlat
          existingRow[7] = JSON.stringify([new Date().getTime()]);
        }
      }

      if (!emailExists) {
        // Yeni kayıt ekle
        const newRow = [
          firstName, // 1. sütun: Ad
          lastName,  // 2. sütun: Soyad
          email,     // 3. sütun: E-posta
          interests.join(", "), // 4. sütun: İlgi Alanları
          verificationCode, // 5. sütun: Doğrulama Kodu
          new Date().toISOString(), // 6. sütun: Oluşturma Zamanı
          language, // 7. sütun: Dil
          JSON.stringify([new Date().getTime()]), // 8. sütun: Kod istekleri zamanları
          "0" // 9. sütun: Başarısız doğrulama denemeleri
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: "Sayfa1!A:I", // I sütununa kadar genişletildi
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
          verificationCode, // 5. sütun: Doğrulama Kodu
          new Date().toISOString(), // 6. sütun: Oluşturma Zamanı
          language, // 7. sütun: Dil
          rows[rowIndex][7] || JSON.stringify([new Date().getTime()]), // 8. sütun: Kod istekleri zamanları (mevcut değeri koru)
          rows[rowIndex][8] || "0" // 9. sütun: Başarısız doğrulama denemeleri (mevcut değeri koru)
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `Sayfa1!A${rowIndex + 1}:I${rowIndex + 1}`, // I sütununa kadar genişletildi
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