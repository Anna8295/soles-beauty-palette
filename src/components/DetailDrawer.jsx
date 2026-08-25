import { useEffect, useRef } from "react";
import { PRODUCTS } from "../data/products";

export default function DetailDrawer({ activeId, onClose }) {
  const open = activeId != null;
  const closeBtnRef = useRef(null);
  const product = open ? PRODUCTS[activeId] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // The story behind the drawer is scroll-driven, so it can't just be
    // `overflow: hidden` — with a 5500px-tall scroll stage and a
    // `position: sticky` scene inside it, hiding overflow on <html> clips
    // the sticky element out of view entirely instead of merely freezing
    // it. Pinning the body in place (and restoring scrollY on close) keeps
    // the frame exactly as it was without touching overflow/clipping.
    const body = document.body;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prev = { position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, width: body.style.width, paddingRight: body.style.paddingRight };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(28, 15, 8, 0.1)",
          backdropFilter: "blur(6px)",
          transition: "opacity 560ms cubic-bezier(.2,.8,.2,1)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={product ? `${product.name} detail` : "Component detail"}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 100,
          height: "100svh",
          width: "min(540px, 100vw)",
          background: "var(--paper)",
          boxShadow: "-40px 0 80px rgba(28, 15, 8, 0.22)",
          transition: "transform 640ms cubic-bezier(.16,1,.3,1)",
          transform: open ? "translateX(0%)" : "translateX(100%)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px clamp(20px, 4vw, 40px)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>
            Component detail
          </span>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close detail"
            style={{
              border: "1px solid var(--line)",
              background: "transparent",
              width: 34,
              height: 34,
              borderRadius: 999,
              cursor: "pointer",
              color: "var(--umber)",
              fontSize: 15,
              lineHeight: 1,
              transition: "background 260ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(28,15,8,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            padding: "clamp(18px, 3vw, 32px) clamp(20px, 4vw, 40px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(14px, 2.4vh, 22px)",
          }}
        >
          {product && (
            <>
              <img
                src={product.detail}
                alt={`${product.name}, ${product.kind.toLowerCase()}`}
                loading="lazy"
                style={{
                  width: "100%",
                  flex: "1 1 auto",
                  minHeight: 0,
                  objectFit: "contain",
                  borderRadius: 4,
                }}
              />
              <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--ember)" }}>{product.kind}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(24px, 3.6vw, 36px)", lineHeight: 1 }}>
                  {product.number} · {product.name}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)" }}>{product.copy}</p>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
