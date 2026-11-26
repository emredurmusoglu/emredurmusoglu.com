import { QR_SAYFASI } from "@/lib/qr-generator/sayfa";

// Sabit sayfa: derlemede bir kez üretilir.
export const dynamic = "force-static";

export function GET() {
  return new Response(QR_SAYFASI, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

// Cloudflare'de route handler HEAD'i kendiliğinden karşılamıyor (404 dönüyordu).
export const HEAD = GET;
