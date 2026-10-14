/**
 * Kendi ürünlerimin detay sayfaları (/projeler/<slug>).
 *
 * Kartın kendisi (başlık, açıklama, ikon, mağaza bağlantıları) panelden,
 * veritabanından geliyor; burada yalnızca vitrin içeriği var: ekran
 * görüntüleri, öne çıkanlar, rakamlar. `slug` panel kaydındaki slug ile
 * aynı olmalı. Bir ürüne burada kayıt eklenince ana sayfa kartında
 * "İncele" çıkar, detay sayfası ve sitemap kendiliğinden oluşur.
 *
 * Görseller public/products/<slug>/ altında. Telefon görüntüleri 660px
 * genişliğinde, masaüstü görüntüleri 1920×1200.
 *
 * Metinler kullanıcıya yazılıyor, yazılımcıya değil.
 */

import type { WorkImage } from "@/lib/work";

export type ProductFeature = {
  title: string;
  body: string;
  image: WorkImage;
};

export type ProductShowcase = {
  slug: string;
  /** Uygulama mı, web ürünü mü: sayfanın görsel düzeni buna göre değişiyor */
  kind: "app" | "web";
  tagline: string;
  summary: string;
  category: string;
  platform: string;
  year: string;
  /** Vurgu çizgisi (tailwind gradient) */
  accent: string;
  /** Sayfa arka planındaki ışıltı (tailwind gradient) */
  glow: string;
  /** Uygulamalarda başlıktaki üç telefon (ortadaki öne çıkar) */
  heroPhones?: [WorkImage, WorkImage, WorkImage];
  /** Web ürünlerinde başlıktaki tarayıcı + telefon */
  heroDesktop?: WorkImage;
  heroMobile?: WorkImage;
  stats: { value: string; label: string }[];
  features: ProductFeature[];
  /** "Telefonda" bölümü: yalnızca web ürünlerinde */
  mobile?: WorkImage[];
  highlights: { title: string; body: string }[];
};

const phone = (slug: string, file: string, alt: string, height = 1434): WorkImage => ({
  src: `/products/${slug}/${file}.webp`,
  alt,
  width: 660,
  height,
});

const desktop = (slug: string, file: string, alt: string, path: string): WorkImage => ({
  src: `/products/${slug}/${file}.webp`,
  alt,
  width: 1920,
  height: 1200,
  path,
});

const vaktinde = (file: string, alt: string) => phone("vaktinde", file, alt);
const alarmix = (file: string, alt: string) => phone("alarmix", file, alt);
const online = (file: string, alt: string) => phone("on-line", file, alt, 1440);
const davetiva = (file: string, alt: string) => phone("davetiva", file, alt);

export const products: ProductShowcase[] = [
  {
    slug: "davetiva",
    kind: "web",
    tagline: "Düğün, kına ve nişan için tek bağlantıyla paylaşılan dijital davetiye.",
    summary:
      "Kağıt davetiyenin yerine, WhatsApp'tan tek bağlantıyla gönderilen şık bir davetiye sayfası. Çift bilgileri girip tasarımını seçiyor, misafirler davetiyeyi açıp katılımını bildiriyor; kim geliyor, kaç kişi geliyor, hepsi canlı olarak panelde.",
    category: "Dijital davetiye platformu",
    platform: "Web · telefon öncelikli",
    year: "2025",
    accent: "from-amber-300/80 via-rose-300/50 to-indigo-400/70",
    glow: "from-amber-400/20 via-rose-400/15 to-indigo-500/25",
    heroDesktop: desktop("davetiva", "home", "Davetiva ana sayfası", "davetiva.com"),
    heroMobile: davetiva("m-invite", "Örnek davetiye, telefonda"),
    stats: [
      { value: "6", label: "farklı davetiye tasarımı" },
      { value: "1", label: "bağlantı: davetiva.com/i/isimleriniz" },
      { value: "Canlı", label: "katılım takibi panelde" },
      { value: "Tek", label: "seferlik ücret, abonelik yok" },
    ],
    features: [
      {
        title: "Tarzınıza uygun tasarım",
        body: "Sade, klasik, romantik ya da modern. Tasarımı seçip önizliyor, bilgilerinizi giriyorsunuz; yayına almadan önce istediğiniz kadar düzenleyebiliyorsunuz.",
        image: desktop("davetiva", "designs", "Davetiye tasarımları", "davetiva.com/designs"),
      },
      {
        title: "Misafirin gördüğü davetiye",
        body: "İsimler, tarih, mekan ve size özel mesajınız. Arka planda müzik ya da kendi sesinizle kaydettiğiniz bir mesaj çalabiliyor.",
        image: desktop("davetiva", "invite", "Örnek davetiye", "davetiva.com/i/elif-mert"),
      },
      {
        title: "Kına, nikah, düğün: hepsi bir arada",
        body: "Birden fazla etkinliği aynı davetiyede topluyorsunuz. Misafir hangisine katılacağını seçiyor, harita ve takvime ekleme tek dokunuşla.",
        image: desktop("davetiva", "ivory", "Klasik tasarımlı davetiye", "davetiva.com/i/elif-mert"),
      },
    ],
    mobile: [
      davetiva("m-invite", "Davetiyenin açılışı"),
      davetiva("m-program", "Etkinlik programı ve hikayeniz"),
      davetiva("m-rsvp", "Katılım formu"),
      davetiva("m-gift", "Hediye ve IBAN bölümü"),
    ],
    highlights: [
      {
        title: "Katılım formu ve canlı panel",
        body: "Misafir gelip gelmeyeceğini, kaç kişi olduğunu ve notunu bırakıyor; liste panelinizde anında güncelleniyor.",
      },
      {
        title: "Fotoğraf ve video galerisi",
        body: "Misafirler düğünde çektikleri fotoğrafları doğrudan size gönderebiliyor.",
      },
      {
        title: "Hediye ve IBAN bölümü",
        body: "İsterseniz hediye önerileri ve banka bilgileri; istemezseniz tek tıkla gizli.",
      },
      {
        title: "Müzik ya da sesli mesaj",
        body: "Davetiye açıldığında arka planda şarkınız ya da kendi sesiniz.",
      },
      {
        title: "Harita ve takvim",
        body: "Mekana yol tarifi ve etkinliği takvime ekleme, misafirin telefonunda tek dokunuş.",
      },
      {
        title: "Türkçe ve İngilizce",
        body: "Davetiye ve site iki dilde; yurt dışındaki misafirler de rahatça okuyor.",
      },
    ],
  },
  {
    slug: "alarmix",
    kind: "app",
    tagline: "Görevleri tamamlamadan susmayan, sizi gerçekten uyandıran alarm.",
    summary:
      "Erteleye erteleye geç kalanlara özel. AlarMix çaldığında kapatmak için önce bir görevi bitirmeniz gerekiyor: birkaç işlem çözmek, kart eşleştirmek ya da bir cümle yazmak. Görev bittiğinde artık uyanmış oluyorsunuz.",
    category: "Alarm uygulaması",
    platform: "iPhone",
    year: "2026",
    accent: "from-violet-400/80 via-fuchsia-400/50 to-sky-400/70",
    glow: "from-violet-600/30 via-fuchsia-500/15 to-indigo-500/20",
    heroPhones: [
      alarmix("tasks", "Uyanma görevleri ayarı"),
      alarmix("alarms", "Alarm listesi"),
      alarmix("math", "Matematik görevi"),
    ],
    stats: [
      { value: "5", label: "farklı uyanma görevi" },
      { value: "24", label: "alarm sesi" },
      { value: "11", label: "dilde kullanılabiliyor" },
      { value: "0", label: "görev bitmeden kapatma yolu" },
    ],
    features: [
      {
        title: "Alarmlarınız, tek bakışta",
        body: "Hafta içi, hafta sonu ya da tek seferlik. Her alarmın hangi günlerde çalacağı ve hangi görevleri istediği listede görünüyor.",
        image: alarmix("alarms", "Alarm listesi"),
      },
      {
        title: "Görevi ve zorluğu siz seçin",
        body: "Matematik, hafıza, desen, yazma ya da fotoğraf. Soru sayısını, işlemleri ve süreyi ayarlıyorsunuz; uykunuz ne kadar ağırsa o kadar zor.",
        image: alarmix("tasks", "Görev ayarları"),
      },
      {
        title: "Çöz, sonra sustur",
        body: "Alarm çalarken birkaç işlem çözmeden ya da kartları eşleştirmeden susmuyor. Beyniniz çalıştığında uyku da kaçıyor.",
        image: alarmix("memory", "Hafıza oyunu görevi"),
      },
      {
        title: "Görevler bitti, gün başladı",
        body: "Tüm görevler tamamlandığında alarm duruyor. 10 saniyelik susturma ise sadece kısa bir nefes, kaçış yolu değil.",
        image: alarmix("stop", "Alarmı durdurma ekranı"),
      },
    ],
    highlights: [
      {
        title: "Beş çeşit görev",
        body: "Matematik, hafıza oyunu, desen, yazma ve fotoğraf görevi. Birkaçını aynı alarma ekleyebiliyorsunuz.",
      },
      {
        title: "24 farklı ses",
        body: "Kuş sesi ve yumuşak piyanodan sirene kadar; her alarma ayrı ses.",
      },
      {
        title: "Kilit ekranında",
        body: "Widget ve canlı etkinlik ile sıradaki alarm her an gözünüzün önünde.",
      },
      {
        title: "Uyanma istatistikleri",
        body: "Alarm çaldıktan sonra kaç dakikada kalktığınız; haftalık ortalamanız ve en hızlı gününüz.",
      },
      {
        title: "11 dil",
        body: "Türkçe, İngilizce, Almanca, Japonca, Korece ve daha fazlası.",
      },
      {
        title: "Koyu, göz yormayan tasarım",
        body: "Sabahın köründe gözünüzü almayan, sade bir arayüz.",
      },
    ],
  },
  {
    slug: "on-line",
    kind: "app",
    tagline: "Rüzgara karşı çizgide kalmaya çalıştığınız, tek dokunuşla oynanan arcade oyunu.",
    summary:
      "Kural basit: çizginin üzerinde kal. Ama rüzgar sizi itiyor, engeller yolu kesiyor ve her saniye biraz daha zorlaşıyor. Kısa molalar için tasarlandı, ama elden bırakması zor.",
    category: "Arcade oyun",
    platform: "iPhone ve Android",
    year: "2026",
    accent: "from-fuchsia-400/80 via-violet-400/50 to-cyan-400/70",
    glow: "from-fuchsia-600/25 via-violet-600/25 to-cyan-500/15",
    heroPhones: [
      online("wind", "Rüzgara karşı denge"),
      online("play", "Oyun ekranı"),
      online("bubbles", "Güçlendirme baloncukları"),
    ],
    stats: [
      { value: "1", label: "dokunuşla kontrol" },
      { value: "4+", label: "güçlendirme: kalkan, can, süre, ters" },
      { value: "∞", label: "bitmeyen, giderek zorlaşan oyun" },
      { value: "2", label: "platform: iOS ve Android" },
    ],
    features: [
      {
        title: "Rüzgar hiç durmuyor",
        body: "Rüzgar sizi sürekli çizginin dışına itiyor. Parmağınızla dengeyi tutuyor, çizgiden düştüğünüzde süre bitmeden geri dönmeye çalışıyorsunuz.",
        image: online("play", "Oyun ekranı"),
      },
      {
        title: "Baloncuklar işinize yarar",
        body: "Kalkan rüzgarı kesiyor, +2 çizgi dışında fazladan süre veriyor, kalp ise ekstra can. Doğru anda toplamak skoru katlıyor.",
        image: online("bubbles", "Güçlendirme baloncukları"),
      },
      {
        title: "Dikkat: ters baloncuk",
        body: "Engellerden uzak durun. Ters baloncuk kontrolleri tersine çeviriyor; sağa çektiğinizde sola gidiyorsunuz.",
        image: online("watch", "Engeller ve ters baloncuk"),
      },
    ],
    highlights: [
      {
        title: "Öğrenmesi kolay",
        body: "Tek parmak, tek kural. İlk oyunda ne yapacağınızı biliyorsunuz.",
      },
      {
        title: "Ustalaşması zor",
        body: "Hız ve rüzgar arttıkça her saniye yeni bir sınav.",
      },
      {
        title: "Kısa oturumlar",
        body: "Kuyrukta, otobüste, iki iş arasında; bir el oyun her zaman sığar.",
      },
      {
        title: "Neon, sade görünüm",
        body: "Dikkatinizi dağıtmayan, akıcı ve şık bir tasarım.",
      },
    ],
  },
  {
    slug: "vaktinde",
    kind: "app",
    tagline: "Diyanet'in resmî vakitleri, susturana kadar çalan ezan alarmı ve kıble, tek uygulamada.",
    summary:
      "Namaz vakitlerini takip etmenin sade ve zarif yolu. Ana ekranda dönen canlı dünya, bir sonraki vakte kalan süre ve günün gökyüzü; arkasında ise Diyanet'in resmî vakitleri. Kur'an-ı Kerim, imsakiye, kıble pusulası ve Apple Watch desteğiyle.",
    category: "Namaz vakti ve ibadet",
    platform: "iPhone, Apple Watch, CarPlay",
    year: "2026",
    accent: "from-violet-400/80 via-indigo-400/50 to-sky-300/70",
    glow: "from-indigo-600/30 via-violet-600/20 to-sky-500/15",
    heroPhones: [
      vaktinde("quran", "Kur'an-ı Kerim"),
      vaktinde("home", "Ana ekran, gece"),
      vaktinde("globe", "Dünyada okunan ezanlar"),
    ],
    stats: [
      { value: "Diyanet", label: "resmî namaz vakitleri" },
      { value: "114", label: "sûre: Arapça, meal ve sesli" },
      { value: "3", label: "cihaz: iPhone, Watch, CarPlay" },
      { value: "2", label: "meal: Diyanet ve Elmalılı" },
    ],
    features: [
      {
        title: "Bir sonraki vakit, tek bakışta",
        body: "Kalan süre, günün altı vakti ve hicri tarih. Arka plandaki gökyüzü günün saatine göre değişiyor; sabah güneşi, gece ay ve yıldızlar.",
        image: vaktinde("home", "Ana ekran, gece"),
      },
      {
        title: "Dünyada şu an okunan ezanlar",
        body: "Dünyayı parmağınızla çevirin: parlayan noktalar şu anda ezanın okunduğu şehirler. Hangi vaktin nerede girdiği renklerle ayrılıyor.",
        image: vaktinde("globe", "Dünya küresi"),
      },
      {
        title: "Kur'an-ı Kerim yanınızda",
        body: "Osmanlı nesih hattıyla Arapça, Diyanet ya da Elmalılı Hamdi Yazır meali ve Kâbe imamlarından sesli tilavet.",
        image: vaktinde("quran", "Fatiha Suresi"),
      },
      {
        title: "Ayın tüm vakitleri",
        body: "İmsakiye ile ayın her gününün vakitleri bir arada; bugün vurgulu.",
        image: vaktinde("imsakiye", "İmsakiye"),
      },
    ],
    highlights: [
      {
        title: "Susturana kadar çalan ezan alarmı",
        body: "Bildirim gelip geçmiyor; vakit girdiğinde siz susturana kadar ezan okunuyor.",
      },
      {
        title: "Kıble pusulası",
        body: "Kâbe'nin yönü pusulada ve haritada, bulunduğunuz yerden.",
      },
      {
        title: "Widget ve kilit ekranı",
        body: "Telefonu açmadan bir sonraki vakte ne kadar kaldığını görün.",
      },
      {
        title: "Apple Watch ve CarPlay",
        body: "Vakitler bileğinizde ve araç ekranında da.",
      },
      {
        title: "Seyahatte kendiliğinden",
        body: "Şehir değiştirdiğinizde vakitler, alarmlar ve widget'lar uygulamayı açmadan güncelleniyor.",
      },
      {
        title: "İnternet olmasa da",
        body: "Diyanet'e ulaşılamazsa vakitler cihazda hesaplanıyor; hiçbir vakit kaçmıyor.",
      },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}
