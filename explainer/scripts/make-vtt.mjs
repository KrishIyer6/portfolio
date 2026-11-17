// Writes out/architech-explainer.vtt from the caption lines in src/script.ts.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('src/script.ts', 'utf8')
const lines = [...src.matchAll(/from: ([0-9.]+), to: ([0-9.]+), text: '([^']*)'/g)]
const stamp = (s) => {
  const n = Number(s)
  const m = Math.floor(n / 60)
  return `00:${String(m).padStart(2, '0')}:${(n - m * 60).toFixed(3).padStart(6, '0')}`
}
const body = lines.map((l, i) => `${i + 1}\n${stamp(l[1])} --> ${stamp(l[2])}\n${l[3]}\n`).join('\n')
mkdirSync('out', { recursive: true })
writeFileSync('out/architech-explainer.vtt', `WEBVTT\n\n${body}`)
console.log(`Wrote ${lines.length} cues`)
