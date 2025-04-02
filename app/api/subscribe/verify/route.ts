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
    const { firstName, lastName, email, verificationCode, language, interests } = await request.json();
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
      range: "Sayfa1!A:F",
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
    console.log("Kayıtlı kod:", savedCode, "Gelen kod:", verificationCode);

    if (savedCode !== verificationCode) {
      console.log("Kod eşleşmiyor:", { savedCode, verificationCode });
      return NextResponse.json(
        { error: "Geçersiz doğrulama kodu. Lütfen doğru kodu girin." },
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
      language,
    ];

    console.log("Güncellenecek satır:", updatedRow);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sayfa1!A${rowIndex + 1}:F${rowIndex + 1}`,
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">${language === "tr" ? "Hoş Geldiniz! 🎉" : "Welcome! 🎉"}</h1>
            <p style="color: #7f8c8d; font-size: 18px;">${language === "tr" 
              ? `Sayın ${firstName} ${lastName}, bülten ailemize katıldığınız için teşekkür ederiz.`
              : `Dear ${firstName} ${lastName}, thank you for joining our newsletter family.`}</p>
          </div>

          <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">${language === "tr" ? "Sizi Neler Bekliyor?" : "What Awaits You?"}</h2>
            <ul style="color: #34495e; line-height: 1.6;">
              <li>${language === "tr" ? "En güncel teknoloji haberleri ve makaleler" : "Latest technology news and articles"}</li>
              <li>${language === "tr" ? "Web geliştirme ipuçları ve öğretici içerikler" : "Web development tips and tutorials"}</li>
              <li>${language === "tr" ? "Yapay zeka ve oyun geliştirme konularında özel içerikler" : "Special content on AI and game development"}</li>
              <li>${language === "tr" ? "Özel indirimler ve kampanyalar" : "Special discounts and campaigns"}</li>
            </ul>
          </div>

          <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">${language === "tr" ? "Seçtiğiniz İlgi Alanları" : "Your Selected Interests"}</h2>
            <ul style="color: #34495e; line-height: 1.6;">
              ${interests.map((interest: string) => {
                const interestText = {
                  web: language === "tr" ? "Web Geliştirme" : "Web Development",
                  oyun: language === "tr" ? "Oyun Geliştirme" : "Game Development",
                  yapay_zeka: language === "tr" ? "Yapay Zeka" : "Artificial Intelligence"
                }[interest];
                return `<li>${interestText}</li>`;
              }).join("")}
            </ul>
          </div>

          <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">${language === "tr" ? "Blog Kataloğumuz" : "Our Blog Catalog"}</h2>
            <p style="color: #34495e; line-height: 1.6;">${language === "tr" 
              ? "Sizin için hazırladığımız özel içerikleri keşfetmek için blog sayfamızı ziyaret edebilirsiniz:"
              : "You can visit our blog page to explore the special content we have prepared for you:"}</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://talha-yuce.site/blog" style="display: inline-block; background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                ${language === "tr" ? "Blog Sayfamızı Ziyaret Edin" : "Visit Our Blog"}
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #7f8c8d; font-size: 14px;">${language === "tr" 
              ? "Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız."
              : "This email was sent automatically. Please do not reply."}</p>
            <p style="color: #7f8c8d; font-size: 14px;">${language === "tr"
              ? "Abonelikten çıkmak isterseniz, lütfen bize e-posta gönderin."
              : "If you wish to unsubscribe, please send us an email."}</p>
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