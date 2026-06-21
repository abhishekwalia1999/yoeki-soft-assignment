"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Custom Hairpin Curve for Logo Arms ──────────────────────────────────────
class HairpinCurve extends THREE.Curve<THREE.Vector3> {
  d: number;
  y_base_long: number;
  y_base_short: number;
  y_loop: number;

  constructor(d = 0.18, y_base_long = 0.08, y_base_short = 0.38, y_loop = 0.8) {
    super();
    this.d = d;
    this.y_base_long = y_base_long;
    this.y_base_short = y_base_short;
    this.y_loop = y_loop;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const L1 = this.y_loop - this.y_base_long;
    const L2 = Math.PI * this.d;
    const L3 = this.y_loop - this.y_base_short;
    const total = L1 + L2 + L3;

    const p1 = L1 / total;
    const p2 = (L1 + L2) / total;

    if (t < p1) {
      // Long leg (going from center-base outwards)
      const segmentT = t / p1;
      const y = this.y_base_long + segmentT * L1;
      return optionalTarget.set(this.d, y, 0);
    } else if (t < p2) {
      // Loop (outer bend connecting legs)
      const segmentT = (t - p1) / (p2 - p1);
      const angle = segmentT * Math.PI;
      const x = this.d * Math.cos(angle);
      const y = this.y_loop + this.d * Math.sin(angle);
      return optionalTarget.set(x, y, 0);
    } else {
      // Short leg (returning towards center-base)
      const segmentT = (t - p2) / (1 - p2);
      const y = this.y_loop - segmentT * L3;
      return optionalTarget.set(-this.d, y, 0);
    }
  }
}

// ── Three-Arm Symmetric Yoeki Logo Group ─────────────────────────────────────
function YoekiLogo({ material }: { material: THREE.ShaderMaterial }) {
  const d = 0.18;
  const y_base_long = 0.08;
  const y_base_short = 0.38;
  const y_loop = 0.8;
  const tubeRadius = 0.085;

  const curve = useMemo(() => new HairpinCurve(d, y_base_long, y_base_short, y_loop), []);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 64, tubeRadius, 24, false), [curve]);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(tubeRadius, 24, 24), [tubeRadius]);

  // Rotations to distribute three identical loops symmetrically:
  // Arm 1 points up-right, Arm 2 points up-left, Arm 3 points down.
  const armRotations: [number, number, number][] = [
    [0, 0, -Math.PI / 3], // -60 deg
    [0, 0, Math.PI / 3],  // 60 deg
    [0, 0, Math.PI],       // 180 deg
  ];

  return (
    <>
      {armRotations.map((rot, idx) => (
        <group key={idx} rotation={rot}>
          {/* Main swept tube */}
          <mesh geometry={tubeGeo} material={material} />
          {/* Hemispherical cap at long leg base */}
          <mesh geometry={sphereGeo} material={material} position={[d, y_base_long, 0]} />
          {/* Hemispherical cap at short leg base */}
          <mesh geometry={sphereGeo} material={material} position={[-d, y_base_short, 0]} />
        </group>
      ))}
    </>
  );
}

// ── Mouse-Reactive Camera Parallax ──────────────────────────────────────────
function CameraRig({
  mouseX,
  mouseY,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}) {
  useFrame((state) => {
    const { camera } = state;
    const t = state.clock.getElapsedTime();

    // Ease camera target position for organic lag parallax
    camera.position.x += (mouseX.current * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (mouseY.current * 0.5 + 0.1 + Math.sin(t * 0.2) * 0.08 - camera.position.y) * 0.04;
    camera.position.z = 4.8;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Main Scene containing Logo and Interactive Math ──────────────────────────
function Scene({
  mouseX,
  mouseY,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}) {
  const logoRef = useRef<THREE.Group>(null);
  const targetHoverStrength = useRef(0);
  const currentHoverStrength = useRef(0);

  // Shader Uniforms
  const shaderUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(-999, -999, -999) },
      uHoverStrength: { value: 0 },
      uBaseColor1: { value: new THREE.Color("#1E1B4B") }, // Deep Blue/Indigo
      uBaseColor2: { value: new THREE.Color("#6D28D9") }, // Violet/Purple
      uEdgeColor: { value: new THREE.Color("#EA580C") },  // Orange/Copper rim glow
    };
  }, []);

  // Custom Glass Shader Material
  const glassMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: shaderUniforms,
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uHoverStrength;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vPosition;
        varying vec3 vLocalPosition;
        varying vec3 vPerturbedNormal;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vLocalPosition = position;

          // Watery wave displacement based on distance from mouse intersection
          float dist = distance(position, uMouse);
          float wave = sin(dist * 9.0 - uTime * 7.5) * 0.06;
          float decay = exp(-dist * 1.6);
          vec3 displacedPosition = position + normal * wave * decay * uHoverStrength;

          vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
          vViewPosition = -mvPosition.xyz;

          // Compute perturbed normal in view-space using normalMatrix
          float waveFactor = cos(dist * 9.0 - uTime * 7.5) * 0.15 * exp(-dist * 1.6) * uHoverStrength;
          vec3 localDir = normalize(position - uMouse);
          if (dist < 0.001) {
            localDir = vec3(0.0, 1.0, 0.0);
          }
          vec3 viewDirSpace = normalize(normalMatrix * localDir);
          vPerturbedNormal = normalize(vNormal + viewDirSpace * waveFactor);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uHoverStrength;
        uniform vec3 uBaseColor1;
        uniform vec3 uBaseColor2;
        uniform vec3 uEdgeColor;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vPosition;
        varying vec3 vLocalPosition;
        varying vec3 vPerturbedNormal;

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          vec3 perturbedNormal = normalize(vPerturbedNormal);

          // Calculate local distance for ripples (used for base calculations if needed)
          float dist = distance(vLocalPosition, uMouse);

          // Fresnel glow factor using the perturbed normal
          float fresnel = pow(1.0 - max(dot(perturbedNormal, viewDir), 0.0), 2.8);

          // Gradient base color along logo height (Y axis)
          float mixTerm = (vLocalPosition.y + 0.9) / 1.8;
          vec3 baseColor = mix(uBaseColor1, uBaseColor2, clamp(mixTerm, 0.0, 1.0));

          // Translucent refractive depth coloring
          baseColor = mix(baseColor, vec3(0.01, 0.02, 0.08), (1.0 - fresnel) * 0.4);

          // Blend glass gradient base with orange Fresnel highlight
          vec3 finalColor = mix(baseColor, uEdgeColor, fresnel);

          // Specular highlight 1: Sharp white shine
          vec3 lightDir1 = normalize(vec3(6.0, 6.0, 7.0));
          vec3 halfDir1 = normalize(lightDir1 + viewDir);
          float spec1 = pow(max(dot(perturbedNormal, halfDir1), 0.0), 64.0);
          finalColor += vec3(0.92, 0.96, 1.0) * spec1 * 0.8;

          // Specular highlight 2: Soft orange rim shine
          vec3 lightDir2 = normalize(vec3(-6.0, -4.0, -2.0));
          vec3 halfDir2 = normalize(lightDir2 + viewDir);
          float spec2 = pow(max(dot(perturbedNormal, halfDir2), 0.0), 16.0);
          finalColor += uEdgeColor * spec2 * 0.4;

          gl_FragColor = vec4(finalColor, 0.96);
        }
      `,
      transparent: true,
      depthWrite: true, // Write to depth buffer for clean solid 3D intersection clipping
      side: THREE.DoubleSide,
    });
  }, [shaderUniforms]);

  // Frame Loop for Animations and Raycasting
  useFrame((state) => {
    const { clock, raycaster, camera } = state;
    const t = clock.getElapsedTime();

    // 1. Time uniform update
    shaderUniforms.uTime.value = t;

    // 2. Slow floating background rotation and drift
    if (logoRef.current) {
      // Background rotation/skew behavior
      logoRef.current.rotation.y = t * 0.16;
      logoRef.current.rotation.x = Math.sin(t * 0.1) * 0.12;
      logoRef.current.rotation.z = Math.cos(t * 0.07) * 0.06;
      logoRef.current.position.y = Math.sin(t * 0.3) * 0.1;
    }

    // 3. Raycast for watery wave interaction
    raycaster.setFromCamera(state.pointer, camera);
    if (logoRef.current) {
      // Raycast against children elements (tubes and caps)
      const intersects = raycaster.intersectObjects(logoRef.current.children, true);
      
      if (intersects.length > 0) {
        const hit = intersects[0];
        // Convert intersection coordinate to logo group local coordinate system
        const localPoint = logoRef.current.worldToLocal(hit.point.clone());
        
        shaderUniforms.uMouse.value.copy(localPoint);
        targetHoverStrength.current = 1.0;
      } else {
        targetHoverStrength.current = 0.0;
      }
    }

    // Smoothly transition hover strength uniform to decay wave
    currentHoverStrength.current += (targetHoverStrength.current - currentHoverStrength.current) * 0.08;
    shaderUniforms.uHoverStrength.value = currentHoverStrength.current;
  });

  return (
    <>
      <CameraRig mouseX={mouseX} mouseY={mouseY} />

      {/* Basic surrounding ambient light */}
      <ambientLight intensity={0.9} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#818CF8" />
      <pointLight position={[-5, -5, -3]} intensity={0.8} color="#C7D2FE" />

      {/* Symmetrically nested logo arms */}
      <group ref={logoRef} scale={1.8}>
        <YoekiLogo material={glassMaterial} />
      </group>
    </>
  );
}

// ── Exported Transformation Engine Wrapper ─────────────────────────────────
export default function TransformationEngine() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Normalize coordinate system: (-1, 1)
      mouseX.current = (e.clientX / w - 0.5) * 2;
      mouseY.current = -(e.clientY / h - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div id="transformation-engine" className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.1, 4.8], fov: 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Scene mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}
