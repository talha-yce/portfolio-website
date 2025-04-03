import os
from PIL import Image

def generate_icons(logo_path, output_dir="public"):
    """
    Logonun farklı boyutlardaki versiyonlarını oluşturur ve mevcut dosyalarla değiştirir.
    
    Args:
        logo_path (str): Orijinal logo dosyasının yolu
        output_dir (str): Çıktı dizini (varsayılan: public)
    """
    # Orijinal logoyu yükle
    logo_extension = os.path.splitext(logo_path)[1].lower()
    
    if logo_extension == '.svg':
        print("SVG dosyaları için destek bu scriptte bulunmuyor.")
        print("Lütfen PNG formatında bir logo kullanın.")
        return
    
    logo = Image.open(logo_path)
    
    # Oluşturulacak boyutlar
    sizes = [16, 32, 48, 64, 96, 128, 256, 384, 512]
    
    # Her boyut için ikon oluştur
    for size in sizes:
        resized_logo = logo.resize((size, size), Image.LANCZOS)
        output_path = os.path.join(output_dir, f"icon-{size}x{size}.png")
        resized_logo.save(output_path, "PNG")
        print(f"{output_path} oluşturuldu.")
    
    # Apple Touch Icon (180x180)
    apple_icon = logo.resize((180, 180), Image.LANCZOS)
    apple_icon_path = os.path.join(output_dir, "apple-touch-icon.png")
    apple_icon.save(apple_icon_path, "PNG")
    print(f"{apple_icon_path} oluşturuldu.")
    
    # SVG için not
    print("Not: icon.svg dosyası oluşturulmadı.")
    print("SVG formatında bir ikon için, logonuzu SVG formatında manuel olarak kaydetmeniz önerilir.")
    
    print("\nTüm ikonlar başarıyla oluşturuldu!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Kullanım: python generate_icons.py <logo_dosya_yolu>")
        print("Örnek: python generate_icons.py logo.png")
        sys.exit(1)
    
    logo_path = sys.argv[1]
    
    if not os.path.exists(logo_path):
        print(f"Hata: {logo_path} bulunamadı.")
        sys.exit(1)
    
    # Gerekli kütüphaneleri kontrol et ve yükle
    try:
        import PIL
    except ImportError:
        print("Pillow kütüphanesi bulunamadı. Yükleniyor...")
        os.system("pip install pillow")
    
    generate_icons(logo_path)
