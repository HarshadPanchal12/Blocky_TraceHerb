"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingBlocks() {
    const group = useRef();

    // Create 30 blocks randomly distributed
    const blocks = useMemo(() => {
        return Array.from({ length: 30 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10 - 5
            ],
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                0
            ],
            scale: Math.random() * 0.5 + 0.2
        }));
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.y = t * 0.05;
            group.current.rotation.x = Math.sin(t * 0.05) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {blocks.map((block, i) => (
                <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={block.position} rotation={block.rotation} scale={block.scale}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial
                            color="#2d5a27"
                            wireframe={Math.random() > 0.5}
                            transparent
                            opacity={0.6}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

export default function CanvasBackground() {
    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, background: "linear-gradient(135deg, #0f172a 0%, #1e1e1e 100%)" }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4ade80" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
                <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <FloatingBlocks />
            </Canvas>
        </div>
    );
}
