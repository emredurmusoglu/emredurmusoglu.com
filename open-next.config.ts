// OpenNext (Next.js → Cloudflare Worker) ayarı.
// Sayfa önbelleği R2'de. Panelden yayınlayınca anında yenileme (D1 etiket
// önbelleği) ve arka planda yenileme (Durable Object kuyruğu) 3. adımda
// eklenecek.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
