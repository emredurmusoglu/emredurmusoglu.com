// app/online/support/page.tsx
export default function OnlineSupportPage() {
  return (
    <main
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: '#0f1220',
        color: '#ffffff',
        margin: 0,
        padding: '40px 20px',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>ON LINE Support</h1>

        <p style={{ lineHeight: 1.6, color: '#d1d5db' }}>
          ON LINE is a fast-paced mobile game focused on smooth gameplay and quick sessions. If you
          have questions, feedback, or encounter any issues while using the game, feel free to
          contact us.
        </p>

        <p style={{ lineHeight: 1.6, color: '#d1d5db' }}>
          📧 Support email:
          <br />
          <a
            href="mailto:emredurmusoglu1@gmail.com"
            style={{ color: '#8b9cff', textDecoration: 'none' }}
          >
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
