---
name: Tiago Magno — Portfolio & Consulting
description: Sober, editorial UX/UI portfolio where orange is a rare accent, not a base color
colors:
  primary: "#ff5625"
  primary-hover: "#e84e20"
  ink: "#1a1a1a"
  ink-muted: "rgba(26,26,26,0.6)"
  ink-faint: "rgba(26,26,26,0.35)"
  surface-base: "#f9f9f9"
  surface-raised: "#ffffff"
  surface-card: "#f3f1ee"
  surface-close: "#1a1c1d"
  border-quiet: "#e2e2e2"
  paper: "#f5f3f0"
typography:
  display:
    fontFamily: "Lufga, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(44px, 7vw, 84px)"
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Lufga, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(28px, 4vw, 44px)"
    fontWeight: 900
    lineHeight: 1.1
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Lufga, system-ui, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.15em"
rounded:
  pill: "999px"
  lg: "20px"
  md: "16px"
  sm: "10px"
spacing:
  section-y: "96px"
  grid-gap: "32px"
  container-max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "15px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "15px 32px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "15px 32px"
  portfolio-card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
  service-card:
    backgroundColor: "{colors.surface-base}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "28px 24px"
  service-card-highlighted:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "28px 24px"
  stat-badge:
    backgroundColor: "#ffffff"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "24px 32px"
---

# Design System: Tiago Magno — Portfolio & Consulting

## Overview

**Creative North Star: "The Quiet Senior Partner"**

This is a UX/UI designer's own portfolio, but built to double as a sales instrument for PJ/consulting engagements — so the visual system had to read as senior and trustworthy before it reads as creative. The site was deliberately walked back from an earlier dark, saturated, orange-forward identity into something closer to an editorial studio site: white and near-white surfaces, near-black text, generous whitespace, and an accent color that is rationed rather than spent. Rounded corners are used everywhere but never showy — 10–20px, never a pill-shaped hero button screaming for attention. The one section that stays fully dark (Contact, fused with the footer) exists specifically to close the page on a different register, the way a good pitch deck ends on a dark, confident final slide instead of another white one.

Rejected explicitly: the earlier dark-background-plus-solid-orange-blocks look (orange CTA banners, orange page-wide gradients, dark hero with a bleeding photo). None of that returns without a direct request.

**Key Characteristics:**
- Light, editorial, generous whitespace — white/off-white surfaces do almost all of the talking.
- Orange (`#ff5625`) is a rationed accent: numbers, active states, hover flashes, thin underlines — never a filled hero button or a full-section wash.
- Rounded-but-restrained geometry: 10px on buttons, 16–20px on cards and photos, full pill only on true toggle/tag controls.
- One deliberate dark register (Contact + Footer, fused into a single dark block) as the page's closing note.
- Real content only: portfolio, career history, and process content come from confirmed data, never invented testimonials or metrics.

## Colors

Almost monochrome by design — the palette reads as ink-on-paper, with orange treated as a spice, not a base.

### Primary
- **Signal Orange** (`#ff5625`): the one identity color. Used only at small scale — eyebrow labels, active pill/tab fills, stat numbers, thin underlines beneath a highlighted phrase, hover-state text, focus accents. Its hover/pressed twin is **Deep Signal Orange** (`#e84e20`).

### Neutral
- **Ink** (`#1a1a1a`): primary text color on every light surface, and the fill for "dark" buttons and highlighted service cards.
- **Ink Muted** (`rgba(26,26,26,0.6)`): body copy secondary to a heading.
- **Ink Faint** (`rgba(26,26,26,0.3–0.45)`): captions, counts, least-important labels.
- **Base Paper** (`#f9f9f9`): the primary alternating section tone.
- **Raised Paper** (`#ffffff`): the brighter alternating section tone — true white, used for the section that should feel one step "up" from its neighbor.
- **Card Stone** (`#f3f1ee`): the fill behind images and image placeholders, warmer and slightly darker than white so photography reads as inset rather than floating.
- **Border Quiet** (`#e2e2e2`): the only border color on light surfaces; never darkened for "emphasis" — emphasis comes from spacing and shadow, not a heavier border.
- **Close Charcoal** (`#1a1c1d`): the one dark surface color, shared byte-for-byte between the Contact section and the Footer so the two fuse into a single closing block with no visible seam.

### Named Rules
**The Rationed Orange Rule.** Orange never fills a shape larger than a badge, a pill, or a 2–3px accent line. If a design calls for a big colorful CTA block, the answer is a neutral card with a solid-ink button inside it, not an orange one.

**The One Dark Seam Rule.** Exactly one continuous dark region exists on any page: the Contact section flows directly into the Footer using the identical `#1a1c1d` fill, with no divider between them. No other section is allowed to go dark.

## Typography

**Display/Headline Font:** Lufga (with system-ui, -apple-system, sans-serif fallback) — used for every heading, button label, and link, never for paragraph copy.
**Body Font:** Plus Jakarta Sans (loaded via `next/font`, exposed as `--font-body`) — used for paragraphs and long-form copy only.

**Character:** Lufga is a heavy, geometric grotesk that supplies all of the system's visual weight and confidence; Plus Jakarta Sans stays quiet and highly legible underneath it, so the pairing reads as "one loud voice, one calm one," never two competing display faces.

### Hierarchy
- **Display** (900, `clamp(44px, 7vw, 84px)`, line-height 1.0, `-0.02em` tracking): Hero headline only.
- **Headline** (900, `clamp(28px, 4vw, 44px)`, line-height 1.1): section titles (About, Serviços, Experiência, Processo, Consultoria, Contato).
- **Card Title** (700, 17–18px): service card and stat card titles.
- **Body Large** (400, 16px, line-height 1.7): section-intro paragraphs.
- **Body** (400, 14px, line-height 1.6–1.8): supporting paragraph copy.
- **Eyebrow/Label** (700, 11px, `0.15em` tracking, uppercase): the small colored kicker above nearly every section heading.

### Named Rules
**The Highlighted-Phrase Rule.** A heading's emphasized second line or clause is never colored solid orange. It stays ink-colored like the rest of the heading; if it needs a marker at all, that marker is a thin orange underline beneath the phrase, not a fill.

## Layout

Container: `max-width: min(85vw, 1320px)`, centered, `24px` horizontal padding — identical across every section and page. Sections alternate `surface-base` (`#f9f9f9`) and `surface-raised` (`#ffffff`) for rhythm, with **no visual divider between them** — SectionDivider is intentionally a no-op; the flat color change alone marks the seam. Vertical rhythm is `96px` top/bottom padding per section (a shorter `48px` lead-in for a CTA slab that follows directly after a section). Grid gaps scale with content density: `20–32px` for card grids, `56px` between a text column and its companion content column (e.g. the Serviços two-column layout), `72px` between a photo and its text column (About).

Responsive collapse is single-breakpoint per grid, not a fluid system: two-column layouts (`About`, `Serviços`, the Consulting CTA visual) drop to one column at `900px`; card grids drop from 3 → 2 columns at `900px` and 2 → 1 at `500–600px`.

## Elevation & Depth

Flat by default — cards rest on a `1px solid #e2e2e2` border, not a shadow, and most surfaces have no shadow at rest at all. Shadow is reserved for two situations: floating elements that need to visually detach from a busy background (the About stat badges floating over the portrait photo use `0 20px 32px rgba(0,0,0,0.18)`), and **hover response** on interactive cards (portfolio cards and service cards lift with `box-shadow: 0 14–16px 28–32px rgba(0,0,0,0.1–0.14)` plus a `translateY(-3px)` or border-darken on hover). Nothing elevates at rest; elevation is earned by floating over imagery or by the user's cursor.

### Named Rules
**The Hover-Earns-Elevation Rule.** A flat-bordered card never gains a shadow just for existing. Shadow appears only as a hover response or when an element must visually separate from a photo behind it.

## Shapes

Rounding is generous but tiered by role, never a single global radius:
- **10px** — buttons and form inputs (the smallest rounding in the system).
- **12–16px** — small badges, tag chips with visible border, service cards, process cards.
- **16–20px** — portfolio image cards, the About portrait, the Contact form card.
- **28px** — the one deliberately oversized radius, reserved for the full-width "Vamos conversar" CTA slab, marking it as the system's single most relaxed shape.
- **999px / 50%** — true toggles only: the language switcher, filter pills, the PillTabs segmented control, circular icon badges, and stat/number circles.

Borders are always `1px solid #e2e2e2` on light surfaces (`rgba(255,255,255,0.1–0.2)` on the one dark surface); a border is never darkened to signal emphasis — hover states change shadow or background instead, never border weight.

## Components

### Buttons
- **Shape:** `10px` radius, `15px 32px` padding, uppercase label, `13px` / `700` weight, `0.06em` tracking.
- **Primary:** solid `#ff5625` fill, white text — reserved for the site's true top-level conversions (nav "Iniciar Projeto", Hero primary CTA, service-card links).
- **Dark:** solid `#1a1a1a` fill, white text — used for secondary-but-still-committed actions (form submit, portfolio CTA) so orange stays rare.
- **Ghost/Outline:** transparent fill, `1px solid rgba(26,26,26,0.15)` border, ink text — the lowest-commitment action on a light surface (Hero secondary CTA, Consulting CTA).
- **Hover:** primary darkens to `#e84e20`; dark/ghost buttons don't otherwise animate beyond the parent card's hover response.

### Chips / Pills
- **Eyebrow badge:** `1px solid #e2e2e2` border, `999px` radius, `6px 16px` padding, `11px` uppercase ink-muted text — the "Serviços" / "Experiência" section markers.
- **Filter pill:** `100px` radius, inactive = `rgba(26,26,26,0.04)` fill / `rgba(26,26,26,0.12)` border / muted text; active = solid `#ff5625` fill with **white** text; inactive hover darkens fill to `rgba(26,26,26,0.09)` and border to `rgba(26,26,26,0.25)`.
- **Category tag (on photography):** glassy `rgba(255,255,255,0.12)` fill with `rgba(245,243,240,0.2)` border and off-white text, always sitting on the dark scrim at the base of a portfolio image — never on a plain light background.

### Cards / Containers
- **Portfolio card:** the image fills the entire card (no inset frame); `20px` radius, `1px solid #e2e2e2` border, `4:3` aspect ratio. A circular white arrow badge (`north_east` icon) sits absolute top-right, overlapping the image. Category tags and the company title sit **inside** the image, anchored to the bottom, legible via a dark scrim (`linear-gradient(to top, rgba(20,18,16,0.92) → transparent)`) — title in `#f5f3f0`, never ink-on-photo directly. Hover: image scales to `1.06` (clipped by the card's own `overflow: hidden`) and the card gains a soft lift shadow + darker border.
- **Service card:** `16px` radius, `1px solid #e2e2e2` border on `surface-base`; one card per grid is the **highlighted** variant — solid `#1a1a1a` fill, white text, white circular arrow badge. Arrow badge sits absolute top-right in both variants (never bottom-right, never with a rule line above the title). Every card is a full link (currently to `/briefing`); hover lifts `-3px` with a shadow, and non-highlighted cards additionally darken their border.
- **Stat badge (About):** floating white card, `16px` radius, `1px solid #e2e2e2`, `0 20px 32px rgba(0,0,0,0.18)` shadow, centered text — number in `40px`/`800` orange, label in `12px` uppercase ink-muted below it.

### Inputs / Fields
- **Style:** `10px` radius, `1px solid rgba(26,26,26,0.12)` (or `rgba(245,243,240,0.1)` on the dark Contact form), filled with `surface-card` (or `#1a1c1d` on dark), ink/paper text depending on section.
- **Focus:** no glow ring currently implemented; relies on the browser default outline.

### Navigation
- Sticky, blurred (`backdrop-filter: blur(12px)`) header on `var(--color-bg)`, `72px` tall on desktop / `60px` mobile. Nav links use `--color-text-dim`, hover to `--color-text`. The single primary CTA in the nav is always the solid-orange "Iniciar Projeto" button — the one place in the persistent chrome where color is allowed to be a filled button.

### Segmented Control (PillTabs, signature component)
A reusable pill-shaped tab control (`src/components/ui/PillTabs.tsx`) used in the Consultoria section: a `999px`-radius track with `rgba(26,26,26,0.04)` fill, no border. The active tab's background is a `framer-motion` `layoutId`-animated `#1a1a1a` pill that slides between tabs; active label is white, inactive labels are `rgba(26,26,26,0.6)` and flash orange on hover — the only place in the system where hover changes text color to the accent instead of darkening a neutral.

## Do's and Don'ts

### Do:
- **Do** keep orange to badges, numbers, active states, thin underlines, and hover flashes — never a filled area larger than a pill or a 2–3px line (**The Rationed Orange Rule**).
- **Do** put the arrow/action icon top-right on any card that has one, overlapping the artwork rather than sitting in the text flow.
- **Do** give every clickable card a real hover response (lift + shadow, or image zoom under `overflow: hidden`) — a static card reads as broken, not calm.
- **Do** keep the Contact section and Footer on the exact same `#1a1c1d` fill so they read as one uninterrupted block (**The One Dark Seam Rule**).
- **Do** wrap every scroll-revealed block in the existing `FadeIn` component (`whileInView`, once) rather than letting content pop in fully rendered before the user scrolls to it.

### Don't:
- **Don't** revive the dark-background-plus-orange-block look anywhere without an explicit request — it is a confirmed anti-reference, not a fallback.
- **Don't** fill a heading's highlighted phrase with solid orange text; use ink color plus, at most, a thin underline.
- **Don't** invent portfolio stats, testimonials, client logos, or metrics — only the real data in `src/data/portfolio.ts` and the confirmed career history may appear as evidence.
- **Don't** darken a border to signal hover or emphasis; change shadow, background, or transform instead.
- **Don't** treat a reference screenshot the user sends as a color/style instruction by default — read it for structure (text/button/image placement, column count) unless they say otherwise.

### Known Intentional Exception
- **`TalkCTA.tsx`'s dashed mock-browser visual is a confirmed placeholder, not an unfinished defect.** The user explicitly asked for an empty device-mockup frame there so a real project screenshot can be dropped in later. Don't "fix" it by inventing a fake project image — replace it only when a real screenshot is provided, and don't flag it again in a future critique/audit without checking this note first.
