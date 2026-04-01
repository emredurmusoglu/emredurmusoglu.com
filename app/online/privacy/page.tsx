import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ON LINE Privacy Policy",
  description: "Privacy Policy for ON LINE game.",
};

export default function OnlinePrivacyPage() {
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
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 10px' }}>Privacy Policy</h1>
        <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 8 }}>
          Last updated: April 1, 2026
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
            This Privacy Policy explains how ON LINE (&quot;the Game&quot;) handles information when you use
            the iOS app. The Game uses Google AdMob to show ads. If you allow Apple&apos;s App
            Tracking Transparency (ATT) permission, ads may be more relevant to you. If you do not
            allow tracking, the Game will continue to work and ads are shown in a non-personalized
            mode where available.
          </p>
        </div>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>1. Data Controller</h2>
        <p style={{ color: '#d1d5db' }}>
          ON LINE is published by Emre Durmuşoğlu (&quot;we&quot;, &quot;us&quot;). For any privacy request, contact us
          at{' '}
          <a
            href="mailto:emredurmusoglu1@gmail.com"
            style={{ color: '#8b9cff', textDecoration: 'none' }}
          >
            emredurmusoglu1@gmail.com
          </a>
          .
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>2. Information We Collect</h2>
        <p style={{ color: '#d1d5db' }}>
          We do not require account creation and we do not directly collect personal information such
          as your name, phone number, or email in the Game itself.
        </p>
        <p style={{ color: '#d1d5db' }}>
          Certain data may be collected automatically by Apple and Google AdMob SDKs to provide,
          secure, and measure ads, including: device information, operating system, language,
          approximate location (derived from IP), ad interaction events, app diagnostics, and
          performance data.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>
          3. Advertising (Google AdMob) and ATT
        </h2>
        <p style={{ color: '#d1d5db' }}>
          The Game displays ads through Google AdMob. On iOS, we request ATT permission before using
          tracking-enabled ad features.
        </p>
        <p style={{ color: '#d1d5db' }}>
          If you grant ATT permission: AdMob may access the Identifier for Advertisers (IDFA) and
          related signals to deliver personalized ads and improve ad measurement.
        </p>
        <p style={{ color: '#d1d5db' }}>
          If you deny ATT permission: we do not use IDFA for tracking; ads are requested as
          non-personalized (contextual/limited targeting, depending on availability and region).
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>4. Legal Basis and Consent</h2>
        <p style={{ color: '#d1d5db' }}>
          Where required by law, personalized advertising is based on your consent. ATT choice,
          consent tools, and your device settings can be used to control ad personalization. You can
          change tracking permission at any time from iOS Settings &gt; Privacy &amp; Security &gt;
          Tracking.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>5. How We Use Data</h2>
        <p style={{ color: '#d1d5db' }}>
          Data is used to: serve ads, limit fraud/abuse, measure ad performance, maintain app
          stability, and improve gameplay quality. We do not sell your personal information.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>6. Data Sharing</h2>
        <p style={{ color: '#d1d5db' }}>
          We share data only with service providers needed to operate the Game, primarily Google
          AdMob. Their processing is governed by their own privacy terms and legal obligations.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>7. Data Retention</h2>
        <p style={{ color: '#d1d5db' }}>
          We keep only the minimum data needed for operational and legal purposes. Retention periods
          for ad and analytics data are determined by the relevant platform/provider policies.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>8. Children&apos;s Privacy</h2>
        <p style={{ color: '#d1d5db' }}>
          The Game is not directed to children under 13. We do not knowingly collect personal data
          from children under 13. If you believe a child has provided personal data, contact us so we
          can review and take appropriate action.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>9. Your Privacy Rights</h2>
        <p style={{ color: '#d1d5db' }}>
          Depending on your location, you may have rights to request access, deletion, correction, or
          restriction of personal data processed about you. You may also have the right to object to
          certain processing or withdraw consent where applicable.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>10. International Transfers</h2>
        <p style={{ color: '#d1d5db' }}>
          Service providers may process data in countries other than your own. When required, such
          transfers are made using legally recognized safeguards.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>11. Security</h2>
        <p style={{ color: '#d1d5db' }}>
          We use reasonable administrative and technical measures to protect information. However, no
          method of transmission or storage is completely secure.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>12. Third-Party Links</h2>
        <p style={{ color: '#d1d5db' }}>
          Useful references:
          <br />
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#8b9cff', textDecoration: 'none' }}
          >
            Google Privacy Policy
          </a>
          <br />
          <a
            href="https://support.google.com/admob/answer/6128543"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#8b9cff', textDecoration: 'none' }}
          >
            How Google uses information from sites or apps that use its services
          </a>
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>13. Changes to This Policy</h2>
        <p style={{ color: '#d1d5db' }}>
          We may update this Privacy Policy from time to time. Updated versions will be posted on
          this page with a revised &quot;Last updated&quot; date.
        </p>

        <h2 style={{ fontSize: 18, margin: '26px 0 10px' }}>14. Contact</h2>
        <p style={{ color: '#d1d5db' }}>
          If you have any questions or requests regarding privacy, contact:{' '}
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
