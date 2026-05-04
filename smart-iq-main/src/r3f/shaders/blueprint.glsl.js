export const blueprintVertex = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const blueprintFragment = /* glsl */`
  uniform float time;
  uniform float opacity;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  float gridLine(float coord, float lineWidth) {
    float f = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    return 1.0 - smoothstep(0.0, lineWidth, f);
  }

  void main() {
    vec2 p = vWorldPos.xz;

    // Major grid (every 1 unit)
    float major = max(gridLine(p.x, 0.6), gridLine(p.y, 0.6));
    // Minor grid (every 0.25 unit)
    float minor = max(gridLine(p.x * 4.0, 0.5), gridLine(p.y * 4.0, 0.5)) * 0.3;

    float grid = max(major, minor);

    // Pulse from center
    float dist = length(p);
    float pulse = sin(dist * 1.2 - time * 1.5) * 0.5 + 0.5;
    pulse = smoothstep(0.0, 1.0, pulse) * 0.15;

    vec3 gridCol = mix(vec3(0.05, 0.18, 0.35), vec3(0.2, 0.8, 1.0), grid);
    gridCol += pulse * vec3(0.1, 0.5, 0.8);

    // Fade at edges
    float edgeFade = 1.0 - smoothstep(8.0, 16.0, dist);

    float alpha = (grid * 0.9 + pulse) * edgeFade * opacity;
    gl_FragColor = vec4(gridCol, clamp(alpha, 0.0, 1.0));
  }
`
