"use client";

import { type RefObject, useEffect, useRef } from "react";
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

const shapeVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vFlow;
  varying float vFault;

  void main() {
    vec3 p = position;
    float flow = sin(p.y * 4.0 + uTime * 1.2);
    flow += sin(p.z * 5.5 - uTime * 0.9);
    flow += cos((p.x + p.y) * 3.2 + uScroll * 2.4);
    flow /= 3.0;

    float fault = step(
      0.8,
      sin(p.y * 12.0 + uTime * 1.9) * sin(p.z * 9.0 - uTime * 1.35)
    );

    p += normalize(position + vec3(0.001)) * (flow * 0.006 + fault * 0.003);

    vPosition = p;
    vNormal = normalize(normalMatrix * normal);
    vFlow = flow;
    vFault = fault;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const shapeFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vFlow;
  varying float vFault;

  float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
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

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });
    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    const group = new Group();
    const geometry = new BoxGeometry(1.48, 1.48, 1.48, 36, 36, 36);
    const wireGeometry = new BoxGeometry(1.48, 1.48, 1.48, 8, 8, 8);
    const material = new ShaderMaterial({
      fragmentShader: shapeFragmentShader,
      transparent: false,
      uniforms: { uScroll: { value: 0 }, uTime: { value: 0 } },
      vertexShader: shapeVertexShader,
    });
    const wireMaterial = new MeshBasicMaterial({
      color: "#394044",
      opacity: 0.14,
      transparent: true,
      wireframe: true,
    });
    const cube = new Mesh(geometry, material);
    const wireCube = new Mesh(wireGeometry, wireMaterial);

    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    camera.position.set(0, 0.08, 4.3);
    group.scale.setScalar(1.04);
    cube.rotation.set(0.2, -0.82, 0.12);
    wireCube.rotation.copy(cube.rotation);
    wireCube.scale.setScalar(1.008);
    group.add(cube, wireCube);
    scene.add(group);

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const startedAt = performance.now();

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const render = (now: number) => {
      const elapsedTime = (now - startedAt) / 1000;

      resize();
      group.rotation.y = elapsedTime * 0.13 + pointerX * 0.28;
      group.rotation.x = -0.18 + pointerY * 0.16;
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uScroll.value =
        window.scrollY / Math.max(window.innerHeight, 1);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      geometry.dispose();
      wireGeometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      renderer.dispose();
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
