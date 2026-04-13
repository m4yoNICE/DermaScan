import './App.css'

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ScanCircleIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="24" cy="24" r="18" />
    <path d="M17 24 C17 20 20 17 24 17 C28 17 31 20 31 24 C31 28 28 31 24 31 C20 31 17 28 17 24Z" />
    <line x1="7" y1="24" x2="12" y2="24" />
    <line x1="36" y1="24" x2="41" y2="24" />
    <line x1="24" y1="7" x2="24" y2="12" />
    <line x1="24" y1="36" x2="24" y2="41" />
  </svg>
)

const LogIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="10" y="8" width="28" height="32" rx="4" />
    <line x1="17" y1="18" x2="31" y2="18" />
    <line x1="17" y1="24" x2="31" y2="24" />
    <line x1="17" y1="30" x2="24" y2="30" />
    <circle cx="34" cy="36" r="6" />
    <line x1="34" y1="33" x2="34" y2="36" />
    <line x1="34" y1="36" x2="36" y2="38" />
  </svg>
)

const SparkleIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M24 8 L26 18 L36 20 L26 22 L24 32 L22 22 L12 20 L22 18 Z" />
    <path d="M36 8 L37.2 12 L41 13 L37.2 14 L36 18 L34.8 14 L31 13 L34.8 12 Z" />
    <path d="M14 30 L15 33 L18 34 L15 35 L14 38 L13 35 L10 34 L13 33 Z" />
  </svg>
)

const features = [
  {
    image: "/landing_images/922b1c9bb81caa4ca0af30bf66cdcd9aeedba7a6.png",
    title: "Smart Skin Analysis",
    tagline: "Let's unlock your skin story.",
    desc: "Upload a photo and let DermaScan+ identify your skin type, concerns, and the best products for your unique complexion.",
  },
  {
    image: "/landing_images/16785ad763f94491f0eb12aa6a7e4ba8a30f11d7.png",
    title: "Real-Time Scanning",
    tagline: "Get your skin scanned and be informed of your skin needs!",
    desc: "Our AI-powered scan detects skin conditions, identifies severity, and gives you a detailed analysis with key ingredient recommendations — right from your phone.",
  },
  {
    image: "/landing_images/16785ad763f94491f0eb12aa6a7e4ba8a30f11d7 (1).png",
    title: "Personal Skin Journal",
    tagline: "Keep logs with your skin updates here in DermaScan+",
    desc: "Write daily notes, log your mood, and keep track of how your skin feels day to day — all in one place.",
  },
];

const steps = [
  {
    num: "01",
    title: "Download the APK",
    desc: "Grab the APK file directly — free to download and install in seconds.",
  },
  {
    num: "02",
    title: "Scan Your Skin",
    desc: "Point your camera at your face — our AI analyzes your skin in seconds.",
  },
  {
    num: "03",
    title: "Get Your Report",
    desc: "Receive a detailed breakdown of your skin health with tailored recommendations.",
  },
  {
    num: "04",
    title: "Track Progress",
    desc: "Log entries over time and watch your skin health improve week by week.",
  },
];

export default function App() {
  return (
    <div className="ds-root">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="logo-dot" aria-hidden="true" />
            DermaScan<span className="logo-plus">+</span>
          </a>
          <ul className="nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="#download">Download</a>
            </li>
          </ul>
          <a href="#download" className="nav-cta">
            Get the App
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg-circle hero-bg-circle--1" aria-hidden="true" />
        <div className="hero-bg-circle hero-bg-circle--2" aria-hidden="true" />
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock Your
            <br />
            <span className="hero-title-accent">Skin Story.</span>
          </h1>
          <p className="hero-sub">
            DermaScan+ uses advanced AI to analyze your skin, track your health
            journey, and guide you to your best complexion — all from your
            phone.
          </p>
          <div className="hero-actions">
            <a href="#download" className="btn-primary">
              <DownloadIcon />
              Download APK
            </a>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-phones" aria-hidden="true">
          {features.map((f, i) => (
            <div key={i} className={`phone phone--${i + 1}`}>
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status-bar">
                    <span>9:41</span>
                    <span>▪▪▪ 100%</span>
                  </div>
                  <div className="phone-illustration">
                    <img src={f.image} alt="" />
                  </div>
                  <div className="phone-app-name">DermaScan+</div>
                  <p className="phone-tagline">{f.tagline}</p>
                  <div className="phone-dots">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className={`dot${d === i ? " dot--active" : ""}`}
                      />
                    ))}
                  </div>
                  <div className="phone-btn">Next</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section">
        <div className="section-inner">
          <div className="section-label">Features</div>
          <h2 className="section-title">
            Everything your skin needs,
            <br />
            in one place.
          </h2>
          <p className="section-sub">
            Three powerful pillars that make DermaScan+ the most comprehensive
            skin health companion available.
          </p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrap">
                  <img src={f.image} alt="" className="feature-icon-img" />
                </div>
                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES BANNER */}
      <section className="capabilities-section">
        <div className="section-inner">
          <ul className="capabilities-list">
            {[
              "Free to download",
              "AI-powered recommendations",
              "Daily skin tracking",
              "Personalized routines",
              "Scan history & condition logs",
              "Morning & night routine scheduler",
            ].map((cap) => (
              <li key={cap} className="cap-item">
                <span className="cap-check">
                  <CheckIcon />
                </span>
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="hiw-section">
        <div className="section-inner">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Glowing skin in four steps.</h2>
          <p className="section-sub">
            Getting started takes less than 2 minutes. Create a free account and
            start scanning right away.
          </p>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD CTA */}
      <section id="download" className="download-section">
        <div className="download-inner">
          <div className="download-bg-circle" aria-hidden="true" />
          <div className="download-content">
            <div className="download-icons" aria-hidden="true">
              <span className="dl-icon-wrap">
                <ScanCircleIcon />
              </span>
              <span className="dl-icon-wrap">
                <SparkleIcon />
              </span>
              <span className="dl-icon-wrap">
                <LogIcon />
              </span>
            </div>
            <h2 className="download-title">Start your skin journey today.</h2>
            <p className="download-sub">
              Download DermaScan+ for free — install the APK, create an account,
              and start your skin journey in minutes.
            </p>
            <div className="download-btns">
              <a
                href="https://expo.dev/artifacts/eas/6pK3gPxzgaCiFSjR5tzkdT.apk"
                download
                className="dl-btn dl-btn--apk"
              >
                <DownloadIcon />
                <div className="dl-btn-text">
                  <span className="dl-btn-small">Direct download</span>
                  <span className="dl-btn-big">Download APK</span>
                </div>
              </a>
            </div>
            <p className="download-fine">
              Free · Account required · Enable &quot;Install from unknown
              sources&quot; in your device settings
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="nav-logo">
              <span className="logo-dot" aria-hidden="true" />
              DermaScan<span className="logo-plus">+</span>
            </span>
            <p className="footer-tagline">Your skin's best companion.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <span className="footer-col-title">Product</span>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#download">Download</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DermaScan+. All rights reserved.</span>
          <span>Made with care for your skin.</span>
        </div>
      </footer>
    </div>
  );
}
