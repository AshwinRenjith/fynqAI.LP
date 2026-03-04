import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import NetworkGraph from './NetworkGraph';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const containerRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Load animation - stagger text reveal
            const loadTl = gsap.timeline();
            loadTl.fromTo(
                '.hero-text-anim',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.4,
                    stagger: 0.18,
                    ease: 'power3.out',
                    delay: 0.3,
                }
            );

            // 2. Rotate badge continuously
            gsap.to(badgeRef.current, {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'linear',
            });

            // 3. Scroll parallax — use fromTo so scrolling back restores correctly
            if (containerRef.current && canvasRef.current) {
                gsap.fromTo(
                    canvasRef.current,
                    { scale: 1, opacity: 1, y: '0%' },
                    {
                        scale: 1.6,
                        opacity: 0,
                        y: '20%',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: 'bottom top',
                            scrub: 1.5,
                        },
                    }
                );

                // Wait for load anim to finish before creating scrub,
                // so GSAP captures the correct resting values
                loadTl.then(() => {
                    gsap.fromTo(
                        '.hero-text-anim',
                        { y: 0, opacity: 1 },
                        {
                            y: -80,
                            opacity: 0,
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top top',
                                end: '80% top',
                                scrub: 1.5,
                            },
                        }
                    );
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className={styles.heroSection}>
            {/* 3D Background */}
            <div ref={canvasRef} className={styles.canvasContainer}>
                <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
                    <ambientLight intensity={0.3} />
                    <NetworkGraph />
                </Canvas>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.textColumn}>
                    <h1 className={`${styles.headline} hero-text-anim text-gradient`}>
                        The intelligence layer for your company's knowledge.
                    </h1>
                    <p className={`${styles.subhead} hero-text-anim`}>
                        Stop searching. Start asking. Turn scattered documents into a
                        living, intelligent system.
                    </p>
                    <div className="hero-text-anim">
                        <button className={styles.ctaButton}>
                            See How It Works <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className={`${styles.socialProof} hero-text-anim`}>
                        <div className={styles.proofItem}>
                            <span className={styles.proofValue}>98%</span>
                            <span className={styles.proofLabel}>Accuracy</span>
                        </div>
                        <div className={styles.proofItem}>
                            <span className={styles.proofValue}>&lt;2s</span>
                            <span className={styles.proofLabel}>Response Time</span>
                        </div>
                        <div className={styles.proofItem}>
                            <span className={styles.proofValue}>50+</span>
                            <span className={styles.proofLabel}>Integrations</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rotating Badge — absolute positioned */}
            <div className={`${styles.badgeWrapper} hero-text-anim`}>
                <div className={styles.badgeDot} />
                <div ref={badgeRef} className={styles.badge}>
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                        <defs>
                            <path
                                id="circlePath"
                                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                                fill="transparent"
                            />
                        </defs>
                        <text
                            fontSize="15"
                            fill="rgba(255,255,255,0.35)"
                            fontWeight="600"
                            letterSpacing="4px"
                            fontFamily="Inter, sans-serif"
                        >
                            <textPath href="#circlePath">
                                INTELLIGENT • CONNECTED • ACCURATE •&nbsp;
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;
