import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/session.shared";

/**
 * Next 16'da eski "middleware" dosyasının yerini "proxy" aldı.
 *
 * Burası SADECE yönlendirme kolaylığı içindir — cookie'nin varlığına bakar,
 * imzasını doğrulamaz. Gerçek yetki kontrolü `requireSession()` ile sunucu
 * tarafında (layout / page / server action) yapılır. Yetkilendirmeyi tek
 * başına buraya bırakmak, Next'te geçmişte çıkan bypass açıkları nedeniyle
 * önerilmiyor.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasCookie = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/panel/login") {
    if (hasCookie) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
    return NextResponse.next();
  }

  if (!hasCookie) {
    const url = new URL("/panel/login", request.url);
    if (pathname !== "/panel") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
