/**
 * Diğer işler — kendi ürünlerim dışında geliştirdiğim projeler.
 *
 * Ürünlerin aksine bunlar panelden yönetilmiyor: her biri görsellerle
 * birlikte elle hazırlanıyor, o yüzden veri burada duruyor. Yeni bir iş
 * eklemek için diziye bir kayıt ekleyip görsellerini public/work/<slug>/
 * altına koymak yeterli; ana sayfa kartı, detay sayfası ve sitemap
 * kendiliğinden oluşur.
 *
 * Metinler iş sahibine yazılıyor, yazılımcıya değil: teknik terim yerine
 * işe ne kazandırdığı.
 */

export type WorkImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tarayıcı çerçevesinin adres çubuğunda görünen yol */
  path?: string;
};

export type Work = {
  slug: string;
  title: string;
  /** Kartta ve sayfa başlığının altında görünen tek cümle */
  tagline: string;
  /** Sayfanın açılış paragrafı */
  summary: string;
  company: string;
  year: string;
  responsibility: string;
  scope: string;
  liveUrl: string;
  liveLabel: string;
  logo: string;
  /** Vurgu çizgisinin rengi (tailwind gradient) */
  accent: string;
  cover: WorkImage;
  coverSecondary: WorkImage;
  stats: { value: string; label: string }[];
  features: { title: string; body: string; image: WorkImage }[];
  mobile: WorkImage[];
  benefits: { title: string; body: string }[];
};

const desktop = (slug: string, file: string, alt: string, path: string): WorkImage => ({
  src: `/work/${slug}/${file}.webp`,
  alt,
  width: 1920,
  height: 1200,
  path,
});

const mobile = (slug: string, file: string, alt: string): WorkImage => ({
  src: `/work/${slug}/${file}.webp`,
  alt,
  width: 780,
  height: 1328,
});

export const works: Work[] = [
  {
    slug: "sibea",
    title: "Sibea",
    tagline: "İş makinesi kiralama firması için canlı müsaitlikli web sitesi ve yönetim paneli.",
    summary:
      "SİBEA İnşaat'ın kiralama sürecini tek bir sisteme taşıdım. Müşterileri hangi makinenin ne zaman boş olduğunu siteden görüp iki dakikada talep bırakıyor; ekip ise teklif, planlama, teslim ve iadeyi tek panelden yönetiyor.",
    company: "SİBEA İnşaat",
    year: "2026",
    responsibility: "Tasarım, geliştirme, yayın ve bakım",
    scope: "Web sitesi + yönetim paneli",
    liveUrl: "https://www.sibea.com.tr",
    liveLabel: "sibea.com.tr",
    logo: "/work/sibea/sibea-mark-white.svg",
    accent: "from-amber-300/80 via-amber-400/50 to-blue-500/70",
    cover: desktop("sibea", "site-home", "Sibea ana sayfası", "sibea.com.tr"),
    coverSecondary: desktop("sibea", "panel-ozet-v2", "Sibea yönetim paneli", "sibea.com.tr/panel"),
    stats: [
      { value: "7/24", label: "canlı müsaitlik, telefon açmadan" },
      { value: "2 dk", label: "içinde kiralama talebi" },
      { value: "1", label: "panel: talepten iadeye her şey" },
      { value: "0", label: "çift rezervasyon riski" },
    ],
    features: [
      {
        title: "Hangi makine ne zaman boş, herkes görüyor",
        body: "Filodaki her makinenin durumu ve önümüzdeki haftaları sitede canlı. Ekip ayrıca bir şey güncellemiyor; panelde yapılan her kiralama siteye anında yansıyor.",
        image: desktop("sibea", "site-filo", "Filo sayfası: canlı müsaitlik", "sibea.com.tr/filo"),
      },
      {
        title: "Dört adımda kiralama talebi",
        body: "Makine, tarih, şantiye ve iletişim. Müşteri talebini gönderdikten sonra takip koduyla durumunu ve teklifi kendisi izliyor.",
        image: desktop("sibea", "site-kirala", "Kiralama talep formu", "sibea.com.tr/kirala"),
      },
      {
        title: "Tüm filo tek ekranda",
        body: "Hangi makine hangi şantiyede, ne zaman dönüyor, sıradaki talep hangisi; ekip tek bakışta görüyor.",
        image: desktop("sibea", "panel-planlama-v2", "Planlama ekranı", "sibea.com.tr/panel/planlama"),
      },
      {
        title: "Talepten iadeye tek panel",
        body: "Teklif verme, kiralamaya dönüştürme, teslim ve iade kaydı, yazdırılabilir kiralama formu. Hepsi aynı yerde.",
        image: desktop("sibea", "panel-ozet-v2", "Panel özet ekranı", "sibea.com.tr/panel"),
      },
    ],
    mobile: [
      mobile("sibea", "m-home", "Ana sayfa, telefonda"),
      mobile("sibea", "m-filo", "Filo, telefonda"),
      mobile("sibea", "m-kirala", "Kiralama talebi, telefonda"),
      mobile("sibea", "m-talep", "Talep takibi, telefonda"),
    ],
    benefits: [
      {
        title: "Çift rezervasyon yok",
        body: "Dolu bir makine aynı tarihe ikinci kez kiralanamıyor.",
      },
      {
        title: "Kendiliğinden giden e-postalar",
        body: "Yeni talep anında ekibe düşüyor, müşteri her adımda bilgilendiriliyor. Her sabah günün işleri, her pazartesi haftanın özeti geliyor.",
      },
      {
        title: "Telefonda hızlı",
        body: "Şantiyede, zayıf bağlantıda bile hızlı açılıyor.",
      },
      {
        title: "Herkes kendi hesabıyla",
        body: "Her çalışan kendi hesabıyla giriyor ve yalnızca yetkisi olan işlemleri yapabiliyor.",
      },
      {
        title: "Firmaya özel tasarım",
        body: "Hazır şablon değil; markanın renkleri ve makinelere özel çizimlerle.",
      },
      {
        title: "Yayından sonra da",
        body: "Alan adı, e-posta ayarları ve bakım dahil her şey tek elden.",
      },
    ],
  },
];

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug) ?? null;
}
