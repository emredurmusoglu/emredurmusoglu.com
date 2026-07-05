import type { Metadata } from 'next';
import { TermsClient } from './TermsClient';

export const metadata: Metadata = {
  title: 'Vaktinde – Kullanım Koşulları / Terms of Use',
  description: 'Terms of Use for the Vaktinde iOS app.',
};

export default function VaktindeTermsPage() {
  return <TermsClient />;
}
