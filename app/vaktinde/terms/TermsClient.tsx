'use client';

import { LegalShell, mailLink, type LegalContent } from '@/components/vaktinde/LegalShell';

const email = 'emredurmusoglu1@gmail.com';

const content: Record<'tr' | 'en', LegalContent> = {
  tr: {
    title: 'Kullanım Koşulları',
    updated: 'Son güncelleme: Temmuz 2026',
    intro:
      'Bu Kullanım Koşulları, Vaktinde uygulamasını ("Uygulama") kullanımınızı düzenler. Uygulamayı indirerek veya kullanarak bu koşulları kabul etmiş sayılırsınız.',
    sections: [
      {
        heading: '1. Lisans',
        body: (
          <p>
            Emre Durmuşoğlu (&quot;biz&quot;), size Uygulamayı yalnızca kişisel, ticari olmayan
            amaçlarla kullanmanız için sınırlı, devredilemez ve münhasır olmayan bir lisans verir.
          </p>
        ),
      },
      {
        heading: '2. Namaz Vakitleri Hakkında Sorumluluk Reddi',
        body: (
          <p>
            Uygulamadaki namaz vakitleri, Türkiye için Diyanet İşleri Başkanlığı verilerine,
            diğer bölgeler için astronomik hesaplama yöntemlerine dayanır. Vakitler bilgilendirme
            amaçlıdır; yerel cami/müezzin duyurusunun veya yetkili dini otoritenin yerini tutmaz.
            Uygulama, vakitlerin hatasız olduğunu garanti etmez ve hesaplama farklarından
            doğabilecek herhangi bir sonuçtan sorumlu tutulamaz.
          </p>
        ),
      },
      {
        heading: '3. Kabul Edilebilir Kullanım',
        body: (
          <p>
            Uygulamayı yasa dışı amaçlarla, tersine mühendislik yaparak veya başkalarının
            haklarını ihlal edecek şekilde kullanamazsınız.
          </p>
        ),
      },
      {
        heading: '4. Üçüncü Taraf Hizmetler',
        body: (
          <p>
            Uygulama, reklam göstermek için Google AdMob&apos;u ve harita/pusula özellikleri için
            Apple Haritalar&apos;ı kullanır. Bu hizmetlerin kullanımı ilgili sağlayıcının kendi
            koşullarına tabidir.
          </p>
        ),
      },
      {
        heading: '5. Garanti Reddi',
        body: (
          <p>
            Uygulama &quot;olduğu gibi&quot; sunulur. Kesintisiz veya hatasız çalışacağına dair açık
            ya da zımni hiçbir garanti verilmez.
          </p>
        ),
      },
      {
        heading: '6. Sorumluluğun Sınırlanması',
        body: (
          <p>
            Yürürlükteki kanunların izin verdiği azami ölçüde, Uygulamanın kullanımından veya
            kullanılamamasından doğan hiçbir doğrudan, dolaylı veya arızi zarardan sorumlu
            tutulamayız.
          </p>
        ),
      },
      {
        heading: '7. Fesih',
        body: (
          <p>
            Bu koşulları ihlal etmeniz halinde Uygulamaya erişiminizi herhangi bir bildirimde
            bulunmaksızın sonlandırabiliriz.
          </p>
        ),
      },
      {
        heading: '8. Değişiklikler',
        body: (
          <p>
            Bu Kullanım Koşulları zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada
            yer alır.
          </p>
        ),
      },
      {
        heading: '9. Uygulanacak Hukuk',
        body: <p>Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir.</p>,
      },
      {
        heading: '10. İletişim',
        body: <p>Sorularınız için: {mailLink(email)}</p>,
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    updated: 'Last updated: July 2026',
    intro:
      'These Terms of Use govern your use of the Vaktinde app ("the App"). By downloading or using the App, you agree to these terms.',
    sections: [
      {
        heading: '1. License',
        body: (
          <p>
            Emre Durmuşoğlu (&quot;we&quot;) grants you a limited, non-transferable, non-exclusive
            license to use the App for personal, non-commercial purposes only.
          </p>
        ),
      },
      {
        heading: '2. Prayer Times Disclaimer',
        body: (
          <p>
            Prayer times shown in the App are based on data from the Turkish Presidency of
            Religious Affairs (Diyanet İşleri Başkanlığı) for Turkey, and on astronomical
            calculation methods for other regions. Times are provided for informational purposes
            and do not replace your local mosque&apos;s announcement or a qualified religious
            authority. The App does not guarantee the times are error-free and is not liable for
            any consequences arising from calculation differences.
          </p>
        ),
      },
      {
        heading: '3. Acceptable Use',
        body: (
          <p>
            You may not use the App for unlawful purposes, attempt to reverse-engineer it, or use
            it in a way that infringes on the rights of others.
          </p>
        ),
      },
      {
        heading: '4. Third-Party Services',
        body: (
          <p>
            The App uses Google AdMob to display ads and Apple Maps for map/compass features. Use
            of these services is subject to each provider&apos;s own terms.
          </p>
        ),
      },
      {
        heading: '5. Disclaimer of Warranty',
        body: (
          <p>
            The App is provided &quot;as is.&quot; We make no warranty, express or implied, that it
            will be uninterrupted or error-free.
          </p>
        ),
      },
      {
        heading: '6. Limitation of Liability',
        body: (
          <p>
            To the maximum extent permitted by law, we are not liable for any direct, indirect,
            or incidental damages arising from your use of, or inability to use, the App.
          </p>
        ),
      },
      {
        heading: '7. Termination',
        body: (
          <p>
            We may terminate your access to the App without notice if you violate these Terms.
          </p>
        ),
      },
      {
        heading: '8. Changes',
        body: (
          <p>
            These Terms of Use may be updated from time to time. The current version is always
            available on this page.
          </p>
        ),
      },
      {
        heading: '9. Governing Law',
        body: <p>These Terms are governed by the laws of the Republic of Turkey.</p>,
      },
      {
        heading: '10. Contact',
        body: <p>For questions, contact: {mailLink(email)}</p>,
      },
    ],
  },
};

export function TermsClient() {
  return <LegalShell content={content} />;
}
