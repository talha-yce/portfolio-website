const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 64, 96, 128, 256, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  // SVG'yi PNG'lere dönüştür
  for (const size of sizes) {
    await sharp(path.join(publicDir, 'icon.svg'))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
  }
}

generateIcons().catch(console.error); 