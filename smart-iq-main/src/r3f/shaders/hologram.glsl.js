export const hologramVertex = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const hologramFragment = /* glsl */`
  uniform float time;
  uniform float glowIntensity;
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    // Fresnel rim
    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fresnel = pow(fresnel, 2.5);

    // Scanlines
    float scan = sin(vWorldPos.y * 18.0 + time * 2.0) * 0.5 + 0.5;
    scan = pow(scan, 3.0) * 0.4;

    // Flicker
    float flicker = 0.92 + 0.08 * sin(time * 47.3 + vWorldPos.x * 5.0);

    // Horizontal glitch bands
    float glitch = step(0.98, sin(vWorldPos.y * 5.0 + time * 3.0));

    float alpha = (fresnel * 0.8 + scan * 0.3 + glitch * 0.15) * glowIntensity * flicker;
    vec3 col = glowColor + vec3(scan * 0.2);

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`
