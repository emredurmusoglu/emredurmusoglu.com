/**
 * Cloudflare Worker girişi (taşıma 5): OpenNext'in ürettiği Worker'ın önünde
 * ince bir katman. Sadece Worker'ın kendi cevaplarına (sayfalar, sitemap,
 * görseller, server action'lar) dokunur; JS, CSS, font ve public/ dosyaları
 * Worker'a gelmeden sunulur, onların başlıkları public/_headers'ta.
 *
 * Vercel'in kendiliğinden yaptığı iki şeyi burada yapıyoruz:
 * - HSTS: Vercel her alan adına ekliyordu, Cloudflare eklemiyor.
 * - Tarayıcıya giden Cache-Control: Next ISR sayfalarına
 *   "s-maxage=…, stale-while-revalidate=…" yazıyor. Bu CDN içindi; Vercel
 *   tarayıcıya "public, max-age=0, must-revalidate" veriyordu. Önbellek
 *   burada R2'de (open-next.config.ts), tarayıcı her seferinde sorar ve
 *   panelden yayınlanan yazı hemen görünür.
 *
 * tsconfig'den hariç: .open-next/worker.js derlemede üretiliyor, Vercel
 * derlemesinde yok. wrangler bu dosyayı kendisi derliyor.
 */
// @ts-expect-error: derlemede üretilir (opennextjs-cloudflare build)
import handler from "../.open-next/worker.js";

// OpenNext'in Durable Object'i (sayfa yenileme kuyruğu) buradan da
// dışarı açılmalı, yoksa wrangler sınıfı bulamaz.
// @ts-expect-error: derlemede üretilir
export { DOQueueHandler } from "../.open-next/worker.js";

const HSTS = "max-age=63072000";
const VERCEL_GIBI = "public, max-age=0, must-revalidate";
// next/image: kaynak public/ altındaki dosya. Her gösterimde yeniden
// küçültülmesin; dosya değişirse en geç bir haftada yenisi gelir.
const GORSEL = "public, max-age=604800";

type Handler = {
  fetch(request: Request, env: unknown, ctx: unknown): Promise<Response>;
};

const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const response = await (handler as Handler).fetch(request, env, ctx);

    const headers = new Headers(response.headers);
    headers.set("Strict-Transport-Security", HSTS);

    const { pathname } = new URL(request.url);
    const cacheControl = headers.get("Cache-Control");
    if (pathname === "/_next/image" && response.ok) {
      headers.set("Cache-Control", GORSEL);
    } else if (cacheControl?.includes("s-maxage")) {
      headers.set("Cache-Control", VERCEL_GIBI);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
