import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { prefersReducedMotion } from '../lib/env'

const vert = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
// Site-survey contour lines: iso-lines of a slow fbm height field, lifted under the pointer.
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uCool;
  uniform vec3 uWarm;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.5; }
    return s;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / uRes.y;
    vec2 m = uMouse / uRes.y;
    float d = length(uv - m);
    float hill = exp(-d * d * 7.0);
    float h = fbm(uv * 1.5 + vec2(uTime * 0.018, -uTime * 0.012)) + hill * 0.2;
    float v = h * 15.0;
    float w = fwidth(v);
    float fr = fract(v);
    float dist = min(fr, 1.0 - fr);
    float line = 1.0 - smoothstep(w * 0.5, w * 1.5, dist);
    float major = step(mod(floor(v + 0.5), 5.0), 0.5);
    float edge = smoothstep(0.0, 0.35, gl_FragCoord.y / uRes.y);
    float alpha = line * (0.2 + major * 0.25 + hill * 0.55) * edge;
    gl_FragColor = vec4(mix(uCool, uWarm, hill), alpha);
  }
`

function Field() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { size, gl } = useThree()
  const mouse = useRef({ x: -9999, y: -9999 })
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uCool: { value: new THREE.Color('#586579') },
      uWarm: { value: new THREE.Color('#2447f9') },
    }),
    [],
  )
  useEffect(() => {
    const el = gl.domElement
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mouse.current.x = e.clientX - r.left
      mouse.current.y = r.bottom - e.clientY
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [gl])
  useFrame((state) => {
    const m = mat.current
    if (!m) return
    const dpr = state.viewport.dpr
    m.uniforms.uTime.value = state.clock.elapsedTime
    m.uniforms.uRes.value.set(size.width * dpr, size.height * dpr)
    const u = m.uniforms.uMouse.value as THREE.Vector2
    u.x += (mouse.current.x * dpr - u.x) * 0.08
    u.y += (mouse.current.y * dpr - u.y) * 0.08
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthTest={false} />
    </mesh>
  )
}

export default function ContourField({ active }: { active: boolean }) {
  return (
    <Canvas
      flat
      aria-hidden="true"
      frameloop={!active ? 'never' : prefersReducedMotion() ? 'demand' : 'always'}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Field />
    </Canvas>
  )
}
