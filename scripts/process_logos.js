const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  const root = path.resolve(__dirname, '..');
  const sourceLogo = path.join(root, 'public', 'df-logo.png');

  console.log('Processing logos with sharp...');

  // 1. App icon 32x32
  await sharp(sourceLogo)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(root, 'src', 'app', 'icon.png'));
  console.log('Created src/app/icon.png');

  // 2. Apple touch icon 180x180
  await sharp(sourceLogo)
    .resize(180, 180, { fit: 'contain', background: { r: 10, g: 10, b: 10, alpha: 1 } })
    .toFile(path.join(root, 'src', 'app', 'apple-icon.png'));
  console.log('Created src/app/apple-icon.png');

  // 3. Favicon ico (32x32 PNG renamed or multi-frame)
  await sharp(sourceLogo)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(root, 'src', 'app', 'favicon.ico'));
  console.log('Updated src/app/favicon.ico');

  // 4. OpenGraph banner 1200x630
  // Composite logo onto a luxury dark brushed background
  const logoResized = await sharp(sourceLogo)
    .resize(450, 450, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radial" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#262626" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#0a0a0a" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#050505" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#radial)"/>
      <rect x="20" y="20" width="1160" height="590" rx="16" fill="none" stroke="#333333" stroke-width="2" stroke-opacity="0.6"/>
      
      <!-- Brand typography -->
      <text x="600" y="520" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="10" text-anchor="middle">DESHIFLEX</text>
      <text x="600" y="560" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="#a1a1aa" letter-spacing="4" text-anchor="middle">OFFICIAL STORE BD • 180-240 GSM DROP SHOULDER STREETWEAR</text>
    </svg>
  `);

  await sharp(svgOverlay)
    .composite([
      {
        input: logoResized,
        top: 60,
        left: 375
      }
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(root, 'public', 'og-image.jpg'));
  console.log('Created public/og-image.jpg');

  console.log('All logo assets successfully updated!');
}

main().catch(console.error);
