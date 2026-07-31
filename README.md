# emredurmusoglu.com

Bu repository, **Emre Durmuşoğlu**’nun kişisel web sitesinin kaynak kodlarını içerir.

Site; üzerinde çalıştığım ürünleri, odaklandığım alanları ve genel yaklaşımımı sade ama modern bir arayüzle sunmak amacıyla oluşturulmuştur.

Canlı adres:  
👉 https://www.emredurmusoglu.com
---

## 🚀 Proje Hakkında

Bu site bir **kişisel landing page**’dir.  
Amaç; klasik CV sayfası yerine, geliştirdiğim ürünleri ve üretim odağımı ön plana çıkaran temiz bir vitrin sunmaktır.

Sitede şu projeler yer alır:

- **Davetiva**  
  Dijital davetiye oluşturma ve RSVP yönetimi platformu.  
  Davetiyeleri tek bir bağlantı üzerinden paylaşmayı ve misafir yanıtlarını düzenli şekilde takip etmeyi sağlar.

- **AlarMix**  
  Görev tabanlı alarm uygulaması.  
  Görevler tamamlanmadan alarmın kapanmasına izin vermez ve daha aktif bir uyanma deneyimi sunar.

---

## 🛠️ Kullanılan Teknolojiler

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Neon Postgres** + **Drizzle ORM**
- **Vercel** (Deployment & Hosting)

Ziyaretçiye açılan sayfalar statik üretilir (ISR); veri tabanı yalnızca panel
ve içerik yayınlama akışında devreye girer.

---

## 🔐 Panel

`/panel` altında, yalnızca site sahibine açık bir çalışma alanı var:

| Ekran | İş |
| --- | --- |
| **Bugün** | Vadesi gelen işler, devam edenler, son notlar, aktif projeler |
| **Yapılacaklar** | Proje ve duruma göre filtrelenen iş listesi |
| **Notlar** | Markdown editör, etiket, arama, tek tıkla yayınlama |
| **Projeler** | Proje kartları — ana sayfadaki vitrini bunlar besler |

Panel aynı zamanda sitenin CMS'i: bir notu **"Sitede yayınla"** ile
işaretlediğinde `/yazilar` altında yayına giriyor, projeleri
"Ana sayfada göster" ile işaretlediğinde ana sayfadaki kartlar oluşuyor.

### Güvenlik yaklaşımı

- Tek kullanıcı, tek parola. Kayıt / şifre sıfırlama akışı bilerek yok.
- Parola `scrypt` ile hash'lenip **yalnızca** env değişkeninde tutulur.
- Oturum, HttpOnly + Secure + SameSite=Lax bir cookie'deki imzalı JWT.
- `proxy.ts` sadece yönlendirme kolaylığı sağlar. **Asıl yetki kontrolü**
  `lib/auth/session.ts` içindeki `requireSession()`'dadır ve panele ait her
  sayfa, layout ve server action bunu çağırır.
- `/panel` `robots.txt` ile dizinlemeye kapalıdır.

---

## 📦 Kurulum (Local)

```bash
git clone https://github.com/emredurmusoglu/emredurmusoglu.com.git
cd emredurmusoglu.com
npm install
```

**1 — Ortam değişkenleri.** `.env.example` dosyasını `.env.local` olarak
kopyala ve doldur:

```bash
cp .env.example .env.local
```

`SESSION_SECRET` üret:

```bash
openssl rand -base64 48
```

Panel parolasının hash'ini üret ve çıktıyı `.env.local` içine yapıştır:

```bash
npm run panel:hash -- 'buraya-parolanı-yaz'
```

**2 — Veri tabanı.** `DATABASE_URL` bir Neon connection string'i olabilir; host
`*.neon.tech` değilse (örneğin `postgresql://localhost:5432/...`) proje
otomatik olarak yerel Postgres sürücüsüne geçer, yani internetsiz de
çalışabilirsin.

```bash
npm run db:migrate   # şemayı uygula
npm run db:seed      # Davetiva + AlarMix kartlarını ekle (bir kez)
npm run dev
```

Şemayı değiştirdiğinde yeni migration üret:

```bash
npm run db:generate
```

**3 — Vercel.** Aynı üç değişkeni (`DATABASE_URL`, `SESSION_SECRET`,
`PANEL_PASSWORD_HASH`) Vercel proje ayarlarına ekle. Build sırasında ana sayfa
ve `/yazilar` veri tabanından okuduğu için `DATABASE_URL` build ortamında da
tanımlı olmalı.