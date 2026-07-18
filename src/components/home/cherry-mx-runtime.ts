import {
  AgXToneMapping,
  Box3,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Sphere,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Material, Mesh, Object3D, Texture } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_URL = "/models/cherry-mx-mid-web-v9.glb";
const MODEL_SIZE_BYTES = 2_408_332;
const MODEL_ROOT = "cherry_mx_mid_web_v9";
const MODEL_REVISION = "assembled-mid-no-led-lower-through-contacts-v9";
const SOURCE_SHA256 =
  "580284368ea10f0e58de1efe92315782b6294fb1920320a87c8b5836c9c9dc3f";
const REQUIRED_COMPONENTS = [
  "Mid Switch",
  "Mid Bottom",
  "Mid Contacts",
  "Mid Top",
  "Mid Spring",
] as const;
const VIEW_DIRECTION = new Vector3(0.78, 0.65, -1.35).normalize();

interface MountOptions {
  onProgress?: (progress: number) => void;
}

const exportedName = (object: Object3D) =>
  typeof object.userData.name === "string"
    ? object.userData.name
    : object.name.replaceAll("_", " ");

const disposeModel = (root: Object3D) => {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    const mesh = object as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    mesh.geometry.dispose();

    for (const material of Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material]) {
      materials.add(material);

      for (const value of Object.values(material)) {
        if (value && typeof value === "object" && "isTexture" in value) {
          const texture = value as Texture;
          if (texture.isTexture) {
            textures.add(texture);
          }
        }
      }
    }
  });

  for (const texture of textures) {
    texture.dispose();
  }
  for (const material of materials) {
    material.dispose();
  }
};

export const mountCherryMxSwitch = async (
  canvas: HTMLCanvasElement,
  options: MountOptions = {}
) => {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(0x00_00_00), 0);
  renderer.toneMapping = AgXToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.01, 100);
  const modelPivot = new Group();
  scene.add(modelPivot);

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;
  room.dispose();
  pmrem.dispose();

  const key = new DirectionalLight(0xff_ff_ff, 2.7);
  key.position.set(3.2, 4.5, 4.1);
  const fill = new DirectionalLight(0xe6_ee_f7, 1.15);
  fill.position.set(-4.2, 1.2, 2.8);
  const rim = new DirectionalLight(0xff_f2_e8, 0.85);
  rim.position.set(1.2, 2.1, -4.4);
  scene.add(key, fill, rim);

  const gltf = await new GLTFLoader().loadAsync(MODEL_URL, (event) => {
    const total = event.total || MODEL_SIZE_BYTES;
    options.onProgress?.(
      Math.min(99, Math.round((event.loaded / total) * 100))
    );
  });

  const root = gltf.scene.getObjectByName(MODEL_ROOT);
  const componentNames = new Set(root?.children.map(exportedName));

  if (
    !root ||
    root.userData.asset_role !== "web-derivative" ||
    root.userData.revision !== MODEL_REVISION ||
    root.userData.source_sha256 !== SOURCE_SHA256 ||
    REQUIRED_COMPONENTS.some((name) => !componentNames.has(name))
  ) {
    disposeModel(gltf.scene);
    renderer.dispose();
    environment.dispose();
    throw new Error("The Cherry MX web derivative is invalid");
  }

  gltf.scene.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(root, true);

  const center = bounds.getCenter(new Vector3());
  const size = bounds.getSize(new Vector3());
  const sourceSphere = bounds.getBoundingSphere(new Sphere());
  const scale = 2.4 / Math.max(size.x, size.y, size.z);
  gltf.scene.scale.setScalar(scale);
  gltf.scene.position.copy(center).multiplyScalar(-scale);
  modelPivot.add(gltf.scene);
  modelPivot.rotation.y = -0.2;
  options.onProgress?.(100);

  const normalizedRadius = sourceSphere.radius * scale;
  const controls = new OrbitControls(camera, canvas);
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  controls.enableDamping = !reducedMotion;
  controls.enablePan = false;
  controls.dampingFactor = 0.055;
  controls.rotateSpeed = 0.46;
  controls.zoomSpeed = 0.55;
  controls.target.set(0, 0, 0);

  const render = () => renderer.render(scene, camera);
  const fitCamera = () => {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const aspect = width / height;
    const verticalFov = MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
    const fitFov = Math.min(verticalFov, horizontalFov);
    const distance = (normalizedRadius / Math.sin(fitFov / 2)) * 1.13;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    camera.near = Math.max(0.01, distance - normalizedRadius * 2.2);
    camera.far = distance + normalizedRadius * 3.2;
    camera.position.copy(VIEW_DIRECTION).multiplyScalar(distance);
    camera.updateProjectionMatrix();
    controls.minDistance = distance * 0.62;
    controls.maxDistance = distance * 1.75;
    controls.update();
    render();
  };

  const resizeObserver = new ResizeObserver(fitCamera);
  resizeObserver.observe(canvas);
  fitCamera();

  let frame = 0;
  let visible = true;
  const tick = (time: number) => {
    frame = window.requestAnimationFrame(tick);
    modelPivot.rotation.y = -0.2 + Math.sin(time * 0.000_19) * 0.024;
    controls.update();
    render();
  };
  const start = () => {
    if (!(reducedMotion || frame || document.hidden || !visible)) {
      frame = window.requestAnimationFrame(tick);
    }
  };
  const stop = () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) {
      start();
    } else {
      stop();
    }
  });
  const handleVisibility = () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  };

  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", handleVisibility);

  if (reducedMotion) {
    controls.addEventListener("change", render);
  } else {
    start();
  }

  return () => {
    stop();
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
    controls.removeEventListener("change", render);
    controls.dispose();
    disposeModel(gltf.scene);
    environment.dispose();
    renderer.dispose();
  };
};
