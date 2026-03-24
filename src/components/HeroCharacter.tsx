"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HeroCharacter() {
  const group = useRef<THREE.Group>(null!);
  
  // Create a stylized low-poly warrior shape
  const bodyRef = useRef<THREE.Mesh>(null!);
  const headRef = useRef<THREE.Mesh>(null!);
  const armLRef = useRef<THREE.Mesh>(null!);
  const armRRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Breathing/Hovering animation
    group.current.position.y = Math.sin(t * 1.5) * 0.1;
    group.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    
    // Subtle arm movement
    armLRef.current.rotation.x = Math.sin(t * 1.5) * 0.2 + 0.5;
    armRRef.current.rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.2 + 0.5;
  });

  return (
    <group ref={group} scale={1.5}>
      {/* Body/Torso */}
      <mesh ref={bodyRef} position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.8, 6]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.45, 0]}>
        <boxGeometry args={[0.25, 0.3, 0.25]} />
        <meshStandardMaterial color="#111" />
        {/* "Red Stripe" detail - Kratos reference */}
        <mesh position={[0.08, 0, 0.01]}>
            <boxGeometry args={[0.04, 0.31, 0.26]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      </mesh>

      {/* Shoulders/Arms */}
      <group position={[-0.4, 0.1, 0]} ref={armLRef}>
        <mesh>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      
      <group position={[0.4, 0.1, 0]} ref={armRRef}>
        <mesh>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Cape-like plane behind */}
      <mesh position={[0, -0.3, -0.2]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[0.8, 1.2]} />
        <meshStandardMaterial color="#800" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      
      {/* Platform beneath */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  );
}
