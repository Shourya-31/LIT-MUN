import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import './GridScan.css';

const VERTEX_SHADER = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec3 uLineColor;
uniform vec3 uScanColor;
uniform float uTime;
uniform float uCells;
uniform float uDepth;
uniform float uDepthFade;
uniform float uLineThickness;
uniform float uScanWidth;
uniform float uTrail;
uniform float uGlow;
uniform float uShading;
uniform float uReflection;
uniform float uIntro;
uniform float uScanZ;
uniform float uScanActive;
uniform float uScanDirection;
uniform float uInteractive;
uniform int uLineStyle;
uniform float uPoints;
uniform float uLightMode;
uniform vec4 uPings[4];
uniform float uPingAlpha[4];
in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float lineAt(float value, float width) {
  float distanceToLine = abs(fract(value + 0.5) - 0.5);
  return 1.0 - smoothstep(width, width + fwidth(value), distanceToLine);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 pointer = uPointer * uInteractive;
  vec3 eye = vec3(pointer.x * 0.1, pointer.y * 0.06, -1.2);
  vec2 screen = vec2((vUv.x - 0.5) * aspect * 1.6, (vUv.y - 0.5) * 1.1);
  vec3 ray = normalize(vec3(screen.x - eye.x * 0.12, screen.y - eye.y * 0.12, 1.0));
  float halfWidth = max(1.3, aspect * 0.78);
  float halfHeight = 0.82;
  float nearest = 1e5;
  int face = 2;

  float tx = ((ray.x > 0.0 ? halfWidth : -halfWidth) - eye.x) / ray.x;
  float ty = ((ray.y > 0.0 ? halfHeight : -halfHeight) - eye.y) / ray.y;
  float tz = (uDepth - eye.z) / ray.z;
  if (tx > 0.0 && tx < nearest) { nearest = tx; face = 0; }
  if (ty > 0.0 && ty < nearest) { nearest = ty; face = 1; }
  if (tz > 0.0 && tz < nearest) { nearest = tz; face = 2; }

  vec3 hit = eye + ray * nearest;
  vec2 surface = face == 0 ? vec2(hit.z, hit.y) :
    (face == 1 ? vec2(hit.x, hit.z) : vec2(hit.x, hit.y));
  vec2 gridCoordinate = surface * uCells;
  float grid = max(lineAt(gridCoordinate.x, uLineThickness), lineAt(gridCoordinate.y, uLineThickness));
  float majorGrid = max(lineAt(gridCoordinate.x / 4.0, uLineThickness * 0.8), lineAt(gridCoordinate.y / 4.0, uLineThickness * 0.8));
  grid = max(grid * 0.48, majorGrid * 0.72);
  if (uLineStyle == 1) {
    float dash = step(0.22, fract((face == 0 ? surface.y : surface.x) * uCells * 0.5));
    grid *= 0.25 + dash * 0.75;
  } else if (uLineStyle == 2) {
    float dots = lineAt(gridCoordinate.x, uLineThickness * 2.0) * lineAt(gridCoordinate.y, uLineThickness * 2.0);
    grid *= max(0.2, dots * 1.4);
  }

  float distanceFade = mix(1.0, exp(-hit.z / max(uDepth * 0.45, 0.1)), uDepthFade);
  float visible = smoothstep(0.0, 0.35, uIntro);
  float wallShade = 1.0 - uShading * 0.38 * (face == 2 ? 0.0 : 1.0);
  float scanDistance = hit.z - uScanZ;
  float scanBand = exp(-scanDistance * scanDistance / max(uScanWidth * uScanWidth, 0.0001));
  float trailSide = max(0.0, -scanDistance * uScanDirection);
  float scanTrail = exp(-trailSide / max(uTrail * 0.7, 0.03)) * smoothstep(-uScanWidth, uScanWidth, trailSide);
  float scanLight = (scanBand + scanTrail * 0.65) * uScanActive * visible;

  float ping = 0.0;
  for (int index = 0; index < 4; index++) {
    float distanceToPing = length(hit - uPings[index].xyz) - uPings[index].w;
    ping += exp(-distanceToPing * distanceToPing / 0.012) * uPingAlpha[index];
  }
  vec2 pointCell = floor(surface * uCells * 2.5);
  float point = step(0.94, hash(pointCell + float(face) * 17.0));
  float sparkle = point * scanLight * (0.7 + 0.3 * sin(uTime * 5.0 + hash(pointCell) * 20.0)) * uPoints;

  float floorReflection = face == 1 && hit.y < 0.0
    ? exp(-abs(scanDistance) * 2.8) * uReflection * uScanActive
    : 0.0;
  float lineAlpha = grid * distanceFade * visible * wallShade * (uLightMode > 0.5 ? 0.34 : 0.56);
  float lightAlpha = min(1.0, scanLight * (0.48 + uGlow * 0.2) + ping * 0.72 + floorReflection * 0.24 + sparkle);
  vec3 color = uLineColor * lineAlpha + uScanColor * lightAlpha;
  float alpha = clamp(lineAlpha + lightAlpha, 0.0, 0.88);
  outColor = vec4(color, alpha);
}`;

type GridLineStyle = 'solid' | 'dashed' | 'dotted';
type ScanDirection = 'forward' | 'backward' | 'pingpong';
type ClickEffect = 'ping' | 'scan' | 'none';

interface GridScanProps {
  linesColor?: string;
  scanColor?: string;
  cells?: number;
  lineThickness?: number;
  lineStyle?: GridLineStyle;
  depth?: number;
  depthFade?: number;
  parallax?: number;
  points?: boolean;
  reflection?: number;
  shading?: number;
  scanDirection?: ScanDirection;
  scanDuration?: number;
  scanDelay?: number;
  scanWidth?: number;
  trail?: number;
  glow?: number;
  autoScan?: boolean;
  interactive?: boolean;
  clickEffect?: ClickEffect;
  intro?: boolean;
  lightMode?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

interface GridScanSettings {
  linesColor: string;
  scanColor: string;
  cells: number;
  lineThickness: number;
  lineStyle: GridLineStyle;
  depth: number;
  depthFade: number;
  parallax: number;
  points: boolean;
  reflection: number;
  shading: number;
  scanDirection: ScanDirection;
  scanDuration: number;
  scanDelay: number;
  scanWidth: number;
  trail: number;
  glow: number;
  autoScan: boolean;
  interactive: boolean;
  clickEffect: ClickEffect;
  intro: boolean;
  lightMode: boolean;
  dpr?: number;
}

interface ProgramInfo {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const GridScan = ({
  linesColor,
  scanColor,
  cells = 8,
  lineThickness = 1,
  lineStyle = 'solid',
  depth = 3,
  depthFade = 0.6,
  parallax = 1,
  points = true,
  reflection = 0.35,
  shading = 0.7,
  scanDirection = 'forward',
  scanDuration = 2.4,
  scanDelay = 1.6,
  scanWidth = 1,
  trail = 0.5,
  glow = 0.6,
  autoScan = true,
  interactive = true,
  clickEffect = 'ping',
  intro = true,
  lightMode = false,
  dpr,
  className = '',
  style,
}: GridScanProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = useMemo<GridScanSettings>(() => ({
    linesColor: linesColor ?? (lightMode ? '#d4d4d8' : '#47617e'),
    scanColor: scanColor ?? (lightMode ? '#0284c7' : '#d9b56d'),
    cells: clamp(cells, 2, 40),
    lineThickness: clamp(lineThickness, 0.2, 2),
    lineStyle,
    depth: clamp(depth, 0.5, 12),
    depthFade: clamp(depthFade, 0, 1),
    parallax: clamp(parallax, 0, 3),
    points,
    reflection: clamp(reflection, 0, 1),
    shading: clamp(shading, 0, 1),
    scanDirection,
    scanDuration: clamp(scanDuration, 0.3, 20),
    scanDelay: clamp(scanDelay, 0, 30),
    scanWidth: clamp(scanWidth, 0.2, 5),
    trail: clamp(trail, 0, 1),
    glow: clamp(glow, 0, 1.5),
    autoScan,
    interactive,
    clickEffect,
    intro,
    lightMode,
    dpr,
  }), [
    linesColor, scanColor, cells, lineThickness, lineStyle, depth, depthFade, parallax,
    points, reflection, shading, scanDirection, scanDuration, scanDelay, scanWidth,
    trail, glow, autoScan, interactive, clickEffect, intro, lightMode, dpr,
  ]);
  const settingsRef = useRef(settings);
  const wakeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
  }, [settings]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) {
      container.classList.add('grid-scan--fallback');
      return () => container.classList.remove('grid-scan--fallback');
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      console.error('GridScan shader compilation failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
      container.classList.add('grid-scan--fallback');
      return () => {
        container.classList.remove('grid-scan--fallback');
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
      };
    }

    const program = gl.createProgram();
    if (!program) {
      container.classList.add('grid-scan--fallback');
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return () => container.classList.remove('grid-scan--fallback');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('GridScan shader linking failed:', gl.getProgramInfoLog(program));
      container.classList.add('grid-scan--fallback');
      gl.deleteProgram(program);
      return () => container.classList.remove('grid-scan--fallback');
    }

    const uniforms: ProgramInfo['uniforms'] = {};
    const uniformNames = [
      'uResolution', 'uPointer', 'uLineColor', 'uScanColor', 'uTime', 'uCells', 'uDepth',
      'uDepthFade', 'uLineThickness', 'uScanWidth', 'uTrail', 'uGlow', 'uShading',
      'uReflection', 'uIntro', 'uScanZ', 'uScanActive', 'uScanDirection', 'uInteractive',
      'uLineStyle', 'uPoints', 'uLightMode', 'uPings[0]', 'uPingAlpha[0]',
    ];
    uniformNames.forEach((name) => {
      uniforms[name.replace('[0]', '')] = gl.getUniformLocation(program, name);
    });
    const info: ProgramInfo = { program, uniforms };
    const vertexArray = gl.createVertexArray();
    const colorProbe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const parseColor = (color: string): [number, number, number] => {
      if (!colorProbe) return [1, 1, 1];
      colorProbe.clearRect(0, 0, 1, 1);
      colorProbe.fillStyle = '#000';
      colorProbe.fillStyle = color;
      colorProbe.fillRect(0, 0, 1, 1);
      const data = colorProbe.getImageData(0, 0, 1, 1).data;
      return [data[0] / 255, data[1] / 255, data[2] / 255];
    };
    const colorCache = new Map<string, [number, number, number]>();
    const getColor = (color: string) => {
      const cached = colorCache.get(color);
      if (cached) return cached;
      const parsed = parseColor(color);
      colorCache.set(color, parsed);
      return parsed;
    };

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0, inside: false };
    const pings: { x: number; y: number; z: number; age: number }[] = [];
    const pingData = new Float32Array(16);
    const pingAlpha = new Float32Array(4);
    let startTime = performance.now();
    const introDuration = 2200;
    let frameId = 0;
    let width = 1;
    let height = 1;
    let elapsed = 0;
    let visible = true;
    let lostContext = false;
    let lastSettingsKey = '';

    const draw = (now: number) => {
      if (lostContext) return;
      const s = settingsRef.current;
      const dprValue = Math.min(s.dpr ?? window.devicePixelRatio ?? 1, 2);
      const nextWidth = Math.max(1, Math.round(container.clientWidth * dprValue));
      const nextHeight = Math.max(1, Math.round(container.clientHeight * dprValue));
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        width = nextWidth;
        height = nextHeight;
      }
      const settingKey = `${s.linesColor}|${s.scanColor}`;
      if (settingKey !== lastSettingsKey) {
        colorCache.clear();
        lastSettingsKey = settingKey;
      }
      const lineRgb = getColor(s.linesColor);
      const scanRgb = getColor(s.scanColor);
      const elapsedSeconds = Math.max(0, (now - startTime) / 1000);
      elapsed = elapsedSeconds;
      const introProgress = s.intro && !motionPreference.matches
        ? clamp((now - startTime) / introDuration, 0, 1)
        : 1;
      const cycleDuration = s.scanDuration + s.scanDelay;
      const cyclePosition = s.autoScan ? elapsedSeconds % cycleDuration : elapsedSeconds;
      const scanActive = !motionPreference.matches && cyclePosition < s.scanDuration;
      let progress = scanActive ? cyclePosition / s.scanDuration : 0;
      let direction = s.scanDirection === 'backward' ? -1 : 1;
      if (s.scanDirection === 'pingpong' && Math.floor(elapsedSeconds / cycleDuration) % 2) direction = -1;
      if (direction < 0) progress = 1 - progress;
      const scanZ = progress * s.depth;

      pings.forEach((ping, index) => {
        const alpha = clamp(1 - ping.age / 2.4, 0, 1);
        pingData.set([ping.x, ping.y, ping.z, ping.age * 0.55], index * 4);
        pingAlpha[index] = alpha * alpha;
      });

      gl.bindVertexArray(vertexArray);
      gl.useProgram(info.program);
      gl.viewport(0, 0, width, height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.uResolution ?? null, width, height);
      gl.uniform2f(uniforms.uPointer ?? null, (pointer.x - 0.5) * s.parallax, (pointer.y - 0.5) * s.parallax);
      gl.uniform3fv(uniforms.uLineColor ?? null, lineRgb);
      gl.uniform3fv(uniforms.uScanColor ?? null, scanRgb);
      gl.uniform1f(uniforms.uTime ?? null, elapsedSeconds);
      gl.uniform1f(uniforms.uCells ?? null, s.cells);
      gl.uniform1f(uniforms.uDepth ?? null, s.depth);
      gl.uniform1f(uniforms.uDepthFade ?? null, s.depthFade);
      gl.uniform1f(uniforms.uLineThickness ?? null, s.lineThickness * 0.012);
      gl.uniform1f(uniforms.uScanWidth ?? null, 0.018 * s.scanWidth);
      gl.uniform1f(uniforms.uTrail ?? null, s.trail);
      gl.uniform1f(uniforms.uGlow ?? null, s.glow);
      gl.uniform1f(uniforms.uShading ?? null, s.shading);
      gl.uniform1f(uniforms.uReflection ?? null, s.reflection);
      gl.uniform1f(uniforms.uIntro ?? null, introProgress);
      gl.uniform1f(uniforms.uScanZ ?? null, scanZ);
      gl.uniform1f(uniforms.uScanActive ?? null, scanActive ? 1 : 0);
      gl.uniform1f(uniforms.uScanDirection ?? null, direction);
      gl.uniform1f(uniforms.uInteractive ?? null, s.interactive && pointer.inside && !motionPreference.matches ? 1 : 0);
      gl.uniform1i(uniforms.uLineStyle ?? null, s.lineStyle === 'dashed' ? 1 : s.lineStyle === 'dotted' ? 2 : 0);
      gl.uniform1f(uniforms.uPoints ?? null, s.points ? 1 : 0);
      gl.uniform1f(uniforms.uLightMode ?? null, s.lightMode ? 1 : 0);
      gl.uniform4fv(uniforms.uPings ?? null, pingData);
      gl.uniform1fv(uniforms.uPingAlpha ?? null, pingAlpha);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!visible || document.hidden) return;
      const shouldAnimate =
        pings.length > 0 ||
        (!motionPreference.matches && (introProgress < 1 || s.autoScan || (s.interactive && pointer.inside)));
      if (shouldAnimate && !frameId) frameId = window.requestAnimationFrame(render);
    };

    const render = (now: number) => {
      frameId = 0;
      const dt = elapsed ? Math.min((now - startTime) / 1000 - elapsed, 0.05) : 1 / 60;
      pings.forEach((ping) => { ping.age += Math.max(dt, 0); });
      for (let index = pings.length - 1; index >= 0; index -= 1) {
        if (pings[index].age >= 2.4) pings.splice(index, 1);
      }
      draw(now);
    };

    const wake = () => {
      if (!frameId && visible && !document.hidden) frameId = window.requestAnimationFrame(render);
    };
    const getHit = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const u = clamp((clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      const v = clamp(1 - (clientY - rect.top) / Math.max(1, rect.height), 0, 1);
      const aspect = rect.width / Math.max(1, rect.height);
      const x = (u - 0.5) * aspect * 1.6;
      const y = (v - 0.5) * 1.1;
      const z = clamp(Math.min(safeDivide(1.3, Math.abs(x) + 0.01), safeDivide(0.82, Math.abs(y) + 0.01)), 0, settingsRef.current.depth);
      return { x, y, z, inside: clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = container.getBoundingClientRect();
      pointer.x = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      pointer.y = clamp(1 - (event.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
      pointer.inside = event.clientX >= rect.left && event.clientX <= rect.right
        && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (pointer.inside) wake();
    };
    const onPointerLeave = () => {
      pointer.inside = false;
      wake();
    };
    const onPointerDown = (event: PointerEvent) => {
      const s = settingsRef.current;
      if (motionPreference.matches || s.clickEffect === 'none') return;
      const hit = getHit(event.clientX, event.clientY);
      if (!hit.inside) return;
      if (s.clickEffect === 'scan') {
        startTime = performance.now();
        elapsed = 0;
      } else {
        pings.unshift({ x: hit.x, y: hit.y, z: hit.z, age: 0 });
        pings.splice(4);
      }
      wake();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        wake();
      }
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      lostContext = true;
      container.classList.add('grid-scan--fallback');
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(wake) : null;
    const intersectionObserver = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        else if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
      })
      : null;
    resizeObserver?.observe(container);
    intersectionObserver?.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    canvas.addEventListener('webglcontextlost', onContextLost);
    wakeRef.current = wake;
    wake();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      wakeRef.current = null;
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      container.classList.remove('grid-scan--fallback');
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div ref={containerRef} className={`grid-scan${className ? ` ${className}` : ''}`} style={style}>
      <canvas ref={canvasRef} className="grid-scan-canvas" aria-hidden="true" />
    </div>
  );
};

const safeDivide = (value: number, divisor: number) => value / Math.max(divisor, 1e-5);

export default GridScan;
