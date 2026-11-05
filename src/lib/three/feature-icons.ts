import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * 3D icons for the "What you get" cards.
 *
 * Performance: ONE WebGL context renders every icon. A transparent fixed
 * canvas sits above the page and each icon is drawn into its card's
 * `.ico3d` rectangle using scissor/viewport. Rendering pauses when the
 * section is off-screen.
 */

export type IconName = "gem" | "phone" | "search" | "magnet" | "layers" | "globe";

interface IconRig {
  scene: THREE.Scene;
  group: THREE.Group;
  tick: (t: number, hover: number) => void;
}

const EMBER = 0xff5b1f;

function createMaterials() {
  return {
    metal: new THREE.MeshPhysicalMaterial({ color: 0x2c2723, metalness: 0.92, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.12 }),
    bone: new THREE.MeshPhysicalMaterial({ color: 0xede6da, metalness: 0.05, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.1 }),
    ember: new THREE.MeshPhysicalMaterial({ color: EMBER, emissive: EMBER, emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.3, clearcoat: 1 }),
    glow: new THREE.MeshBasicMaterial({ color: 0xff8a4c }),
    gem: new THREE.MeshPhysicalMaterial({
      color: 0xf3e9da, metalness: 0.25, roughness: 0.08, clearcoat: 1,
      iridescence: 1, iridescenceIOR: 1.5, iridescenceThicknessRange: [200, 800], flatShading: true,
    }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xffe2cc, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.18, clearcoat: 1 }),
    line: new THREE.LineBasicMaterial({ color: EMBER, transparent: true, opacity: 0.6 }),
  };
}
type Materials = ReturnType<typeof createMaterials>;

function stage(env: THREE.Texture) {
  const scene = new THREE.Scene();
  scene.environment = env;
  const key = new THREE.DirectionalLight(0xfff1e0, 2.2);
  key.position.set(-3, 4, 5);
  const rim = new THREE.PointLight(EMBER, 40, 12, 1.5);
  rim.position.set(2.5, -1.5, 1.5);
  const group = new THREE.Group();
  scene.add(key, rim, group);
  return { scene, group };
}

const builders: Record<IconName, (env: THREE.Texture, M: Materials) => IconRig> = {
  gem(env, M) {
    const { scene, group } = stage(env);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), M.gem);
    const cage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.42, 1)), M.line);
    const sats = [0, 1, 2].map((i) => new THREE.Mesh(new THREE.OctahedronGeometry(0.12), i ? M.bone : M.ember));
    group.add(core, cage, ...sats);
    return {
      scene, group,
      tick(t, h) {
        core.rotation.set(t * 0.25, t * 0.6, 0);
        cage.rotation.set(0, -t * 0.25, t * 0.1);
        sats.forEach((m, i) => {
          const a = t * (0.9 + i * 0.3) + i * 2.1;
          m.position.set(Math.cos(a) * 1.75, Math.sin(a * 1.3) * 0.5, Math.sin(a) * 1.75);
          m.rotation.x = t * 2;
        });
        core.scale.setScalar(1 + h * 0.12);
      },
    };
  },

  phone(env, M) {
    const { scene, group } = stage(env);
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.15, 2.2, 0.16, 6, 0.17), M.metal);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.02, 2.04),
      new THREE.MeshBasicMaterial({ map: phoneScreenTexture(), toneMapped: false }),
    );
    screen.position.z = 0.081;
    const notch = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.07, 0.02, 2, 0.03), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    notch.position.set(0, 0.93, 0.09);
    const chipA = new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.26, 0.08, 4, 0.12), M.ember);
    const chipB = new THREE.Mesh(new RoundedBoxGeometry(0.56, 0.2, 0.06, 4, 0.09), M.bone);
    group.add(body, screen, notch, chipA, chipB);
    return {
      scene, group,
      tick(t, h) {
        group.rotation.y = Math.sin(t * 0.6) * 0.5 + h * 0.3;
        group.rotation.z = Math.sin(t * 0.4) * 0.05;
        chipA.position.set(0.95, 0.35 + Math.sin(t * 1.4) * 0.08, 0.35);
        chipB.position.set(-0.9, -0.45 + Math.sin(t * 1.2 + 1) * 0.08, 0.3);
        group.position.y = Math.sin(t) * 0.05;
      },
    };
  },

  search(env, M) {
    const { scene, group } = stage(env);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.13, 24, 72), M.metal);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.72, 48), M.glass);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 1.05, 24), M.ember);
    handle.position.set(0.88, -0.88, 0);
    handle.rotation.z = Math.PI / 4;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), M.ember);
    cap.position.set(1.26, -1.26, 0);
    const bars = new THREE.Group();
    ([[0.9, 0.32], [0.6, 0], [0.75, -0.32]] as const).forEach(([w, y], i) => {
      const b = new THREE.Mesh(new RoundedBoxGeometry(w, 0.12, 0.05, 3, 0.05), i === 0 ? M.ember : M.bone);
      b.position.set(-0.05, y, -0.5);
      bars.add(b);
    });
    group.add(ring, lens, handle, cap, bars);
    return {
      scene, group,
      tick(t, h) {
        group.rotation.set(Math.sin(t * 0.5) * 0.15, Math.sin(t * 0.7) * 0.45, 0);
        group.position.x = Math.sin(t * 0.8) * 0.15;
        bars.children.forEach((b, i) => (b.position.x = -0.05 + Math.sin(t * 1.2 + i) * 0.1));
        ring.scale.setScalar(1 + h * 0.08);
      },
    };
  },

  magnet(env, M) {
    const { scene, group } = stage(env);
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 21 }, (_, i) => {
        const a = Math.PI * (i / 20);
        return new THREE.Vector3(-Math.cos(a) * 0.62, Math.sin(a) * 0.62 + 0.15, 0);
      }),
    );
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.22, 20, false), M.ember));
    [-0.62, 0.62].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.55, 24), M.ember);
      leg.position.set(x, -0.12, 0);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.3, 24), M.bone);
      tip.position.set(x, -0.54, 0);
      group.add(leg, tip);
    });
    group.position.y = 0.55;

    // Particles being pulled in = visitors becoming enquiries.
    const N = 16;
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 10, 8), M.glow, N);
    scene.add(dots);
    const seeds = Array.from({ length: N }, (_, i) => ({ o: i / N, x: (Math.random() - 0.5) * 2.6, z: (Math.random() - 0.5) * 1.2 }));
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    return {
      scene, group,
      tick(t, h) {
        group.rotation.set(Math.sin(t * 0.45) * 0.12, Math.sin(t * 0.6) * 0.5, 0);
        seeds.forEach((d, i) => {
          const k = (t * (0.28 + h * 0.5) + d.o) % 1;
          const e = k * k;
          p.set(d.x * (1 - e), -1.6 + e * 1.55, d.z * (1 - e));
          s.setScalar(0.6 + 0.8 * Math.sin(Math.PI * k));
          m4.compose(p, q, s);
          dots.setMatrixAt(i, m4);
        });
        dots.instanceMatrix.needsUpdate = true;
      },
    };
  },

  layers(env, M) {
    const { scene, group } = stage(env);
    const plates = [0, 1, 2].map((i) => new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.09, 1.2, 4, 0.045), i === 2 ? M.bone : M.metal));
    const knob = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.1, 0.2, 3, 0.05), M.ember);
    const track = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.03, 0.06, 2, 0.015), M.metal);
    const tiles = [0, 1, 2].map((i) => new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.06, 0.32, 3, 0.03), i === 1 ? M.ember : M.bone));
    group.add(...plates, knob, track, ...tiles);
    group.rotation.set(0.55, -0.6, 0);
    return {
      scene, group,
      tick(t, h) {
        const gap = 0.55 + h * 0.25;
        plates.forEach((m, i) => (m.position.y = (i - 1) * gap + Math.sin(t * 1.3 + i) * 0.05));
        const top = plates[2].position.y;
        track.position.set(0, top + 0.07, 0.3);
        knob.position.set(Math.sin(t * 1.4) * 0.45, top + 0.1, 0.3);
        tiles.forEach((m, i) => m.position.set((i - 1) * 0.5, plates[1].position.y + 0.08, -0.15 + Math.sin(t * 2 + i) * 0.04));
        group.rotation.y = -0.6 + Math.sin(t * 0.5) * 0.35;
      },
    };
  },

  globe(env, M) {
    const { scene, group } = stage(env);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.95, 48, 32), M.metal);
    const wire = new THREE.Group();
    const circle = (fn: (a: number) => THREE.Vector3) =>
      new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 65 }, (_, k) => fn((k / 64) * Math.PI * 2))), M.line);
    for (let i = 1; i < 6; i++) {
      const lat = -Math.PI / 2 + (i * Math.PI) / 6;
      const r = Math.cos(lat);
      const y = Math.sin(lat);
      wire.add(circle((a) => new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)));
    }
    for (let i = 0; i < 6; i++) {
      const lo = (i * Math.PI) / 6;
      wire.add(circle((a) => new THREE.Vector3(Math.cos(a) * Math.cos(lo), Math.sin(a), Math.cos(a) * Math.sin(lo))));
    }
    const orbit = new THREE.Group();
    orbit.rotation.set(1.2, 0, 0.35);
    const a = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), M.ember);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), M.bone);
    orbit.add(new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.012, 8, 128), M.glow), a, b);
    group.add(core, wire, orbit);
    return {
      scene, group,
      tick(t, h) {
        wire.rotation.y = core.rotation.y = t * 0.35;
        const sp = t * (0.8 + h * 1.2);
        a.position.set(Math.cos(sp) * 1.45, Math.sin(sp) * 1.45, 0);
        b.position.set(Math.cos(sp + Math.PI) * 1.45, Math.sin(sp + Math.PI) * 1.45, 0);
        group.rotation.x = Math.sin(t * 0.4) * 0.15;
      },
    };
  },
};

function phoneScreenTexture() {
  const c = document.createElement("canvas");
  c.width = 230;
  c.height = 440;
  const x = c.getContext("2d")!;
  const gr = x.createLinearGradient(0, 0, 0, 440);
  gr.addColorStop(0, "#2a120a");
  gr.addColorStop(1, "#0b0908");
  x.fillStyle = gr;
  x.fillRect(0, 0, 230, 440);
  x.fillStyle = "#EDE6DA";
  x.font = "700 34px sans-serif";
  x.fillText("Hello.", 22, 92);
  x.fillStyle = "rgba(237,230,218,.25)";
  x.fillRect(22, 120, 150, 8);
  x.fillRect(22, 140, 110, 8);
  x.fillStyle = "rgba(237,230,218,.08)";
  for (let i = 0; i < 3; i++) {
    x.beginPath();
    x.roundRect(22, 180 + i * 58, 186, 46, 10);
    x.fill();
  }
  x.fillStyle = "#FF5B1F";
  x.beginPath();
  x.roundRect(22, 370, 186, 44, 22);
  x.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ── Public API ──────────────────────────────────────────────────── */

export function createFeatureIcons(canvas: HTMLCanvasElement, section: HTMLElement, isTouch: boolean) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  document.documentElement.classList.add("gl-icons");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const materials = createMaterials();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 5.7);

  const slots = Array.from(section.querySelectorAll<HTMLElement>(".ico3d")).map((el) => {
    const card = el.closest<HTMLElement>(".card")!;
    const rig = builders[el.dataset.icon as IconName](env, materials);
    const slot = { el, card, rig, hover: 0, hoverTarget: 0, mx: 0.5, my: 0.5, vis: 0, seed: (el.dataset.icon ?? "").length };
    card.addEventListener("pointerenter", () => (slot.hoverTarget = 1));
    card.addEventListener("pointerleave", () => {
      slot.hoverTarget = 0;
      slot.mx = slot.my = 0.5;
    });
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      slot.mx = (e.clientX - r.left) / r.width;
      slot.my = (e.clientY - r.top) / r.height;
    });
    return slot;
  });

  let active = false;
  const sectionObserver = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
      if (!active) {
        renderer.setScissorTest(false);
        renderer.clear();
      }
    },
    { rootMargin: "200px" },
  );
  sectionObserver.observe(section);

  // Fill the spec meters when a card scrolls into view.
  const cardObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.4 },
  );
  slots.forEach((s) => cardObserver.observe(s.card));

  const onResize = () => renderer.setSize(window.innerWidth, window.innerHeight, false);
  window.addEventListener("resize", onResize);

  const clock = new THREE.Clock();
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!active) return;
    const t = clock.getElapsedTime();
    const H = window.innerHeight;
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);
    for (const s of slots) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.width < 2) continue;
      const opacity = parseFloat(getComputedStyle(s.card).opacity) || 0;
      if (opacity < 0.02) continue;
      s.vis += (opacity - s.vis) * 0.2;
      s.hover += (s.hoverTarget - s.hover) * 0.08;
      s.rig.tick(t + s.seed, s.hover);
      s.rig.group.scale.setScalar((0.55 + 0.45 * s.vis) * (1 + s.hover * 0.08));
      s.rig.scene.rotation.y += ((s.mx - 0.5) * 0.9 * s.hover - s.rig.scene.rotation.y) * 0.1;
      s.rig.scene.rotation.x += ((s.my - 0.5) * 0.6 * s.hover - s.rig.scene.rotation.x) * 0.1;
      camera.aspect = r.width / r.height;
      camera.fov = r.height < 170 ? 34 : 30;
      camera.updateProjectionMatrix();
      const y = H - r.bottom;
      renderer.setViewport(r.left, y, r.width, r.height);
      renderer.setScissor(r.left, y, r.width, r.height);
      renderer.render(s.rig.scene, camera);
    }
  };
  raf = requestAnimationFrame(loop);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      sectionObserver.disconnect();
      cardObserver.disconnect();
      window.removeEventListener("resize", onResize);
      Object.values(materials).forEach((m) => m.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      document.documentElement.classList.remove("gl-icons");
    },
  };
}
