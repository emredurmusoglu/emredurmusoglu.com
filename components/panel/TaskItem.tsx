"use client";

import { useEffect, useState } from "react";

import { SwipeRow } from "@/components/SwipeRow";

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
  deleteSwipeForm,
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
  /** Masaüstünde imleçle beliren küçük çarpı */
  deleteForm: React.ReactNode;
  /** Telefonda sola kaydırınca çıkan "Sil" düğmesi */
  deleteSwipeForm: React.ReactNode;
  editForm: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  // Kaydetme bittiğinde formu kapat. Toast olayı bunun tek güvenilir
  // sinyali: form sunucudan geldiği için submit'ini buradan izleyemiyoruz.
  useEffect(() => {
    if (!editing) return;
    const onSaved = () => setEditing(false);
    window.addEventListener(TOAST_EVENT, onSaved);
    return () => window.removeEventListener(TOAST_EVENT, onSaved);
  }, [editing]);

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
    <li className="group">
      <SwipeRow
        className="rounded-xl"
        contentClassName="flex items-start gap-3 rounded-xl bg-neutral-50 px-3 py-2.5 transition-colors hover:bg-neutral-100 md:bg-white md:hover:bg-neutral-50"
        leftAction={(close) => (
          <button
            type="button"
            onClick={() => {
              close();
              setEditing(true);
            }}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
          >
            Düzenle
          </button>
        )}
        rightAction={deleteSwipeForm}
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
        <div className="hidden items-center gap-0.5 pt-0.5 md:flex">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Düzenle"
            className="rounded-md p-1 text-transparent transition group-hover:text-neutral-400 hover:!text-indigo-600"
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
      </SwipeRow>
    </li>
  );
}
