"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function SnowStorm() {
  const ref = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(8000 * 3); // Higher density
    for (let i = 0; i < 8000; i++) {
        temp[i * 3] = (Math.random() - 0.5) * 50;
        temp[i * 3 + 1] = (Math.random() - 0.5) * 50;
        temp[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.08; // Faster rotation
    ref.current.position.y = - (t * 0.4) % 20 + 10;
    ref.current.position.z = Math.sin(t * 0.2) * 2; // Slight sway
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.18} // Larger, more visible flakes
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{ zIndex: -1 }}
    >
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 75 }}
        style={{ width: '100vw', height: '100vh', background: '#0a0b0d' }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0a0b0d"]} />
          <ambientLight intensity={1.2} />
          <pointLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
          <SnowStorm />
          <fog attach="fog" args={["#0a0b0d", 5, 35]} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
    </div>
  );
}
