import { useEffect, useRef } from "react";
import { HOTSPOTS, PRODUCTS } from "../data/products";

const FRAME_COUNT = 26;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => `/assets/frames/f${String(i + 1).padStart(2, "0")}.webp`);
const LETTERS = ["S", "o", "l", "e", "a"];
// Fractal-noise SVG, tiled and drifted, so the hero backdrop reads as paper/light rather than a flat fill.
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}")`;
// Shared box so the outline layer's mask lines up pixel-for-pixel with the visible frame image.
// width (not height) is the constrained dimension, so aspect-ratio always holds exactly —
// mixing a fixed height with max-width let the box go narrower than 16:9 on tall/narrow
// screens, letterboxing the contained image and throwing off the mask.
const FRAME_BOX = { width: "min(96vw, calc(90svh * 16 / 9))", aspectRatio: "16 / 9" };
// svh-based (viewport-relative), not %, so the same lift applies identically inside the
// full-viewport word and inside the smaller mask wrapper, keeping the two layers aligned.
const WORD_LIFT = "6svh";
const WORD_FONT = {
  fontFamily: "'BBH Bartle', var(--font-display)",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14.5vw",
  lineHeight: 0.78,
};
const BOB = ["bob1", "bob2", "bob3", "bob2", "bob1"];
const BOB_DUR = ["6.2s", "7.4s", "6.8s", "8.1s", "7.1s"];
const BOB_DELAY = ["0s", "0.4s", "0.9s", "1.3s", "1.8s"];

function ease(v) {
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
}
function clamp01(v) {
  return Math.min(Math.max(v, 0), 1);
}

// Style writes below are imperative (refs, not state) — a 60fps scroll scrub can't afford a re-render per frame.
export default function StoryScene({ headerRef, onOpenProduct }) {
  const stageRef = useRef(null);
  const innerRef = useRef(null);
  const palRef = useRef(null);
  const framesRef = useRef(null);
  const flatRef = useRef(null);
  const wordRef = useRef(null);
  const wordOutlineRef = useRef(null);
  const copyRef = useRef(null);
  const discoverMarkRef = useRef(null);
  const tagRef = useRef(null);
  const hintRef = useRef(null);
  const frameImgs = useRef([]);
  const hotspotRefs = useRef([]);

  const state = useRef({
    shown: 0,
    cur: 0,
    target: 0,
    wide: false,
    xl: false,
    reduced: false,
    interactive: false,
    travel: 0,
  });

  useEffect(() => {
    const s = state.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mq = window.matchMedia("(min-width: 860px)");
    // Matches the .discover-mark breakpoint in index.css — the oversized vertical
    // wordmark (and the navbar hide it replaces) only exist at this width and up.
    const xlMq = window.matchMedia("(min-width: 1280px)");
    const measure = () => {
      s.wide = mq.matches;
      s.xl = xlMq.matches;
      const host = innerRef.current ? innerRef.current.getBoundingClientRect().width : 0;
      s.travel = s.wide ? Math.min(host * 0.17, 240) : 0;

      const copy = copyRef.current;
      if (!copy) return;
      copy.style.left = s.wide ? "clamp(22px, 5vw, 76px)" : "50%";
      copy.style.top = s.wide ? "50%" : "auto";
      copy.style.bottom = s.wide ? "auto" : "clamp(70px, 11vh, 128px)";
      copy.style.width = s.wide ? "min(380px, 32vw)" : "min(500px, 86vw)";
    };
    measure();
    mq.addEventListener("change", measure);
    xlMq.addEventListener("change", measure);
    window.addEventListener("resize", measure);

    if (s.reduced) {
      s.cur = 1;
      s.target = 1;
    }

    return () => {
      mq.removeEventListener("change", measure);
      xlMq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const showFrame = (i) => {
    const s = state.current;
    const imgs = frameImgs.current;
    if (i === s.shown || !imgs.length) return;
    const prev = imgs[s.shown];
    const next = imgs[i];
    if (next) next.style.opacity = "1";
    if (prev && prev !== next) prev.style.opacity = "0";
    s.shown = i;
  };

  const tick = (ts) => {
    const s = state.current;
    const stage = stageRef.current;
    const vh = window.innerHeight || 1;

    if (stage) {
      const span = Math.max(stage.offsetHeight - vh, 1);
      s.target = clamp01(-stage.getBoundingClientRect().top / span);
    }
    s.cur = s.reduced ? s.target : s.cur + (s.target - s.cur) * 0.22;

    const p = s.cur;
    const t1 = clamp01((p - 0.05) / 0.44); // compact opens, drifts aside
    const t2 = clamp01((p - 0.5) / 0.24); // recentre, grow, hand off to the flat photo
    const e1 = ease(t1);
    const e2 = ease(t2);

    showFrame(Math.round(e1 * (FRAME_COUNT - 1)));

    if (palRef.current) {
      const float = s.reduced ? 0 : Math.sin(ts / 2600) * 6 * (1 - e1);
      // At xl the vertical wordmark takes the left margin, so once open the palette
      // settles 80px right of center and slightly larger to balance against it.
      const xlSettle = s.xl ? e2 : 0;
      const x = s.travel * e1 * (1 - e2) + 80 * xlSettle;
      const k = 1 - 0.2 * e1 + (0.2 + 0.06 * xlSettle) * e2;
      palRef.current.style.transform = `translate3d(${x.toFixed(1)}px,${float.toFixed(2)}px,0) scale(${k.toFixed(4)})`;
    }
    if (framesRef.current) framesRef.current.style.opacity = (1 - clamp01((t2 - 0.45) / 0.4)).toFixed(3);
    const f = clamp01((t2 - 0.4) / 0.4);
    if (flatRef.current) {
      flatRef.current.style.opacity = f.toFixed(3);
      const interactive = f > 0.92;
      flatRef.current.style.pointerEvents = interactive ? "auto" : "none";
      if (interactive !== s.interactive) {
        s.interactive = interactive;
        for (const btn of hotspotRefs.current) {
          if (btn) btn.tabIndex = interactive ? 0 : -1;
        }
      }
    }
    // Held below full opacity so the wordmark blends into the backdrop instead of sitting flat on top of it.
    if (discoverMarkRef.current) discoverMarkRef.current.style.opacity = (f * 0.82).toFixed(3);
    if (wordRef.current) wordRef.current.style.opacity = clamp01(1 - t1 / 0.45).toFixed(3);
    if (wordOutlineRef.current) wordOutlineRef.current.style.opacity = clamp01(1 - t1 / 0.45).toFixed(3);
    if (tagRef.current) {
      const g = clamp01(1 - t1 / 0.26);
      tagRef.current.style.opacity = g.toFixed(3);
      tagRef.current.style.pointerEvents = g < 0.1 ? "none" : "auto";
    }
    if (copyRef.current) {
      const c = clamp01((t1 - 0.6) / 0.28) * (1 - clamp01((t2 - 0.05) / 0.3));
      copyRef.current.style.opacity = c.toFixed(3);
      const base = s.wide ? "translateY(-50%)" : "translateX(-50%)";
      copyRef.current.style.transform = `${base} translate3d(0, ${((1 - c) * 18).toFixed(1)}px, 0)`;
      copyRef.current.style.pointerEvents = c < 0.1 ? "none" : "auto";
    }
    if (hintRef.current) hintRef.current.style.opacity = clamp01((t2 - 0.6) / 0.35).toFixed(3);

    if (headerRef && headerRef.current) {
      headerRef.current.setVisible(s.xl ? 1 - f : 1);
    }
  };

  useEffect(() => {
    let id = requestAnimationFrame(function loop(t) {
      tick(t);
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
    // StoryScene never re-renders after mount (no internal state changes),
    // so `tick` is stable — this loop is set up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={stageRef}
      aria-label="The Solea palette, opening"
      style={{ position: "relative", height: "620svh" }}
    >
      <div
        ref={innerRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Golden-hour glow + vignette: gives the flat backdrop a light source and pulls
            focus toward the product instead of sitting as a plain fill. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(58% 46% at 50% 42%, rgba(227,162,92,0.34) 0%, rgba(227,162,92,0) 72%)," +
              "radial-gradient(70% 55% at 66% 78%, rgba(230,185,160,0.24) 0%, rgba(230,185,160,0) 70%)," +
              "radial-gradient(120% 95% at 50% 50%, transparent 58%, rgba(44,23,16,0.09) 100%)",
          }}
        />
        {/* Film-grain texture, slowly drifting, so the light reads as paper rather than a gradient. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-12% -12%",
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.05,
            mixBlendMode: "overlay",
            backgroundImage: GRAIN,
            backgroundSize: "220px 220px",
            animation: "grain-drift 11s ease-in-out infinite alternate",
          }}
        />

        <h1
          ref={wordRef}
          aria-label="Solea"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: `translateY(calc(-50% - ${WORD_LIFT}))`,
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1.5vw",
            ...WORD_FONT,
            color: "var(--gold)",
            WebkitTextStroke: "1px var(--ember)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "block",
                animation: `${BOB[i]} ${BOB_DUR[i]} ease-in-out infinite ${BOB_DELAY[i]}`,
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        {/* Same word again, hollow — masked to the palette's silhouette so only its outline
            shows where the box sits on top, letting the box art fill each letter's counter. */}
        <div
          ref={wordOutlineRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 3,
            ...FRAME_BOX,
            WebkitMaskImage: "url(/assets/frames/f01-mask.png)",
            maskImage: "url(/assets/frames/f01-mask.png)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, calc(-50% - ${WORD_LIFT}))`,
              width: "100vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 1.5vw",
              ...WORD_FONT,
              color: "transparent",
              WebkitTextStroke: "0.18vw var(--umber)",
              userSelect: "none",
            }}
          >
            {LETTERS.map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </div>
        </div>

        <div ref={palRef} style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", willChange: "transform" }}>
          <div
            ref={framesRef}
            style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", ...FRAME_BOX }}
          >
            {FRAMES.map((src, i) => (
              <img
                key={src}
                ref={(el) => (frameImgs.current[i] = el)}
                src={src}
                alt={i === 0 ? "Solea palette, closed" : i === FRAME_COUNT - 1 ? "Solea palette, open" : ""}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: i === 0 ? 1 : 0,
                }}
              />
            ))}
          </div>

          <div ref={flatRef} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "min(88svh, 92vw)", height: "min(88svh, 92vw)", opacity: 0, pointerEvents: "none" }}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <img src="/assets/open.webp" alt="Solea palette, open, five pans and the duo brush" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />

              {HOTSPOTS.map((h, i) => {
                const product = PRODUCTS[h.productId];
                const liftY = h.lift === "up" ? "-7%" : "6%";
                return (
                  <button
                    key={product.id}
                    ref={(el) => (hotspotRefs.current[i] = el)}
                    type="button"
                    tabIndex={-1}
                    aria-label={`${product.name} — ${product.kind}`}
                    onClick={() => onOpenProduct(product.id)}
                    className="hotspot"
                    style={{
                      position: "absolute",
                      ...h.style,
                      padding: 0,
                      border: 0,
                      background: `url(${product.pan}) center / contain no-repeat`,
                      cursor: "pointer",
                      opacity: 0,
                      "--lift-y": liftY,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Vertical wordmark for the open/discover phase — sits in the left margin the
            flat reveal leaves empty, fading in with the flat photo and taking the navbar's
            place (Header.setVisible fades out on the same curve). Sized to run taller and
            wider than the viewport on purpose — the sticky stage's own overflow: hidden
            crops the top, bottom, and left edges, so it reads as a run of type bleeding off
            the frame rather than a boxed logo. */}
        <div
          ref={discoverMarkRef}
          aria-hidden="true"
          className="discover-mark"
          style={{
            position: "absolute",
            left: "-1.4vw",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 4,
            opacity: 0,
            pointerEvents: "none",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.06em",
            ...WORD_FONT,
            fontSize: "min(15vw, 26svh)",
            lineHeight: 0.86,
            color: "var(--gold)",
            WebkitTextStroke: "1px var(--ember)",
            userSelect: "none",
          }}
        >
          {LETTERS.map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </div>

        <div ref={copyRef} style={{ position: "absolute", zIndex: 3, opacity: 0, willChange: "transform, opacity" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ember)" }}>The Golden Hour Palette</span>
          <h2 style={{ marginTop: 16, fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.2vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.015em" }}>
            Warmth, pressed
            <br />
            into five degrees.
          </h2>
          <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.8, color: "var(--muted)" }}>
            Two bronzers for the shape of the light. Two blushes for its temperature. One highlight for where it catches — plus the hand-cut duo brush folded into the lid.
          </p>
        </div>

        <div
          ref={tagRef}
          style={{ position: "absolute", left: "50%", bottom: "clamp(22px, 4vh, 44px)", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}
        >
          <p style={{ maxWidth: "30ch", fontSize: 13, lineHeight: 1.7, letterSpacing: "0.06em", color: "var(--muted)" }}>Five tones of afternoon light, and the brush that carries them.</p>
          <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--rose)" }}>Scroll to open</span>
        </div>

        <div
          ref={hintRef}
          style={{ position: "absolute", left: "50%", bottom: "clamp(20px, 3.4vh, 40px)", transform: "translateX(-50%)", zIndex: 5, opacity: 0, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--ember)", whiteSpace: "nowrap" }}
        >
          Select a pan for its story
        </div>
      </div>
    </section>
  );
}
