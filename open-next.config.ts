// OpenNext (Next.js → Cloudflare Worker) ayarı: Vercel'deki ISR'ın karşılığı.
//
// - Sayfalar R2'de (incrementalCache). Önünde bölgesel önbellek: her Cloudflare
//   veri merkezi sayfanın kopyasını kendi Cache API'sinde tutar, her istekte
//   R2'ye gidilmez (deneme adresinde ölçüldü, taşıma 7).
// - Panelden yayınlayınca revalidatePath D1'e "bu sayfa eskidi" yazar
//   (tagCache); bölgesel kopya da buna bakar, sayfa bir sonraki istekte
//   yenisiyle gelir.
// - Süresi dolan sayfa (revalidate = 3600) arka planda Durable Object
//   kuyruğunda yeniden üretilir (queue); ziyaretçi beklemez.
//
// Bağlantılar wrangler.jsonc'de. OpenNext'in küçük siteler için önerdiği üçlü.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  queue: doQueue,
  tagCache: d1NextTagCache,
});
