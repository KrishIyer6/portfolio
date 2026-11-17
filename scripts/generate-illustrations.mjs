// Draws mockup covers for projects that have no screenshot yet and saves them as PNGs in image-source/.
// Each one is drawn in that project's own look, not the portfolio's. They are mockups, not screenshots:
// replace them with real captures when you can. A real image with the same slot name always wins.
import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'
import { feature } from 'topojson-client'

const W = 1600
const H = 1000
const SANS = 'font-family="Segoe UI, Inter, Arial, sans-serif"'
const hash = (n) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return v - Math.floor(v)
}
const svg = (bg, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs><rect width="${W}" height="${H}" fill="${bg}"/>${body}</svg>`
const r = (x, y, w, h, rx, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`
const t = (x, y, s, size, fill, weight = 400, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${SANS}>${s}</text>`

// ---- Make-A-Dash: a dark widget board ----
function makeADash() {
  const card = (x, y, w, h, inner, fill = '#15171e') => `<g transform="translate(${x} ${y})">${r(0, 0, w, h, 26, fill, 'stroke="#262a35" stroke-width="2"')}${inner}</g>`
  const music =
    r(30, 30, 240, 240, 20, 'url(#green)') + `<circle cx="150" cy="150" r="46" fill="#0b0c10" opacity=".35"/><circle cx="150" cy="150" r="10" fill="#eafff1"/>` +
    t(304, 62, 'NOW PLAYING', 18, '#7b8194', 600) + r(304, 86, 300, 26, 8, '#f4f5f7') + r(304, 126, 190, 16, 8, '#5d6375') +
    r(304, 226, 380, 8, 4, '#2b2f3b') + r(304, 226, 170, 8, 4, '#1ed760') + `<circle cx="474" cy="230" r="11" fill="#fff"/>` +
    `<g fill="#f4f5f7" transform="translate(420 150)"><path d="M0 4v36h7V4zM40 4 12 22l28 18z"/><circle cx="92" cy="22" r="32" fill="#1ed760"/><path d="M82 8v28l24-14z" fill="#0b0c10"/><path d="M184 4v36h-7V4zM144 4l28 18-28 18z"/></g>`
  let cal = t(28, 52, 'Calendar', 24, '#f4f5f7', 600) + r(238, 30, 84, 30, 15, '#232a3d') + t(280, 51, 'Today', 15, '#8fb4ff', 600, 'middle')
  for (let i = 0; i < 28; i++) {
    const x = 34 + (i % 7) * 42
    const y = 88 + Math.floor(i / 7) * 40
    cal += i === 10 ? `<circle cx="${x + 8}" cy="${y + 8}" r="17" fill="#4f8cff"/>` : ''
    cal += `<circle cx="${x + 8}" cy="${y + 8}" r="5" fill="${i === 10 ? '#fff' : '#3a4052'}"/>`
  }
  cal += r(28, 252, 190, 22, 11, '#4f8cff', 'opacity=".9"') + r(28, 284, 130, 22, 11, '#8b5cf6', 'opacity=".9"')
  const weather =
    `<circle cx="96" cy="104" r="46" fill="#ffd34d"/><path d="M130 190a44 44 0 0 1 10-87 62 62 0 0 1 118 8 40 40 0 0 1 6 79z" fill="#fff"/>` +
    [0, 1, 2, 3, 4].map((i) => r(34 + i * 60, 300 - [34, 52, 40, 64, 46][i], 36, [34, 52, 40, 64, 46][i], 8, '#ffffff', 'opacity=".55"')).join('')
  const todo = t(28, 52, 'To-do', 24, '#f4f5f7', 600) + [0, 1, 2, 3].map((i) => {
    const y = 92 + i * 56
    return r(28, y, 30, 30, 9, i < 2 ? '#8b5cf6' : 'none', i < 2 ? '' : 'stroke="#3a4052" stroke-width="2.5"') + (i < 2 ? `<path d="M35 ${y + 15}l7 8 12-15" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>` : '') + r(76, y + 8, [200, 150, 220, 170][i], 14, 7, i < 2 ? '#4a5064' : '#e6e8ee')
  }).join('')
  const ticks = Array.from({ length: 12 }, (_, i) => `<path d="M0 -112V-98" transform="rotate(${i * 30})" stroke="#4a5064" stroke-width="5" stroke-linecap="round"/>`).join('')
  const clock = `<g transform="translate(170 165)"><circle r="128" fill="none" stroke="url(#violet)" stroke-width="8"/>${ticks}<path d="M0 0V-74" stroke="#f4f5f7" stroke-width="8" stroke-linecap="round"/><path d="M0 0 58 34" stroke="#8b5cf6" stroke-width="6" stroke-linecap="round"/><circle r="9" fill="#f4f5f7"/></g>`
  const chart = t(28, 52, 'Activity', 24, '#f4f5f7', 600) + `<path d="M28 250 80 204 132 222 190 150 246 172 322 96V290H28Z" fill="#22d3ee" opacity=".16"/><path d="M28 250 80 204 132 222 190 150 246 172 322 96" fill="none" stroke="#22d3ee" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
  const apis = Array.from({ length: 8 }, (_, i) => r(60 + i * 96, 880, 78, 38, 19, '#15171e', 'stroke="#262a35" stroke-width="2"') + `<circle cx="${82 + i * 96}" cy="899" r="6" fill="#1ed760"/>` + r(96 + i * 96, 893, 28, 12, 6, '#4a5064')).join('')
  return svg(
    '#0b0c10',
    t(60, 82, 'Make-A-Dash', 38, '#f4f5f7', 700) + r(1314, 40, 226, 58, 29, '#8b5cf6') + t(1427, 78, '+ Add widget', 22, '#fff', 600, 'middle') +
      card(60, 130, 720, 330, music) + card(810, 130, 350, 330, cal) + card(1190, 130, 350, 330, weather, 'url(#sky)') +
      card(60, 490, 350, 330, todo) + card(440, 490, 340, 330, clock) +
      r(810, 490, 350, 330, 26, 'none', 'stroke="#3a4052" stroke-width="3" stroke-dasharray="14 12"') +
      r(1190, 490, 350, 330, 26, 'none', 'stroke="#8b5cf6" stroke-width="3" stroke-dasharray="14 12"') + t(1440, 792, 'Drop here', 22, '#8b5cf6', 600, 'middle') +
      `<g transform="translate(1000 520) rotate(-5)">${r(14, 22, 350, 330, 26, '#000', 'opacity=".45"')}${r(0, 0, 350, 330, 26, '#1b1e27', 'stroke="#8b5cf6" stroke-width="3"')}${chart}</g>` +
      `<path d="M1290 760v66l17-15 13 30 13-6-13-29 23-2z" fill="#fff" stroke="#0b0c10" stroke-width="3"/>` +
      apis + t(848, 907, '8 APIs connected', 20, '#7b8194', 500),
    `<linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1ed760"/><stop offset="1" stop-color="#0a6b33"/></linearGradient><linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a6df4"/><stop offset="1" stop-color="#6cb8ff"/></linearGradient>`,
  )
}

// ---- Motion Mentor: a light sports-analysis screen ----
function motionMentor() {
  const J = { head: [430, 258], neck: [430, 318], sr: [482, 330], sl: [384, 336], er: [540, 262], wr: [562, 170], el: [330, 392], wl: [296, 344], hip: [426, 512], hr: [456, 516], hl: [396, 516], kr: [502, 630], ar: [492, 760], kl: [360, 640], al: [300, 752] }
  const bones = [['neck', 'sr'], ['neck', 'sl'], ['sr', 'er'], ['er', 'wr'], ['sl', 'el'], ['el', 'wl'], ['neck', 'hip'], ['hip', 'hr'], ['hip', 'hl'], ['hr', 'kr'], ['kr', 'ar'], ['hl', 'kl'], ['kl', 'al']]
  const shift = { er: [20, -18], wr: [44, -34], el: [-8, -14], wl: [-14, -30], kr: [10, -8], head: [8, -4], neck: [6, -2], sr: [8, -4] }
  const at = (k, ref) => (ref && shift[k] ? [J[k][0] + shift[k][0], J[k][1] + shift[k][1]] : J[k])
  const skel = (ref) => {
    const c = ref ? '#ffffff' : '#a3ff5f'
    const wrist = at('wr', ref)
    const tip = ref ? [wrist[0] + 62, wrist[1] - 96] : [wrist[0] + 40, wrist[1] - 104]
    return `<g opacity="${ref ? 0.6 : 1}" stroke="${c}" stroke-width="${ref ? 5 : 8}" stroke-linecap="round" fill="none"${ref ? ' stroke-dasharray="3 14"' : ''}>` + bones.map(([a, b]) => `<path d="M${at(a, ref)}L${at(b, ref)}"/>`).join('') +
      `<circle cx="${at('head', ref)[0]}" cy="${at('head', ref)[1] - 34}" r="34"/><path d="M${wrist}L${tip}" stroke-width="5"/><ellipse cx="${tip[0] + 14}" cy="${tip[1] - 36}" rx="26" ry="40" transform="rotate(20 ${tip[0] + 14} ${tip[1] - 36})" stroke-width="5"/></g>` +
      (ref ? '' : Object.keys(J).filter((k) => k !== 'head').map((k) => `<circle cx="${J[k][0]}" cy="${J[k][1]}" r="10" fill="#101418" stroke="#fff" stroke-width="4"/>`).join(''))
  }
  const curve = (phase, amp) => Array.from({ length: 41 }, (_, i) => `${i === 0 ? 'M' : 'L'}${(990 + i * 12.6).toFixed(1)} ${(838 - Math.sin(i / 6.4 + phase) * amp - Math.sin(i / 2.7 + phase) * 8).toFixed(1)}`).join('')
  const bars = [['Shoulder', 0.34, '#12b76a'], ['Elbow', 0.78, '#f04438'], ['Wrist', 0.56, '#f79009'], ['Knee', 0.22, '#12b76a']]
  return svg(
    '#f3f5f7',
    t(60, 84, 'Motion Mentor', 38, '#101828', 700) + r(1250, 44, 140, 52, 26, '#12b76a') + t(1320, 78, 'Analyze', 21, '#fff', 600, 'middle') + r(1404, 44, 136, 52, 26, '#fff', 'stroke="#d0d5dd" stroke-width="2"') + t(1472, 78, 'History', 21, '#475467', 600, 'middle') +
      r(60, 130, 860, 800, 28, '#fff', 'stroke="#e4e7ec" stroke-width="2"') + r(90, 160, 800, 620, 18, '#101418') +
      `<g clip-path="url(#vid)"><path d="M90 700H890M90 700 250 560H730L890 700M490 560V700" stroke="#1f6b45" stroke-width="4" fill="none"/><path d="M760 700V520" stroke="#e4e7ec" stroke-width="5"/><g transform="translate(150 150) scale(0.72)">${skel(true)}${skel(false)}</g></g>` +
      r(110, 180, 150, 40, 20, '#000', 'opacity=".55"') + `<circle cx="134" cy="200" r="7" fill="#a3ff5f"/>` + t(150, 207, 'Tracking', 18, '#fff', 600) +
      r(90, 836, 800, 10, 5, '#e4e7ec') + r(90, 836, 420, 10, 5, '#12b76a') + `<circle cx="510" cy="841" r="15" fill="#fff" stroke="#12b76a" stroke-width="5"/>` +
      r(950, 130, 590, 240, 28, '#fff', 'stroke="#e4e7ec" stroke-width="2"') + t(986, 184, 'Form match', 26, '#101828', 600) +
      `<path d="M1026 334a84 84 0 1 1 148 0" fill="none" stroke="#e4e7ec" stroke-width="20" stroke-linecap="round"/><path d="M1026 334a84 84 0 0 1 124 -110" fill="none" stroke="#12b76a" stroke-width="20" stroke-linecap="round"/>` +
      t(1230, 262, 'Close to the', 26, '#475467', 500) + t(1230, 298, 'pro reference', 26, '#475467', 500) +
      r(950, 392, 590, 330, 28, '#fff', 'stroke="#e4e7ec" stroke-width="2"') + t(986, 446, 'Joint deviation', 26, '#101828', 600) +
      bars.map(([name, v, c], i) => t(986, 508 + i * 58, name, 21, '#475467', 500) + r(1120, 492 + i * 58, 380, 16, 8, '#f2f4f7') + r(1120, 492 + i * 58, 380 * v, 16, 8, c)).join('') +
      r(950, 744, 590, 186, 28, '#fff', 'stroke="#e4e7ec" stroke-width="2"') + `<path d="${curve(0, 44)}" fill="none" stroke="#12b76a" stroke-width="5"/><path d="${curve(0.7, 36)}" fill="none" stroke="#98a2b3" stroke-width="5" stroke-dasharray="10 8"/>` + t(986, 786, 'Elbow angle, you vs pro', 19, '#667085', 500),
    `<clipPath id="vid"><rect x="90" y="160" width="800" height="620" rx="18"/></clipPath>`,
  )
}

// ---- FuturePop: a light choropleth map ----
function futurePop() {
  const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'))
  const countries = feature(topo, topo.objects.countries).features
  const scale = ['#fdebd0', '#fbc59a', '#f08a78', '#cf5187', '#7b2d8e']
  const px = (lon) => 70 + (lon + 180) * 3.0
  const py = (lat) => 150 + (84 - lat) * 4.3
  let map = ''
  countries.forEach((f, n) => {
    if (f.properties?.name === 'Antarctica') return
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    const lats = polys.flatMap((p) => p[0].map((c) => c[1]))
    const lat = lats.reduce((a, b) => a + b, 0) / lats.length
    // Sample shading only: warmer toward the equator, with a little noise. Not real data.
    const v = Math.max(0, Math.min(0.999, 1 - Math.abs(lat) / 62 + (hash(n) - 0.5) * 0.35))
    const d = polys.map((p) => p.map((ring) => {
      if (ring.some((c, i) => i > 0 && Math.abs(c[0] - ring[i - 1][0]) > 180)) return ''
      return 'M' + ring.map((c) => `${px(c[0]).toFixed(1)} ${py(c[1]).toFixed(1)}`).join('L') + 'Z'
    }).join('')).join('')
    map += `<path d="${d}" fill="${scale[Math.floor(v * 5)]}" stroke="#fff" stroke-width="1.2"/>`
  })
  const rows = Array.from({ length: 8 }, (_, i) => r(1236, 300 + i * 62, 90 + hash(i + 3) * 60, 14, 7, '#d0d5dd') + r(1236, 324 + i * 62, 250 - i * 24, 12, 6, scale[4 - Math.floor(i / 2)])).join('')
  return svg(
    '#ffffff',
    t(70, 84, 'FuturePop', 38, '#1d1b2f', 700) + t(70, 122, 'Predicted fertility rate by country, 2024', 22, '#667085', 500) +
      map +
      scale.map((c, i) => r(70 + i * 64, 900, 64, 18, 0, c)).join('') + t(70, 948, 'Lower', 19, '#667085', 500) + t(390, 948, 'Higher', 19, '#667085', 500, 'end') +
      r(1200, 150, 340, 780, 24, '#faf7fb', 'stroke="#ece6f0" stroke-width="2"') + t(1236, 204, 'Countries', 26, '#1d1b2f', 600) +
      r(1236, 226, 150, 36, 18, '#7b2d8e') + t(1311, 251, 'Random Forest', 16, '#fff', 600, 'middle') + r(1396, 226, 110, 36, 18, '#fff', 'stroke="#d9cfe0" stroke-width="2"') + t(1451, 251, '150+', 16, '#7b2d8e', 600, 'middle') +
      rows + t(1236, 884, '89.6% fit', 30, '#7b2d8e', 700),
  )
}

// ---- Premier League Match Predictor: a match-day prediction card ----
function plPredictor() {
  const feats = [['Expanding goal average', 0.86], ['Expanding win rate', 0.7], ['Home advantage', 0.52], ['Goals conceded', 0.38]]
  return svg(
    '#f4f6f4',
    r(0, 0, W, 330, 0, '#0c6b3c') + `<g stroke="#fff" stroke-opacity=".28" stroke-width="4" fill="none"><path d="M800 0V330M0 60h170v210H0M1600 60h-170v210h170"/><circle cx="800" cy="165" r="96"/></g>` +
      t(70, 84, 'Match Predictor', 38, '#fff', 700) + r(1330, 44, 210, 52, 26, '#fff', 'opacity=".16"') + t(1435, 78, '30k+ matches', 20, '#fff', 600, 'middle') +
      r(70, 180, 1460, 330, 28, '#fff', 'stroke="#e3e8e4" stroke-width="2"') +
      `<circle cx="210" cy="300" r="62" fill="#0c6b3c"/><circle cx="1390" cy="300" r="62" fill="#1d3557"/>` + t(210, 312, 'H', 44, '#fff', 700, 'middle') + t(1390, 312, 'A', 44, '#fff', 700, 'middle') +
      t(300, 290, 'Home', 34, '#101828', 700) + t(1300, 290, 'Away', 34, '#101828', 700, 'end') + t(300, 328, 'Last five: W W D W L', 20, '#667085', 500) + t(1300, 328, 'Last five: L D W L W', 20, '#667085', 500, 'end') +
      t(800, 262, 'Predicted outcome', 20, '#667085', 500, 'middle') +
      r(170, 404, 640, 34, 17, '#0c6b3c') + r(810, 404, 300, 34, 0, '#c9d1cc') + r(1110, 404, 320, 34, 17, '#1d3557') + r(790, 404, 40, 34, 0, '#0c6b3c') + r(1090, 404, 40, 34, 0, '#1d3557') + r(810, 404, 300, 34, 0, '#c9d1cc') +
      t(170, 476, 'Home win', 20, '#0c6b3c', 600) + t(960, 476, 'Draw', 20, '#667085', 600, 'middle') + t(1430, 476, 'Away win', 20, '#1d3557', 600, 'end') +
      r(70, 540, 860, 400, 28, '#fff', 'stroke="#e3e8e4" stroke-width="2"') + t(110, 600, 'What the model leans on', 26, '#101828', 600) +
      feats.map(([name, v], i) => t(110, 668 + i * 66, name, 21, '#475467', 500) + r(430, 650 + i * 66, 450, 20, 10, '#eef2ef') + r(430, 650 + i * 66, 450 * v, 20, 10, '#0c6b3c')).join('') +
      r(960, 540, 570, 400, 28, '#fff', 'stroke="#e3e8e4" stroke-width="2"') + t(1000, 600, 'Home advantage by season', 26, '#101828', 600) +
      `<path d="M1000 880H1490M1000 640V880" stroke="#d0d5dd" stroke-width="2" fill="none"/><path d="${Array.from({ length: 12 }, (_, i) => `${i === 0 ? 'M' : 'L'}${1010 + i * 42} ${(760 - Math.sin(i / 1.9) * 34 - hash(i) * 30).toFixed(1)}`).join('')}" fill="none" stroke="#0c6b3c" stroke-width="5" stroke-linejoin="round"/><path d="${Array.from({ length: 12 }, (_, i) => `${i === 0 ? 'M' : 'L'}${1010 + i * 42} ${(826 - Math.cos(i / 2.3) * 20 - hash(i + 20) * 22).toFixed(1)}`).join('')}" fill="none" stroke="#1d3557" stroke-width="5" stroke-linejoin="round" stroke-dasharray="10 8"/>`,
  )
}

// ---- Sudoku CSP Solver: a paper puzzle being solved ----
function sudoku() {
  const C = 86
  const X = 90
  const Y = 110
  // A valid solved grid: the standard shifted pattern, with rows swapped inside their bands and digits relabelled.
  const order = [1, 0, 2, 5, 3, 4, 6, 8, 7]
  const relabel = [5, 3, 8, 1, 9, 6, 2, 7, 4]
  const digit = (row, col) => relabel[(order[row] * 3 + Math.floor(order[row] / 3) + col) % 9]
  const focus = [4, 5]
  let cells = ''
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const peer = row === focus[0] || col === focus[1] || (Math.floor(row / 3) === 1 && Math.floor(col / 3) === 1)
      const isFocus = row === focus[0] && col === focus[1]
      if (peer) cells += r(X + col * C, Y + row * C, C, C, 0, isFocus ? '#ffd166' : '#fbeecb')
      const given = hash(row * 9 + col) > 0.6
      cells += t(X + col * C + C / 2, Y + row * C + C / 2 + 17, digit(row, col), 48, given ? '#1f2937' : '#2563eb', given ? 700 : 500, 'middle')
    }
  }
  let grid = ''
  for (let i = 0; i <= 9; i++) grid += `<path d="M${X + i * C} ${Y}V${Y + 9 * C}M${X} ${Y + i * C}H${X + 9 * C}" stroke="#1f2937" stroke-width="${i % 3 === 0 ? 5 : 1.5}" stroke-opacity="${i % 3 === 0 ? 1 : 0.4}"/>`
  const check = (y, label) => `<circle cx="1000" cy="${y}" r="20" fill="#2563eb"/><path d="M990 ${y}l7 8 13-16" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` + t(1038, y + 9, label, 26, '#1f2937', 500)
  const node = (x, y, on) => `<circle cx="${x}" cy="${y}" r="16" fill="${on ? '#2563eb' : '#faf6ee'}" stroke="${on ? '#2563eb' : '#9aa3b2'}" stroke-width="3"/>`
  return svg(
    '#faf6ee',
    cells + grid +
      t(980, 150, 'Sudoku CSP Solver', 38, '#1f2937', 700) + t(980, 192, 'Constraint satisfaction with backtracking', 22, '#6b7280', 500) +
      r(980, 232, 250, 44, 22, '#1f2937') + t(1105, 262, 'Easy to expert', 19, '#faf6ee', 600, 'middle') +
      t(980, 350, 'Constraints', 26, '#1f2937', 600) + check(408, 'Rows') + check(468, 'Columns') + check(528, 'Sub-grids') +
      t(980, 630, 'Backtracking search', 26, '#1f2937', 600) +
      `<path d="M1220 690 1090 770M1220 690 1220 770M1220 690 1350 770M1090 770 1040 850M1090 770 1140 850M1350 770 1300 850M1350 770 1400 850" stroke="#9aa3b2" stroke-width="3" fill="none"/><path d="M1220 690 1350 770 1300 850" stroke="#2563eb" stroke-width="5" fill="none"/>` +
      node(1220, 690, true) + node(1090, 770, false) + node(1220, 770, false) + node(1350, 770, true) + node(1040, 850, false) + node(1140, 850, false) + node(1300, 850, true) + node(1400, 850, false) +
      `<path d="M1076 756l28 28M1104 756l-28 28M1206 756l28 28M1234 756l-28 28" stroke="#d92d20" stroke-width="4" stroke-linecap="round"/>`,
  )
}

const jobs = { 'project-makeadash-1': makeADash, 'project-motionmentor-1': motionMentor, 'project-futurepop-1': futurePop, 'project-plpredictor-1': plPredictor, 'project-sudoku-1': sudoku }

// image-source/.illustrations.json records which files this script drew. Anything else in the folder
// is yours, whatever its extension, and is never overwritten.
const LEDGER = 'image-source/.illustrations.json'
const mine = new Set(existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, 'utf8')) : [])
const present = readdirSync('image-source')
for (const [slot, draw] of Object.entries(jobs)) {
  const file = slot + '.png'
  const yours = present.find((f) => f.startsWith(slot + '.') && !(f === file && mine.has(file)))
  if (yours) {
    console.log(slot + ': skipped, ' + yours + ' is a real image')
    // Remove the drawing this script made earlier, so the real image is the only one for the slot.
    if (mine.has(file) && yours !== file && existsSync('image-source/' + file)) unlinkSync('image-source/' + file)
    mine.delete(file)
    continue
  }
  await sharp(Buffer.from(draw())).png().toFile('image-source/' + file)
  mine.add(file)
  console.log(slot + ': drawn')
}
writeFileSync(LEDGER, JSON.stringify([...mine].sort(), null, 2) + String.fromCharCode(10))
