/**
 * usePanZoom.ts
 *
 * Pan + zoom interactions for an SVG viewBox.
 *
 * - Mouse wheel zooms toward the cursor position (keeps the point under
 *   the cursor fixed, like Google Maps).
 * - Left-click + drag pans.
 * - Touch: one-finger drag pans; two-finger pinch zooms around the midpoint.
 * - Clamps zoom factor in [minZoom, maxZoom] and prevents panning the map
 *   completely off-screen.
 *
 * Returned bind props attach to the *outer container* of the SVG (so wheel
 * events still fire over child paths) and expose a viewBox string ready to
 * drop on the <svg> element.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface UsePanZoomOpts {
  width: number;
  height: number;
  minZoom?: number;   // smallest ratio of full-map to viewBox dim (1 = fully zoomed out)
  maxZoom?: number;   // largest ratio
}

interface UsePanZoomResult {
  viewBox: ViewBox;
  viewBoxStr: string;
  zoom: number;
  reset: () => void;
  /** Multiply zoom by factor, centred on the container midpoint. */
  zoomBy: (factor: number) => void;
  isPanning: boolean;
  containerProps: {
    ref: (el: HTMLDivElement | null) => void;
    onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
}

export function usePanZoom({
  width,
  height,
  minZoom = 1,
  maxZoom = 12,
}: UsePanZoomOpts): UsePanZoomResult {
  const initial = useMemo<ViewBox>(
    () => ({ x: 0, y: 0, w: width, h: height }),
    [width, height],
  );

  const [vb, setVb] = useState<ViewBox>(initial);
  const [isPanning, setIsPanning] = useState(false);

  // Refs for interaction state that doesn't trigger re-renders.
  const containerRef    = useRef<HTMLDivElement | null>(null);
  const pointers        = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStart       = useRef<{ pointerX: number; pointerY: number; vb: ViewBox } | null>(null);
  const pinchStart      = useRef<{ dist: number; vb: ViewBox; midSvg: { x: number; y: number } } | null>(null);

  const setRef = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
  }, []);

  // Reset when map dimensions change (e.g. data loads).
  useEffect(() => { setVb(initial); }, [initial]);

  /* ── Helpers ────────────────────────────────────────────────────────── */

  const clientToSvg = useCallback((clientX: number, clientY: number, v: ViewBox) => {
    const el = containerRef.current;
    if (!el) return { x: clientX, y: clientY };
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top)  / rect.height;
    return { x: v.x + px * v.w, y: v.y + py * v.h };
  }, []);

  const clampViewBox = useCallback((v: ViewBox): ViewBox => {
    // Limit dimensions to the zoom range
    const minW = width  / maxZoom;
    const minH = height / maxZoom;
    const maxW = width  / minZoom;
    const maxH = height / minZoom;

    let w = Math.min(Math.max(v.w, minW), maxW);
    let h = Math.min(Math.max(v.h, minH), maxH);
    // Keep aspect locked to the SVG aspect ratio
    const targetAspect = width / height;
    if (Math.abs(w / h - targetAspect) > 0.001) {
      // Fit the shorter dimension; expand the other to match aspect.
      if (w / h > targetAspect) h = w / targetAspect;
      else w = h * targetAspect;
    }

    // Allow panning slightly past edges (10% of viewBox dim on each side)
    const pad = 0.1;
    const minX = -w * pad;
    const minY = -h * pad;
    const maxX = width  - w * (1 - pad);
    const maxY = height - h * (1 - pad);
    const x = Math.min(Math.max(v.x, minX), maxX);
    const y = Math.min(Math.max(v.y, minY), maxY);

    return { x, y, w, h };
  }, [width, height, minZoom, maxZoom]);

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    setVb(prev => {
      const before = clientToSvg(clientX, clientY, prev);
      const w      = prev.w / factor;
      const h      = prev.h / factor;
      // Keep the point under the cursor stationary after zoom
      const x      = before.x - (before.x - prev.x) * (w / prev.w);
      const y      = before.y - (before.y - prev.y) * (h / prev.h);
      return clampViewBox({ x, y, w, h });
    });
  }, [clientToSvg, clampViewBox]);

  /* ── Event handlers ─────────────────────────────────────────────────── */

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Wheel up (negative deltaY) → zoom in.
    const factor = Math.pow(1.0015, -e.deltaY);
    zoomAt(e.clientX, e.clientY, factor);
  }, [zoomAt]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only left button for mouse; pen/touch always
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    containerRef.current?.setPointerCapture(e.pointerId);

    if (pointers.current.size === 1) {
      // Begin pan
      setIsPanning(true);
      setVb(prev => {
        dragStart.current = { pointerX: e.clientX, pointerY: e.clientY, vb: prev };
        return prev;
      });
    } else if (pointers.current.size === 2) {
      // Begin pinch
      const pts = Array.from(pointers.current.values());
      const dx  = pts[1].x - pts[0].x;
      const dy  = pts[1].y - pts[0].y;
      const dist = Math.hypot(dx, dy);
      const midClient = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      setVb(prev => {
        const midSvg = clientToSvg(midClient.x, midClient.y, prev);
        pinchStart.current = { dist, vb: prev, midSvg };
        return prev;
      });
      dragStart.current = null;
      setIsPanning(false);
    }
  }, [clientToSvg]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1 && dragStart.current) {
      // Single-pointer pan
      const start = dragStart.current;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dxClient = e.clientX - start.pointerX;
      const dyClient = e.clientY - start.pointerY;
      const dxSvg = (dxClient / rect.width)  * start.vb.w;
      const dySvg = (dyClient / rect.height) * start.vb.h;
      setVb(clampViewBox({
        x: start.vb.x - dxSvg,
        y: start.vb.y - dySvg,
        w: start.vb.w,
        h: start.vb.h,
      }));
    } else if (pointers.current.size === 2 && pinchStart.current) {
      // Two-pointer pinch
      const pts  = Array.from(pointers.current.values());
      const dx   = pts[1].x - pts[0].x;
      const dy   = pts[1].y - pts[0].y;
      const dist = Math.hypot(dx, dy);
      const factor = dist / pinchStart.current.dist;

      const start = pinchStart.current;
      const w = start.vb.w / factor;
      const h = start.vb.h / factor;
      // Center the new viewBox so start.midSvg stays at the same pixel midpoint
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const midClient = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      const midPxFrac = {
        x: (midClient.x - rect.left) / rect.width,
        y: (midClient.y - rect.top)  / rect.height,
      };
      const x = start.midSvg.x - midPxFrac.x * w;
      const y = start.midSvg.y - midPxFrac.y * h;
      setVb(clampViewBox({ x, y, w, h }));
    }
  }, [clampViewBox]);

  const endPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    try { containerRef.current?.releasePointerCapture(e.pointerId); } catch { /* ignore */ }

    if (pointers.current.size === 0) {
      dragStart.current = null;
      pinchStart.current = null;
      setIsPanning(false);
    } else if (pointers.current.size === 1) {
      // Drop pinch mode; re-anchor single-pointer pan to the remaining finger
      pinchStart.current = null;
      const [remaining] = Array.from(pointers.current.values());
      setVb(prev => {
        dragStart.current = { pointerX: remaining.x, pointerY: remaining.y, vb: prev };
        return prev;
      });
      setIsPanning(true);
    }
  }, []);

  const reset = useCallback(() => setVb(initial), [initial]);

  const zoomBy = useCallback((factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  }, [zoomAt]);

  // Compute zoom level for display
  const zoom = width / vb.w;

  return {
    viewBox: vb,
    viewBoxStr: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`,
    zoom,
    reset,
    zoomBy,
    isPanning,
    containerProps: {
      ref: setRef,
      onWheel,
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
      style: {
        touchAction: 'none',
        cursor: isPanning ? 'grabbing' : 'grab',
        userSelect: 'none',
      },
    },
  };
}
