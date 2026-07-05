'use client';

import { useState, type ReactNode } from 'react';

export type Lang = 'tr' | 'en';

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

export interface LegalContent {
  title: string;
  updated?: string;
  intro: ReactNode;
  sections: LegalSection[];
}

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/** Vaktinde'nin gizlilik/kullanım/destek sayfaları için ortak kabuk: TR/EN geçişi + aynı koyu tema. */
export function LegalShell({
  content,
}: {
  content: Record<Lang, LegalContent>;
}) {
  const [lang, setLang] = useState<Lang>('tr');
  const c = content[lang];

  return (
    <main
      style={{
        fontFamily,
        background: '#0f1220',
        color: '#ffffff',
        margin: 0,
        padding: '40px 20px',
        lineHeight: 1.6,
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 22,
          }}
        >
          <div
            role="group"
            aria-label="Dil seçimi / Language"
            style={{
              display: 'inline-flex',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 999,
              padding: 3,
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            {(['tr', 'en'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setLang(value)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 999,
                  padding: '6px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily,
                  background: lang === value ? '#8b9cff' : 'transparent',
                  color: lang === value ? '#0f1220' : '#9ca3af',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <h1 style={{ fontSize: 28, margin: '0 0 10px' }}>{c.title}</h1>
        {c.updated && (
          <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 8 }}>{c.updated}</div>
        )}

        <div
          style={{
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: 18,
            background: 'rgba(255,255,255,0.03)',
            marginTop: 14,
          }}
        >
          <p style={{ color: '#d1d5db', margin: 0 }}>{c.intro}</p>
        </div>

        {c.sections.map((section) => (
          <section key={section.heading}>
            <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>{section.heading}</h2>
            <div style={{ color: '#d1d5db' }}>{section.body}</div>
          </section>
        ))}

        <footer style={{ marginTop: 40, color: '#9ca3af', fontSize: 14 }}>
          © {new Date().getFullYear()} Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}

export const mailLink = (email: string) => (
  <a href={`mailto:${email}`} style={{ color: '#8b9cff', textDecoration: 'none' }}>
    {email}
  </a>
);
