// Base-relative so paths still resolve when the site is served from a
// sub-path (e.g. the GitHub Pages project path), not just from domain root.
const A = import.meta.env.BASE_URL;

// Copy is ordered to match the physical case: two bronzers, two blushes, one
// highlight, the brush — the same left-to-right, top-to-bottom order a hand
// finds them in. `id` is the index the detail drawer keys off of.
export const PRODUCTS = [
  {
    id: 0,
    name: "Sirocco",
    number: "01",
    kind: "Bronzer · Soft matte",
    // The source file named "detail-sirocco" is actually the faceted rose-gold
    // shot (that's Prisme) — "detail-peche" is the plain dust-matte tan pan
    // that actually matches Sirocco's description. Swapped to the right ones.
    detail: `${A}assets/detail-peche.webp`,
    pan: `${A}assets/pan-sirocco.webp`,
    copy: "A dry, dust-fine bronze the colour of sun-baked clay. Sits low on the cheek to carve shape without shine — one pass reads as a week spent outdoors.",
  },
  {
    id: 1,
    name: "Feuille",
    number: "02",
    kind: "Bronzer · Crushed foil",
    detail: `${A}assets/detail-feuille.webp`,
    pan: `${A}assets/pan-feuille.webp`,
    copy: "Pressed like beaten leaf, so the surface breaks into facets under the brush. Deeper and redder than Sirocco, with a satin lift for temples and shoulders.",
  },
  {
    id: 2,
    name: "Solstice",
    number: "03",
    kind: "Blush · Embossed satin",
    detail: `${A}assets/detail-solstice.webp`,
    pan: `${A}assets/pan-solstice.webp`,
    copy: "Struck with a sun motif that grinds away as you wear it down. Warm coral with a gold heart — the colour of the light at its highest.",
  },
  {
    id: 3,
    name: "Pêche",
    number: "04",
    kind: "Blush · Sheer matte",
    detail: `${A}assets/detail-prisme.webp`,
    pan: `${A}assets/pan-peche.webp`,
    copy: "Cool-leaning peach, greyed just enough to read as skin rather than pigment. The last hour of light, when colour drains and warmth stays.",
  },
  {
    id: 4,
    name: "Prisme",
    number: "05",
    kind: "Highlight · Rose-gold foil",
    detail: `${A}assets/detail-sirocco.webp`,
    pan: `${A}assets/pan-prisme.webp`,
    copy: "Faceted rose gold with a wet, foiled finish and no visible glitter. A fingertip on the high cheek and the brow bone is the whole instruction.",
  },
  {
    id: 5,
    name: "No. 07",
    number: "06",
    kind: "Duo brush · Hand-cut",
    detail: `${A}assets/pan-brush.webp`,
    pan: `${A}assets/pan-brush.webp`,
    copy: "Flat and wide for bronzer, tapered at the corner for blush. Hand-cut bristle in a lacquered handle, sized to lie flat in the lid.",
  },
];

// Hotspot geometry on the flat, open-palette photo. `productId` maps each
// physical pan to its entry in PRODUCTS above — the grid reads left→right,
// top→bottom, but the case itself doesn't order the shades numerically.
export const HOTSPOTS = [
  { productId: 2, lift: "up", style: { left: "12.7%", top: "49.89%", width: "24.48%", height: "20.11%" } },
  { productId: 1, lift: "up", style: { left: "34.5%", top: "49.19%", width: "25%", height: "19.71%" } },
  { productId: 3, lift: "up", style: { left: "58.2%", top: "49%", width: "25.71%", height: "19.5%" } },
  { productId: 0, lift: "down", style: { left: "14.59%", top: "71.2%", width: "23.5%", height: "18.7%" } },
  { productId: 4, lift: "down", style: { left: "38.91%", top: "71.4%", width: "25.2%", height: "19.6%" } },
  { productId: 5, lift: "down", style: { left: "64.28%", top: "71.2%", width: "23.77%", height: "18.6%" } },
];
