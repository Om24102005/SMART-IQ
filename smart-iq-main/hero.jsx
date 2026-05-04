// Hero — bold dark scene with sunrise, sprinklers, and live cleaning
const { useState: hUseState, useEffect: hUseEffect, useRef: hUseRef } = React;

function HeroScene() {
  const wrapRef = hUseRef(null);
  const canvasRef = hUseRef(null);
  const [readout, setReadout] = hUseState({ show: false, power: 280, gain: 0 });
  const [phase, setPhase] = hUseState("dawn");

  hUseEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !window.THREE) return;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0816, 0.04);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(5.2, 4.8, 7);
    camera.lookAt(0, 0.3, 0);

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };

    // SKY — full-screen quad behind everything
    const skyGeo = new THREE.PlaneGeometry(60, 30);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: { uPhase: { value: 0 }, uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        varying vec2 vUv; uniform float uPhase; uniform float uTime;
        void main(){
          // bold colors - night purple to magenta to amber
          vec3 night = vec3(0.04, 0.05, 0.18);
          vec3 deep  = vec3(0.18, 0.06, 0.32);
          vec3 magenta = vec3(0.95, 0.18, 0.55);
          vec3 orange = vec3(1.0, 0.5, 0.18);
          vec3 day = vec3(0.95, 0.74, 0.42);
          float p = uPhase;
          vec3 top = mix(night, mix(deep, magenta, smoothstep(0.3,0.7,p)), p);
          vec3 horizon = mix(deep, mix(orange, day, smoothstep(0.6,1.0,p)), p);
          vec3 c = mix(horizon, top, smoothstep(0.0, 1.0, vUv.y));
          // stars in early phase
          float starSeed = fract(sin(dot(floor(vUv*200.0), vec2(127.1,311.7))) * 43758.5);
          float star = step(0.997, starSeed) * (1.0 - p) * (0.6 + 0.4*sin(uTime*3.0 + starSeed*40.0));
          c += star * vec3(1.0, 0.95, 0.85);
          // grain
          float n = fract(sin(dot(vUv*1500.0, vec2(12.9898,78.233))) * 43758.5);
          c += (n - 0.5) * 0.02;
          gl_FragColor = vec4(c, 1.0);
        }
      `,
      depthWrite: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(0, 6, -14);
    scene.add(sky);

    // Sun
    const sunGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const sunMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        varying vec3 vN; uniform float uTime; uniform float uOpacity;
        void main(){
          float fres = pow(1.0 - max(0.0, vN.z), 2.0);
          vec3 c = mix(vec3(1.0, 0.95, 0.7), vec3(1.0, 0.55, 0.2), fres);
          gl_FragColor = vec4(c, uOpacity);
        }
      `,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(6, -1, -10);
    scene.add(sun);

    // Sun halo
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 3.5, 64),
      new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uOpacity: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `varying vec2 vUv; uniform float uOpacity; void main(){ float r=distance(vUv,vec2(0.5)); float a = smoothstep(0.5, 0.18, r) * 0.4 * uOpacity; gl_FragColor = vec4(1.0, 0.65, 0.3, a); }`,
      })
    );
    halo.position.copy(sun.position);
    scene.add(halo);

    // ROOF base
    const roofGeo = new THREE.PlaneGeometry(20, 14);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x2a1f18, roughness: 0.9, metalness: 0.0 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = -0.25;
    scene.add(roof);

    // Subtle roof grid lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4a3a30, transparent: true, opacity: 0.4 });
    for (let i = -10; i <= 10; i += 2) {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -0.24, -7),
        new THREE.Vector3(i, -0.24, 7),
      ]);
      scene.add(new THREE.Line(g, lineMat));
      const g2 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10, -0.24, i),
        new THREE.Vector3(10, -0.24, i),
      ]);
      scene.add(new THREE.Line(g2, lineMat));
    }

    // SOLAR PANELS
    const cols = 4, rows = 2;
    const panelW = 1.7, panelH = 1.05, gap = 0.1;
    const totalW = cols * panelW + (cols - 1) * gap;
    const totalH = rows * panelH + (rows - 1) * gap;
    const panels = [];

    const panelShader = {
      uniforms: { uClipZ: { value: -1 }, uPhase: { value: 0 }, uTime: { value: 0 }, uPanelZ: { value: 0 }, uPanelH: { value: panelH } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uClipZ; uniform float uPhase; uniform float uTime;
        uniform float uPanelZ; uniform float uPanelH;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
        float noise(vec2 p){ vec2 i=floor(p),f=fract(p); float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1)); vec2 u=f*f*(3.0-2.0*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
        float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }
        void main(){
          vec2 grid = vec2(6.0, 10.0);
          vec2 local = fract(vUv * grid);
          float border = step(0.045, local.x) * step(local.x, 0.955) * step(0.045, local.y) * step(local.y, 0.955);
          // Bold deep silicon
          vec3 silicon = mix(vec3(0.06,0.10,0.22), vec3(0.10,0.16,0.36), noise(vUv*30.0));
          vec3 frame = vec3(0.32, 0.32, 0.36);
          vec3 baseClean = mix(frame, silicon, border);
          // dust
          float dust = clamp(fbm(vUv*7.0)*0.85 + fbm(vUv*22.0)*0.3, 0.0, 1.0);
          vec3 dustColor = mix(vec3(0.62, 0.46, 0.26), vec3(0.42, 0.30, 0.18), dust);
          vec3 dirty = mix(baseClean*0.5, dustColor, 0.6 + dust*0.3);
          // local v: 0..1 along panel length (vUv.y maps to z)
          float v = vUv.y;
          // bar position in panel local space
          float barLocal = (uClipZ - (uPanelZ - uPanelH/2.0)) / uPanelH;
          float swept = step(v, barLocal);
          float wet = smoothstep(barLocal - 0.06, barLocal, v) * (1.0 - smoothstep(barLocal - 0.02, barLocal + 0.04, v));
          vec3 col = mix(dirty, baseClean, swept);
          // wet sheen — strong specular
          col += wet * vec3(0.4, 0.6, 1.0) * 0.7;
          // sunrise tint with bold magenta-amber gradient
          vec3 dawnTint = mix(vec3(0.5,0.4,0.65), vec3(1.1,0.7,0.55), uPhase);
          col *= dawnTint;
          // panel highlights
          float reflectStripe = smoothstep(0.0, 1.0, sin(vUv.x*40.0 + uTime*0.2)*0.5+0.5) * 0.05 * uPhase;
          col += reflectStripe * vec3(1.0, 0.85, 0.7);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const geom = new THREE.PlaneGeometry(panelW, panelH);
        const u = THREE.UniformsUtils.clone(panelShader.uniforms);
        const mat = new THREE.ShaderMaterial({
          uniforms: u,
          vertexShader: panelShader.vertexShader,
          fragmentShader: panelShader.fragmentShader,
        });
        const m = new THREE.Mesh(geom, mat);
        m.rotation.x = -Math.PI / 2;
        const pz = -totalH/2 + r*(panelH+gap) + panelH/2;
        m.position.set(
          -totalW/2 + c*(panelW+gap) + panelW/2,
          0.05,
          pz
        );
        u.uPanelZ.value = pz;
        scene.add(m);
        panels.push(m);
      }
    }

    // Aluminum frame
    const railMat = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.35, metalness: 0.85 });
    for (let r = 0; r <= rows; r++) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(totalW + 0.3, 0.06, 0.06), railMat);
      rail.position.set(0, 0.02, -totalH/2 + r*(panelH + gap));
      scene.add(rail);
    }
    // Side rails
    for (let c = 0; c <= cols; c++) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, totalH + 0.2), railMat);
      rail.position.set(-totalW/2 + c*(panelW+gap) - gap/2, 0.02, 0);
      if (c > 0 && c < cols) scene.add(rail);
    }

    // Side support pylons (chunky, 3D)
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x404048, roughness: 0.5, metalness: 0.6 });
    for (let s of [-1, 1]) {
      for (let r of [-1, 1]) {
        const py = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.4, 12), pylonMat);
        py.position.set(s * (totalW/2 + 0.1), -0.05, r * (totalH/2 + 0.1));
        scene.add(py);
      }
    }

    // ===== SPRINKLER ARM (the cleaning bar with visible nozzles) =====
    const barGroup = new THREE.Group();
    const barW = totalW + 0.5;

    // Main aluminum housing
    const housingGeo = new THREE.BoxGeometry(barW, 0.16, 0.22);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0xe2e2e6, roughness: 0.25, metalness: 0.85 });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.y = 0.32;
    barGroup.add(housing);

    // Amber accent strip
    const accent = new THREE.Mesh(
      new THREE.BoxGeometry(barW * 0.85, 0.025, 0.005),
      new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff7a1a, emissiveIntensity: 0.8 })
    );
    accent.position.set(0, 0.32, 0.115);
    barGroup.add(accent);

    // EPDM strip below
    const epdm = new THREE.Mesh(
      new THREE.BoxGeometry(barW, 0.04, 0.07),
      new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.95 })
    );
    epdm.position.set(0, 0.22, 0.04);
    barGroup.add(epdm);

    // Sprinkler nozzles — visible little cones along the bar
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xc8c8d0, roughness: 0.3, metalness: 0.9 });
    const nozzles = [];
    const nozzleCount = 14;
    for (let i = 0; i < nozzleCount; i++) {
      const x = -barW/2 + 0.3 + (i / (nozzleCount - 1)) * (barW - 0.6);
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 12), nozzleMat);
      nozzle.position.set(x, 0.22, 0.085);
      nozzle.rotation.x = Math.PI / 2;
      barGroup.add(nozzle);
      nozzles.push(new THREE.Vector3(x, 0.22, 0.09));
    }

    // End caps with screws
    for (let s of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0x18181c, roughness: 0.6 }));
      cap.rotation.z = Math.PI/2;
      cap.position.set(s * barW/2, 0.32, 0);
      barGroup.add(cap);
    }

    barGroup.position.set(0, 0, -totalH/2 - 0.3);
    scene.add(barGroup);

    // ===== WATER SPRAY PARTICLES =====
    const sprayCount = 1500;
    const sprayPos = new Float32Array(sprayCount * 3);
    const spraySeed = new Float32Array(sprayCount);
    const sprayNozzle = new Float32Array(sprayCount);
    for (let i = 0; i < sprayCount; i++) {
      sprayPos[i*3+0] = 0;
      sprayPos[i*3+1] = 0;
      sprayPos[i*3+2] = 0;
      spraySeed[i] = Math.random();
      sprayNozzle[i] = Math.floor(Math.random() * nozzleCount);
    }
    const sprayGeo = new THREE.BufferGeometry();
    sprayGeo.setAttribute("position", new THREE.BufferAttribute(sprayPos, 3));
    sprayGeo.setAttribute("aSeed", new THREE.BufferAttribute(spraySeed, 1));
    sprayGeo.setAttribute("aNozzle", new THREE.BufferAttribute(sprayNozzle, 1));

    const sprayMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uActive: { value: 0 },
        uBarPos: { value: new THREE.Vector3() },
        uBarW: { value: barW },
        uNozzleCount: { value: nozzleCount },
      },
      vertexShader: `
        attribute float aSeed; attribute float aNozzle;
        uniform float uTime; uniform float uActive;
        uniform vec3 uBarPos; uniform float uBarW; uniform float uNozzleCount;
        varying float vA;
        void main(){
          // Compute nozzle world position
          float nx = -uBarW*0.5 + 0.3 + (aNozzle / (uNozzleCount - 1.0)) * (uBarW - 0.6);
          vec3 origin = uBarPos + vec3(nx, 0.22, 0.09);
          float life = fract(uTime * 1.6 + aSeed * 13.0);
          // Spray cone forward (+z) and slightly down
          float angle = (aSeed - 0.5) * 0.5;
          float horiz = (fract(aSeed*131.0) - 0.5) * 0.25;
          vec3 vel = vec3(horiz, -0.12 - aSeed*0.15, 0.4 + aSeed*0.5);
          vec3 p = origin + vel * life * 0.9;
          // gravity
          p.y -= 1.4 * life * life;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (3.5 + aSeed*4.0) * (1.0 / -mv.z) * 12.0;
          vA = (1.0 - life) * uActive;
        }
      `,
      fragmentShader: `
        varying float vA;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d) * 0.5 * vA;
          gl_FragColor = vec4(0.7, 0.85, 1.0, a);
        }
      `,
    });
    const spray = new THREE.Points(sprayGeo, sprayMat);
    scene.add(spray);

    // ===== FOAM CONTACT LINE =====
    const foamGeo = new THREE.PlaneGeometry(totalW + 0.2, 0.04);
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const foam = new THREE.Mesh(foamGeo, foamMat);
    foam.rotation.x = -Math.PI / 2;
    foam.position.y = 0.07;
    scene.add(foam);

    // ===== WET TRAIL DROPLETS =====
    const dropCount = 400;
    const dropPos = new Float32Array(dropCount * 3);
    const dropSeed = new Float32Array(dropCount);
    const dropPanelZ = new Float32Array(dropCount);
    for (let i = 0; i < dropCount; i++) {
      dropSeed[i] = Math.random();
    }
    const dropGeo = new THREE.BufferGeometry();
    dropGeo.setAttribute("position", new THREE.BufferAttribute(dropPos, 3));
    dropGeo.setAttribute("aSeed", new THREE.BufferAttribute(dropSeed, 1));
    const dropMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uBarZ: { value: -10 }, uTotalH: { value: totalH }, uTotalW: { value: totalW } },
      vertexShader: `
        attribute float aSeed;
        uniform float uTime; uniform float uBarZ; uniform float uTotalH; uniform float uTotalW;
        varying float vA;
        void main(){
          float x = (aSeed - 0.5) * uTotalW;
          float z = uBarZ - 0.05 - aSeed * uTotalH * 0.5;
          // Only show if behind bar and within roof
          float visible = step(-uTotalH/2.0, z) * step(z, uTotalH/2.0);
          float life = fract(aSeed * 7.0 + uTime * 0.2);
          vec3 p = vec3(x, 0.06 - life*0.04, z);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (2.0 + aSeed*2.0) * (1.0 / -mv.z) * 8.0;
          vA = (1.0 - life) * visible * 0.6;
        }
      `,
      fragmentShader: `
        varying float vA;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d) * vA;
          gl_FragColor = vec4(0.85, 0.92, 1.0, a);
        }
      `,
    });
    const drops = new THREE.Points(dropGeo, dropMat);
    scene.add(drops);

    // ===== AMBIENT FLOATING DUST PARTICLES =====
    const ambN = 800;
    const ambPos = new Float32Array(ambN * 3);
    const ambSeed = new Float32Array(ambN);
    for (let i = 0; i < ambN; i++) {
      ambPos[i*3+0] = (Math.random() - 0.5) * 14;
      ambPos[i*3+1] = Math.random() * 5;
      ambPos[i*3+2] = (Math.random() - 0.5) * 12;
      ambSeed[i] = Math.random();
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute("aSeed", new THREE.BufferAttribute(ambSeed, 1));
    const ambMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uPhase: { value: 0 } },
      vertexShader: `
        attribute float aSeed; varying float vS;
        uniform float uTime; uniform float uPhase;
        void main(){
          vec3 p = position;
          p.y += sin(uTime*0.4 + aSeed*30.0)*0.15;
          p.x += cos(uTime*0.3 + aSeed*20.0)*0.1;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.0 + aSeed*2.5) * (8.0 / -mv.z);
          vS = aSeed * uPhase;
        }
      `,
      fragmentShader: `
        varying float vS;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d) * 0.4 * (0.4 + vS);
          gl_FragColor = vec4(1.0, 0.7, 0.4, a);
        }
      `,
    });
    const ambDust = new THREE.Points(ambGeo, ambMat);
    scene.add(ambDust);

    // LIGHTS
    const ambient = new THREE.AmbientLight(0x6655aa, 0.5);
    scene.add(ambient);
    const sunLight = new THREE.DirectionalLight(0xffaa66, 1.4);
    sunLight.position.set(5, 6, -2);
    scene.add(sunLight);
    const fillLight = new THREE.DirectionalLight(0x6688ff, 0.4);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);
    // Rim light — magenta from behind
    const rim = new THREE.DirectionalLight(0xff2d6f, 0.5);
    rim.position.set(0, 3, -5);
    scene.add(rim);

    // ANIMATION
    let raf;
    const start = performance.now();
    const cycleMs = 14000;
    let lastReadout = 280;
    let lastPhase = "";

    function animate() {
      const now = performance.now();
      const t = ((now - start) % cycleMs) / cycleMs;
      const tSec = (now - start) / 1000;

      // Sky/sun phase 0..0.4 = sunrise; 0.4..0.85 = day; 0.85..1 = reset
      const sunPhase = Math.min(1, t / 0.4);
      skyMat.uniforms.uPhase.value = sunPhase;
      skyMat.uniforms.uTime.value = tSec;
      sunMat.uniforms.uTime.value = tSec;
      sunMat.uniforms.uOpacity.value = Math.max(0, sunPhase - 0.15);
      halo.material.uniforms.uOpacity.value = Math.max(0, sunPhase - 0.2);
      sun.position.x = 6 - sunPhase * 4;
      sun.position.y = -1 + sunPhase * 3.5;
      halo.position.copy(sun.position);
      ambMat.uniforms.uTime.value = tSec;
      ambMat.uniforms.uPhase.value = sunPhase;

      // Bar sweep: 0.3..0.75
      const sweepStart = 0.3, sweepEnd = 0.75;
      let sweepT = Math.max(0, Math.min(1, (t - sweepStart) / (sweepEnd - sweepStart)));
      const sweepActive = t > sweepStart && t < sweepEnd;
      const startZ = -totalH/2 - 0.35;
      const endZ = totalH/2 + 0.35;
      barGroup.position.z = startZ + sweepT * (endZ - startZ);

      // Spray active during sweep
      sprayMat.uniforms.uActive.value = sweepActive ? 1 : 0;
      sprayMat.uniforms.uTime.value = tSec;
      sprayMat.uniforms.uBarPos.value.copy(barGroup.position);

      // Foam line just under the bar
      foamMat.opacity = sweepActive ? 0.7 : 0;
      foam.position.z = barGroup.position.z + 0.03;

      // Trail drops
      dropMat.uniforms.uTime.value = tSec;
      dropMat.uniforms.uBarZ.value = barGroup.position.z;

      // Update each panel's clip
      panels.forEach((p) => {
        p.material.uniforms.uClipZ.value = barGroup.position.z;
        p.material.uniforms.uPhase.value = sunPhase;
        p.material.uniforms.uTime.value = tSec;
      });

      // Phase label
      let ph = "dawn";
      if (t < 0.25) ph = "Pre-dawn · 04:42";
      else if (t < sweepStart) ph = "Wake-up · 05:08";
      else if (t < sweepEnd) ph = "Cleaning · 05:14 IST";
      else ph = "Done · 05:38";
      if (ph !== lastPhase) { lastPhase = ph; setPhase(ph); }

      // Readout
      const cleaned = t > 0.78;
      if (cleaned) {
        const rt = Math.min(1, (t - 0.78) / 0.18);
        const power = lerp(280, 340, easeOutQuart(rt));
        if (Math.abs(power - lastReadout) > 0.3) {
          lastReadout = power;
          setReadout({ show: true, power: Math.round(power), gain: Math.round((power-280)/280*100) });
        }
      } else if (t < sweepStart) {
        if (lastReadout !== 280) { lastReadout = 280; setReadout(r => ({ ...r, show: false })); }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    function lerp(a,b,t){ return a+(b-a)*t; }
    function easeOutQuart(x){ return 1 - Math.pow(1-x, 4); }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); renderer.dispose(); };
  }, []);

  return (
    <div className="hero-canvas-wrap" ref={wrapRef}>
      <canvas className="hero-canvas" ref={canvasRef}></canvas>
      <div className="hero-tags">
        <div className="hero-tag"><span className="led"></span>{phase}</div>
        <div className="hero-tag amber"><span className="led"></span>14 nozzles · 0.6L/cycle</div>
        <div className="hero-tag cyan"><span className="led"></span>Live render</div>
      </div>
      <div className={"hero-readout " + (readout.show ? "show" : "")}>
        <div className="hero-readout-label">Live Output · Panel 03</div>
        <div className="hero-readout-power">{readout.power}<span>W</span></div>
        <div className="hero-readout-pill">+{readout.gain}% more power this morning</div>
      </div>
    </div>
  );
}

window.HeroScene = HeroScene;
