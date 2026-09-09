const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceFile = 'C:/Users/JOJO/.gemini/antigravity-ide/brain/762ea082-a8f3-480c-9895-7a3c52874aa9/.user_uploaded/media_1788970695673.png';

async function generateBrandAssets() {
  console.log('Extracting and processing master chrome DF logo...');
  
  // 1. Crop to bounding box of the logo
  const croppedBuf = await sharp(sourceFile)
    .extract({ left: 190, top: 215, width: 655, height: 380 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const data = croppedBuf.data;
  const w = croppedBuf.info.width;
  const h = croppedBuf.info.height;
  const channels = croppedBuf.info.channels;

  // 2. Flood fill outer background with threshold l <= 20
  const isBg = (x, y) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return false;
    const idx = (y * w + x) * channels;
    const l = Math.max(data[idx], data[idx + 1], data[idx + 2]);
    return l <= 20;
  };

  const bg = new Uint8Array(w * h);
  const queue = [];

  for (let x = 0; x < w; x++) {
    if (isBg(x, 0)) { bg[x] = 1; queue.push(x); }
    if (isBg(x, h - 1)) { bg[(h - 1) * w + x] = 1; queue.push((h - 1) * w + x); }
  }
  for (let y = 0; y < h; y++) {
    if (isBg(0, y)) { bg[y * w] = 1; queue.push(y * w); }
    if (isBg(w - 1, y)) { bg[y * w + w - 1] = 1; queue.push(y * w + w - 1); }
  }

  // Inside D loop
  if (isBg(148, 175)) {
    bg[175 * w + 148] = 1;
    queue.push(175 * w + 148);
  }

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % w;
    const y = Math.floor(idx / w);
    const nbs = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of nbs) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!bg[nidx] && isBg(nx, ny)) {
          bg[nidx] = 1;
          queue.push(nidx);
        }
      }
    }
  }

  console.log('Background flooded:', queue.length, 'pixels');

  // 3. Smooth continuous alpha ramp from l=20 to l=80 with color de-darkening
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const inIdx = idx * channels;
      const outIdx = idx * 4;

      const r = data[inIdx];
      const g = data[inIdx + 1];
      const b = data[inIdx + 2];
      const l = Math.max(r, g, b);

      if (bg[idx] || l <= 20) {
        rgba[outIdx] = 0;
        rgba[outIdx + 1] = 0;
        rgba[outIdx + 2] = 0;
        rgba[outIdx + 3] = 0;
      } else if (l < 80) {
        const alphaFraction = (l - 20) / 60;
        rgba[outIdx] = Math.min(255, Math.round(r / alphaFraction));
        rgba[outIdx + 1] = Math.min(255, Math.round(g / alphaFraction));
        rgba[outIdx + 2] = Math.min(255, Math.round(b / alphaFraction));
        rgba[outIdx + 3] = Math.round(alphaFraction * 255);
      } else {
        rgba[outIdx] = r;
        rgba[outIdx + 1] = g;
        rgba[outIdx + 2] = b;
        rgba[outIdx + 3] = 255;
      }
    }
  }

  // 4. Save trimmed master transparent logo
  const trimmedLogoBuffer = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .trim()
    .png({ compressionLevel: 9 })
    .toBuffer();

  const logoMeta = await sharp(trimmedLogoBuffer).metadata();
  console.log(`Master trimmed logo generated: ${logoMeta.width}x${logoMeta.height}`);

  const publicDfLogo = path.join(root, 'public', 'df-logo.png');
  const publicDfLogoTrans = path.join(root, 'public', 'df-logo-transparent.png');
  const publicDfLogoNew = path.join(root, 'public', 'df-logo-new.png');

  fs.writeFileSync(publicDfLogo, trimmedLogoBuffer);
  fs.writeFileSync(publicDfLogoTrans, trimmedLogoBuffer);
  fs.writeFileSync(publicDfLogoNew, trimmedLogoBuffer);
  console.log('Saved public/df-logo.png, df-logo-transparent.png, df-logo-new.png');

  // 5. Generate Favicons & Icons (Multi-resolution for Google Search & Browsers)
  const sizes = [
    { name: 'icon-48.png', size: 48, padding: 2 },
    { name: 'icon-96.png', size: 96, padding: 4 },
    { name: 'icon-192.png', size: 192, padding: 8 },
    { name: 'icon-512.png', size: 512, padding: 20 },
    { name: 'apple-touch-icon.png', size: 180, padding: 10 }
  ];

  for (const s of sizes) {
    const iconSize = s.size - s.padding * 2;
    const resizedLogo = await sharp(trimmedLogoBuffer)
      .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const finalIcon = await sharp({
      create: {
        width: s.size,
        height: s.size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toBuffer();

    fs.writeFileSync(path.join(root, 'public', s.name), finalIcon);
    console.log(`Saved public/${s.name} (${s.size}x${s.size})`);
  }

  // App router specific icons
  const icon32 = await sharp(trimmedLogoBuffer)
    .resize(30, 30, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 1, bottom: 1, left: 1, right: 1, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(root, 'src', 'app', 'icon.png'), icon32);
  fs.writeFileSync(path.join(root, 'public', 'icon.png'), icon32);

  const icon180 = await sharp(trimmedLogoBuffer)
    .resize(160, 160, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 10, bottom: 10, left: 10, right: 10, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(root, 'src', 'app', 'apple-icon.png'), icon180);

  // Favicon.ico
  const icon48Buf = fs.readFileSync(path.join(root, 'public', 'icon-48.png'));
  fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), icon48Buf);
  fs.writeFileSync(path.join(root, 'src', 'app', 'favicon.ico'), icon48Buf);
  console.log('Saved favicon.ico files');

  // 6. OpenGraph / Twitter Banner (1200x630) with signature tagline
  const ogLogoResized = await sharp(trimmedLogoBuffer)
    .resize(500, 290, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const ogSvg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ogGlow" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#2a2a2a" stop-opacity="0.9"/>
          <stop offset="55%" stop-color="#0f0f11" stop-opacity="0.98"/>
          <stop offset="100%" stop-color="#050505" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="50%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#ogGlow)"/>
      <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#27272a" stroke-width="1.5" stroke-opacity="0.7"/>
      
      <!-- Brand Title -->
      <text x="600" y="445" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="44" font-weight="900" fill="url(#silverGradient)" letter-spacing="14" text-anchor="middle">DESHIFLEX</text>
      
      <!-- Signature Tagline -->
      <text x="600" y="495" font-family="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="500" fill="#e4e4e7" letter-spacing="6" text-anchor="middle">CRAFTING A LEGACY FROM BANGLADESH TO THE WORLD</text>
      
      <!-- Quality Subtitle -->
      <text x="600" y="540" font-family="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="600" fill="#71717a" letter-spacing="4" text-anchor="middle">OFFICIAL STORE BD • 180-240 GSM DROP SHOULDER STREETWEAR</text>
    </svg>
  `);

  await sharp(ogSvg)
    .composite([
      {
        input: ogLogoResized,
        top: 100,
        left: 350
      }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(root, 'public', 'og-image.jpg'));
  console.log('Saved public/og-image.jpg with signature tagline');

  console.log('ALL BRAND ASSETS PRODUCED WITH CONTINUOUS ALPHA PERFECTION!');
}

generateBrandAssets().catch(console.error);
