"use client";

import { type RefObject, useEffect, useRef } from "react";

const SOLID_SEGMENTS = 36;
const WIRE_SEGMENTS = 8;
const CUBE_SIZE = 1.48;
const FOV_DEG = 34;
const CAMERA_Z = 4.3;
const CAMERA_Y = 0.08;
const GROUP_SCALE = 1.04;
const WIRE_SCALE = 1.008;
const CUBE_ROTATION: [number, number, number] = [0.2, -0.82, 0.12];

const SOLID_VERTEX_SHADER = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;

  uniform mat4 uProjection;
  uniform mat4 uModelView;
  uniform mat3 uNormalMatrix;
  uniform float uTime;
  uniform float uScroll;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vFlow;
  varying float vFault;

  void main() {
    vec3 p = aPosition;
    float flow = sin(p.y * 4.0 + uTime * 1.2);
    flow += sin(p.z * 5.5 - uTime * 0.9);
    flow += cos((p.x + p.y) * 3.2 + uScroll * 2.4);
    flow /= 3.0;

    float fault = step(
      0.8,
      sin(p.y * 12.0 + uTime * 1.9) * sin(p.z * 9.0 - uTime * 1.35)
    );

    p += normalize(aPosition + vec3(0.001)) * (flow * 0.006 + fault * 0.003);

    vPosition = p;
    vNormal = normalize(uNormalMatrix * aNormal);
    vFlow = flow;
    vFault = fault;
    gl_Position = uProjection * uModelView * vec4(p, 1.0);
  }
`;

const SOLID_FRAGMENT_SHADER = `
  precision highp float;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vFlow;
  varying float vFault;

  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec3 ink = vec3(0.36, 0.36, 0.33);
    vec3 pearl = vec3(0.74, 0.71, 0.64);
    vec3 ember = vec3(0.84, 0.34, 0.18);
    vec3 ice = vec3(0.17, 0.46, 0.68);

    vec3 lightDir = normalize(vec3(0.35, 0.75, 0.55));
    float light = clamp(dot(vNormal, lightDir), 0.0, 1.0);
    float rim = pow(1.0 - clamp(abs(vNormal.z), 0.0, 1.0), 2.0);
    float band = step(0.6, fract((vPosition.y + vPosition.z * 0.45) * 8.0 + vFlow));
    float stream = smoothstep(0.22, 0.0, abs(fract(vPosition.y * 3.2 + vFlow * 0.7) - 0.5));
    float dither = rand(floor(gl_FragCoord.xy * 0.55)) * 0.035;

    vec3 color = mix(ink, pearl, smoothstep(0.08, 0.95, light) * 0.78);
    color = mix(color, ember, band * 0.11 + vFault * 0.13);
    color = mix(color, ice, stream * 0.18);
    color = mix(color, ice, rim * 0.14);
    color += dither;
    color = max(color, vec3(0.32, 0.32, 0.3));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const WIRE_VERTEX_SHADER = `
  attribute vec3 aPosition;
  uniform mat4 uProjection;
  uniform mat4 uModelView;
  void main() {
    gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
  }
`;

const WIRE_FRAGMENT_SHADER = `
  precision highp float;
  uniform vec4 uColor;
  void main() {
    gl_FragColor = uColor;
  }
`;

type HeroTitleObjectProps = {
  objectRef?: RefObject<HTMLDivElement | null>;
};

export default function HeroTitleObject({ objectRef }: HeroTitleObjectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = objectRef?.current;

    if (!(canvas && host)) {
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

    const solid = buildCubeGeometry(CUBE_SIZE / 2, SOLID_SEGMENTS);
    const wire = buildCubeGeometry(CUBE_SIZE / 2, WIRE_SEGMENTS);
    const wireIndices = trianglesToEdges(wire.indices);

    const solidProgram = createProgram(
      gl,
      SOLID_VERTEX_SHADER,
      SOLID_FRAGMENT_SHADER
    );
    const wireProgram = createProgram(
      gl,
      WIRE_VERTEX_SHADER,
      WIRE_FRAGMENT_SHADER
    );

    const solidPositionBuffer = createBuffer(
      gl,
      gl.ARRAY_BUFFER,
      solid.positions
    );
    const solidNormalBuffer = createBuffer(gl, gl.ARRAY_BUFFER, solid.normals);
    const solidIndexBuffer = createIndexBuffer(gl, solid.indices);
    const solidIndexCount = solid.indices.length;

    const wirePositionBuffer = createBuffer(
      gl,
      gl.ARRAY_BUFFER,
      wire.positions
    );
    const wireIndexBuffer = createIndexBuffer(gl, wireIndices);
    const wireIndexCount = wireIndices.length;

    const solidLocations = {
      aPosition: gl.getAttribLocation(solidProgram, "aPosition"),
      aNormal: gl.getAttribLocation(solidProgram, "aNormal"),
      uProjection: gl.getUniformLocation(solidProgram, "uProjection"),
      uModelView: gl.getUniformLocation(solidProgram, "uModelView"),
      uNormalMatrix: gl.getUniformLocation(solidProgram, "uNormalMatrix"),
      uTime: gl.getUniformLocation(solidProgram, "uTime"),
      uScroll: gl.getUniformLocation(solidProgram, "uScroll"),
    };

    const wireLocations = {
      aPosition: gl.getAttribLocation(wireProgram, "aPosition"),
      uProjection: gl.getUniformLocation(wireProgram, "uProjection"),
      uModelView: gl.getUniformLocation(wireProgram, "uModelView"),
      uColor: gl.getUniformLocation(wireProgram, "uColor"),
    };

    const projection = new Float32Array(16);
    const view = new Float32Array(16);
    const groupMatrix = new Float32Array(16);
    const baseCubeMatrix = new Float32Array(16);
    const cubeMatrix = new Float32Array(16);
    const wireMatrix = new Float32Array(16);
    const modelView = new Float32Array(16);
    const normalMatrix3 = new Float32Array(9);

    // View matrix: camera at (0, CAMERA_Y, CAMERA_Z) looking down -Z.
    // Since camera is axis-aligned, view = inverse(translate(0, CAMERA_Y, CAMERA_Z))
    //                                    = translate(0, -CAMERA_Y, -CAMERA_Z)
    identity(view);
    view[12] = 0;
    view[13] = -CAMERA_Y;
    view[14] = -CAMERA_Z;

    // Base cube transform (static rotation, scale 1)
    rotationXYZ(
      baseCubeMatrix,
      CUBE_ROTATION[0],
      CUBE_ROTATION[1],
      CUBE_ROTATION[2]
    );

    const startedAt = performance.now();
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }

      const aspect = rect.height === 0 ? 1 : rect.width / rect.height;
      setPerspective(projection, {
        fovY: (FOV_DEG * Math.PI) / 180,
        aspect,
        near: 0.1,
        far: 100,
      });
      gl.viewport(0, 0, width, height);
    };

    const render = (now: number) => {
      const elapsed = (now - startedAt) / 1000;

      resize();

      const rotY = elapsed * 0.13 + pointerX * 0.28;
      const rotX = -0.18 + pointerY * 0.16;

      // group: scale(GROUP_SCALE) * rotateY(rotY) * rotateX(rotX)
      rotationXYZ(groupMatrix, rotX, rotY, 0);
      scaleInPlace(groupMatrix, GROUP_SCALE);

      // cubeMatrix = groupMatrix * baseCubeMatrix
      multiply(cubeMatrix, groupMatrix, baseCubeMatrix);
      // wireMatrix = cubeMatrix * scale(WIRE_SCALE)
      copyMatrix(wireMatrix, cubeMatrix);
      scaleInPlace(wireMatrix, WIRE_SCALE);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA
      );

      // Solid cube
      multiply(modelView, view, cubeMatrix);
      normalMatrixFromModelView(normalMatrix3, modelView);

      gl.useProgram(solidProgram);
      gl.uniformMatrix4fv(solidLocations.uProjection, false, projection);
      gl.uniformMatrix4fv(solidLocations.uModelView, false, modelView);
      gl.uniformMatrix3fv(solidLocations.uNormalMatrix, false, normalMatrix3);
      gl.uniform1f(solidLocations.uTime, elapsed);
      gl.uniform1f(
        solidLocations.uScroll,
        window.scrollY / Math.max(window.innerHeight, 1)
      );

      bindAttribute(gl, solidPositionBuffer, solidLocations.aPosition, 3);
      bindAttribute(gl, solidNormalBuffer, solidLocations.aNormal, 3);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, solidIndexBuffer);
      gl.drawElements(gl.TRIANGLES, solidIndexCount, gl.UNSIGNED_SHORT, 0);

      // Wireframe
      multiply(modelView, view, wireMatrix);
      gl.useProgram(wireProgram);
      gl.uniformMatrix4fv(wireLocations.uProjection, false, projection);
      gl.uniformMatrix4fv(wireLocations.uModelView, false, modelView);
      gl.uniform4f(wireLocations.uColor, 0.224, 0.251, 0.267, 0.14);

      bindAttribute(gl, wirePositionBuffer, wireLocations.aPosition, 3);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireIndexBuffer);
      gl.drawElements(gl.LINES, wireIndexCount, gl.UNSIGNED_SHORT, 0);

      if (!canvas.classList.contains("is-ready")) {
        canvas.classList.add("is-ready");
      }

      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(render);
    };

    const stop = () => {
      if (frame === 0) {
        return;
      }
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0 }
    );
    observer.observe(host);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      stop();
      gl.deleteBuffer(solidPositionBuffer);
      gl.deleteBuffer(solidNormalBuffer);
      gl.deleteBuffer(solidIndexBuffer);
      gl.deleteBuffer(wirePositionBuffer);
      gl.deleteBuffer(wireIndexBuffer);
      gl.deleteProgram(solidProgram);
      gl.deleteProgram(wireProgram);
    };
  }, [objectRef]);

  return (
    <div
      className="hero-title-object pointer-events-none absolute top-1/2 left-1/2 z-0 h-[clamp(13rem,31vw,27rem)] w-[clamp(13rem,31vw,27rem)] -translate-x-1/2 -translate-y-1/2 opacity-100 md:left-[62%]"
      ref={objectRef}
    >
      <canvas className="hero-shader-canvas" ref={canvasRef} />
    </div>
  );
}

type CubeGeometry = {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint16Array;
};

type FaceSpec = {
  nx: number;
  ny: number;
  nz: number;
  axisU: number;
  axisV: number;
  flipU: number;
};

const CUBE_FACES: FaceSpec[] = [
  { nx: 1, ny: 0, nz: 0, axisU: 2, axisV: 1, flipU: -1 }, // +X
  { nx: -1, ny: 0, nz: 0, axisU: 2, axisV: 1, flipU: 1 }, // -X
  { nx: 0, ny: 1, nz: 0, axisU: 0, axisV: 2, flipU: 1 }, // +Y
  { nx: 0, ny: -1, nz: 0, axisU: 0, axisV: 2, flipU: -1 }, // -Y
  { nx: 0, ny: 0, nz: 1, axisU: 0, axisV: 1, flipU: 1 }, // +Z
  { nx: 0, ny: 0, nz: -1, axisU: 0, axisV: 1, flipU: -1 }, // -Z
];

function buildCubeGeometry(halfSize: number, segments: number): CubeGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const point: [number, number, number] = [0, 0, 0];

  for (const face of CUBE_FACES) {
    const base = positions.length / 3;
    for (let j = 0; j <= segments; j++) {
      const v = (j / segments) * 2 - 1;
      for (let i = 0; i <= segments; i++) {
        const u = ((i / segments) * 2 - 1) * face.flipU;
        point[0] = face.nx * halfSize;
        point[1] = face.ny * halfSize;
        point[2] = face.nz * halfSize;
        point[face.axisU] += u * halfSize;
        point[face.axisV] += v * halfSize;
        positions.push(point[0], point[1], point[2]);
        normals.push(face.nx, face.ny, face.nz);
      }
    }

    for (let j = 0; j < segments; j++) {
      for (let i = 0; i < segments; i++) {
        const a = base + j * (segments + 1) + i;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

function trianglesToEdges(indices: Uint16Array): Uint16Array {
  const edges = new Uint16Array(indices.length * 2);
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];
    const o = i * 2;
    edges[o] = a;
    edges[o + 1] = b;
    edges[o + 2] = b;
    edges[o + 3] = c;
    edges[o + 4] = c;
    edges[o + 5] = a;
  }
  return edges;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Unable to create shader.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Unknown shader error.";
    gl.deleteShader(shader);
    throw new Error(log);
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
    const log = gl.getProgramInfoLog(program) ?? "Unknown program error.";
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createBuffer(
  gl: WebGLRenderingContext,
  target: number,
  data: Float32Array
) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error("Unable to create WebGL buffer.");
  }
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, gl.STATIC_DRAW);
  return buffer;
}

function createIndexBuffer(gl: WebGLRenderingContext, data: Uint16Array) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error("Unable to create WebGL index buffer.");
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

function bindAttribute(
  gl: WebGLRenderingContext,
  buffer: WebGLBuffer,
  location: number,
  size: number
) {
  if (location < 0) {
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function identity(out: Float32Array) {
  out.fill(0);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
}

function copyMatrix(out: Float32Array, source: Float32Array) {
  for (let i = 0; i < 16; i++) {
    out[i] = source[i];
  }
}

function multiply(out: Float32Array, a: Float32Array, b: Float32Array) {
  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a10 = a[4];
  const a11 = a[5];
  const a12 = a[6];
  const a13 = a[7];
  const a20 = a[8];
  const a21 = a[9];
  const a22 = a[10];
  const a23 = a[11];
  const a30 = a[12];
  const a31 = a[13];
  const a32 = a[14];
  const a33 = a[15];

  for (let i = 0; i < 4; i++) {
    const b0 = b[i * 4];
    const b1 = b[i * 4 + 1];
    const b2 = b[i * 4 + 2];
    const b3 = b[i * 4 + 3];
    out[i * 4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[i * 4 + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[i * 4 + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[i * 4 + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  }
}

function rotationXYZ(out: Float32Array, rx: number, ry: number, rz: number) {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);

  // Combined Z * Y * X (matches Three.js default Euler order XYZ applied in that order)
  out[0] = cy * cz;
  out[1] = cy * sz;
  out[2] = -sy;
  out[3] = 0;
  out[4] = sx * sy * cz - cx * sz;
  out[5] = sx * sy * sz + cx * cz;
  out[6] = sx * cy;
  out[7] = 0;
  out[8] = cx * sy * cz + sx * sz;
  out[9] = cx * sy * sz - sx * cz;
  out[10] = cx * cy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
}

function scaleInPlace(out: Float32Array, scale: number) {
  for (let i = 0; i < 12; i++) {
    out[i] *= scale;
  }
}

function setPerspective(
  out: Float32Array,
  params: { fovY: number; aspect: number; near: number; far: number }
) {
  const { fovY, aspect, near, far } = params;
  const f = 1 / Math.tan(fovY / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
}

function normalMatrixFromModelView(out: Float32Array, modelView: Float32Array) {
  // Inverse-transpose of the upper-left 3x3 of modelView.
  const a00 = modelView[0];
  const a01 = modelView[1];
  const a02 = modelView[2];
  const a10 = modelView[4];
  const a11 = modelView[5];
  const a12 = modelView[6];
  const a20 = modelView[8];
  const a21 = modelView[9];
  const a22 = modelView[10];

  const b01 = a22 * a11 - a12 * a21;
  const b11 = -a22 * a10 + a12 * a20;
  const b21 = a21 * a10 - a11 * a20;

  let det = a00 * b01 + a01 * b11 + a02 * b21;
  if (det === 0) {
    out.fill(0);
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return;
  }
  det = 1 / det;

  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
}
