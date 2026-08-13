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

  const loginPath = pathname.startsWith("/etsy") ? "/etsy/login" : "/panel/login";
  const homePath = pathname.startsWith("/etsy") ? "/etsy" : "/panel";

  // Login sayfasına ASLA dokunma.
  //
  // Burada "cookie varsa panele gönder" demek sonsuz döngü yaratıyordu:
  // süresi dolmuş bir cookie'de proxy panele atıyor, requireSession()
  // doğrulayıp geçersiz bulunca login'e geri atıyor, proxy tekrar panele...
  // Proxy geçerli/geçersiz ayrımını yapamadığı için bu kararı veremez.
  // "Zaten giriş yapmışsan panele git" işini login sayfası kendisi yapıyor.
  if (pathname === loginPath) {
    return NextResponse.next();
  }

  if (!hasCookie) {
    const url = new URL(loginPath, request.url);
    if (pathname !== homePath) url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/etsy/:path*"],
};
