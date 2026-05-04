/**
 * SPARSHIQ — Premium Dust Shader
 * Shows organic procedural dust accumulation.
 * The `barX` uniform controls how much is "cleaned" —
 * dust disappears to the LEFT of the bar's current world X position.
 */

export const dustVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv        = uv;
    vWorldPos  = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const dustFragment = /* glsl */`
  uniform float dustAmount;
  uniform float time;
  uniform float barWorldX;     // world-space X of cleaning bar

  varying vec2  vUv;
  varying vec3  vWorldPos;

  /* ── Noise helpers ─────────────────────────────────────────── */
  float hash(vec2 p) {
    p  = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),             hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * smoothNoise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2  uv = vUv;

    /* Organic multi-octave dust accumulation */
    float n   = fbm(uv * 5.0 + vec2(time * 0.03, 0.0));
    n        += 0.35 * fbm(uv * 12.0 - vec2(0.0, time * 0.025));
    n        += 0.15 * fbm(uv * 25.0 + vec2(time * 0.06));

    /* Dust gathers at edges and low areas */
    float edge = 1.0 - smoothstep(0.04, 0.28, min(
      min(uv.x, 1.0 - uv.x),
      min(uv.y, 1.0 - uv.y)
    ));
    float base = n * (1.0 + edge * 0.7);

    /* ── Cleaning mask ─────────────────────────────────────────
       The bar sweeps in world X. Panels are ±1.5 units wide.
       Map vWorldPos.x → panel UV space to compute how much has
       been cleaned on this specific panel.                      */
    float cleanEdge  = barWorldX;
    float panelLeft  = vWorldPos.x - 1.48;   // approx left edge of panel in world
    /* Convert bar X to panel UV (0 = left, 1 = right of panel) */
    float barUV      = clamp((cleanEdge - panelLeft) / 2.96, 0.0, 1.0);

    /* Soft wipe edge — 5% feather */
    float cleaned    = smoothstep(barUV - 0.04, barUV + 0.01, uv.x);

    /* Sparkling mist at the clean boundary */
    float distEdge   = abs(uv.x - barUV);
    float sparkle    = smoothstep(0.06, 0.0, distEdge)
                     * (0.5 + 0.5 * sin(time * 30.0 + uv.y * 80.0));

    /* Final dust: removed left of bar, present right of bar */
    float finalDust  = base * (1.0 - (1.0 - cleaned) * 1.0) * dustAmount;
    /* But always show a tiny residue even on cleaned side */
    finalDust        = max(finalDust, base * dustAmount * 0.06 * cleaned);

    /* Dust colour — warm sandy beige */
    vec3 dustColor   = mix(
      vec3(0.78, 0.70, 0.54),
      vec3(0.58, 0.50, 0.38),
      base
    );

    /* Sparkle at wipe edge — cyan tinted */
    vec3 sparkleColor = mix(dustColor, vec3(0.7, 0.95, 1.0), sparkle * 0.6);

    float opacity     = clamp(finalDust * 0.88 + sparkle * 0.22 * dustAmount, 0.0, 0.88);

    gl_FragColor = vec4(sparkleColor, opacity);
  }
`
