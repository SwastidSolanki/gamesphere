"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function GoldenGrace() {
  const ref = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
        temp[i * 3] = (Math.random() - 0.5) * 60;
        temp[i * 3 + 1] = (Math.random() - 0.5) * 60;
        temp[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.05;
    ref.current.rotation.x = t * 0.02;
    
    // Subtle movement
    ref.current.position.y = Math.sin(t * 0.5) * 1;
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d4af37"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
           <GoldenGrace />
        </Float>
        <fog attach="fog" args={["#050505", 10, 40]} />
      </Canvas>
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
