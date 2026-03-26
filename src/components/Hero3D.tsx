"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Text, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function GameShard({ position, textureUrl, title, color, delay = 0 }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => {
    if (typeof window !== "undefined") {
      return new THREE.TextureLoader().load(textureUrl);
    }
    return null;
  }, [textureUrl]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay;
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef}>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          <meshStandardMaterial 
            map={texture} 
            transparent 
            opacity={0.8}
            emissive={color}
            emissiveIntensity={0.2}
          />
          {/* Technical Border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(2.52, 3.52, 0.12)]} />
            <lineBasicMaterial color={color} transparent opacity={0.4} />
          </lineSegments>
        </mesh>
        <Text
          position={[0, -2, 0]}
          fontSize={0.15}
          color={color}
          font="/fonts/JetBrainsMono-Bold.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          {title}
        </Text>
      </group>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#00e5ff" />
        
        {/* Left Side Gallery: Sekiro, GOW, Uncharted */}
        <GameShard 
          position={[-6, 1.5, 0]} 
          textureUrl="/sekiro_portrait.png" 
          title="REF_ID: SHADOW_DIE_TWICE" 
          color="#ff4400" 
          delay={0}
        />
        <GameShard 
          position={[-7.5, -1.5, -2]} 
          textureUrl="/kratos_portrait.png" 
          title="REF_ID: GOD_OF_WAR" 
          color="#f43f5e" 
          delay={1}
        />
        <GameShard 
          position={[-4.5, -2.5, 1]} 
          textureUrl="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1659420/header.jpg" 
          title="REF_ID: UNCHARTED_V" 
          color="#3b82f6" 
          delay={2}
        />

        {/* Right Side Gallery: TLOU2, Far Cry, Elden Ring */}
        <GameShard 
          position={[6, 1.5, 0]} 
          textureUrl="/ellie_portrait.png" 
          title="REF_ID: LAST_OF_US_II" 
          color="#10b981" 
          delay={0.5}
        />
        <GameShard 
          position={[7.5, -1.5, -2]} 
          textureUrl="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1361210/header.jpg" 
          title="REF_ID: FAR_CRY_VI" 
          color="#f59e0b" 
          delay={1.5}
        />
        <GameShard 
          position={[4.5, -2.5, 1]} 
          textureUrl="/elden_ring_bg.png" 
          title="REF_ID: ELDEN_RING" 
          color="#a855f7" 
          delay={2.5}
        />

        <Environment preset="city" />
        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
      </Canvas>
    </div>
  );
}
