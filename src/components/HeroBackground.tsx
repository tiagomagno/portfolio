'use client';

import { useEffect, useRef } from 'react';

// Fitas em dois tons de laranja (alinhados ao --color-primary #ff5625 da marca)
// somadas por blend aditivo, adaptadas do fundo shader de referência (fundo
// quase-preto) para um véu suave sobre o hero claro do site — a estrutura do
// hero (texto, botões, layout) não muda, isso só desenha atrás dela.
const COLOR_LIGHT = [1.0, 0.702, 0.478] as const; // #FFB37A
const COLOR_DARK = [0.788, 0.263, 0.102] as const; // #C9431A

const VERTEX_SRC = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SRC = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uOpacity;

  float ribbon(vec2 uv, float freq1, float freq2, float speed, float phase, float thickness) {
    float y = 0.52
      + 0.12 * sin(uv.x * freq1 + uTime * speed + phase)
      + 0.05 * sin(uv.x * freq2 - uTime * speed * 0.6 + phase * 1.7);
    float d = abs(uv.y - y);
    return smoothstep(thickness, 0.0, d);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    float r1 = ribbon(uv, 2.4, 4.1, 0.15, 0.0, 0.05);
    float r2 = ribbon(uv, 3.1, 2.0, 0.12, 2.1, 0.045);
    float r3 = ribbon(uv, 1.8, 3.6, 0.18, 4.2, 0.05);

    vec3 color = vec3(${COLOR_LIGHT.join(', ')}) * r1
      + vec3(${COLOR_DARK.join(', ')}) * r2
      + vec3(${COLOR_LIGHT.join(', ')}) * r3;

    float glow = smoothstep(0.55, 0.0, length(uv - vec2(0.62, 0.48))) * 0.12;
    color += glow * vec3(${COLOR_LIGHT.join(', ')});

    float alpha = clamp(r1 + r2 + r3 + glow, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initWebGL(canvas: HTMLCanvasElement) {
  const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  if (!gl) return null;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return {
    gl,
    uResolution: gl.getUniformLocation(program, 'uResolution'),
    uTime: gl.getUniformLocation(program, 'uTime'),
    uOpacity: gl.getUniformLocation(program, 'uOpacity'),
  };
}

// Fallback sem WebGL: as mesmas três ondas senoidais, como traços espessos com
// blend aditivo ("lighter") num canvas 2D transparente sobre o hero claro.
function draw2DFallback(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, opacity: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineWidth = height * 0.09;

  const ribbons: { freq1: number; freq2: number; speed: number; phase: number; color: string }[] = [
    { freq1: 2.4, freq2: 4.1, speed: 0.15, phase: 0, color: '255, 179, 122' },
    { freq1: 3.1, freq2: 2.0, speed: 0.12, phase: 2.1, color: '201, 67, 26' },
    { freq1: 1.8, freq2: 3.6, speed: 0.18, phase: 4.2, color: '255, 179, 122' },
  ];

  for (const r of ribbons) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${r.color}, ${opacity})`;
    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const xN = i / steps;
      const x = xN * width;
      const y =
        height * (0.52 + 0.12 * Math.sin(xN * r.freq1 + time * r.speed + r.phase) + 0.05 * Math.sin(xN * r.freq2 - time * r.speed * 0.6 + r.phase * 1.7));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frameId = 0;
    let startTime = performance.now();

    const webgl = initWebGL(canvas);
    const ctx2d = webgl ? null : canvas.getContext('2d');

    function resize() {
      if (!canvas) return;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      if (webgl) webgl.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    function renderFrame(elapsedMs: number) {
      if (!canvas) return;
      const t = elapsedMs / 1000;
      if (webgl) {
        const { gl, uResolution, uTime, uOpacity } = webgl;
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime, t);
        gl.uniform1f(uOpacity, 0.55);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else if (ctx2d) {
        draw2DFallback(ctx2d, canvas.width, canvas.height, t, 0.4);
      }
    }

    if (reducedMotion) {
      // Sem animação: desenha um único frame estático e para por aí.
      renderFrame(0);
    } else {
      const loop = (now: number) => {
        renderFrame(now - startTime);
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Véu claro: garante legibilidade do texto (canto esquerdo/inferior) sem
          apagar o efeito nas áreas mais vazias da hero. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(115deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 32%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0.55) 100%)',
        }}
      />
    </>
  );
}
