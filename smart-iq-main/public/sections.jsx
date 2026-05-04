// Sections 2-4: Hidden problem, How it works, Routine
const { useState: sUseState, useEffect: sUseEffect, useRef: sUseRef, useMemo: sUseMemo } = React;
const { useScrollProgress, useLerpedNumber, inr, easeOutQuart, easeInOutCubic } = window.SparshUtils;

// =================== SECTION 2: HIDDEN PROBLEM ===================
function HiddenProblem() {
  const ref = sUseRef(null);
  const dirtyCanvas = sUseRef(null);
  const cleanCanvas = sUseRef(null);
  const p = useScrollProgress(ref);

  // Day counter 0..30
  const day = Math.round(p * 30);
  const lostTarget = Math.round(p * 2847);
  const lost = useLerpedNumber(lostTarget, 0.18);

  // Draw dust accumulation
  sUseEffect(() => {
    const drawPanel = (canvas, dustAmount) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.width = canvas.offsetWidth * 2;
      const h = canvas.height = canvas.offsetHeight * 2;
      ctx.scale(1, 1);
      // Sky-tinted background underneath frame
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, w, h);
      // Cells (silicon panel)
      const cols = 6, rows = 10;
      const pad = 16;
      const cellW = (w - pad*2) / cols;
      const cellH = (h - pad*2) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = pad + c*cellW;
          const y = pad + r*cellH;
          // Cell base — deep blue silicon
          const grd = ctx.createLinearGradient(x, y, x+cellW, y+cellH);
          grd.addColorStop(0, "#15233f");
          grd.addColorStop(1, "#0e1a32");
          ctx.fillStyle = grd;
          ctx.fillRect(x+3, y+3, cellW-6, cellH-6);
          // bus bars
          ctx.strokeStyle = "rgba(220,220,230,0.18)";
          ctx.lineWidth = 1;
          for (let bb = 1; bb < 4; bb++) {
            const xx = x + (cellW * bb/4);
            ctx.beginPath();
            ctx.moveTo(xx, y+4); ctx.lineTo(xx, y+cellH-4); ctx.stroke();
          }
        }
      }
      // Frame
      ctx.strokeStyle = "rgba(180,180,190,0.7)";
      ctx.lineWidth = 6;
      ctx.strokeRect(pad-2, pad-2, w-pad*2+4, h-pad*2+4);

      // Dust layer using noise particles
      if (dustAmount > 0) {
        const count = Math.floor(dustAmount * 3500);
        ctx.save();
        for (let i = 0; i < count; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          const r2 = Math.random() * 1.6 + 0.4;
          const a = Math.random() * 0.4 * dustAmount;
          ctx.fillStyle = `rgba(${190 + Math.random()*30}, ${160 + Math.random()*30}, ${110 + Math.random()*30}, ${a})`;
          ctx.beginPath(); ctx.arc(x, y, r2, 0, Math.PI*2); ctx.fill();
        }
        // Smudgy patches
        for (let i = 0; i < 8; i++) {
          const cx = Math.random()*w, cy = Math.random()*h;
          const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 + Math.random()*60);
          grd.addColorStop(0, `rgba(170,140,90,${0.15*dustAmount})`);
          grd.addColorStop(1, "rgba(170,140,90,0)");
          ctx.fillStyle = grd;
          ctx.fillRect(0,0,w,h);
        }
        ctx.restore();
      }
    };
    drawPanel(dirtyCanvas.current, p);
    drawPanel(cleanCanvas.current, 0);
  }, [p]);

  return (
    <section id="problem" ref={ref} data-screen-label="02 Hidden Problem">
      <div className="reveal">
        <div className="section-eyebrow">02 — The hidden problem</div>
        <h2 className="section-title">A solar panel loses up to <em>30% efficiency</em> in just one month of dust.</h2>
        <p className="section-sub">Your installer cleans twice a year. Dust accumulates daily.</p>
      </div>

      <div className="problem-stage">
        <div className="problem-panel">
          <canvas className="problem-panel-canvas" ref={dirtyCanvas}></canvas>
          <div className="problem-day">Day {day} · No cleaning</div>
          <div className="problem-label left">
            <div className="problem-label-mute">Lost so far</div>
            <div className="problem-label-num">{inr(lost)}</div>
          </div>
        </div>
        <div className="problem-panel">
          <canvas className="problem-panel-canvas" ref={cleanCanvas}></canvas>
          <div className="problem-day">Day {day} · With SparshIQ</div>
          <div className="problem-label right">
            <div className="problem-label-mute">Lost so far</div>
            <div className="problem-label-num">{inr(0)}</div>
          </div>
        </div>
      </div>
      <div className="problem-progress">
        <div className="problem-progress-fill" style={{ transform: `scaleX(${p})` }}></div>
      </div>
      <div className="problem-caption">Scroll forward — watch one month of soiling.</div>
    </section>
  );
}

// =================== SECTION 3: HOW IT WORKS ===================
const HW_COMPONENTS = [
  { id: "bar", name: "Cleaning Bar", desc: "Soft EPDM foam strip. Replaceable in 30 seconds." },
  { id: "sensor", name: "Temp Sensor", desc: "Measures panel surface heat without touching it." },
  { id: "controller", name: "Smart Controller", desc: "Talks to your inverter directly. No extra wiring." },
  { id: "frame", name: "Mount Frame", desc: "Fits on your existing solar frame. No drilling. No structural changes." },
];

function HowItWorks() {
  const [active, setActive] = sUseState("bar");
  const wrapRef = sUseRef(null);
  const canvasRef = sUseRef(null);

  sUseEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !window.THREE) return;
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    cam.position.set(3.2, 2.4, 4.6);
    cam.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      cam.aspect = r.width / r.height;
      cam.updateProjectionMatrix();
    };

    // Build a stylized exploded view
    const group = new THREE.Group();
    scene.add(group);

    const matBar = new THREE.MeshStandardMaterial({ color: 0xe8e8ea, roughness: 0.3, metalness: 0.6 });
    const matEpdm = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.95 });
    const matSensor = new THREE.MeshStandardMaterial({ color: 0x1B4F72, roughness: 0.4, metalness: 0.3 });
    const matCtrl = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.4 });
    const matFrame = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.4, metalness: 0.7 });
    const matAccent = new THREE.MeshStandardMaterial({ color: 0xE89234, roughness: 0.5 });

    const bar = new THREE.Group();
    const housing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 0.22), matBar);
    bar.add(housing);
    const epdm = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 0.08), matEpdm);
    epdm.position.set(0, -0.14, 0.04);
    bar.add(epdm);
    const accentStripe = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.005), matAccent);
    accentStripe.position.set(1.0, 0, 0.115);
    bar.add(accentStripe);

    const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), matSensor);
    const sensorRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.018, 12, 32), matAccent);
    const sensorGroup = new THREE.Group();
    sensorGroup.add(sensor); sensorGroup.add(sensorRing);

    const ctrl = new THREE.Group();
    const ctrlBody = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.36, 0.22), matCtrl);
    ctrl.add(ctrlBody);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 16), new THREE.MeshBasicMaterial({ color: 0xE89234 }));
    led.position.set(0.22, 0.1, 0.115);
    ctrl.add(led);

    const frame = new THREE.Group();
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.06), matFrame);
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.06, 0.06), matFrame);
    rail1.position.set(0, 0, -0.6);
    rail2.position.set(0, 0, 0.6);
    frame.add(rail1); frame.add(rail2);
    const cross1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.26), matFrame);
    const cross2 = cross1.clone();
    cross1.position.x = -1.3; cross2.position.x = 1.3;
    frame.add(cross1); frame.add(cross2);

    group.add(bar, sensorGroup, ctrl, frame);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7); scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffe1b3, 0.85);
    dir.position.set(4, 5, 3); scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x88aacc, 0.4);
    dir2.position.set(-3, 2, -2); scene.add(dir2);

    let raf;
    let yOffsets = { bar: 1.2, sensor: 0.6, ctrl: -0.4, frame: -1.0 };
    let xOffsets = { bar: 0, sensor: -0.9, ctrl: 1.0, frame: 0 };
    let zOffsets = { bar: 0, sensor: 0.2, ctrl: -0.4, frame: 0 };
    const targetSet = (id) => {
      // when active, zoom toward that component
      const focused = id;
      const focusY = { bar: 0.9, sensor: 0.4, ctrl: -0.6, frame: -1.1 };
      group.userData.focus = focused;
    };
    targetSet(active);

    let groupScale = 1;
    let camTargetZ = 4.6;

    const start = performance.now();
    const animate = () => {
      const now = performance.now();
      const t = (now - start) / 1000;
      // gentle rotation
      group.rotation.y = Math.sin(t * 0.3) * 0.25;
      // Position parts at exploded offsets
      bar.position.set(xOffsets.bar, yOffsets.bar, zOffsets.bar);
      sensorGroup.position.set(xOffsets.sensor, yOffsets.sensor, zOffsets.sensor);
      ctrl.position.set(xOffsets.ctrl, yOffsets.ctrl, zOffsets.ctrl);
      frame.position.set(xOffsets.frame, yOffsets.frame, zOffsets.frame);

      // Highlight active by scaling slightly
      const active = group.userData.focus;
      const scaleFor = (id) => active === id ? 1.2 : 0.85;
      bar.scale.setScalar(THREE.MathUtils.lerp(bar.scale.x, scaleFor("bar"), 0.08));
      sensorGroup.scale.setScalar(THREE.MathUtils.lerp(sensorGroup.scale.x, scaleFor("sensor"), 0.08));
      ctrl.scale.setScalar(THREE.MathUtils.lerp(ctrl.scale.x, scaleFor("ctrl"), 0.08));
      frame.scale.setScalar(THREE.MathUtils.lerp(frame.scale.x, scaleFor("frame"), 0.08));

      renderer.render(scene, cam);
      raf = requestAnimationFrame(animate);
    };
    resize();
    window.addEventListener("resize", resize);
    animate();

    // expose update fn
    canvasRef.current.__setActive = (id) => { group.userData.focus = id; };

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); renderer.dispose(); };
  }, []);

  sUseEffect(() => {
    if (canvasRef.current && canvasRef.current.__setActive) canvasRef.current.__setActive(active);
  }, [active]);

  return (
    <section id="how" data-screen-label="03 How It Works">
      <div className="reveal">
        <div className="section-eyebrow">03 — How it works</div>
        <h2 className="section-title">Four parts. <em>One quiet job.</em></h2>
        <p className="section-sub">SparshIQ mounts onto your existing frame in under three hours.</p>
      </div>
      <div className="howitworks">
        <div className="howitworks-canvas-wrap" ref={wrapRef}>
          <canvas className="howitworks-canvas" ref={canvasRef}></canvas>
        </div>
        <div className="howitworks-list">
          {HW_COMPONENTS.map((c, i) => (
            <div
              key={c.id}
              className={"howitworks-item " + (active === c.id ? "active" : "")}
              onClick={() => setActive(c.id)}
              onMouseEnter={() => setActive(c.id)}
            >
              <div className="hw-num">0{i+1}</div>
              <div>
                <div className="hw-title">{c.name}</div>
                <div className="hw-desc">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== SECTION 4: ROUTINE (Full Three.js) ===================
function Routine() {
  const canvasRef = sUseRef(null);
  const wrapRef = sUseRef(null);
  const stateRef = sUseRef({ t: 0, playing: true, mouse: 0 });
  const [, force] = sUseState(0);

  sUseEffect(() => {
    const THREE = window.THREE; if (!THREE) return;
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.012);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    camera.position.set(8, 6, 11);
    camera.lookAt(0, 0.5, 0);

    // ---- SKY DOME (vertex-color gradient) ----
    const skyGeo = new THREE.SphereGeometry(80, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        uTop: { value: new THREE.Color(0x05060f) },
        uMid: { value: new THREE.Color(0x1a1530) },
        uBot: { value: new THREE.Color(0x2a1a2e) },
        uSunPos: { value: new THREE.Vector3(0, -1, 0) },
        uSunCol: { value: new THREE.Color(0xff7a1a) },
        uSunStrength: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorld;
        void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `
        uniform vec3 uTop, uMid, uBot, uSunPos, uSunCol;
        uniform float uSunStrength;
        varying vec3 vWorld;
        void main(){
          vec3 dir = normalize(vWorld);
          float h = clamp(dir.y, -1.0, 1.0);
          vec3 col = mix(uBot, uMid, smoothstep(-0.1, 0.35, h));
          col = mix(col, uTop, smoothstep(0.35, 0.9, h));
          // sun glow
          float d = max(0.0, dot(dir, normalize(uSunPos)));
          col += uSunCol * pow(d, 32.0) * uSunStrength * 2.5;
          col += uSunCol * pow(d, 4.0) * uSunStrength * 0.35;
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // ---- LIGHTS ----
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambient);
    const sunLight = new THREE.DirectionalLight(0xffd1a0, 1.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.left = -10; sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10; sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    const rim = new THREE.DirectionalLight(0xff2d6f, 0.4); rim.position.set(-5, 3, -6); scene.add(rim);
    const rim2 = new THREE.PointLight(0xff7a1a, 1.5, 20); rim2.position.set(2, 1.2, 2); scene.add(rim2);

    // ---- VISIBLE SUN DISC ----
    const sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: 0.0 })
    );
    scene.add(sunDisc);

    // ---- ROOFTOP BASE ----
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.3, 14),
      new THREE.MeshStandardMaterial({ color: 0x1c1d22, roughness: 0.9 })
    );
    roof.position.y = -0.15; roof.receiveShadow = true; scene.add(roof);
    // edge trim
    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(20.2, 0.06, 14.2),
      new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.4, emissive: 0xff7a1a, emissiveIntensity: 0.4 })
    );
    edge.position.y = 0.02; scene.add(edge);

    // ---- SOLAR PANELS (3x2 grid) ----
    const panelGroup = new THREE.Group();
    scene.add(panelGroup);
    const panelMats = [];
    const panelGeo = new THREE.BoxGeometry(2.4, 0.08, 1.4);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uDust: { value: 1.0 },
            uClean: { value: 0.0 }, // 0..1 sweep
            uTime: { value: 0 },
            uSunStrength: { value: 0 },
          },
          vertexShader: `
            varying vec2 vUv; varying vec3 vN;
            void main(){ vUv = uv; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
          fragmentShader: `
            varying vec2 vUv; varying vec3 vN;
            uniform float uDust, uClean, uTime, uSunStrength;
            float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
            float noise(vec2 p){
              vec2 i = floor(p), f = fract(p);
              float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
              vec2 u = f*f*(3.0-2.0*f);
              return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
            }
            void main(){
              // grid lines (cells)
              vec2 g = abs(fract(vUv * vec2(6.0, 4.0)) - 0.5);
              float line = smoothstep(0.46, 0.5, max(g.x, g.y));
              vec3 cellCol = vec3(0.04, 0.06, 0.12);
              vec3 lineCol = vec3(0.2, 0.45, 0.75);
              vec3 base = mix(cellCol, lineCol, line);
              // sheen
              float sheen = pow(max(0.0, vN.y), 1.5);
              base += vec3(0.15, 0.35, 0.6) * sheen * (0.4 + 0.6*uSunStrength);
              // dust mask: only ahead of the cleaning sweep (vUv.x < uClean means cleaned)
              float dust = uDust * smoothstep(uClean - 0.03, uClean + 0.03, vUv.x);
              float dn = noise(vUv * 32.0) * 0.6 + noise(vUv * 80.0) * 0.4;
              vec3 dustCol = mix(vec3(0.55,0.42,0.28), vec3(0.75,0.62,0.42), dn);
              base = mix(base, dustCol, dust * 0.75);
              // wet sheen right at the sweep
              float wet = smoothstep(0.06, 0.0, abs(vUv.x - uClean));
              base += vec3(0.5, 0.7, 1.0) * wet * 0.6;
              gl_FragColor = vec4(base, 1.0);
            }`,
        });
        panelMats.push(mat);
        const m = new THREE.Mesh(panelGeo, mat);
        m.position.set(-3.0 + i*2.6, 0.18, -1.5 + j*1.6);
        m.rotation.x = -0.18; // tilt
        m.castShadow = true; m.receiveShadow = true;
        panelGroup.add(m);
        // panel frame
        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(2.5, 0.05, 1.5),
          new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.4, metalness: 0.7 })
        );
        frame.position.copy(m.position); frame.position.y -= 0.04; frame.rotation.x = m.rotation.x;
        panelGroup.add(frame);
      }
    }

    // ---- SPRINKLER RAIL + CLEANING BAR ----
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(8.4, 0.06, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff7a1a, emissiveIntensity: 0.6, metalness: 0.6, roughness: 0.3 })
    );
    rail.position.set(0, 0.36, -2.5); scene.add(rail);
    const rail2 = rail.clone(); rail2.position.z = 1.5; scene.add(rail2);

    // Cleaning bar group
    const bar = new THREE.Group();
    scene.add(bar);
    // bar body
    const barBody = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.18, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xfafafa, metalness: 0.85, roughness: 0.18, emissive: 0xff7a1a, emissiveIntensity: 0.05 })
    );
    barBody.castShadow = true;
    bar.add(barBody);
    // foam strip (under)
    const foam = new THREE.Mesh(
      new THREE.BoxGeometry(8.0, 0.06, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1 })
    );
    foam.position.y = -0.10; bar.add(foam);
    // sprinkler nozzles along the bar
    const nozzles = [];
    for (let n = -3.6; n <= 3.6; n += 0.6) {
      const noz = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.07, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0x111, metalness: 0.9, roughness: 0.2 })
      );
      noz.position.set(n, -0.04, 0.14);
      noz.rotation.x = Math.PI / 2.2;
      bar.add(noz);
      nozzles.push(noz);
    }
    // bar end caps with neon glow
    [-1, 1].forEach(s => {
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.30, 0.30),
        new THREE.MeshStandardMaterial({ color: 0xc8ff00, emissive: 0xc8ff00, emissiveIntensity: 1.2 })
      );
      cap.position.set(s * 4.15, 0, 0); bar.add(cap);
    });
    bar.position.set(0, 0.34, -2.5);

    // ---- SPRINKLER MIST PARTICLES ----
    const MIST_COUNT = 1500;
    const mistGeo = new THREE.BufferGeometry();
    const mistPos = new Float32Array(MIST_COUNT * 3);
    const mistVel = new Float32Array(MIST_COUNT * 3);
    const mistLife = new Float32Array(MIST_COUNT);
    const mistSize = new Float32Array(MIST_COUNT);
    for (let i = 0; i < MIST_COUNT; i++) {
      mistLife[i] = -1; // dead
      mistSize[i] = 0.04 + Math.random() * 0.06;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    mistGeo.setAttribute('aSize', new THREE.BufferAttribute(mistSize, 1));
    mistGeo.setAttribute('aLife', new THREE.BufferAttribute(mistLife, 1));
    const mistMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aSize; attribute float aLife;
        varying float vLife;
        void main(){
          vLife = aLife;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * 280.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vLife;
        void main(){
          if (vLife <= 0.0) discard;
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float a = smoothstep(0.5, 0.0, d) * vLife;
          vec3 col = mix(vec3(0.5,0.8,1.0), vec3(1.0,1.0,1.0), vLife);
          gl_FragColor = vec4(col, a * 0.55);
        }`,
    });
    const mist = new THREE.Points(mistGeo, mistMat);
    scene.add(mist);

    // ---- AMBIENT FLOATING DUST ----
    const dustCount = 500;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i*3] = (Math.random()-0.5)*30;
      dustPos[i*3+1] = Math.random()*8;
      dustPos[i*3+2] = (Math.random()-0.5)*20;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.04, color: 0xffd1a0, transparent: true, opacity: 0.4, depthWrite: false });
    const dustPts = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPts);

    // resize
    const resize = () => {
      const r = wrapRef.current.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // mouse
    const onMove = (e) => {
      const r = wrapRef.current.getBoundingClientRect();
      stateRef.current.mouse = ((e.clientX - r.left) / r.width - 0.5) * 0.4;
    };
    wrapRef.current.addEventListener('mousemove', onMove);

    // ---- ANIMATION LOOP ----
    let raf, last = performance.now();
    const cleanStart = (1*60+12) / (24*60); // 5:12am from 4am base
    const cleanEnd = (1*60+38) / (24*60);
    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = stateRef.current;
      if (st.playing) st.t = (st.t + dt / 14) % 1; // 14s loop
      const t = st.t;
      const mins = (t * 24 * 60 + 4 * 60) % (24*60);

      // sky/sun colors over the day
      const dawn = 0.05, sunrise = 0.18, day = 0.45, sunset = 0.85;
      let top, mid, bot, sunCol, sunStr, sunY, sunX;
      if (t < dawn) { top=[0.02,0.02,0.06]; mid=[0.06,0.06,0.12]; bot=[0.12,0.08,0.18]; sunCol=[1.0,0.5,0.2]; sunStr=0.0; }
      else if (t < sunrise) {
        const k = (t - dawn) / (sunrise - dawn);
        top=[0.02+0.05*k, 0.02+0.04*k, 0.06+0.10*k];
        mid=[0.10+0.30*k, 0.08+0.10*k, 0.20];
        bot=[0.40+0.50*k, 0.20+0.40*k, 0.20+0.10*k];
        sunCol=[1.0, 0.5+0.3*k, 0.2+0.4*k]; sunStr = k * 0.8;
      }
      else if (t < day) {
        const k = (t - sunrise) / (day - sunrise);
        top=[0.07+0.20*k, 0.06+0.30*k, 0.16+0.50*k];
        mid=[0.40+0.20*k, 0.18+0.40*k, 0.20+0.50*k];
        bot=[0.90, 0.60+0.20*k, 0.30+0.50*k];
        sunCol=[1.0, 0.85, 0.55+0.3*k]; sunStr = 0.8 + k*0.2;
      }
      else if (t < sunset) {
        top=[0.27, 0.36, 0.66]; mid=[0.60, 0.58, 0.70]; bot=[0.90, 0.80, 0.80];
        sunCol=[1.0,1.0,0.9]; sunStr = 1.0;
      }
      else {
        const k = (t - sunset) / (1 - sunset);
        top=[0.27-0.20*k, 0.36-0.30*k, 0.66-0.55*k];
        mid=[0.60-0.50*k, 0.58-0.50*k, 0.70-0.55*k];
        bot=[0.90-0.40*k, 0.40-0.30*k, 0.30-0.20*k];
        sunCol=[1.0, 0.4-0.2*k, 0.2]; sunStr = Math.max(0, 1.0 - k*1.4);
      }
      skyMat.uniforms.uTop.value.setRGB(...top);
      skyMat.uniforms.uMid.value.setRGB(...mid);
      skyMat.uniforms.uBot.value.setRGB(...bot);
      skyMat.uniforms.uSunCol.value.setRGB(...sunCol);
      skyMat.uniforms.uSunStrength.value = sunStr;

      // sun position: arc from east to west
      const arcAng = t * Math.PI; // 0..pi
      sunX = Math.cos(Math.PI - arcAng) * 30;
      sunY = Math.sin(arcAng) * 22 - 4;
      const sunZ = -20;
      skyMat.uniforms.uSunPos.value.set(sunX, sunY, sunZ);
      sunDisc.position.set(sunX*0.7, sunY*0.7, sunZ*0.7);
      sunDisc.material.opacity = Math.max(0, Math.min(1, sunStr * 1.4));
      sunDisc.material.color.setRGB(...sunCol);
      sunLight.position.set(sunX*0.3, Math.max(2, sunY*0.5), sunZ*0.2);
      sunLight.color.setRGB(Math.min(1, sunCol[0]+0.2), Math.min(1, sunCol[1]+0.2), Math.min(1, sunCol[2]+0.2));
      sunLight.intensity = 0.3 + sunStr * 1.4;
      ambient.intensity = 0.12 + sunStr * 0.35;
      rim2.intensity = 0.8 + (1 - sunStr) * 1.5; // night neon glow

      // panels: cleaning sweep
      let cleanPos = 0; // 0..1 across panel x (cleaned region)
      const cleaning = t >= cleanStart && t <= cleanEnd;
      if (t < cleanStart) cleanPos = 0; // dirty
      else if (t > cleanEnd) cleanPos = 1; // fully clean (will reset visually next loop)
      else cleanPos = (t - cleanStart) / (cleanEnd - cleanStart);

      // dust persists thru day, resets at end of day
      const baseDust = t > cleanEnd ? Math.max(0, 0.05 + (t - cleanEnd) * 0.4) : 1.0;
      panelMats.forEach(m => {
        m.uniforms.uDust.value = baseDust;
        m.uniforms.uClean.value = cleanPos;
        m.uniforms.uSunStrength.value = sunStr;
        m.uniforms.uTime.value = now * 0.001;
      });

      // bar position: slides from -2.5 (back of array) to +1.5 during clean window, raised when not cleaning
      if (cleaning) {
        const k = (t - cleanStart) / (cleanEnd - cleanStart);
        bar.position.x = 0;
        bar.position.z = -2.5 + k * 4.0;
        bar.position.y = 0.34;
        bar.visible = true;
      } else if (t < cleanStart) {
        bar.position.set(0, 0.34, -2.5);
        bar.visible = true;
      } else {
        // returning home (slide back over a couple seconds)
        const k = Math.min(1, (t - cleanEnd) / 0.04);
        bar.position.z = 1.5 - k * 4.0;
        bar.visible = true;
      }

      // emit mist particles when cleaning
      if (cleaning) {
        for (let i = 0; i < 14; i++) {
          // pick a dead particle
          for (let j = 0; j < MIST_COUNT; j++) {
            const idx = (j + Math.floor(Math.random()*MIST_COUNT)) % MIST_COUNT;
            if (mistLife[idx] <= 0) {
              const sx = (Math.random() - 0.5) * 8.0;
              mistPos[idx*3]   = bar.position.x + sx;
              mistPos[idx*3+1] = bar.position.y - 0.05;
              mistPos[idx*3+2] = bar.position.z + 0.18 + (Math.random()-0.5)*0.06;
              mistVel[idx*3]   = (Math.random()-0.5) * 0.8;
              mistVel[idx*3+1] = -0.3 - Math.random()*0.6;
              mistVel[idx*3+2] = 0.6 + Math.random()*0.8;
              mistLife[idx] = 1.0;
              break;
            }
          }
        }
      }
      // update mist
      for (let i = 0; i < MIST_COUNT; i++) {
        if (mistLife[i] > 0) {
          mistLife[i] -= dt * 1.6;
          mistPos[i*3]   += mistVel[i*3]   * dt;
          mistPos[i*3+1] += mistVel[i*3+1] * dt;
          mistPos[i*3+2] += mistVel[i*3+2] * dt;
          mistVel[i*3+1] += dt * -0.3; // gravity-ish
        } else {
          mistPos[i*3+1] = -10;
        }
      }
      mistGeo.attributes.position.needsUpdate = true;
      mistGeo.attributes.aLife.array.set(mistLife);
      mistGeo.attributes.aLife.needsUpdate = true;

      // ambient dust drift
      for (let i = 0; i < dustCount; i++) {
        dustPos[i*3] += dt * 0.2;
        if (dustPos[i*3] > 15) dustPos[i*3] = -15;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // camera dolly with mouse
      camera.position.x = 8 + st.mouse * 1.5;
      camera.position.y = 6 + Math.sin(now * 0.0003) * 0.15;
      camera.lookAt(0, 0.5, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // expose for UI
    canvas.__getState = () => stateRef.current;

    // tick UI ~10 Hz
    const ui = setInterval(() => force(x => x + 1), 100);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(ui);
      window.removeEventListener('resize', resize);
      wrapRef.current && wrapRef.current.removeEventListener('mousemove', onMove);
      renderer.dispose();
    };
  }, []);

  const t = stateRef.current.t;
  const mins = (t * 24 * 60 + 4 * 60) % (24*60);
  const hh = Math.floor(mins / 60);
  const mm = Math.floor(mins % 60);
  const timeStr = `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
  const cleanStart = (1*60+12) / (24*60);
  const cleanEnd = (1*60+38) / (24*60);
  const cleaning = t >= cleanStart && t <= cleanEnd;
  const cleaned = t > cleanEnd && t < 0.95;
  const phase = t < 0.05 ? "Pre-dawn" : t < 0.18 ? "First light" : t < 0.45 ? "Sunrise" : t < 0.7 ? "Daylight" : t < 0.9 ? "Dusk" : "Night";

  return (
    <section id="routine" data-screen-label="04 Daily Routine">
      <div className="reveal">
        <div className="section-eyebrow">04 — Daily routine</div>
        <h2 className="section-title">Every morning, before <em>you wake up.</em></h2>
        <p className="section-sub">Sprinklers mist. The bar sweeps. Done before sunrise — every single day.</p>
      </div>
      <div className="routine-stage" ref={wrapRef}>
        <canvas className="routine-canvas" ref={canvasRef}></canvas>
        <div className="routine-overlay">
          <div>
            <div className="routine-time">{timeStr}</div>
            <div className="routine-time-label">{phase}</div>
          </div>
          <div className="routine-status">
            <div className={"routine-status-row " + (t < cleanStart ? "active" : "done")}>
              <div className="routine-status-dot"></div>
              <div>04:00 — System idle. Sensors armed.</div>
            </div>
            <div className={"routine-status-row " + (cleaning ? "active" : (cleaned ? "done" : ""))}>
              <div className="routine-status-dot"></div>
              <div>05:12 — Sprinklers on. Bar sweeping. {cleaning ? `${Math.round((t-cleanStart)/(cleanEnd-cleanStart)*100)}%` : ""}</div>
            </div>
            <div className={"routine-status-row " + (cleaned ? "done" : "")}>
              <div className="routine-status-dot"></div>
              <div>05:38 — Dry. Reflective. Ready for sun.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="routine-scrubber">
        <button className="routine-play" onClick={() => { stateRef.current.playing = !stateRef.current.playing; force(x => x+1); }}>
          {stateRef.current.playing ? "❚❚" : "▶"}
        </button>
        <div className="routine-scrubber-track" onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          stateRef.current.t = (e.clientX - r.left) / r.width;
          force(x => x+1);
        }}>
          <div className="routine-scrubber-fill" style={{ transform: `scaleX(${t})` }}></div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
          14s = 24h
        </div>
      </div>
    </section>
  );
}

window.HiddenProblem = HiddenProblem;
window.HowItWorks = HowItWorks;
window.Routine = Routine;
