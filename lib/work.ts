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
  /** Logonun durduğu rozetin rengi (markanın kendi rengi) */
  brand: string;
  /** Vurgu çizgisinin rengi (tailwind gradient) */
  accent: string;
  cover: WorkImage;
  coverSecondary: WorkImage;
  stats: { value: string; label: string }[];
  features: { title: string; body: string; image: WorkImage }[];
  mobile: WorkImage[];
  benefits: { title: string; body: string }[];
  /** Sayfa sonundaki çağrının açıklaması: bu işe benzer ne yapılabilir */
  pitch: string;
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
    brand: "#1E3D8F",
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
    pitch:
      "Rezervasyon, talep toplama, planlama ya da ekibinizin her gün kullanacağı bir panel. Birlikte netleştirip yayına alalım.",
  },
  {
    slug: "menga",
    title: "MengA",
    tagline: "İnşaat firması için referans vitrini olan kurumsal site ve müşteri takip paneli.",
    summary:
      "MengA İnşaat'ın 2012'den bu yana yaptığı işleri, makine parkını ve yurt dışındaki danışmanlık deneyimini iki dilde bir siteye taşıdım. Siteden gelen her talep, ekibin müşteri takibini, yazışmalarını, makinelerini ve tanıtım kataloğunu yönettiği panele düşüyor.",
    company: "MengA İnşaat",
    year: "2026",
    responsibility: "Tasarım, geliştirme, yayın ve bakım",
    scope: "Kurumsal site + yönetim paneli",
    liveUrl: "https://www.menga.com.tr",
    liveLabel: "menga.com.tr",
    logo: "/work/menga/menga-mark-white.svg",
    brand: "#003C78",
    accent: "from-orange-400/80 via-orange-500/50 to-sky-600/70",
    cover: desktop("menga", "site-home", "MengA ana sayfası", "menga.com.tr"),
    coverSecondary: desktop("menga", "panel-ozet", "MengA yönetim paneli", "menga.com.tr/panel"),
    stats: [
      { value: "1", label: "panel: site, müşteri, e-posta, takvim ve filo bir arada" },
      { value: "0", label: "gözden kaçan teklif talebi" },
      { value: "0 saat", label: "katalog hazırlığı, içerik değişince kendini yeniliyor" },
      { value: "Otomatik", label: "envanter takibi, bakım ve belge hatırlatmaları" },
    ],
    features: [
      {
        title: "Yapılan işler, referans dosyası gibi",
        body: "Projeler türe ve işverene göre süzülebiliyor. Kamu kurumlarına teklif hazırlarken istenen bilgiler tek sayfada: işveren, yer, süre, yapılan işler ve saha fotoğrafları.",
        image: desktop("menga", "site-projeler", "Projeler sayfası", "menga.com.tr/projeler"),
      },
      {
        title: "Site, yazılımcıya gerek kalmadan güncel",
        body: "Yeni bir proje, fotoğraf ya da makine panelden ekleniyor ve birkaç saniye içinde sitede. Her içeriğin Türkçesi ve İngilizcesi aynı formda yan yana.",
        image: desktop("menga", "panel-icerik", "Panelde site içeriği", "menga.com.tr/panel/icerik"),
      },
      {
        title: "Teklif talebi doğrudan takibe",
        body: "Siteden gelen her talep panelde yeni bir müşteri kaydı olarak açılıyor ve ekibe anında e-postayla bildiriliyor. Hiçbir talep bir gelen kutusunda unutulmuyor.",
        image: desktop("menga", "site-teklif", "Teklif isteme formu", "menga.com.tr/teklif-iste"),
      },
      {
        title: "Müşteri takibi tek yerde",
        body: "Her kurum, kişi ve görüşme panelde. Kimin hangi aşamada olduğu, sıradaki adımın ne zaman ve kimde olduğu tek bakışta görülüyor; geciken takip kırmızıyla öne çıkıyor.",
        image: desktop("menga", "panel-temaslar", "Temaslar listesi", "menga.com.tr/panel/temaslar"),
      },
      {
        title: "Katalog kendini güncelliyor",
        body: "Türkçe ve İngilizce tanıtım kataloğu sitedeki güncel içerikten tek tıkla hazırlanıyor. Müşteriye bir bağlantı göndermek yetiyor.",
        image: desktop("menga", "panel-katalog", "Katalog ekranı", "menga.com.tr/panel/katalog"),
      },
      {
        title: "Her pazartesi haftalık rapor",
        body: "Yeni talepler, ilerleyen görüşmeler, kazanılan işler, geciken adımlar ve önümüzdeki haftanın planı haftanın başında yöneticinin e-postasında.",
        image: desktop("menga", "panel-rapor", "Haftalık rapor", "menga.com.tr/panel/rapor"),
      },
    ],
    mobile: [
      mobile("menga", "m-home", "Ana sayfa, telefonda"),
      mobile("menga", "m-projeler", "Projeler, telefonda"),
      mobile("menga", "m-proje", "Proje künyesi, telefonda"),
      mobile("menga", "m-makine", "Makine detayı, telefonda"),
    ],
    benefits: [
      {
        title: "Yazışmalar panelden",
        body: "Müşteriye giden e-postalar panelden, çalışanın kendi adresinden gönderiliyor; yanıtlar da ona dönüyor ve geçmiş kayıtta kalıyor.",
      },
      {
        title: "Ortak takvim",
        body: "Görüşmeler, hatırlatmalar, belge bitişleri ve bakımlar aynı takvimde. Herkes kendi işlerini ya da ekibin tamamını görebiliyor.",
      },
      {
        title: "Makineler ve araçlar takipte",
        body: "Saha ekibi çalışma saatini ve bakımı telefondan giriyor. Muayene, trafik sigortası ve kasko bitmeden yöneticilere hatırlatma gidiyor.",
      },
      {
        title: "Herkes kendi yetkisiyle",
        body: "Yönetici her şeyi, ofis ekibi müşteri ve içerik tarafını, saha ekibi yalnızca makineleri görüyor.",
      },
      {
        title: "Yeni dile hazır",
        body: "Site Türkçe ve İngilizce yayında. Almanca eklemek için yalnızca çeviri yeterli; panelde her formda kendiliğinden yeni bir sekme açılıyor.",
      },
      {
        title: "Eski adresler kaybolmadı",
        body: "Eski sitedeki her sayfa yenisine yönleniyor; Google'da kazanılmış yer ve paylaşılmış bağlantılar boşa gitmedi.",
      },
    ],
    pitch:
      "Referanslarınızı anlatan bir site, müşteri takibi, teklif ve yazışmalar ya da ekibinizin her gün kullanacağı bir panel. Birlikte netleştirip yayına alalım.",
  },
];

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug) ?? null;
}
