// app/alarmix/privacy/page.tsx

export default function AlarMixPrivacyPage() {
  return (
    <main
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        background: '#0f1220',
        color: '#ffffff',
        margin: 0,
        padding: '40px 20px',
        lineHeight: 1.6,
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 10px' }}>Privacy Policy</h1>
        <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 8 }}>
          Last updated: January 2026
        </div>

        <div
          style={{
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: 18,
            background: 'rgba(255,255,255,0.03)',
            marginTop: 14,
          }}
        >
          <p style={{ color: '#d1d5db', margin: 0 }}>
            This Privacy Policy explains how AlarMix (“the App”) handles information. AlarMix is
            designed to work without requiring personal details such as your name, email address, or
            account information.
          </p>
        </div>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>1. Information We Collect</h2>
        <p style={{ color: '#d1d5db' }}>
          AlarMix does not request personal information such as name, email address, or account
          details. However, some anonymous information may be collected automatically through
          advertising services. This may include device type, operating system, in-app ad
          interactions, and approximate location at the country or region level.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>2. Advertising</h2>
        <p style={{ color: '#d1d5db' }}>
          AlarMix uses banner ads and rewarded ads. Ads may be provided by third-party advertising
          services. These providers may collect anonymous data to display ads and measure advertising
          performance. AlarMix does not share personally identifiable information with advertising
          providers.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>3. Tracking</h2>
        <p style={{ color: '#d1d5db' }}>
          AlarMix does not track users across apps or websites owned by other companies. We do not
          use collected data for tracking or profiling purposes.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>4. How We Use Data</h2>
        <p style={{ color: '#d1d5db' }}>
          Collected anonymous data is used only to display ads, enable rewarded ad functionality,
          improve app performance, and perform statistical analysis.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>5. Data Sharing</h2>
        <p style={{ color: '#d1d5db' }}>
          User data is not sold or rented. Data may be shared only with advertising service providers
          as required for the operation of the app (for example, to display ads and measure ad
          performance).
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>6. Children’s Privacy</h2>
        <p style={{ color: '#d1d5db' }}>
          AlarMix does not knowingly collect personal data from children under the age of 13.
          Parents or legal guardians are responsible for supervising their children’s use of the app.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>7. Data Security</h2>
        <p style={{ color: '#d1d5db' }}>
          AlarMix takes reasonable technical and organizational measures to protect user privacy.
          However, no method of data transmission over the internet can be guaranteed to be
          completely secure.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>8. Changes</h2>
        <p style={{ color: '#d1d5db' }}>
          This Privacy Policy may be updated from time to time. Any changes will become effective
          once published within the app or on this page.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>9. Contact</h2>
        <p style={{ color: '#d1d5db' }}>
          If you have any questions about this Privacy Policy, you can contact us at{' '}
          <a
            href="mailto:emredurmusoglu1@gmail.com"
            style={{ color: '#8b9cff', textDecoration: 'none' }}
          >
            emredurmusoglu1@gmail.com
          </a>
          .
        </p>

        <footer style={{ marginTop: 40, color: '#9ca3af', fontSize: 14 }}>
          © 2026 Emre Durmuşoğlu
        </footer>
      </div>
    </main>
  );
}