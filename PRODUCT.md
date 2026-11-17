# Product

Inferred from the written brief (`portfolio_prompt_with_hobbies_with_images.md`) and the master resume. No interview was held; the brief asked for decisions instead of questions.

## Platform

Web, static. Desktop first, responsive from 360px.

## Stack

Vite, React, TypeScript, Tailwind CSS v4, Three.js with React Three Fiber, GSAP with ScrollTrigger, Motion, Lenis, D3.

## Users

Recruiters, hiring managers, hackathon judges, professors, and other engineers. Most arrive from a resume link on a laptop and give the page under a minute.

## Product purpose

Show what Krish Iyer builds, how well he builds it, and how to reach him. Replace an outdated static page.

## Positioning

A CS and AI student who does two things: builds AI products and checks whether the models behind them hold up. The site is itself evidence of the first.

## Operating context

Hosted as static files in a subfolder at `webpages.charlotte.edu/kiyer6/`, possibly mirrored on GitHub Pages or Vercel. No server, no secrets.

## Capabilities and constraints

- Surface mode: Experience (a portfolio), with a hard requirement that it stays scannable.
- Facts come only from the brief and the resume. Nothing is invented. Gaps are `TODO` entries in `src/data/content.ts`.
- No phone number, home address, or exact location.
- No club crests, logos, or player images.

## Brand commitments

Paper, ink, and one cobalt accent, with the product stack as the hero. See `DESIGN.md`.

## Evidence on hand

Headshot, master resume, written brief, and a second round of direction from Krish: build the site around him as a developer instead of around ArchiTech.

Supplied since the first build: four ArchiTech screenshots, three Ai-FixIT screenshots, one VeinViz screenshot, two hackathon photos, 29 places for the globe, an ArchiTech demo on YouTube, and a resume PDF. No screenshots yet for Make-A-Dash, Motion Mentor, FuturePop, the Premier League Match Predictor, or the Sudoku solver, which use drawn mockups.

Third round of direction from Krish: drop the pinned 3D scroll opening, keep the stack as a live object with better drawing, switch to a light paper-and-ink theme with a cobalt accent, and give each project image its own look with no mockup label.

## Product principles

1. The work leads. Effects support it and never block it.
2. Every number on the page is one Krish can defend.
3. A recruiter can find projects, experience, and contact within seconds from the nav.

## Accessibility and inclusion

WCAG AA contrast, keyboard access, visible focus, reduced-motion alternatives, a no-WebGL fallback, and a text alternative for every visualization.
