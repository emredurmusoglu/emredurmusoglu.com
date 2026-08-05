"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { notifyToast } from "./Toast";

/**
 * Kaydetme butonu + "Kaydedildi" toast'ı.
 *
 * Action bitince toast göstermek için `pending`in true -> false geçişini
 * izliyoruz. Bu yüzden buton, formun yeniden mount olan bölümünün DIŞINDA
 * durmalı — yoksa geçişi yakalayamadan kendisi de sıfırlanır.
 */
export function SubmitButton({
  children,
  pendingLabel = "Kaydediliyor…",
  message = "Kaydedildi",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  message?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) notifyToast(message);
    wasPending.current = pending;
  }, [pending, message]);

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}
