// Persistent global ambient 3D background with floating dust + sun
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const canvas = document.getElementById("ambient-bg");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));

  // Big atmospheric sun
  const sunGeo = new THREE.SphereGeometry(1.6, 48, 48);
  const sunMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec2 vUv; void main(){ vN = normalize(normalMatrix * normal); vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec3 vN; varying vec2 vUv; uniform float uTime;
      void main(){
        float r = distance(vUv, vec2(0.5));
        float fres = pow(1.0 - max(0.0, vN.z), 2.0);
        vec3 c = mix(vec3(1.0, 0.86, 0.6), vec3(0.95, 0.62, 0.32), r*1.4);
        float a = smoothstep(0.5, 0.0, r) * 0.55 + fres * 0.4;
        a *= 0.9 + 0.1*sin(uTime*0.6);
        gl_FragColor = vec4(c, a);
      }
    `,
  });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(5, 2, -2);
  scene.add(sun);

  // Sun halo
  const haloGeo = new THREE.RingGeometry(1.8, 4.2, 64);
  const haloMat = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime;
      void main(){
        float r = distance(vUv, vec2(0.5));
        float a = smoothstep(0.5, 0.18, r) * 0.18;
        a *= 0.7 + 0.3 * sin(uTime*0.4 + r*20.0);
        gl_FragColor = vec4(0.95, 0.62, 0.32, a);
      }
    `,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.copy(sun.position);
  scene.add(halo);

  // Floating dust particles (3D)
  const N = 1200;
  const positions = new Float32Array(N * 3);
  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    positions[i*3+0] = (Math.random() - 0.5) * 22;
    positions[i*3+1] = (Math.random() - 0.5) * 22;
    positions[i*3+2] = (Math.random() - 0.5) * 14;
    seeds[i] = Math.random();
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const dustMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uScroll: { value: 0 } },
    vertexShader: `
      attribute float aSeed; varying float vS;
      uniform float uTime; uniform float uScroll;
      void main(){
        vec3 p = position;
        p.y += sin(uTime*0.3 + aSeed*30.0) * 0.4;
        p.x += cos(uTime*0.2 + aSeed*22.0) * 0.3;
        p.z += sin(uTime*0.15 + aSeed*18.0) * 0.2;
        // drift downward then loop
        float drift = mod(p.y - uScroll*0.4 + aSeed*10.0, 22.0) - 11.0;
        p.y = drift;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.5 + aSeed * 3.0) * (8.0 / -mv.z);
        vS = aSeed;
      }
    `,
    fragmentShader: `
      varying float vS;
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float a = smoothstep(0.5, 0.0, d) * (0.18 + vS*0.25);
        vec3 col = mix(vec3(0.91,0.58,0.20), vec3(0.78,0.66,0.48), vS);
        gl_FragColor = vec4(col, a);
      }
    `,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // A slow distant grid plane for parallax depth
  const gridGeo = new THREE.PlaneGeometry(40, 40, 1, 1);
  const gridMat = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime;
      void main(){
        vec2 g = abs(fract(vUv * 30.0 + vec2(0.0, uTime*0.02)) - 0.5);
        float line = smoothstep(0.49, 0.5, max(g.x, g.y));
        float fade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) * smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
        gl_FragColor = vec4(vec3(0.65,0.55,0.40), line * 0.05 * fade);
      }
    `,
  });
  const grid = new THREE.Mesh(gridGeo, gridMat);
  grid.position.set(0, 0, -8);
  scene.add(grid);

  let mx = 0, my = 0, scroll = 0;
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });
  window.addEventListener("scroll", () => { scroll = window.scrollY; }, { passive: true });

  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  const start = performance.now();
  function loop() {
    const t = (performance.now() - start) / 1000;
    sunMat.uniforms.uTime.value = t;
    haloMat.uniforms.uTime.value = t;
    dustMat.uniforms.uTime.value = t;
    dustMat.uniforms.uScroll.value = scroll * 0.001;
    gridMat.uniforms.uTime.value = t;

    // Sun moves with scroll (rises)
    const scrollNorm = Math.min(1, scroll / (document.body.scrollHeight - window.innerHeight));
    sun.position.x = 5 - scrollNorm * 8;
    sun.position.y = 2 + Math.sin(scrollNorm * Math.PI) * 1.5;
    halo.position.copy(sun.position);

    // Camera parallax
    camera.position.x += (mx * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();

  // Initialize micro-interactions after ambient scene is ready
  if (window.SparshMicro) {
    window.SparshMicro.createScrollProgressBadge();
  }
})();
