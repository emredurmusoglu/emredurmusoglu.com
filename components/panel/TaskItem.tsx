"use client";

import { useEffect, useRef, useState } from "react";

import { TOAST_EVENT } from "./Toast";

const DUE_TONE: Record<string, string> = {
  overdue: "text-red-600",
  today: "text-amber-600",
  soon: "text-neutral-500",
  later: "text-neutral-400",
};

const PRIORITY_DOT: Record<number, string> = {
  1: "bg-amber-500",
  2: "bg-red-500",
};

/** Kaydırıldığında eylemlerin göründüğü genişlik */
const REVEAL = 96;
/** Bu eşiği geçen kaydırma açık kalıyor, altı geri kapanıyor */
const THRESHOLD = 44;

type Side = "left" | "right" | null;

export function TaskItem({
  title,
  done,
  priority,
  projectTitle,
  dueText,
  dueTone,
  showProject,
  toggleForm,
  deleteForm,
  editForm,
}: {
  title: string;
  done: boolean;
  priority: number;
  projectTitle: string | null;
  dueText: string | null;
  dueTone: string | null;
  showProject: boolean;
  toggleForm: React.ReactNode;
  deleteForm: React.ReactNode;
  editForm: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [side, setSide] = useState<Side>(null);
  const [dragging, setDragging] = useState(false);

  const start = useRef<{ x: number; y: number } | null>(null);
  const locked = useRef<"horizontal" | "vertical" | null>(null);

  // Kaydetme bittiğinde formu kapat. Toast olayı bunun tek güvenilir
  // sinyali: form sunucudan geldiği için submit'ini buradan izleyemiyoruz.
  useEffect(() => {
    if (!editing) return;
    const onSaved = () => setEditing(false);
    window.addEventListener(TOAST_EVENT, onSaved);
    return () => window.removeEventListener(TOAST_EVENT, onSaved);
  }, [editing]);

  function onTouchStart(event: React.TouchEvent) {
    if (editing) return;
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

    const clamped = Math.max(-REVEAL, Math.min(REVEAL, dx));
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

  function close() {
    setOffset(0);
    setSide(null);
  }

  function openEditor() {
    close();
    setEditing(true);
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3">
        {editForm}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg px-3 py-1.5 text-xs text-neutral-500 transition hover:text-neutral-800"
          >
            Vazgeç
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="group relative overflow-hidden rounded-xl">
      {/* Kaydırınca açığa çıkan eylemler — içeriğin altında duruyor */}
      <div
        className={[
          "absolute inset-y-0 flex items-center gap-1 px-2",
          side === "left" ? "left-0" : "right-0",
          side ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden={!side}
      >
        <button
          type="button"
          onClick={openEditor}
          tabIndex={side ? 0 : -1}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
        >
          Düzenle
        </button>
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          touchAction: "pan-y",
          transition: dragging ? "none" : "transform 200ms ease",
        }}
        className="relative flex items-start gap-3 rounded-xl bg-neutral-50 px-3 py-2.5 transition-colors hover:bg-neutral-100 md:bg-white md:hover:bg-neutral-50"
      >
        <div className="pt-0.5">{toggleForm}</div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {PRIORITY_DOT[priority] && !done ? (
              <span
                className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[priority]}`}
                aria-label={priority === 2 ? "Acil" : "Önemli"}
              />
            ) : null}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              title={expanded ? "Kapat" : "Tamamını göster"}
              className={[
                "min-w-0 flex-1 rounded text-left text-sm transition",
                expanded ? "whitespace-pre-wrap break-words" : "truncate",
                done ? "text-neutral-400 line-through" : "text-neutral-800",
              ].join(" ")}
            >
              {title}
            </button>
          </div>

          {(showProject && projectTitle) || dueText ? (
            <div className="mt-1 flex items-center gap-2 text-xs">
              {showProject && projectTitle ? (
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-neutral-500 md:bg-neutral-100">
                  {projectTitle}
                </span>
              ) : null}
              {dueText && !done ? (
                <span className={DUE_TONE[dueTone ?? "later"]}>{dueText}</span>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Masaüstünde dokunma yok — eylemler imleçle beliriyor */}
        <div className="flex items-center gap-0.5 pt-0.5">
          <button
            type="button"
            onClick={openEditor}
            aria-label="Düzenle"
            className="hidden rounded-md p-1 text-transparent transition group-hover:text-neutral-400 hover:!text-indigo-600 md:block"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          {deleteForm}
        </div>
      </div>
    </li>
  );
}
