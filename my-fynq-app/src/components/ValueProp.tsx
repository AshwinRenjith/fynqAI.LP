import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Scale, Users, Briefcase, Code } from 'lucide-react';
import styles from './ValueProp.module.css';

gsap.registerPlugin(ScrollTrigger);

function BackgroundNodes() {
    const pointsRef = useRef<THREE.Points>(null);
    const mouse = useRef(new THREE.Vector2());

    const { positions } = useMemo(() => {
        const count = 150;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 10;
        }
        return { positions: pos };
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame((_state, delta) => {
        if (pointsRef.current) {
            const tx = mouse.current.x * 1.5;
            const ty = mouse.current.y * 1.5;
            pointsRef.current.position.x += (tx - pointsRef.current.position.x) * 2 * delta;
            pointsRef.current.position.y += (ty - pointsRef.current.position.y) * 2 * delta;
            pointsRef.current.rotation.y += delta * 0.04;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                color="#8A8F98"
                transparent
                opacity={0.25}
                sizeAttenuation
            />
        </points>
    );
}

const ValueProp = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cylinderRef = useRef<HTMLDivElement>(null);
    const dropLineGlowRef = useRef<HTMLDivElement>(null);

    const texts = [
        'FOR ONBOARDING',
        'FOR COMPLIANCE',
        'FOR OPERATIONS',
        'FOR HR',
        'FOR LEGAL',
        'FOR ENGINEERING',
    ];

    const faceCount = texts.length;
    const angle = 360 / faceCount;
    // A tighter radius for a better 3D effect
    const radius = Math.round((90 / 2) / Math.tan(Math.PI / faceCount)) + 30;

    useEffect(() => {
        if (!cylinderRef.current || !sectionRef.current) return;

        gsap.set(cylinderRef.current, { rotationX: 0 });

        // 3D Cylinder scroll rotation
        gsap.to(cylinderRef.current, {
            rotationX: -360,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

        // Department tags pop in
        gsap.fromTo(
            gsap.utils.toArray('.deptTagAnim') as HTMLElement[],
            { y: 20, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.1,
                ease: "back.out(1.5)",
                duration: 0.6,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 20%",
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // The connecting line drops smoothly down
        // We use scrub so it feels connected to the user's scroll position as they hit the bottom
        gsap.fromTo(dropLineGlowRef.current,
            { top: '-50px', opacity: 0 },
            {
                top: '100%',
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "bottom 60%", // Triggers as they scroll into the final 60% of viewport
                    end: "bottom top", // Ends exactly as the next section hits the top
                    scrub: 1
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* SEO & Screen Reader Content for WebGL */}
            <h2 className="sr-only">FASTER DECISIONS</h2>
            <ul className="sr-only">
                {texts.map((text, i) => <li key={i}>{text}</li>)}
            </ul>

            <div className={styles.canvasContainer}>
                <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 1.5]}>
                    <BackgroundNodes />
                </Canvas>
            </div>

            <div className={styles.backgroundText}>FASTER DECISIONS</div>

            <div className={styles.scene}>
                <div ref={cylinderRef} className={styles.cylinder}>
                    {texts.map((text, index) => (
                        <div
                            key={index}
                            className={styles.face}
                            style={{
                                transform: `rotateX(${index * angle}deg) translateZ(${radius}px)`,
                            }}
                        >
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.centerLabel}>
                <div className={styles.labelTag}>One platform</div>
                <div className={styles.labelHeadline}>Every department. Every answer.</div>

                <div className={styles.deptRow}>
                    <div className={`${styles.deptTag} deptTagAnim`}>
                        <Scale size={14} className={styles.deptIcon} /> Legal
                    </div>
                    <div className={`${styles.deptTag} deptTagAnim`}>
                        <Users size={14} className={styles.deptIcon} /> HR
                    </div>
                    <div className={`${styles.deptTag} deptTagAnim`}>
                        <Briefcase size={14} className={styles.deptIcon} /> Operations
                    </div>
                    <div className={`${styles.deptTag} deptTagAnim`}>
                        <Code size={14} className={styles.deptIcon} /> Engineering
                    </div>
                </div>
            </div>

            {/* Connecting line that drops down to FooterCTA */}
            <div className={styles.dropLineContainer}>
                <div ref={dropLineGlowRef} className={styles.dropLineGlow} />
            </div>
        </section>
    );
};

export default ValueProp;
