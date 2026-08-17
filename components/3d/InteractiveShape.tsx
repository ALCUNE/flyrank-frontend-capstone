'use client';

import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  ContactShadows,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InteractiveShapeProps {
  color: string;
  wireframe: boolean;
  distort: number;
  speed: number;
  autoRotate: boolean;
}

// ── Background setter ─────────────────────────────────────────────────────────

function SceneBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color('#050816');
    return () => {
      scene.background = null;
    };
  }, [scene]);
  return null;
}

// ── Core gem geometry ─────────────────────────────────────────────────────────

interface GemProps {
  color: string;
  wireframe: boolean;
  distort: number;
  speed: number;
}

function GemCore({ color, wireframe, distort, speed }: GemProps) {
  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
      {wireframe ? (
        // When wireframe is on, swap to a plain StandardMaterial so the edges
        // are crisp — MeshDistortMaterial's custom shader ignores wireframe mode.
        <mesh castShadow>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial
            color={color}
            wireframe
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ) : (
        <mesh castShadow>
          <icosahedronGeometry args={[1.4, 1]} />
          <MeshDistortMaterial
            color={color}
            distort={distort}
            speed={speed * 2.5}
            roughness={0.04}
            metalness={0.88}
            envMapIntensity={2}
          />
        </mesh>
      )}
    </Float>
  );
}

// ── Inner scene (runs inside Canvas context) ──────────────────────────────────

function Scene({ color, wireframe, distort, speed, autoRotate }: InteractiveShapeProps) {
  return (
    <>
      <SceneBackground />

      {/* Lights */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={1.6} castShadow />
      {/* Accent fill light — tinted to match current color */}
      <pointLight position={[-4, -3, -4]} intensity={0.8} color={color} />
      <pointLight position={[4, -3, 4]} intensity={0.4} color="#06b6d4" />

      <GemCore color={color} wireframe={wireframe} distort={distort} speed={speed} />

      <ContactShadows
        position={[0, -2.3, 0]}
        opacity={0.5}
        blur={3}
        far={5.5}
        color="#000000"
      />

      {/* Realistic lighting via environment map */}
      <Environment preset="city" />

      {/* Orbit with inertia damping — gives the "pointer tracking + inertia" feel */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={autoRotate}
        autoRotateSpeed={speed * 1.8}
        enableDamping
        dampingFactor={0.04}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
      />
    </>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export default function InteractiveShape(props: InteractiveShapeProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5.5], fov: 44 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
