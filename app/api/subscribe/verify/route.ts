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
const MAX_FAILED_ATTEMPTS = 3; // Maksimum başarısız doğrulama denemesi sayısı

// Resend yapılandırması
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, verificationCode, language, interests } = await request.json();
    const dictionary = await getDictionary(language as "tr" | "en");
    console.log("Doğrulama isteği:", { firstName, lastName, email, verificationCode, language, interests });

    if (!email || !verificationCode) {
      console.log("Eksik parametreler:", { email, verificationCode });
      return NextResponse.json(
        { error: "E-posta ve doğrulama kodu gereklidir" },
        { status: 400 }
      );
    }

    // Google Sheets'ten verileri al
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sayfa1!A:I",
    });

    const rows = response.data.values || [];
    console.log("Google Sheets'ten gelen veriler:", rows);

    // E-posta adresine göre kullanıcıyı bul
    const userRow = rows.find((row) => row[2] === email);
    console.log("Kullanıcı satırı:", userRow);

    if (!userRow) {
      console.log("Kullanıcı bulunamadı:", email);
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı. Lütfen doğrulama kodunu tekrar gönderin." },
        { status: 404 }
      );
    }

    const savedCode = userRow[4];
    const codeCreationTime = userRow[5] ? new Date(userRow[5]) : null;
    const failedAttempts = parseInt(userRow[8] || "0", 10);
    
    console.log("Kayıtlı kod:", savedCode, "Gelen kod:", verificationCode);
    console.log("Kod oluşturma zamanı:", codeCreationTime);
    console.log("Başarısız deneme sayısı:", failedAttempts);

    // Başarısız deneme sayısını kontrol et
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      console.log("Maksimum başarısız deneme sayısı aşıldı:", failedAttempts);
      return NextResponse.json(
        { 
          error: "Çok fazla başarısız deneme yaptınız. Lütfen yeni bir doğrulama kodu talep edin.", 
          maxAttemptsReached: true 
        },
        { status: 403 }
      );
    }

    // Doğrulama kodunun geçerlilik süresini kontrol et (3 dakika)
    const codeExpirationMinutes = 3;
    const now = new Date();
    const isCodeExpired = codeCreationTime && 
      ((now.getTime() - codeCreationTime.getTime()) > (codeExpirationMinutes * 60 * 1000));

    if (isCodeExpired) {
      console.log("Doğrulama kodu süresi dolmuş:", {
        codeCreationTime,
        now,
        diffMinutes: (now.getTime() - codeCreationTime.getTime()) / (60 * 1000)
      });
      return NextResponse.json(
        { error: "Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod talep edin.", expired: true },
        { status: 400 }
      );
    }

    if (savedCode !== verificationCode) {
      console.log("Kod eşleşmiyor:", { savedCode, verificationCode });
      
      // Başarısız deneme sayısını artır
      const rowIndex = rows.findIndex((row) => row[2] === email);
      const updatedFailedAttempts = failedAttempts + 1;
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Sayfa1!I${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[updatedFailedAttempts.toString()]],
        },
      });
      
      return NextResponse.json(
        { 
          error: "Geçersiz doğrulama kodu. Lütfen doğru kodu girin.", 
          remainingAttempts: MAX_FAILED_ATTEMPTS - updatedFailedAttempts 
        },
        { status: 400 }
      );
    }

    // Doğrulama başarılı, kullanıcı bilgilerini güncelle
    const rowIndex = rows.findIndex((row) => row[2] === email);
    const updatedRow = [
      firstName,
      lastName,
      email,
      interests.join(", "),
      verificationCode,
      codeCreationTime ? codeCreationTime.toISOString() : new Date().toISOString(),
      language,
      userRow[7] || "[]", // Kod istekleri zamanları
      "0" // Başarısız deneme sayısını sıfırla
    ];

    console.log("Güncellenecek satır:", updatedRow);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sayfa1!A${rowIndex + 1}:I${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [updatedRow],
      },
    });

    console.log("Google Sheets güncellendi");

    // Hoş geldiniz e-postası gönder
    const welcomeEmail = await resend.emails.send({
      from: "Bülten Sistemi <bulten@talha-yuce.site>",
      to: [email],
      subject: language === "tr" ? "Bültenimize Hoş Geldiniz! 🎉" : "Welcome to Our Newsletter! 🎉",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">${dictionary.newsletter.selectedInterests}</h2>
            <ul style="color: #34495e; line-height: 1.6;">
              ${interests.map((interest: string) => {
                const interestText = {
                  web: dictionary.newsletter.webDevelopment,
                  oyun: dictionary.newsletter.gameDevelopment,
                  yapay_zeka: dictionary.newsletter.artificialIntelligence
                }[interest];
                return `<li>${interestText}</li>`;
              }).join("")}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #7f8c8d; font-size: 14px;">${dictionary.newsletter.autoEmailMessage}</p>
          </div>
        </div>
      `,
    });

    console.log("Hoş geldiniz e-postası gönderildi:", welcomeEmail);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hata detayı:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu", details: error instanceof Error ? error.message : "Bilinmeyen hata" },
      { status: 500 }
    );
  }
} 