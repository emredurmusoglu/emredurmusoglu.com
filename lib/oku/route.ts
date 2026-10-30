import { useSyncExternalStore } from "react";

/**
 * Oku tek bir statik sayfa; ekranlar URL'nin `#` kısmında:
 * `/oku` kütüphane, `/oku#yeni` yeni metin, `/oku#<id>` okuyucu.
 *
 * Sayfa yeniden yüklenmiyor, ama tarayıcının geri tuşu (Android, masaüstü)
 * yine beklendiği gibi bir önceki ekrana dönüyor.
 */

export type Route =
  { name: "library" } | { name: "new" } | { name: "read"; id: string };

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const value = decodeURIComponent(hash.replace(/^#/, ""));
  if (!value) return { name: "library" };
  if (value === "yeni") return { name: "new" };
  return { name: "read", id: value };
}

/** Uygulama içinden açılan ekranlar geçmişe işaretli giriyor. */
export function navigate(
  to: "library" | "new" | { read: string },
  replace = false,
) {
  const hash =
    to === "library"
      ? ""
      : to === "new"
        ? "#yeni"
        : `#${encodeURIComponent(to.read)}`;
  const url = `${window.location.pathname}${hash}`;
  if (replace) window.history.replaceState({ oku: true }, "", url);
  else window.history.pushState({ oku: true }, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/**
 * Geri: uygulama içinden gelindiyse gerçekten geri git (geçmiş şişmesin),
 * doğrudan bir okuyucu linkiyle açıldıysa kütüphaneye geç.
 */
export function goBack() {
  if (window.history.state?.oku) window.history.back();
  else navigate("library", true);
}
