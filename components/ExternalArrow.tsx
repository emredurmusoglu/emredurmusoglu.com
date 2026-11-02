/**
 * Dışarı giden bağlantıların yanındaki ↗ oku. Karakter olarak yazınca iOS
 * onu mavi kutulu emojiye çeviriyor; SVG her yerde yazıyla aynı görünür.
 */
export function ExternalArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ml-1 inline-block h-[0.9em] w-[0.9em] align-[-0.1em] ${className}`}
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}
