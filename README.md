# Solea — The Golden Hour Palette

A scroll-driven story site for a fictional luxury bronzer/blush palette, built in React + Vite.

## Run it

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL.

## What's here

- `src/components/StoryScene.jsx` — the scroll-scrubbed opening sequence: the word reveal, the 26-frame compact-opening animation, the flat hoverable palette photo, and the "golden hour" clock. Driven by scroll position via `requestAnimationFrame`, writing styles imperatively through refs (no per-frame React re-renders).
- `src/components/DetailDrawer.jsx` — the slide-in panel for each shade/the brush.
- `src/components/Closing.jsx` — the CTA + footer.
- `src/lib/gradient.js` — interpolates the page's background color across the scroll, walking from dawn to ember.
- `src/data/products.js` — all product copy, hotspot positions, and the clock's time stops. Edit copy here.
- `src/hooks/useLenis.js` — smooth/inertial scrolling (via [Lenis](https://github.com/darkroomengineering/lenis)).

## Known asset issue

`public/assets/frames/f19.webp`–`f26.webp` (the last third of the opening
animation) carry a faint watermark baked into the top-right corner of the
original source photos, from whatever tool generated them. It overlaps the
palette lid's rising corner in those same frames, so it can't be safely
cropped or masked out automatically without risking clipping the product —
it needs a proper source-image touch-up (or regenerating those frames).
