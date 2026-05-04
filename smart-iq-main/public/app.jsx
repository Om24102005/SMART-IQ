// App + Tweaks + Nav
const { useState: aUseState, useEffect: aUseEffect, useRef: aUseRef } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "amber",
  "headlineStyle": "default",
  "showGrain": true
}/*EDITMODE-END*/;

const ACCENTS = {
  amber:    { primary: "#E89234", soft: "#F2B370", name: "Amber" },
  panelblue:{ primary: "#1B4F72", soft: "#3a7bb1", name: "Panel Blue" },
  green:    { primary: "#2D7A3F", soft: "#5a9c6c", name: "Foliage" },
};

function Marquee({ variant }) {
  const items = variant === "alt"
    ? ["Daily clean", "Before sunrise", "No drilling", "Inverter-aware", "Made for India", "0.6L per cycle"]
    : ["+18% more power", "Zero structural change", "Pays back in 4 years", "EPDM soft contact", "Weather-aware", "Fits any frame"];
  const row = (
    <span>
      {items.map((t, i) => <React.Fragment key={i}>{t}</React.Fragment>)}
    </span>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row}{row}{row}
      </div>
    </div>
  );
}

function ScrollRotor() {
  return (
    <div className="scroll-rotor" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="70" height="70">
        <defs>
          <path id="rotor-path" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"/>
        </defs>
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(26,26,24,0.15)" strokeWidth="0.5"/>
        <text fontSize="9" fill="currentColor" letterSpacing="2">
          <textPath href="#rotor-path">SPARSH · CLEAN · QUIET · DAILY · SPARSH · CLEAN · QUIET · DAILY · </textPath>
        </text>
        <circle cx="50" cy="50" r="3" fill="var(--amber)"/>
      </svg>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = aUseState(false);
  aUseEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"nav " + (scrolled ? "scrolled" : "")}>
      <a href="#" className="nav-mark">
        <span className="dot"></span>
        SparshIQ
      </a>
      <div className="nav-links">
        <a href="#problem">The Problem</a>
        <a href="#how">How it works</a>
        <a href="#calc">Calculator</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>
      <a href="#pricing" className="nav-cta">Book a consult</a>
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" data-screen-label="01 Hero">
      <window.HeroScene />
      <div className="hero-content">
        <div className="hero-eyebrow reveal show"><span className="bar"></span>For Indian rooftops · 4–30 panels</div>
        <h1 className="hero-headline reveal show">Your panels are <em>losing money</em> every day.</h1>
        <p className="hero-subhead reveal show">SparshIQ cleans them automatically. So you actually get what you paid for.</p>
        <div className="hero-ctas reveal show">
          <a href="#pricing" className="btn btn-primary">See it on your roof <span className="arrow">→</span></a>
          <a href="#calc" className="btn btn-ghost">How much you're losing</a>
        </div>
      </div>
    </header>
  );
}

function TweaksPanel({ tweaks, setTweak, onClose }) {
  return (
    <div className="tweaks-panel">
      <span className="tweaks-close" onClick={onClose}>×</span>
      <h5>Tweaks</h5>
      <div className="tweaks-row">
        <label>Accent color</label>
        <div className="tweaks-swatches">
          {Object.entries(ACCENTS).map(([k, v]) => (
            <div key={k}
              className={"tweaks-swatch " + (tweaks.accent === k ? "active" : "")}
              style={{ background: v.primary }}
              onClick={() => setTweak("accent", k)}
              title={v.name}/>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <label>Headline style</label>
        <select
          value={tweaks.headlineStyle}
          onChange={(e) => setTweak("headlineStyle", e.target.value)}
          style={{ font: "inherit", fontSize: 12, padding: "4px 8px", border: "1px solid var(--line)", borderRadius: 6, background: "#fff" }}>
          <option value="default">Losing money</option>
          <option value="cleaner">Wasting sunlight</option>
          <option value="science">Underperforming</option>
        </select>
      </div>
      <div className="tweaks-row">
        <label>Grain texture</label>
        <input type="checkbox" checked={tweaks.showGrain} onChange={(e) => setTweak("showGrain", e.target.checked)}/>
      </div>
    </div>
  );
}

const HEADLINES = {
  default:  { h: ["Your panels are ", " losing money", " every day."], em: 1, sub: "SparshIQ cleans them automatically. So you actually get what you paid for." },
  cleaner:  { h: ["Your panels are ", " wasting sunlight", " before breakfast."], em: 1, sub: "SparshIQ cleans them every morning. Quietly. Automatically. Done before you wake up." },
  science:  { h: ["Solar without cleaning ", " loses 18%", " a year."], em: 1, sub: "We measured it. We fixed it. Your panels finally meet the spec sheet." },
};

function App() {
  const [tweaks, setTweaks] = aUseState(TWEAKS_DEFAULTS);
  const [showTweaks, setShowTweaks] = aUseState(false);
  const [loading, setLoading] = aUseState(true);
  const scrollProgressRef = aUseRef(0);

  const setTweak = (k, v) => {
    setTweaks((prev) => {
      const next = { ...prev, [k]: v };
      try {
        window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
      } catch (e) {}
      return next;
    });
  };

  // Edit-mode contract
  aUseEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === "__activate_edit_mode") setShowTweaks(true);
      if (e.data.type === "__deactivate_edit_mode") setShowTweaks(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Apply accent tweak via CSS var
  aUseEffect(() => {
    const a = ACCENTS[tweaks.accent] || ACCENTS.amber;
    document.documentElement.style.setProperty("--amber", a.primary);
    document.documentElement.style.setProperty("--amber-soft", a.soft);
  }, [tweaks.accent]);

  // Grain toggle
  aUseEffect(() => {
    document.body.style.setProperty("--grain-display", tweaks.showGrain ? "block" : "none");
    const style = document.getElementById("grain-toggle-style") || (() => {
      const s = document.createElement("style"); s.id = "grain-toggle-style"; document.head.appendChild(s); return s;
    })();
    style.textContent = tweaks.showGrain ? "" : "body::before { display: none !important; }";
  }, [tweaks.showGrain]);

  // Track scroll progress for Theatre.js orchestration
  aUseEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize GSAP defaults and micro-interactions on mount
  aUseEffect(() => {
    if (window.SparshGSAP) {
      window.SparshGSAP.initGSAPDefaults();
    }
    if (window.SparshMicro) {
      window.SparshMicro.initAllMicroInteractions();
    }
  }, []);

  // Reveal observer
  window.SparshUtils.useReveal();

  const headline = HEADLINES[tweaks.headlineStyle] || HEADLINES.default;

  return (
    <>
      {/* Loading screen overlay */}
      {loading && React.createElement(window.LoadingScreen, {
        onComplete: () => setLoading(false)
      })}

      {/* Custom magnetic cursor with particle trail */}
      <window.MagneticCursor />

      <Nav />
      <header className="hero" data-screen-label="01 Hero">
        <window.HeroScene />
        <div className="hero-content">
          <div className="hero-eyebrow reveal show"><span className="bar"></span>For Indian rooftops · 4–30 panels</div>
          <h1 className="hero-headline reveal show">
            {headline.h.map((part, i) => i === headline.em ? <em key={i}>{part}</em> : <React.Fragment key={i}>{part}</React.Fragment>)}
          </h1>
          <p className="hero-subhead reveal show">{headline.sub}</p>
          <div className="hero-ctas reveal show">
            <a href="#pricing" className="btn btn-primary">See it on your roof <span className="arrow">→</span></a>
            <a href="#calc" className="btn btn-ghost">How much you're losing</a>
          </div>
        </div>
      </header>
      <Marquee />
      <window.HiddenProblem />
      <window.HowItWorks />
      <window.Routine />
      <window.Dashboard />
      <Marquee variant="alt" />
      <window.Calculator />
      <window.IndiaMap />
      <window.Testimonials />
      <window.Pricing />
      <window.FAQ />
      <ScrollRotor />
      <window.Footer />
      {showTweaks && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => {
        setShowTweaks(false);
        try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
      }}/>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
