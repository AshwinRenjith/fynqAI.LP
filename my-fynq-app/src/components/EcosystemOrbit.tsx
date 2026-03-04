import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import {
    MessageCircle, // Slack
    FileText,      // Docs/Drive
    Layout,        // Jira/Trello
    Database,      // DBs
    Cloud,         // Cloud Storage
    Briefcase      // CRM/Salesforce
} from 'lucide-react';
import styles from './EcosystemOrbit.module.css';

gsap.registerPlugin(ScrollTrigger);

// The intense glowing core of fynqAI
function GlowingCore() {
    const sphereRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.y += 0.005;
            sphereRef.current.rotation.z += 0.002;

            // Pulsing scale
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
            sphereRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <mesh ref={sphereRef} scale={1}>
            <icosahedronGeometry args={[2, 4]} />
            <meshStandardMaterial
                ref={materialRef}
                color="#ffffff"
                emissive="#ff5722" // Ember color
                emissiveIntensity={2}
                wireframe={true}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
}

const EcosystemOrbit = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const stickyContainerRef = useRef<HTMLDivElement>(null);
    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const coreHUDRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const orbitContainerRef = useRef<HTMLDivElement>(null);
    const securityGridRef = useRef<HTMLDivElement>(null);
    const securityLabelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%", // 3 screens for the full sequence
                    pin: stickyContainerRef.current,
                    scrub: 1,
                }
            });

            // 1. Core Ignition (0% - 20%)
            // Fade in the 3D canvas and the HUD
            tl.to(canvasWrapperRef.current, { opacity: 1, duration: 1 }, "start");
            tl.to(coreHUDRef.current, { opacity: 1, y: -40, duration: 1 }, "start");
            tl.to(ringRef.current, { opacity: 1, scale: 1.2, duration: 1 }, "start");

            // 2. Orbital Assembly (20% - 60%)
            // The massive orbit container spins
            tl.to(orbitContainerRef.current, {
                rotation: 360,
                duration: 4,
                ease: "none"
            }, "start"); // Spins throughout the entire scroll

            // The individual tools fly in from the edges
            const tools = gsap.utils.toArray('.orbit-tool') as HTMLElement[];

            // Counter-rotate the tools so the icons stay upright while the parent spins
            tl.to(tools, {
                rotation: -360,
                duration: 4,
                ease: "none"
            }, "start");

            tools.forEach((tool, i) => {
                // Fly in animation
                tl.fromTo(tool,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
                    `start+=${0.5 + (i * 0.1)}`
                );
            });

            // 3. Security Lockdown (60% - 85%)
            // The neon grid flashes in and the HUD screams SECURE
            tl.to(securityGridRef.current, { opacity: 0.8, duration: 0.5 }, "lockdown");
            tl.to(securityLabelRef.current, { opacity: 1, y: -20, duration: 0.5, ease: "back.out(2)" }, "lockdown");
            tl.to(ringRef.current, { borderColor: "rgba(255, 87, 34, 0.5)", backgroundColor: "rgba(255, 87, 34, 0.05)", duration: 0.5 }, "lockdown");

            // 4. Zoom Through Transition (85% - 100%)
            // Massively scale up the core to act as a white-out transition
            tl.to(canvasWrapperRef.current, {
                scale: 15,
                opacity: 0,
                duration: 1,
                ease: "power2.in"
            }, "zoom");

            tl.to([coreHUDRef.current, orbitContainerRef.current, securityLabelRef.current, securityGridRef.current, ringRef.current], {
                opacity: 0,
                scale: 1.5,
                duration: 0.8,
                ease: "power2.in"
            }, "zoom");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const toolsData = [
        { icon: <MessageCircle size={32} />, angle: 0 },
        { icon: <FileText size={32} />, angle: 60 },
        { icon: <Layout size={32} />, angle: 120 },
        { icon: <Database size={32} />, angle: 180 },
        { icon: <Cloud size={32} />, angle: 240 },
        { icon: <Briefcase size={32} />, angle: 300 },
    ];

    const [radius, setRadius] = useState(260);
    const [iconOffset, setIconOffset] = useState(-40);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            setRadius(isMobile ? 150 : 260); // 300px ring diameter on mobile
            setIconOffset(isMobile ? -20 : -40); // 40px icons on mobile
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section ref={sectionRef} className={styles.section} id="integrations">
            {/* SEO & Accessibility Hidden Text for WebGL Scene */}
            <h2 className="sr-only">fynqAI Core Integrations</h2>
            <div className="sr-only">
                <p>Synthesizing data securely across Enterprise platforms including:</p>
                <ul>
                    <li>Slack / Microsoft Teams</li>
                    <li>Google Drive / Office 365</li>
                    <li>Jira / Trello / Asana</li>
                    <li>SQL / NoSQL Databases</li>
                    <li>AWS / Google Cloud Storage</li>
                    <li>Salesforce / HubSpot CRM</li>
                </ul>
            </div>

            <div ref={stickyContainerRef} className={styles.stickyContainer}>

                {/* 3D Background Layer */}
                <div ref={canvasWrapperRef} className={styles.canvasWrapper}>
                    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={2} color="#ff5722" />
                        <GlowingCore />
                    </Canvas>
                </div>

                {/* 2D HUD Layer */}
                <div ref={coreHUDRef} className={styles.coreHUD}>
                    <div className={styles.coreTitle}>fynqAI Core</div>
                    <div className={styles.coreStatus}>SYNTHESIZING</div>
                </div>

                {/* The Orbital Ring */}
                <div ref={ringRef} className={styles.integrationRing} />

                {/* The Rotating Tool Container */}
                <div ref={orbitContainerRef} className={styles.orbitContainer}>
                    {toolsData.map((tool, index) => {
                        // Calculate position on the circle
                        const rad = tool.angle * (Math.PI / 180);
                        const x = Math.cos(rad) * radius;
                        const y = Math.sin(rad) * radius;

                        return (
                            <div
                                key={index}
                                className={`orbit-tool ${styles.toolLogo}`}
                                style={{
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                    marginLeft: `${iconOffset}px`,
                                    marginTop: `${iconOffset}px`
                                }}
                            >
                                {tool.icon}
                            </div>
                        );
                    })}
                </div>

                {/* Security Lockdown Elements */}
                <div ref={securityGridRef} className={styles.securityGrid} />
                <div ref={securityLabelRef} className={styles.securityLabel}>
                    ENTERPRISE GRADE
                    <span className={styles.securitySubLabel}>SOC2 Type II Compliant Layer</span>
                </div>

            </div>
        </section>
    );
};

export default EcosystemOrbit;
