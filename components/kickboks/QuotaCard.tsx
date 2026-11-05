/**
 * Ders paketi bir kart gibi: her ders hakkı bir kutu. Yapılan dersler dolu,
 * takvime yazılmış ama henüz yapılmamış olanlar çerçeveli, kalanlar boş.
 * Antrenmanlar burada yok; hak sadece dersle düşüyor.
 */
export function QuotaCard({
  quota,
  used,
  planned,
}: {
  quota: number;
  used: number;
  /** Takvimde bekleyen dersler */
  planned: number;
}) {
  const left = Math.max(0, quota - used);
  const plannedShown = Math.min(planned, left);

  return (
    <section aria-label={`${quota} ders hakkının ${used} tanesi kullanıldı`}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-neutral-500">Ders hakkı</p>
        <p className="font-mono text-sm tabular-nums">
          <span className="text-2xl font-medium text-neutral-900">{used}</span>
          <span className="text-neutral-400"> / {quota}</span>
        </p>
      </div>

      <ol className="mt-3 grid grid-cols-12 gap-1" aria-hidden="true">
        {Array.from({ length: quota }, (_, index) => (
          <li
            key={index}
            className={[
              "h-3.5 rounded-[3px]",
              index < used
                ? "bg-red-600"
                : index < used + plannedShown
                  ? "border border-red-400 bg-red-50"
                  : "bg-neutral-200/80",
            ].join(" ")}
          />
        ))}
      </ol>

      <p className="mt-2 text-xs text-neutral-500">
        {left} ders kaldı
        {plannedShown ? ` · ${plannedShown} tanesi takvimde` : ""}
      </p>
    </section>
  );
}
