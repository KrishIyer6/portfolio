// Converts originals in image-source/ into responsive AVIF, WebP and JPEG files in public/images/
// and records what exists in src/data/images.generated.json so the site only requests real files.
import { existsSync, readFileSync } from 'node:fs'
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'image-source'
const OUT = 'public/images'
const TARGET_WIDTHS = [480, 960, 1600]

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
const manifest = {}
// Files drawn by generate-illustrations.mjs. The site tags these "Illustration" and keeps them out of browser frames.
const ledger = path.join(SRC, '.illustrations.json')
const drawn = existsSync(ledger) ? JSON.parse(readFileSync(ledger, 'utf8')) : []

for (const file of files) {
  const slot = path.parse(file).name
  const input = sharp(path.join(SRC, file)).rotate()
  const meta = await input.metadata()
  const widths = TARGET_WIDTHS.filter((w) => w < meta.width)
  widths.push(Math.min(meta.width, 2400))
  for (const w of widths) {
    const resized = input.clone().resize({ width: w, withoutEnlargement: true })
    await resized.clone().avif({ quality: 55 }).toFile(path.join(OUT, `${slot}-${w}.avif`))
    await resized.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${slot}-${w}.webp`))
    await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `${slot}-${w}.jpg`))
  }
  manifest[slot] = { widths, formats: ['avif', 'webp', 'jpg'], ...(drawn.includes(file) ? { illustration: true } : {}) }
  console.log(`${slot}: ${widths.join(', ')}`)
}

await writeFile('src/data/images.generated.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(`Wrote ${Object.keys(manifest).length} slot(s) to src/data/images.generated.json`)
