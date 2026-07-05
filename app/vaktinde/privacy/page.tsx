import type { Metadata } from 'next';
import { PrivacyClient } from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Vaktinde – Gizlilik Politikası / Privacy Policy',
  description: 'Privacy Policy for the Vaktinde iOS app.',
};

export default function VaktindePrivacyPage() {
  return <PrivacyClient />;
}
