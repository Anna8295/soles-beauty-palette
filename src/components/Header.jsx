import { forwardRef, useImperativeHandle, useRef } from "react";

const Header = forwardRef(function Header(_props, ref) {
  const rootRef = useRef(null);
  const markRef = useRef(null);
  const editionRef = useRef(null);

  useImperativeHandle(ref, () => ({
    // 0 = fully hidden, 1 = fully shown — lets the story scene fade the
    // navbar out while its own oversized wordmark is on screen so the two
    // don't compete for the same corner.
    setVisible(v) {
      if (!rootRef.current) return;
      rootRef.current.style.opacity = v.toFixed(3);
      rootRef.current.style.pointerEvents = v < 0.15 ? "none" : "auto";
    },
  }));

  return (
    <header
      ref={rootRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px clamp(18px, 4vw, 56px)",
        pointerEvents: "none",
        willChange: "opacity",
      }}
    >
      <span
        ref={markRef}
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 18,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--umber)",
          transition: "color 320ms ease",
        }}
      >
        Solea
      </span>
      <span
        ref={editionRef}
        style={{
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--muted)",
          transition: "color 320ms ease",
        }}
      >
        Édition Or · No. 07
      </span>
    </header>
  );
});

export default Header;
