// Draws public/og-image.png (1200 x 630), the card shown when the site link is shared.
import sharp from 'sharp'

const sheet = (y, fill, stroke) => `<path d="M880 ${y} 1110 ${y + 78} 880 ${y + 156} 650 ${y + 78}Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#0f172a" stroke-opacity=".06"/></pattern></defs>
<rect width="1200" height="630" fill="#fbfcf8"/><rect width="1200" height="630" fill="url(#g)"/>
${sheet(330, '#ffffff', '#0f172a')}${sheet(250, '#ffffff', '#0f172a')}${sheet(170, '#ffffff', '#0f172a')}${sheet(90, '#2447f9', '#2447f9')}
<text x="70" y="330" font-family="Arial Black, Impact, Arial, sans-serif" font-weight="900" font-size="128" fill="#0f172a" letter-spacing="-3">KRISH</text>
<text x="70" y="450" font-family="Arial Black, Impact, Arial, sans-serif" font-weight="900" font-size="128" fill="#0f172a" letter-spacing="-3">IYER</text>
<text x="74" y="520" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#334155">CS + AI student, ML researcher, builder</text>
<rect x="74" y="556" width="96" height="6" fill="#2447f9"/>
</svg>`
await sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
console.log('Wrote public/og-image.png')
