export default function Closing() {
  return (
    <section
      style={{
        position: "relative",
        boxSizing: "border-box",
        // Overlaps the section above by 64px and starts fully transparent —
        // rather than guessing a flat color to match the story scene's own
        // vignette-darkened edge, this just lets those exact pixels show
        // through, so there's no seam to begin with. From there it goes
        // straight to umber (no saturated mid-tones, reads as a soft
        // vignette rather than a sunset band) and is spread over enough
        // height to stay gradual. By the time any text starts, the
        // background has settled into a near-black brown, so the headline,
        // CTA and nav all read as one continuous dark footer.
        marginTop: "-64px",
        background: "linear-gradient(to bottom, transparent 0, var(--dawn) 64px, var(--umber) 56%, var(--void) 86%, var(--void) 100%)",
        color: "var(--paper)",
        padding: "clamp(168px, 25vh, 264px) clamp(20px, 5vw, 72px) 0",
        overflow: "hidden",
      }}
    >
      {/* The closed case from the story scene's first frame, zoomed to fill the
          section and faded into the dark ground — brand texture instead of a
          flat fill. Starts below the seam overlap so it doesn't reintroduce
          a hard edge where that blend reveals the section above. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/assets/box-motif.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
      {/* Scrim over the background image: transparent where the seam blend
          already handles darkness, thickening toward the footer nav so the
          copy and links stay legible over the image. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 1,
          inset: 0,
          background: "linear-gradient(to top, var(--void) 0%, rgba(29,15,8,0.72) 40%, rgba(29,15,8,0) 72%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 18,
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--gold)" }}>Maison Solea</span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(28px, 3.6vw, 54px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            maxWidth: "18ch",
          }}
        >
          Shop the collection.
        </h2>
        <p style={{ maxWidth: "44ch", fontSize: 14, lineHeight: 1.8, color: "var(--muted-on-dark)" }}>
          Solea palettes are poured in small batches in Grasse and refilled for life.
        </p>
        <a
          href="#top"
          className="cta-link"
          style={{
            marginTop: 4,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 36px",
            border: "1px solid rgba(250,241,230,0.28)",
            borderRadius: 999,
            color: "var(--paper)",
            fontSize: 11,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            transition: "background 360ms ease, color 360ms ease, border-color 360ms ease",
          }}
        >
          Shop the palette
        </a>
      </div>

      <footer
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1400,
          margin: "clamp(32px, 5vh, 56px) auto 0",
          padding: "22px 0 28px",
          borderTop: "1px solid var(--line-on-dark)",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px 44px",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--muted-on-dark)",
        }}
      >
        <span>© 2026 Maison Solea. All rights reserved.</span>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
          {["Stockists", "Refills", "Journal", "Contact"].map((label) => (
            <a key={label} href="#" className="footer-link" style={{ color: "inherit", transition: "color 260ms ease" }}>
              {label}
            </a>
          ))}
        </nav>
      </footer>
    </section>
  );
}
