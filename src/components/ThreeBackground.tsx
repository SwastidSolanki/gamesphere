"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Snow() {
  const ref = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
        temp[i * 3] = (Math.random() - 0.5) * 40;
        temp[i * 3 + 1] = (Math.random() - 0.5) * 40;
        temp[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.05;
    ref.current.position.y = - (t * 0.3) % 20 + 10;
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.15}
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
      style={{ zIndex: -1, background: '#0a0b0d' }}
    >
      <Suspense fallback={<div className="w-full h-full bg-[#0a0b0d]" />}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ width: '100vw', height: '100vh' }}
        >
          <color attach="background" args={["#0a0b0d"]} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
          <Snow />
          <fog attach="fog" args={["#0a0b0d", 5, 30]} />
        </Canvas>
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
    </div>
  );
}
