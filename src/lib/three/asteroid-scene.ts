import * as THREE from "three";
import {
  asteroidFragment,
  asteroidVertex,
  dotFragment,
  dotVertex,
  nebulaFragment,
  nebulaVertex,
} from "./shaders";

/**
 * Hero WebGL scene: nebula background, molten asteroid with orbit ring,
 * instanced debris field and twinkling stars.
 *
 * The asteroid follows the page: every element with `data-anchor="<id>"`
 * defines where it should sit while that section is centred on screen
 * (see ANCHORS). Positions are mirrored automatically for RTL pages.
 */

type Anchor = { fx: number; y: number; s: number; d: number };

/** fx = fraction of half-width (−1..1), y = world units, s = scale, d = brightness. */
export const ANCHORS: Record<string, Anchor> = {
  hero: { fx: 0.56, y: 0.55, s: 0.95, d: 1 },
  manifesto: { fx: 0.64, y: -0.2, s: 0.78, d: 0.42 },
  what: { fx: 0.74, y: 1.25, s: 0.45, d: 0.9 },
  work: { fx: 0.86, y: 2.35, s: 0.36, d: 0.8 },
  expertise: { fx: -0.72, y: 2.45, s: 0.4, d: 0.8 },
  how: { fx: 0.72, y: 0.25, s: 0.58, d: 0.95 },
  pricing: { fx: 0.84, y: 2.45, s: 0.4, d: 0.75 },
  care: { fx: 0.02, y: 2.6, s: 0.4, d: 0.85 },
  faq: { fx: -0.62, y: -1.5, s: 0.5, d: 0.85 },
  contact: { fx: 0, y: 0.15, s: 1.35, d: 0.3 },
};

export interface AsteroidSceneOptions {
  isTouch: boolean;
  /** Called every few frames with scroll velocity (used by the sound engine). */
  onScrollVelocity?: (v: number) => void;
}

export interface AsteroidSceneHandle {
  /** 0 → 1 entrance progress (driven by the intro timeline). */
  setIntro: (value: number) => void;
  /** Re-measure anchor positions after layout changes. */
  measure: () => void;
  dispose: () => void;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function createAsteroidScene(
  canvas: HTMLCanvasElement,
  { isTouch, onScrollVelocity }: AsteroidSceneOptions,
): AsteroidSceneHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch {
    return null; // WebGL unavailable — the CSS gradient fallback stays visible.
  }

  const DPR = Math.min(window.devicePixelRatio, isTouch ? 1.5 : 1.75);
  renderer.setPixelRatio(DPR);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.autoClear = false;
  renderer.setClearColor(0x0b0a09, 1);

  /* ── Background nebula ─────────────────────────────────────────── */
  const bgScene = new THREE.Scene();
  const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const bgMat = new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uFocus: { value: new THREE.Vector2(0.7, 0.5) },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader: nebulaVertex,
    fragmentShader: nebulaFragment,
  });
  bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat));

  /* ── Main scene ────────────────────────────────────────────────── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const rig = new THREE.Group(); // moves with scroll
  const spin = new THREE.Group(); // rotates
  scene.add(rig);
  rig.add(spin);

  const astMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uEmber: { value: new THREE.Color(0xff5b1f) },
      uHeat: { value: 0 },
      uDim: { value: 1 },
    },
    vertexShader: asteroidVertex,
    fragmentShader: asteroidFragment,
  });
  spin.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1, 5), astMat));

  // Soft additive glow behind the asteroid.
  const glowTex = makeGlowTexture();
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(5.2, 5.2, 1);
  glow.position.z = -1.2;
  rig.add(glow);

  // Orbit ring + dust + moon (matches the logo).
  const orbit = new THREE.Group();
  orbit.rotation.set(1.25, 0, -0.38);
  rig.add(orbit);
  const ringPts = new THREE.EllipseCurve(0, 0, 2.05, 2.05, 0, Math.PI * 2)
    .getPoints(256)
    .map((p) => new THREE.Vector3(p.x, p.y, 0));
  orbit.add(
    new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(ringPts),
      new THREE.LineBasicMaterial({ color: 0xff5b1f, transparent: true, opacity: 0.55 }),
    ),
  );

  const dotMaterial = (size: number, color: number) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uSize: { value: size * DPR }, uColor: { value: new THREE.Color(color) } },
      vertexShader: dotVertex,
      fragmentShader: dotFragment,
    });

  const ringDust = new THREE.Points(makeRingDust(900), dotMaterial(3.2, 0xffa060));
  orbit.add(ringDust);

  const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 1), new THREE.MeshBasicMaterial({ color: 0xff5b1f }));
  const moonGlow = glow.clone();
  moonGlow.scale.set(0.9, 0.9, 1);
  moonGlow.position.set(0, 0, 0);
  moon.add(moonGlow);
  orbit.add(moon);

  // Debris field (instanced low-poly rocks).
  const debrisCount = isTouch ? 40 : 90;
  const debris = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: 0x6a6058, roughness: 0.95, metalness: 0, flatShading: true }),
    debrisCount,
  );
  const debrisData = Array.from({ length: debrisCount }, () => ({
    p: new THREE.Vector3((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 40, -2 - Math.random() * 14),
    r: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    v: new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6),
    s: 0.03 + Math.pow(Math.random(), 3) * 0.22,
    depth: Math.random(),
  }));
  scene.add(debris);
  scene.add(new THREE.AmbientLight(0x332822, 1.2));
  const key = new THREE.DirectionalLight(0xffe6cc, 2.2);
  key.position.set(-4, 5, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0xff5b1f, 30, 30, 1.6);
  rim.position.set(3, -2, -2);
  scene.add(rim);

  // Stars.
  const stars = new THREE.Points(makeStars(isTouch ? 900 : 1800), dotMaterial(2.2, 0xede6da));
  scene.add(stars);
  const twinkleMats = [ringDust.material, stars.material] as THREE.ShaderMaterial[];

  /* ── Scroll choreography ───────────────────────────────────────── */
  let anchors: (Anchor & { c: number })[] = [];
  const measure = () => {
    anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-anchor]"))
      .filter((el) => ANCHORS[el.id])
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { c: r.top + window.scrollY + r.height / 2 - window.innerHeight / 2, ...ANCHORS[el.id] };
      })
      .sort((a, b) => a.c - b.c);
  };
  const sample = (y: number): Anchor => {
    if (!anchors.length) return ANCHORS.hero;
    if (y <= anchors[0].c) return anchors[0];
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (y < b.c) {
        const t = smoothstep((y - a.c) / (b.c - a.c));
        return { fx: a.fx + (b.fx - a.fx) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t, d: a.d + (b.d - a.d) * t };
      }
    }
    return anchors[anchors.length - 1];
  };

  /* ── Input ─────────────────────────────────────────────────────── */
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const onPointer = (e: PointerEvent) => {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = e.clientY / window.innerHeight;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    bgMat.uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    measure();
  };
  window.addEventListener("resize", onResize);
  measure();

  /* ── Render loop ───────────────────────────────────────────────── */
  const clock = new THREE.Clock();
  const state = { fx: 0.4, y: 0.35, s: 1.08, d: 1, spinBoost: 0, intro: 0, dir: 1 };
  const m4 = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const scl = new THREE.Vector3();
  const pos = new THREE.Vector3();
  let scrollV = 0;
  let lastY = window.scrollY;
  let frame = 0;
  let raf = 0;
  let visible = !document.hidden;
  const onVisibility = () => (visible = !document.hidden);
  document.addEventListener("visibilitychange", onVisibility);

  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) return; // pause rendering in background tabs

    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;

    const y = window.scrollY;
    scrollV += (y - lastY - scrollV) * 0.2;
    lastY = y;
    if (frame++ % 5 === 0) onScrollVelocity?.(scrollV);

    const target = sample(y);
    const k = (1 - Math.pow(0.001, dt)) * 1.4; // frame-rate independent easing
    state.fx += (target.fx - state.fx) * k;
    state.y += (target.y - state.y) * k;
    state.s += (target.s - state.s) * k;
    state.d += (target.d - state.d) * k;
    const dirTarget = document.documentElement.dir === "rtl" ? -1 : 1;
    state.dir += (dirTarget - state.dir) * k * 0.85;

    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfW = halfH * camera.aspect;
    const mobile = window.innerWidth < 760;
    const heroFactor = Math.max(0, 1 - y / window.innerHeight);
    const fx = (mobile ? state.fx * 0.35 : state.fx) * state.dir;
    const scale = (mobile ? state.s * (0.72 - 0.12 * heroFactor) : state.s) * (0.2 + 0.8 * state.intro);

    rig.position.set(
      fx * halfW + (mouse.x - 0.5) * 0.25,
      (mobile ? state.y * 1.5 + 0.85 * heroFactor : state.y) - (mouse.y - 0.5) * 0.2,
      0,
    );
    rig.scale.setScalar(scale);

    state.spinBoost += (Math.min(Math.abs(scrollV) * 0.004, 0.25) - state.spinBoost) * 0.08;
    spin.rotation.y += dt * (0.12 + state.spinBoost * 3);
    spin.rotation.x = Math.sin(t * 0.2) * 0.25 + (mouse.y - 0.5) * 0.4;
    spin.rotation.z = (mouse.x - 0.5) * 0.3;
    orbit.rotation.z = -0.38 + Math.sin(t * 0.15) * 0.06;
    moon.position.set(Math.cos(t * 0.55) * 2.05, Math.sin(t * 0.55) * 2.05, 0);

    // Heat up when the cursor is near the asteroid.
    const sx = (rig.position.x / halfW) * 0.5 + 0.5;
    const sy = 0.5 - (rig.position.y / halfH) * 0.5;
    const dist = Math.hypot((mouse.x - sx) * camera.aspect, mouse.y - sy);
    const heat = Math.max(0, 1 - dist / (0.35 * scale + 0.05)) + state.spinBoost * 1.5;
    astMat.uniforms.uHeat.value += (Math.min(heat, 1.2) - astMat.uniforms.uHeat.value) * 0.08;
    astMat.uniforms.uTime.value = t;
    astMat.uniforms.uDim.value = state.d * (0.3 + 0.7 * state.intro);
    glowMat.opacity = state.d * 0.9;
    twinkleMats.forEach((m) => (m.uniforms.uTime.value = t));

    camera.position.x += ((mouse.x - 0.5) * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (-(mouse.y - 0.5) * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Parallax: stars + debris drift with scroll by depth.
    stars.position.y = y * 0.0012;
    const drift = y * 0.004;
    for (let i = 0; i < debrisData.length; i++) {
      const d = debrisData[i];
      pos.set(d.p.x, ((((d.p.y + drift * (0.4 + d.depth * 1.2) + 20) % 40) + 40) % 40) - 20, d.p.z);
      euler.set(d.r.x + t * d.v.x, d.r.y + t * d.v.y, d.r.z + t * d.v.z);
      quat.setFromEuler(euler);
      scl.setScalar(d.s);
      m4.compose(pos, quat, scl);
      debris.setMatrixAt(i, m4);
    }
    debris.instanceMatrix.needsUpdate = true;

    bgMat.uniforms.uTime.value = t;
    bgMat.uniforms.uScroll.value = y / window.innerHeight;
    bgMat.uniforms.uFocus.value.set(sx, 1 - sy);
    bgMat.uniforms.uMouse.value.set(mouse.x, 1 - mouse.y);

    renderer.clear();
    renderer.render(bgScene, bgCam);
    renderer.clearDepth();
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    setIntro: (v) => (state.intro = v),
    measure,
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((m) => m.dispose());
      });
      bgMat.dispose();
      glowTex.dispose();
      renderer.dispose();
    },
  };
}

/* ── helpers ─────────────────────────────────────────────────────── */

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,110,40,.55)");
  g.addColorStop(0.35, "rgba(255,80,20,.18)");
  g.addColorStop(1, "rgba(255,80,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeRingDust(count: number) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.05 + (Math.random() - 0.5) * 0.35 * Math.random();
    pos.set([Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.08], i * 3);
    seed[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  return g;
}

function makeStars(count: number) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos.set([(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80, -6 - Math.random() * 30], i * 3);
    seed[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  return g;
}
