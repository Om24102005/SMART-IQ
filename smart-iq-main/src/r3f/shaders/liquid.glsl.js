export const liquidVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const liquidFragment = /* glsl */`
  uniform float fillLevel; // 0.0 to 1.0
  uniform float time;
  uniform vec3 liquidColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  float wave(float x, float t) {
    return sin(x * 8.0 + t * 2.5) * 0.012 + sin(x * 13.0 - t * 1.8) * 0.008;
  }

  void main() {
    // Liquid surface with wave displacement
    float surfaceY = fillLevel + wave(vUv.x, time);
    float inLiquid = step(vUv.y, surfaceY);

    // Surface shimmer
    float shimmer = sin(vUv.x * 20.0 + time * 3.0) * 0.5 + 0.5;
    shimmer *= step(surfaceY - 0.03, vUv.y) * step(vUv.y, surfaceY + 0.01);

    // Fresnel for glass-like interior
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.0);

    vec3 col = liquidColor * (0.8 + 0.2 * fresnel);
    col += shimmer * vec3(1.0, 0.9, 0.6) * 0.4;

    float alpha = inLiquid * (0.75 + fresnel * 0.2) + shimmer * 0.6;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.95));
  }
`
