// app/alarmix/support/page.tsx
export default function AlarMixSupportPage() {
  return (
    <main style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#0f1220',
      color: '#ffffff',
      margin: 0,
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>AlarMix Support</h1>

        <p style={{ lineHeight: 1.6, color: '#d1d5db' }}>
          AlarMix is a smart alarm app designed to help you wake up more consciously.
          If you have questions, feedback, or encounter any issues while using the app,
          feel free to contact us.
        </p>

        <p style={{ lineHeight: 1.6, color: '#d1d5db' }}>
          📧 Support email:<br />
          <a href="mailto:emredurmusoglu1@gmail.com" style={{ color: '#8b9cff', textDecoration: 'none' }}>
            emredurmusoglu1@gmail.com
          </a>
        </p>

        <footer style={{ marginTop: 40, fontSize: 14, color: '#9ca3af' }}>
          © 2026 Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}