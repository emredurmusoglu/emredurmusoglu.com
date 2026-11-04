"use client";

import { useEffect, useState } from "react";

const NAME = "Emre Durmuşoğlu";
const OPEN = "<h1>";
const CLOSE = "</h1>";
const TOTAL = OPEN.length + NAME.length;

// Etiketin karakter karakter renkleri — kod katmanıyla aynı sınıflar
const OPEN_CLASSES = ["src-p", "src-t", "src-t", "src-p"];

const START_DELAY = 675;
/** Satır yazılınca Enter'a basmadan önceki duraksama */
const BEFORE_ENTER = 780;
/** Enter: satır bir an "çalışan satır" gibi parlar, sonra başlık gelir */
const RUN = 170;

/** İnsan eli gibi: etiket hızlı, isim biraz daha yavaş ve düzensiz. */
function delayAfter(typed: number) {
  if (typed < OPEN.length) return 83;
  // Editör kapanış etiketini ekledi; yazmaya devam etmeden kısa bir an
  if (typed === OPEN.length) return 390;
  if (NAME[typed - OPEN.length - 1] === " ") return 210;
  return 90 + Math.random() * 90;
}

type Phase = "typing" | "run" | "done";

/**
 * Ana sayfadaki isim. Önce başlığın HTML'i kod olarak yazılıyor — `<h1>`
 * yazılınca editör gibi `</h1>` kendiliğinden kapanıyor — satır bitince
 * Enter'a basılmış gibi o satır çalışıyor ve gerçek başlık beliriyor.
 * Başlık metni baştan DOM'da; animasyon sadece görsel (aria-hidden).
 */
export function TypedName() {
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    // Hareket istemeyenlerde CSS kodu gizleyip başlığı doğrudan gösteriyor
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number;
    let count = 0;
    const type = () => {
      count += 1;
      setTyped(count);
      if (count < TOTAL) {
        timer = window.setTimeout(type, delayAfter(count));
        return;
      }
      timer = window.setTimeout(() => {
        setPhase("run");
        timer = window.setTimeout(() => setPhase("done"), RUN);
      }, BEFORE_ENTER);
    };
    timer = window.setTimeout(type, START_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const open = OPEN.slice(0, typed);
  const name = NAME.slice(0, Math.max(0, typed - OPEN.length));

  return (
    <h1 className="relative mb-8 text-4xl font-semibold tracking-[-0.02em] md:text-6xl">
      <span className={phase === "done" ? undefined : "typed-pending"}>{NAME}</span>

      {phase !== "done" ? (
        <span
          aria-hidden="true"
          data-run={phase === "run" ? "" : undefined}
          className="typed-code absolute inset-y-0 -left-3 flex items-center whitespace-pre pl-3 pr-4 font-mono text-xl font-normal tracking-normal md:text-4xl"
        >
          {[...open].map((ch, i) => (
            <span key={i} className={OPEN_CLASSES[i]}>
              {ch}
            </span>
          ))}
          <span className="text-white">{name}</span>
          {phase === "typing" ? <span key={typed} className="typed-caret" /> : null}
          {typed >= OPEN.length ? (
            <>
              <span className="src-p">{"</"}</span>
              <span className="src-t">{CLOSE.slice(2, 4)}</span>
              <span className="src-p">{">"}</span>
            </>
          ) : null}
        </span>
      ) : null}
    </h1>
  );
}
