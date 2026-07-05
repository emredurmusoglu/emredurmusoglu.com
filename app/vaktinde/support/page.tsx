import type { Metadata } from 'next';
import { SupportClient } from './SupportClient';

export const metadata: Metadata = {
  title: 'Vaktinde – Destek / Support',
  description: 'Support contact for the Vaktinde iOS app.',
};

export default function VaktindeSupportPage() {
  return <SupportClient />;
}
