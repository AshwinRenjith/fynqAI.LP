import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate connecting lines between nearby nodes
function ConnectionLines({ positions }: { positions: Float32Array }) {
    const linePositions = useMemo(() => {
        const lines: number[] = [];
        const count = positions.length / 3;
        const maxDist = 0.9;

        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDist) {
                    lines.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }
        return new Float32Array(lines);
    }, [positions]);

    return (
        <lineSegments>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[linePositions, 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color="#C42C3E"
                transparent
                opacity={0.12}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </lineSegments>
    );
}

export default function NetworkGraph() {
    const groupRef = useRef<THREE.Group>(null);
    const pointsRef = useRef<THREE.Points>(null);

    const { targetPositions, currentPositions } = useMemo(() => {
        const count = 300;
        const target = new Float32Array(count * 3);
        const current = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Target: Fibonacci sphere for even distribution
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const r = 1.8 + (Math.random() * 0.3);

            target[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            target[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            target[i * 3 + 2] = r * Math.cos(phi);

            // Current: Start scattered
            current[i * 3] = (Math.random() - 0.5) * 20;
            current[i * 3 + 1] = (Math.random() - 0.5) * 20;
            current[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return { targetPositions: target, currentPositions: current };
    }, []);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
            const ease = 1.8 * delta;

            for (let i = 0; i < positions.length; i++) {
                positions[i] += (targetPositions[i] - positions[i]) * ease;
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.12;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
        }
    });

    return (
        <group ref={groupRef} position={[3.5, 0.3, 0]}>
            {/* Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[currentPositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08}
                    color="#C42C3E"
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    sizeAttenuation
                />
            </points>

            {/* Connecting lines between nearby particles */}
            <ConnectionLines positions={targetPositions} />

            {/* Core glow */}
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#C42C3E" transparent opacity={0.15} />
            </mesh>
        </group>
    );
}
