"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating "document stack": a small cluster of glowing purple planes
// (representing sheets/PDF pages) that rotate slowly, bob up and down,
// and drift slightly toward the mouse. Kept intentionally low-poly so it
// stays smooth on mid-range laptops.
function DocumentStack() {
  const group = useRef<THREE.Group>(null);
  const sheets = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        y: i * 0.09,
        rot: (Math.random() - 0.5) * 0.08,
        color: i % 2 === 0 ? "#A855F7" : "#6D28D9",
      })),
    []
  );

  useFrame(({ clock, mouse }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.6) * 0.25;
    group.current.rotation.y = t * 0.25 + mouse.x * 0.3;
    group.current.rotation.x = mouse.y * 0.12;
  });

  return (
    <group ref={group}>
      {sheets.map((s, i) => (
        <mesh key={i} position={[0, s.y, 0]} rotation={[-Math.PI / 2.4, 0, s.rot]}>
          <planeGeometry args={[1.6, 2.1]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.35}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
      {/* Neon accent line, like a headline rule across the top sheet */}
      <mesh position={[0, sheets[sheets.length - 1].y + 0.01, 0.7]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <planeGeometry args={[1.1, 0.05]} />
        <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(140 * 3);
    for (let i = 0; i < 140; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (points.current) points.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#A855F7" size={0.035} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function ThreeScene({ reduced = false }: { reduced?: boolean }) {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        dpr={reduced ? 1 : [1, 1.5]}
        camera={{ position: [0, 1.2, 4.2], fov: 45 }}
        gl={{ antialias: !reduced, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={1.4} color="#A855F7" />
        <pointLight position={[-3, -1, -2]} intensity={0.8} color="#FACC15" />
        <Suspense fallback={null}>
          <DocumentStack />
          {!reduced && <Particles />}
        </Suspense>
      </Canvas>
    </div>
  );
}
