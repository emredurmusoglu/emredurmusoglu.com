/**
 * Bölüm başlığı, koddaki bir yorum satırı gibi: `// kendi projelerim`.
 * Arkadaki kod katmanıyla aynı mono fontta, küçük harfle.
 */
export function SectionLabel({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: React.ReactNode;
  /** Başlık değil de bir etiketse (ör. ikonun yanında) "span" */
  as?: "h2" | "span";
  className?: string;
}) {
  return (
    <Tag className={`font-mono text-xs lowercase text-white/45 ${className}`}>
      <span aria-hidden="true" className="text-white/25">
        {"// "}
      </span>
      {children}
    </Tag>
  );
}

/** Bölümdeki öğe sayısı, iki haneli: 04 */
export function SectionCount({ count }: { count: number }) {
  return (
    <span className="font-mono text-xs tabular-nums text-white/25">
      {String(count).padStart(2, "0")}
    </span>
  );
}
