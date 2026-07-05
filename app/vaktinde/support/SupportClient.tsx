'use client';

import { LegalShell, mailLink, type LegalContent } from '@/components/vaktinde/LegalShell';

const email = 'emredurmusoglu1@gmail.com';

const content: Record<'tr' | 'en', LegalContent> = {
  tr: {
    title: 'Vaktinde Destek',
    intro:
      'Vaktinde, bulunduğunuz konuma göre namaz vakitlerini, ezan alarmlarını, kıble pusulasını ve ana ekran widget’ını sunan bir iOS uygulamasıdır. Sorularınız, geri bildirimleriniz veya karşılaştığınız sorunlar için bizimle iletişime geçebilirsiniz.',
    sections: [
      {
        heading: 'E-posta ile ulaşın',
        body: <p>📧 {mailLink(email)}</p>,
      },
    ],
  },
  en: {
    title: 'Vaktinde Support',
    intro:
      'Vaktinde is an iOS app that shows prayer times, adhan alarms, a qibla compass, and a home screen widget based on your location. If you have questions, feedback, or run into any issues, feel free to contact us.',
    sections: [
      {
        heading: 'Contact by email',
        body: <p>📧 {mailLink(email)}</p>,
      },
    ],
  },
};

export function SupportClient() {
  return <LegalShell content={content} />;
}
