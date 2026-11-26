// OpenNext (Next.js → Cloudflare Worker) ayarı: Vercel'deki ISR'ın karşılığı.
//
// - Sayfalar R2'de (incrementalCache).
// - Panelden yayınlayınca revalidatePath D1'e "bu sayfa eskidi" yazar
//   (tagCache); sayfa bir sonraki istekte yenisiyle gelir.
// - Süresi dolan sayfa (revalidate = 3600) arka planda Durable Object
//   kuyruğunda yeniden üretilir (queue); ziyaretçi beklemez.
//
// Bağlantılar wrangler.jsonc'de. OpenNext'in küçük siteler için önerdiği üçlü.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
  tagCache: d1NextTagCache,
});
