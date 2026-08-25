"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
 * Lightweight internal digital signature pad (Phase E).
 *
 * Canvas-based, pointer-event driven (mouse + touch), high-DPI aware. Emits a
 * base64 PNG data URL via onChange whenever a stroke completes, and "" when
 * cleared / empty. No third-party signing provider.
 *
 * PERSISTENCE: assigning canvas.width/height resets the drawing surface, so the
 * signature is kept as a durable data URL in a ref and redrawn after any
 * (re)size. Sizing happens only on mount and on a real window resize, and is a
 * no-op when dimensions are unchanged — so re-renders never wipe the drawing.
 * The signature is cleared ONLY by the Clear button (or when the parent
 * unmounts the pad after a successful submit).
 * ------------------------------------------------------------------------- */

export default function SignaturePad({ onChange, value = "", height = 176 }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const inked = useRef(false); // whether any ink has been drawn
  const last = useRef({ x: 0, y: 0 });
  const cssSize = useRef({ w: 0, h: height });
  const imageData = useRef(""); // durable copy of the signature (survives resizes)
  const suppressClickRef = useRef(false); // swallow the click a drag/draw emits
  const [hasInk, setHasInk] = useState(false);

  // Configure stroke style on the (re)created 2D context.
  const configureContext = (ctx, ratio) => {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0b2a4a";
  };

  // Size the backing store to the element's CSS width. No-op when unchanged, so
  // ordinary re-renders / effect re-invocations never clear the canvas. Any
  // existing signature is redrawn afterwards so a real resize never loses it.
  const fitCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = height;
    const targetW = Math.round(w * ratio);
    const targetH = Math.round(h * ratio);

    if (
      ctxRef.current &&
      canvas.width === targetW &&
      canvas.height === targetH
    ) {
      return; // dimensions unchanged — leave the drawing surface intact
    }

    cssSize.current = { w, h };
    canvas.width = targetW; // NB: assigning width/height clears the canvas
    canvas.height = targetH;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    configureContext(ctx, ratio);
    ctxRef.current = ctx;

    // Restore any existing signature onto the freshly-sized surface.
    if (imageData.current) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = imageData.current;
    }
  };

  // Initialise once on mount; re-fit only on window resize. NOT on re-render.
  // Seed the durable copy from the parent-held `value` so the signature is
  // restored even if this component is re-created (re-mounted) — refs alone do
  // not survive a re-mount, but the parent's persisted value does.
  useEffect(() => {
    if (value && !imageData.current) imageData.current = value;
    fitCanvas();
    const onResize = () => fitCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const emit = () => {
    imageData.current = inked.current
      ? canvasRef.current.toDataURL("image/png")
      : "";
    onChange?.(imageData.current);
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
    canvasRef.current.setPointerCapture?.(e.pointerId);
  };

  const move = (e) => {
    if (!drawing.current) return;
    const p = pos(e);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!inked.current) {
      inked.current = true;
      setHasInk(true);
    }
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    emit();
    // A pointer press/release always emits a trailing compatibility `click`.
    // After a real stroke that click can land on the Clear button and wipe the
    // signature — arm a one-shot guard so the very next click is ignored, then
    // release it on the following macrotask (after the click has dispatched) so
    // deliberate Clear clicks keep working.
    if (inked.current) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const clear = () => {
    // Ignore the synthetic click that immediately follows a drawing stroke.
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const ctx = ctxRef.current;
    if (ctx) ctx.clearRect(0, 0, cssSize.current.w, cssSize.current.h);
    inked.current = false;
    imageData.current = "";
    setHasInk(false);
    onChange?.("");
  };

  return (
    <div>
      <div className="relative rounded-lg border border-gray-300 bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="w-full cursor-crosshair rounded-lg"
          style={{ touchAction: "none" }}
          aria-label="Signature pad"
        />
        {!hasInk && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            Sign here
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-400">Draw your signature above.</p>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-gray-500 underline transition hover:text-gray-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
