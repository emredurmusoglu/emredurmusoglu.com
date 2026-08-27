/**
 * Hem middleware (edge runtime) hem de sunucu tarafından import edilebilen
 * bağımlılıksız sabitler. Buraya `server-only` ya da node modülü bağımlılığı
 * olan hiçbir şey koyma.
 */
export const SESSION_COOKIE = "panel_session";

/** Proxy'nin isteğe eklediği "hangi yol açıldı" başlığı */
export const PATH_HEADER = "x-pathname";
