"use client";

import { type PointerEvent, useEffect, useRef } from "react";

interface LiquidImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uImageResolution;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float random(vec2 value) {
    return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec2 coverUv(vec2 uv) {
    float frameAspect = uResolution.x / uResolution.y;
    float imageAspect = uImageResolution.x / uImageResolution.y;
    vec2 result = uv;

    if (frameAspect > imageAspect) {
      float scale = imageAspect / frameAspect;
      result.y = (uv.y - 0.5) * scale + 0.5;
    } else {
      float scale = frameAspect / imageAspect;
      result.x = (uv.x - 0.5) * scale + 0.5;
    }

    return result;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 toMouse = uv - uMouse;
    float distanceToMouse = length(toMouse);
    float hover = smoothstep(0.0, 1.0, uHover);

    vec2 pixelUv = floor(uv * vec2(120.0, 76.0)) / vec2(120.0, 76.0);
    uv = mix(uv, pixelUv, 0.12 + hover * 0.16);

    float ripple = sin(distanceToMouse * 28.0 - uTime * 5.4) * 0.032 * hover;
    vec2 flow = vec2(
      sin(uv.y * 18.0 + uTime * 1.6),
      cos(uv.x * 16.0 - uTime * 1.35)
    ) * (0.004 + hover * 0.024);
    vec2 pull = normalize(toMouse + vec2(0.001)) * ripple;
    vec2 distortedUv = clamp(uv + flow - pull, vec2(0.006), vec2(0.994));

    float rgbShift = 0.012 * hover + 0.002;
    vec4 texR = texture2D(uTexture, distortedUv + vec2(rgbShift, 0.0));
    vec4 texG = texture2D(uTexture, distortedUv);
    vec4 texB = texture2D(uTexture, distortedUv - vec2(rgbShift, 0.0));

    float gray = dot(texG.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono = vec3(smoothstep(0.12, 0.86, gray));
    vec3 shifted = vec3(texR.r, texG.g, texB.b);
    float grain = random(floor(gl_FragCoord.xy * 0.72) + uTime) * 0.035;

    vec3 color = mix(mono, shifted, 0.32 + hover * 0.48);
    color += grain;

    gl_FragColor = vec4(color, 0.18 + hover * 0.62);
  }
`;

export function LiquidImage({
  src,
  alt = "",
  className,
  width,
  height,
}: LiquidImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const hoverTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;

    if (!(canvas && frame)) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const uniforms = {
      hover: gl.getUniformLocation(program, "uHover"),
      imageResolution: gl.getUniformLocation(program, "uImageResolution"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      resolution: gl.getUniformLocation(program, "uResolution"),
      texture: gl.getUniformLocation(program, "uTexture"),
      time: gl.getUniformLocation(program, "uTime"),
    };
    const buffer = createBuffer(
      gl,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    );
    const texture = gl.createTexture();
    const image = new Image();

    if (!texture) {
      return;
    }

    let disposed = false;
    let frameId = 0;
    let hover = 0;
    let textureReady = false;
    const startedAt = performance.now();

    image.decoding = "async";
    image.src = src;
    image.onload = () => {
      if (disposed) {
        return;
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      textureReady = true;
    };

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
    };

    const render = (now: number) => {
      resize();
      hover += (hoverTargetRef.current - hover) * 0.08;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!textureReady) {
        frameId = window.requestAnimationFrame(render);
        return;
      }

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.texture, 0);
      gl.uniform1f(uniforms.time, (now - startedAt) / 1000);
      gl.uniform1f(uniforms.hover, hover);
      gl.uniform2f(
        uniforms.imageResolution,
        image.naturalWidth || 1,
        image.naturalHeight || 1
      );
      gl.uniform2f(uniforms.mouse, pointerRef.current.x, pointerRef.current.y);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, [src]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;

    pointerRef.current = { x, y };
  };

  return (
    <div
      className={`liquid-image ${className ?? ""}`}
      onPointerEnter={() => {
        hoverTargetRef.current = 1;
      }}
      onPointerLeave={() => {
        hoverTargetRef.current = 0;
      }}
      onPointerMove={handlePointerMove}
      ref={frameRef}
    >
      <img
        alt={alt}
        decoding="async"
        draggable={false}
        height={height}
        loading="lazy"
        src={src}
        width={width}
      />
      <canvas className="liquid-image-canvas" ref={canvasRef} />
    </div>
  );
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Unable to create shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Unable to create program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown program error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function createBuffer(gl: WebGLRenderingContext, vertices: Float32Array) {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error("Unable to create WebGL buffer.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  return buffer;
}
