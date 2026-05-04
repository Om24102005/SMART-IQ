// Sections 5-11
const { useState: mUseState, useEffect: mUseEffect, useRef: mUseRef, useMemo: mUseMemo } = React;
const { useLerpedNumber: mLerp, inr: mInr, easeOutQuart: mEaseOutQuart } = window.SparshUtils;

// =================== SECTION 5: DASHBOARD ===================
function Dashboard() {
  const [tilt, setTilt] = mUseState({ x: 0, y: 0 });
  const wrapRef = mUseRef(null);

  mUseEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: -cy * 6, y: cx * 8 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  // Simulated chart points
  const chartPath = mUseMemo(() => {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * 100;
      // bell-ish solar curve, with morning bump from cleaning
      const base = Math.max(0, Math.sin(((i - 6) / 12) * Math.PI)) * 90;
      const y = 90 - base + (Math.random() - 0.5) * 1;
      pts.push([x, Math.max(2, Math.min(88, y))]);
    }
    return "M " + pts.map(p => p.join(" ")).join(" L ");
  }, []);

  return (
    <section id="dashboard" data-screen-label="05 Dashboard">
      <div className="reveal">
        <div className="section-eyebrow">05 — The dashboard</div>
        <h2 className="section-title">The dashboard you <em>actually want.</em></h2>
        <p className="section-sub">Not data slop. Just the numbers that matter — what your panels made today, and what they would have made dirty.</p>
      </div>

      <div className="dashboard-stage">
        <div ref={wrapRef} style={{ perspective: "1200px" }}>
          <div className="phone" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="phone-content">
                <div>
                  <div className="phone-greeting">Tuesday · 09:42</div>
                  <div className="phone-headline">Good morning, Arjun.<br/>Your panels are <span style={{color:"var(--green)"}}>+18%</span> ahead today.</div>
                </div>
                <div className="phone-card">
                  <div className="label">Power right now</div>
                  <div className="value">2.41<sup>kW</sup></div>
                  <div className="delta">↑ 0.36 kW vs yesterday</div>
                  <svg className="phone-chart" viewBox="0 0 100 90" preserveAspectRatio="none" style={{ marginTop: 8 }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#E89234" stopOpacity="0.35"/>
                        <stop offset="100%" stopColor="#E89234" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d={chartPath + " L 100 90 L 0 90 Z"} fill="url(#chartGrad)"/>
                    <path d={chartPath} stroke="#E89234" strokeWidth="1.4" fill="none"/>
                    {/* cleaning marker */}
                    <line x1="22" y1="0" x2="22" y2="90" stroke="#1B4F72" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6"/>
                    <circle cx="22" cy="58" r="2" fill="#1B4F72"/>
                  </svg>
                </div>
                <div className="phone-row">
                  <div className="phone-card">
                    <div className="label">Saved this month</div>
                    <div className="value">₹612</div>
                  </div>
                  <div className="phone-card">
                    <div className="label">Panel health</div>
                    <div className="value">98<sup>%</sup></div>
                  </div>
                </div>
                <div className="phone-tab">
                  <div className="active">Home</div>
                  <div>Trends</div>
                  <div>Health</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-features">
          {[
            { t: "See exactly how much your panels made today.", i: "₹" },
            { t: "Compare clean panels vs dirty in real numbers.", i: "▲" },
            { t: "Get notified if anything needs attention.", i: "✱" },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal">
              <div className="feature-icon" style={{ fontFamily: "var(--serif)", fontSize: 16 }}>{f.i}</div>
              <div className="feature-text">{f.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== SECTION 6: CALCULATOR ===================
function Calculator() {
  const [panels, setPanels] = mUseState(8);
  const ref = mUseRef(null);
  const [seen, setSeen] = mUseState(false);

  mUseEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setSeen(true); });
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // Each panel produces ~ 1.4 kWh/day * 365 = 511 kWh/yr. Soiling loss avg 18% in India. ₹8/kWh.
  const annualBase = panels * 511 * 8;
  const lossRecovered = Math.round(annualBase * 0.18);
  const sysCost = panels <= 6 ? 30000 : panels <= 12 ? 50000 : 50000 + (panels - 12) * 3500;
  const paybackYears = sysCost / lossRecovered;
  const lifetime = lossRecovered * 25 - sysCost;

  const aSaved = mLerp(lossRecovered, 0.12);
  const aPay = mLerp(paybackYears, 0.12);
  const aLife = mLerp(lifetime, 0.12);

  return (
    <section id="calc" ref={ref} data-screen-label="06 The Math">
      <div className="reveal">
        <div className="section-eyebrow">06 — The math, your way</div>
        <h2 className="section-title">How many panels do <em>you</em> have?</h2>
        <p className="section-sub">Drag the slider. We'll show you the real numbers — no projections, no marketing math.</p>
      </div>
      <div className="calc">
        <div className="calc-control">
          <div className="calc-control-label">Number of panels</div>
          <div className="calc-control-value">{panels}<span>panels</span></div>
          <input className="calc-slider" type="range" min="4" max="30" value={panels} onChange={(e) => setPanels(Number(e.target.value))}/>
          <div className="calc-ticks"><span>4</span><span>10</span><span>16</span><span>22</span><span>30</span></div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line-soft)", fontSize: 13, color: "var(--ink-soft)" }}>
            Based on average soiling loss of <strong style={{ color: "var(--ink)" }}>18%</strong> across Tier-1 Indian cities, ₹8 per kWh, and 5.2 peak sun hours/day.
          </div>
        </div>
        <div className="calc-numbers">
          <div className="calc-number">
            <div className="label">Money saved per year</div>
            <div className="num">{mInr(aSaved)}</div>
          </div>
          <div className="calc-number">
            <div className="label">Years to pay back SparshIQ</div>
            <div className="num">{aPay.toFixed(1)}<span>yrs</span></div>
          </div>
          <div className="calc-number">
            <div className="label">Net saved over 25 years</div>
            <div className="num" style={{ color: "var(--green)" }}>{mInr(aLife)}</div>
          </div>
        </div>
      </div>

      <div className="calc-bars">
        <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400 }}>Lifetime savings, side by side</div>
        <div style={{ fontSize: 13, color: "var(--ink-mute)", marginTop: 4 }}>Across 25 years · {panels} panels</div>
        <div className="calc-bars-grid" style={{ marginTop: 32 }}>
          <div className="calc-bars-label">Without SparshIQ</div>
          <div className="calc-bars-bar"><div className="calc-bars-fill" style={{ transform: `scaleX(${seen ? 0.42 : 0})`, transition: "transform 1400ms cubic-bezier(0.34, 1.2, 0.64, 1)" }}></div></div>
          <div className="calc-bars-num">{mInr(annualBase * 25 * 0.82)}</div>
          <div className="calc-bars-label">With SparshIQ</div>
          <div className="calc-bars-bar"><div className="calc-bars-fill amber" style={{ transform: `scaleX(${seen ? 1 : 0})`, transition: "transform 1600ms cubic-bezier(0.34, 1.2, 0.64, 1)" }}></div></div>
          <div className="calc-bars-num" style={{ color: "var(--amber)" }}>{mInr(annualBase * 25)}</div>
        </div>
      </div>
    </section>
  );
}

// =================== SECTION 7: INDIA MAP ===================
const CITIES = [
  { name: "Delhi NCR", x: 405, y: 180, intensity: 0.92, loss: "22%" },
  { name: "Jaipur", x: 360, y: 240, intensity: 0.85, loss: "20%" },
  { name: "Ahmedabad", x: 290, y: 320, intensity: 0.78, loss: "19%" },
  { name: "Mumbai", x: 290, y: 410, intensity: 0.55, loss: "14%" },
  { name: "Bangalore", x: 380, y: 540, intensity: 0.48, loss: "12%" },
  { name: "Hyderabad", x: 410, y: 460, intensity: 0.62, loss: "16%" },
  { name: "Chennai", x: 440, y: 560, intensity: 0.42, loss: "11%" },
  { name: "Kolkata", x: 580, y: 290, intensity: 0.58, loss: "15%" },
];

function IndiaMap() {
  const [hovered, setHovered] = mUseState(0);
  const canvasRef = mUseRef(null);
  const wrapRef = mUseRef(null);

  mUseEffect(() => {
    const THREE = window.THREE; if (!THREE) return;
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    cam.position.set(0, 1.2, 5);
    cam.lookAt(0, 0, 0);

    // Heat-cloud particle field (10000 pts) shaped like dust accumulation
    const N = 10000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sz = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // bias high density toward "north-west" of the cloud (Delhi/Jaipur)
      const r = Math.pow(Math.random(), 1.6) * 2.4;
      const a = Math.random() * Math.PI * 2;
      const skew = Math.random() < 0.45 ? -0.6 : 0;
      pos[i*3]   = Math.cos(a) * r * 0.9 + skew;
      pos[i*3+1] = Math.sin(a) * r * 1.4 + 0.4;
      pos[i*3+2] = (Math.random() - 0.5) * 0.6;
      // intensity color
      const intensity = Math.max(0, 1 - r/2.4) + (skew !== 0 ? 0.35 : 0);
      col[i*3]   = 1.0;
      col[i*3+1] = 0.45 + 0.4 * (1 - intensity);
      col[i*3+2] = 0.05 + 0.5 * (1 - intensity);
      sz[i] = 0.015 + Math.random() * 0.04;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aSize; varying vec3 vCol;
        uniform float uTime;
        void main(){
          vCol = color;
          vec3 p = position;
          p.x += sin(uTime*0.4 + position.y*2.0)*0.04;
          p.y += cos(uTime*0.3 + position.x*1.5)*0.03;
          vec4 mv = modelViewMatrix * vec4(p,1.0);
          gl_PointSize = aSize * 380.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vCol;
        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vCol, a*0.7);
        }`,
      vertexColors: true,
    });
    const cloud = new THREE.Points(geo, mat);
    scene.add(cloud);

    // ring grid
    for (let r = 1; r <= 4; r++) {
      const ringG = new THREE.RingGeometry(r*0.6 - 0.002, r*0.6 + 0.002, 64);
      const ringM = new THREE.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringG, ringM);
      ring.rotation.x = Math.PI/2;
      scene.add(ring);
    }

    const resize = () => {
      const r = wrapRef.current.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      cam.aspect = r.width / r.height;
      cam.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let raf, t0 = performance.now();
    const animate = () => {
      const t = (performance.now() - t0) * 0.001;
      mat.uniforms.uTime.value = t;
      cloud.rotation.y = t * 0.05;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); renderer.dispose(); };
  }, []);

  return (
    <section id="map" data-screen-label="07 Built for India">
      <div className="reveal">
        <div className="section-eyebrow">07 — Built for India</div>
        <h2 className="section-title">Designed for the <em>dustiest rooftops</em> in the world.</h2>
        <p className="section-sub">Soiling intensity varies massively across India. SparshIQ adjusts cleaning frequency for your region, automatically.</p>
      </div>
      <div className="map-stage">
        <div className="map-cloud-wrap" ref={wrapRef}>
          <canvas ref={canvasRef} className="map-cloud-canvas"></canvas>
          <div className="map-cloud-label">
            <div className="map-cloud-eyebrow">/ atmospheric soiling index</div>
            <div className="map-cloud-region">{CITIES[hovered].name.toUpperCase()}</div>
            <div className="map-cloud-stat">{CITIES[hovered].loss}<span> monthly loss</span></div>
            <div className="map-cloud-bar-track"><span style={{ transform: `scaleX(${CITIES[hovered].intensity})` }}></span></div>
          </div>
        </div>

        <div className="map-cities">
          {CITIES.map((c, i) => (
            <div key={c.name}
                 className={"map-city " + (hovered === i ? "active" : "")}
                 onMouseEnter={() => setHovered(i)}>
              <div>
                <div className="map-city-name">{c.name}</div>
                <div className="map-city-loss">{c.loss} monthly soiling loss</div>
              </div>
              <div className="map-city-bar"><span style={{ transform: `scaleX(${c.intensity})` }}></span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== SECTION 8: TESTIMONIALS ===================
const TESTIMONIALS = [
  { name: "Vikram", city: "Gurugram", num: "₹6,400 saved this year",
    quote: "Two months in, my inverter app shows a 19% jump from last summer. I stopped questioning it.",
    grad: ["#1B4F72", "#d4a373"] },
  { name: "Priya", city: "Pune", num: "₹4,200 saved this year",
    quote: "I forget it's even there. That's the whole point — solar panels were supposed to be the same.",
    grad: ["#2D7A3F", "#E89234"] },
  { name: "Anand", city: "Ahmedabad", num: "₹8,100 saved this year",
    quote: "Dust here is brutal. My installer used to charge me ₹2,000 each visit and never came on time.",
    grad: ["#2C2C2A", "#E89234"] },
];

function Testimonials() {
  return (
    <section id="stories" data-screen-label="08 Real Homes">
      <div className="reveal">
        <div className="section-eyebrow">08 — Real homes</div>
        <h2 className="section-title">Real numbers. <em>From real rooftops.</em></h2>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div className="testimonial reveal" key={i} style={{ transitionDelay: `${i*80}ms` }}>
            <div className="testimonial-img" style={{ background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})` }}>
              {/* Stylized rooftop placeholder */}
              <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id={`stripes-${i}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="320" height="240" fill={`url(#stripes-${i})`}/>
                {/* Panel grid */}
                <g transform="translate(50, 110) rotate(-15)">
                  {Array.from({length: 12}).map((_, k) => {
                    const r = Math.floor(k/4), c = k%4;
                    return <rect key={k} x={c*52} y={r*38} width="48" height="32" fill="rgba(26,40,80,0.65)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>;
                  })}
                </g>
                <text x="20" y="32" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="JetBrains Mono">{`// rooftop · ${t.city.toLowerCase()}`}</text>
              </svg>
            </div>
            <div className="testimonial-body">
              <div className="testimonial-num">{t.num}</div>
              <div className="testimonial-quote">"{t.quote}"</div>
              <div className="testimonial-byline">
                <span><strong style={{color:"var(--ink)"}}>{t.name}</strong> · {t.city}</span>
                <span>↗</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// =================== SECTION 9: PRICING ===================
function PricingCard({ plan, featured }) {
  const ref = mUseRef(null);
  const [tilt, setTilt] = mUseState({ x: 0, y: 0 });
  return (
    <div
      ref={ref}
      className={"pricing-card reveal " + (featured ? "featured" : "")}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: -((e.clientY - r.top)/r.height - 0.5) * 4, y: ((e.clientX - r.left)/r.width - 0.5) * 6 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {featured && <div className="pricing-tag">Recommended</div>}
      <div className="pricing-name">{plan.name}</div>
      <div className="pricing-price">{plan.price}<small>{plan.priceNote}</small></div>
      <div className="pricing-for">{plan.for}</div>
      <ul className="pricing-list">{plan.features.map((f) => <li key={f}>{f}</li>)}</ul>
      <a href="#" className="pricing-cta">{plan.cta}</a>
    </div>
  );
}

function Pricing() {
  const plans = [
    { name: "SparshIQ Lite", price: "₹30,000", priceNote: " onwards", for: "For 4–6 panel homes",
      features: ["Daily automated cleaning", "Basic app access", "1-year hardware warranty", "Self-install option"],
      cta: "Get Lite" },
    { name: "SparshIQ Pro", price: "₹50,000", priceNote: " onwards", for: "For 8–12 panel homes",
      features: ["Daily automated cleaning", "Full performance dashboard", "Annual maintenance included", "Priority support", "3-year warranty"],
      cta: "Get Pro", featured: true },
    { name: "SparshIQ Enterprise", price: "Talk to us", priceNote: "", for: "Housing societies, large rooftops",
      features: ["Custom installation", "Dedicated account manager", "Multi-rooftop dashboard", "On-site SLA", "Bulk pricing"],
      cta: "Book a call" },
  ];

  return (
    <section id="pricing" data-screen-label="09 Pricing">
      <div className="reveal">
        <div className="section-eyebrow">09 — Pricing</div>
        <h2 className="section-title">Transparent prices. <em>No "starting from" tricks.</em></h2>
        <p className="section-sub">One-time install. The system pays itself back in under 5 years on most rooftops.</p>
      </div>
      <div className="pricing-grid">
        {plans.map((p, i) => <PricingCard key={p.name} plan={p} featured={p.featured}/>)}
      </div>
    </section>
  );
}

// =================== SECTION 10: FAQ ===================
function FAQ() {
  const [open, setOpen] = mUseState(0);
  const items = [
    { q: "Will it damage my panels?", a: "The cleaning bar uses a soft EPDM foam strip — the same material that seals your car windshield. It's designed for daily contact with glass. Panel manufacturers we've tested with reported zero micro-scratching after 800+ cycles." },
    { q: "What if it rains during cleaning?", a: "SparshIQ checks weather forecasts at 4 AM and skips the cycle if rain is expected. If it's already raining, the controller waits — no point washing panels nature is washing for free." },
    { q: "How long does installation take?", a: "Two to three hours for a typical 8-panel home. Our certified installer comes once, mounts the rails on your existing solar frame (no drilling into your roof), connects to your inverter's data port, and you're done." },
    { q: "Do I need to maintain it?", a: "The EPDM strip is the only consumable — replace it every 12 months in 30 seconds. Pro plan includes the annual replacement automatically." },
    { q: "What if I move houses?", a: "It's modular. The installer un-mounts it in an hour and re-installs at your new home. We charge a small re-install fee, but the hardware stays yours for life." },
  ];

  return (
    <section id="faq" data-screen-label="10 FAQ">
      <div className="faq">
        <div className="reveal">
          <div className="section-eyebrow">10 — Questions</div>
          <h2 className="section-title">The things <em>everyone asks.</em></h2>
          <p className="section-sub">If something's missing here, write to us. We answer every email — no chatbot.</p>
        </div>
        <div className="faq-list">
          {items.map((it, i) => (
            <div key={i} className={"faq-item " + (open === i ? "open" : "")} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">
                <span>{it.q}</span>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-a"><div style={{ paddingTop: 4 }}>{it.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== SECTION 11: FOOTER ===================
function Footer() {
  const ref = mUseRef(null);
  const [reveal, setReveal] = mUseState(false);
  mUseEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setReveal(true); }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const word = "SparshIQ";
  return (
    <footer className="footer" ref={ref}>
      <div className="footer-inner">
        <div className="footer-mark" aria-label="SparshIQ">
          {word.split("").map((ch, i) => (
            <span key={i} style={{
              transform: reveal ? "translateY(0)" : "translateY(100%)",
              opacity: reveal ? 1 : 0,
              transition: `transform 900ms cubic-bezier(0.22,1,0.36,1) ${i*60}ms, opacity 900ms ease ${i*60}ms`,
            }}>{ch}</span>
          ))}
        </div>
        <div className="footer-tag">Made for rooftops that should be earning more.</div>

        <div className="footer-grid">
          <div className="footer-col" style={{ gridColumn: "span 2" }}>
            <h4>Stay informed</h4>
            <p style={{ color: "rgba(250,246,240,0.6)", fontSize: 14, maxWidth: "32ch" }}>
              One email a month. Field notes, performance data, and the occasional rooftop story.
            </p>
            <form className="footer-signup" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@home.in"/>
              <button type="submit">Subscribe</button>
            </form>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#how">How it works</a></li>
              <li><a href="#calc">The math</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="mailto:hello@sparshiq.in">hello@sparshiq.in</a></li>
              <li><a href="#">+91 80 4567 8900</a></li>
              <li><a href="#">Installation guide</a></li>
              <li><a href="#">Service request</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SparshIQ Technologies · Bengaluru, India</span>
          <span>Privacy · Terms · Warranty</span>
        </div>
      </div>
    </footer>
  );
}

window.Dashboard = Dashboard;
window.Calculator = Calculator;
window.IndiaMap = IndiaMap;
window.Testimonials = Testimonials;
window.Pricing = Pricing;
window.FAQ = FAQ;
window.Footer = Footer;
