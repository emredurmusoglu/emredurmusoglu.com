"use client";

import { useRef, useState } from "react";

/** Kaydırıldığında eylemlerin göründüğü genişlik */
const REVEAL = 96;
/** Bu eşiği geçen kaydırma açık kalıyor, altı geri kapanıyor */
const THRESHOLD = 44;

type Side = "left" | "right" | null;
type Action = React.ReactNode | ((close: () => void) => React.ReactNode);

function render(action: Action | undefined, close: () => void) {
  return typeof action === "function" ? action(close) : action;
}

/**
 * Dokunmatik ekranda satırı yana çekince altından eylem çıkaran sarmalayıcı.
 *
 * Sağa çekiş `leftAction`'ı, sola çekiş `rightAction`'ı açıyor. Silme gibi
 * geri alınamayan işleri hep bunun arkasına koyuyoruz: listede duran bir
 * çarpıya elin değip kaydı uçurması çok kolay.
 */
export function SwipeRow({
  children,
  leftAction,
  rightAction,
  disabled = false,
  className = "",
  contentClassName = "",
}: {
  children: React.ReactNode;
  leftAction?: Action;
  rightAction?: Action;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}) {
  const [offset, setOffset] = useState(0);
  const [side, setSide] = useState<Side>(null);
  const [dragging, setDragging] = useState(false);

  const start = useRef<{ x: number; y: number } | null>(null);
  const locked = useRef<"horizontal" | "vertical" | null>(null);

  function close() {
    setOffset(0);
    setSide(null);
  }

  function onTouchStart(event: React.TouchEvent) {
    if (disabled) return;
    const touch = event.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY };
    locked.current = null;
    setDragging(true);
  }

  function onTouchMove(event: React.TouchEvent) {
    if (!start.current) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.current.x;
    const dy = touch.clientY - start.current.y;

    // İlk hareketin yönüne kilitleniyoruz: dikeyse sayfa kaydırmasına
    // karışmıyoruz. (touch-action: pan-y ile birlikte çalışıyor.)
    if (!locked.current) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      locked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
    }
    if (locked.current === "vertical") return;

    const max = leftAction ? REVEAL : 0;
    const min = rightAction ? -REVEAL : 0;
    const clamped = Math.max(min, Math.min(max, dx));
    setOffset(clamped);
    setSide(clamped > 0 ? "left" : clamped < 0 ? "right" : null);
  }

  function onTouchEnd() {
    setDragging(false);
    start.current = null;

    if (Math.abs(offset) >= THRESHOLD) {
      const open = offset > 0 ? REVEAL : -REVEAL;
      setOffset(open);
      setSide(open > 0 ? "left" : "right");
    } else {
      close();
    }
  }

  // Açıkken içeriğe dokunmak eylemi tetiklemesin — önce satırı kapatıyoruz.
  function onClickCapture(event: React.MouseEvent) {
    if (!side) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Kaydırınca açığa çıkan eylemler — içeriğin altında duruyor */}
      <div
        className={[
          "absolute inset-y-0 flex items-center gap-1 px-2",
          side === "left" ? "left-0" : "right-0",
          side ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden={!side}
      >
        {side === "left" ? render(leftAction, close) : null}
        {side === "right" ? render(rightAction, close) : null}
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onClickCapture={onClickCapture}
        style={{
          transform: `translateX(${offset}px)`,
          touchAction: "pan-y",
          transition: dragging ? "none" : "transform 200ms ease",
        }}
        className={`relative ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
