import Image from "next/image";

import type { WorkImage } from "@/lib/work";

/** Ekran görüntüsünü sade bir tarayıcı penceresi içinde gösterir. */
export function BrowserFrame({
  image,
  sizes = "(max-width: 768px) 100vw, 960px",
  priority = false,
  className = "",
}: {
  image: WorkImage;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:rounded-2xl ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-3 py-2 md:px-4 md:py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        {image.path ? (
          <span className="mx-auto max-w-[70%] truncate rounded-md bg-white/[0.06] px-3 py-0.5 text-center font-mono text-[10px] text-white/40 md:text-[11px]">
            {image.path}
          </span>
        ) : null}
        <span className="w-[42px]" aria-hidden="true" />
      </div>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
    </figure>
  );
}

/** Mobil ekran görüntüsünü telefon çerçevesi içinde gösterir. */
export function PhoneFrame({ image, className = "" }: { image: WorkImage; className?: string }) {
  return (
    <figure
      className={`overflow-hidden rounded-[1.75rem] border-[5px] border-neutral-800 bg-neutral-900 shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(max-width: 768px) 45vw, 220px"
        className="block h-auto w-full"
      />
    </figure>
  );
}

/**
 * Uygulama ekran görüntüsü için iPhone çerçevesi. Köşe yarıçapı yüzdeyle
 * verildiği için her boyutta aynı oranda kalıyor.
 */
export function DeviceFrame({
  image,
  sizes = "(max-width: 768px) 60vw, 300px",
  priority = false,
  className = "",
}: {
  image: WorkImage;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-[14%/6.5%] border-[6px] border-neutral-800 bg-neutral-900 shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/15 ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
    </figure>
  );
}
