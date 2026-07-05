'use client';

import { LegalShell, mailLink, type LegalContent } from '@/components/vaktinde/LegalShell';

const email = 'emredurmusoglu1@gmail.com';

const content: Record<'tr' | 'en', LegalContent> = {
  tr: {
    title: 'Gizlilik Politikası',
    updated: 'Son güncelleme: Temmuz 2026',
    intro:
      'Bu Gizlilik Politikası, Vaktinde ("Uygulama") uygulamasının bilgilerinizi nasıl işlediğini açıklar. Vaktinde, hesap oluşturmanızı veya adınız, e-posta adresiniz gibi kişisel bilgileri paylaşmanızı gerektirmeden çalışacak şekilde tasarlanmıştır.',
    sections: [
      {
        heading: '1. Topladığımız Bilgiler',
        body: (
          <p>
            Vaktinde, ad, e-posta adresi veya hesap bilgisi gibi kişisel veriler istemez. Namaz
            vakitlerini bulunduğunuz yere göre hesaplayabilmek için cihazınızın konum bilgisine
            ihtiyaç duyar. Reklam hizmetleri aracılığıyla bazı anonim bilgiler (cihaz tipi,
            işletim sistemi, reklam etkileşimleri, yaklaşık bölge bilgisi gibi) otomatik olarak
            toplanabilir.
          </p>
        ),
      },
      {
        heading: '2. Konum Kullanımı',
        body: (
          <p>
            Uygulama, bulunduğunuz ilçeye göre doğru namaz vakitlerini gösterebilmek için
            &quot;Kullanırken&quot; konum izni ister. Seyahat ettiğinizde vakitlerin, ezan
            alarmlarının ve widget&apos;ın otomatik güncellenebilmesi için isteğe bağlı olarak
            &quot;Her Zaman&quot; izni de verebilirsiniz; bu izin yalnızca önemli konum
            değişikliklerinde (ör. şehir değişimi) kullanılır. Konum verisi bizim sunucularımıza
            gönderilmez; yalnızca cihazınızda saklanır ve namaz vakti hesaplaması için kullanılır.
          </p>
        ),
      },
      {
        heading: '3. Reklamlar ve Takip (App Tracking Transparency)',
        body: (
          <p>
            Vaktinde, Google AdMob aracılığıyla banner reklam gösterir. iOS&apos;ta, kişiselleştirilmiş
            reklam gösterebilmek için Apple&apos;ın App Tracking Transparency (ATT) izni istenir.
            İzin verirseniz reklam sağlayıcıları IDFA&apos;yı kullanarak size daha ilgili reklamlar
            gösterebilir. İzin vermezseniz uygulama normal şekilde çalışmaya devam eder ve
            reklamlar kişiselleştirilmemiş olarak gösterilir.
          </p>
        ),
      },
      {
        heading: '4. Ezan Alarmları',
        body: (
          <p>
            Ezan vakti alarmları, Apple&apos;ın AlarmKit çerçevesi kullanılarak tamamen cihazınızda
            kurulur. Alarm ayarlarınız (hangi vakitler açık, ihtiyat payı, seçtiğiniz sesler)
            yalnızca cihazınızda saklanır; herhangi bir sunucuya gönderilmez.
          </p>
        ),
      },
      {
        heading: '5. Kıble Pusulası ve Harita',
        body: (
          <p>
            Kıble yönü, cihazınızın konumu ve pusula sensörü kullanılarak hesaplanır. Harita
            görünümü Apple Haritalar (MapKit) ile sağlanır; bu özellik Apple&apos;ın kendi gizlilik
            uygulamalarına tabidir.
          </p>
        ),
      },
      {
        heading: '6. Widget',
        body: (
          <p>
            Ana ekran widget&apos;ı, namaz vakitlerini gösterebilmek için uygulamayla aynı cihaz
            üzerinde paylaşılan bir depoda (App Group) saklanan veriyi okur. Bu veri cihazınızın
            dışına çıkmaz.
          </p>
        ),
      },
      {
        heading: '7. Veri Paylaşımı',
        body: (
          <p>
            Kullanıcı verileri satılmaz veya kiralanmaz. Veriler yalnızca uygulamanın çalışması
            için gerekli olan reklam sağlayıcılarıyla (Google AdMob) paylaşılabilir.
          </p>
        ),
      },
      {
        heading: '8. Çocukların Gizliliği',
        body: (
          <p>
            Vaktinde, 13 yaşın altındaki çocuklardan bilerek kişisel veri toplamaz. Ebeveynler
            veya yasal vasiler, çocuklarının uygulama kullanımını denetlemekten sorumludur.
          </p>
        ),
      },
      {
        heading: '9. Veri Güvenliği',
        body: (
          <p>
            Kullanıcı gizliliğini korumak için makul teknik ve organizasyonel önlemler alınır.
            Ancak internet üzerinden hiçbir veri iletiminin tamamen güvenli olduğu garanti
            edilemez.
          </p>
        ),
      },
      {
        heading: '10. Değişiklikler',
        body: (
          <p>
            Bu Gizlilik Politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada
            yayımlanmasıyla yürürlüğe girer.
          </p>
        ),
      },
      {
        heading: '11. İletişim',
        body: <p>Bu Gizlilik Politikası hakkında sorularınız için: {mailLink(email)}</p>,
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: July 2026',
    intro:
      'This Privacy Policy explains how Vaktinde ("the App") handles information. Vaktinde is designed to work without requiring account creation or personal details such as your name or email address.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: (
          <p>
            Vaktinde does not request personal information such as name, email address, or
            account details. The App needs your device&apos;s location to calculate prayer times for
            where you are. Some anonymous information (device type, operating system, ad
            interactions, approximate region) may be collected automatically through advertising
            services.
          </p>
        ),
      },
      {
        heading: '2. Use of Location',
        body: (
          <p>
            The App requests &quot;While Using&quot; location access to show accurate prayer times for
            your district. You may optionally grant &quot;Always&quot; access so prayer times, adhan
            alarms, and the widget can update automatically while traveling; this is only used
            for significant location changes (e.g. changing cities). Location data is never sent
            to our servers — it stays on your device and is used only to calculate prayer times.
          </p>
        ),
      },
      {
        heading: '3. Advertising and Tracking (App Tracking Transparency)',
        body: (
          <p>
            Vaktinde displays banner ads through Google AdMob. On iOS, we request Apple&apos;s App
            Tracking Transparency (ATT) permission before showing personalized ads. If you grant
            permission, ad providers may use the IDFA to show more relevant ads. If you decline,
            the App continues to work normally and ads are shown in a non-personalized mode.
          </p>
        ),
      },
      {
        heading: '4. Adhan Alarms',
        body: (
          <p>
            Prayer-time alarms are scheduled entirely on your device using Apple&apos;s AlarmKit
            framework. Your alarm settings (which prayers are on, the precautionary offset, the
            sounds you choose) are stored only on your device and never sent to a server.
          </p>
        ),
      },
      {
        heading: '5. Qibla Compass and Map',
        body: (
          <p>
            The qibla direction is calculated using your device&apos;s location and compass sensor.
            The map view is provided by Apple Maps (MapKit) and is subject to Apple&apos;s own
            privacy practices.
          </p>
        ),
      },
      {
        heading: '6. Widget',
        body: (
          <p>
            The home screen widget reads prayer-time data from storage shared with the App on the
            same device (an App Group). This data never leaves your device.
          </p>
        ),
      },
      {
        heading: '7. Data Sharing',
        body: (
          <p>
            User data is never sold or rented. Data may only be shared with advertising service
            providers (Google AdMob) as required for the App to operate.
          </p>
        ),
      },
      {
        heading: "8. Children's Privacy",
        body: (
          <p>
            Vaktinde does not knowingly collect personal data from children under 13. Parents or
            legal guardians are responsible for supervising their children&apos;s use of the App.
          </p>
        ),
      },
      {
        heading: '9. Data Security',
        body: (
          <p>
            We take reasonable technical and organizational measures to protect user privacy.
            However, no method of transmission over the internet can be guaranteed to be
            completely secure.
          </p>
        ),
      },
      {
        heading: '10. Changes',
        body: (
          <p>
            This Privacy Policy may be updated from time to time. Changes take effect once
            published on this page.
          </p>
        ),
      },
      {
        heading: '11. Contact',
        body: <p>If you have questions about this Privacy Policy, contact us at {mailLink(email)}</p>,
      },
    ],
  },
};

export function PrivacyClient() {
  return (
    <LegalShell content={content} />
  );
}
