import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Database, ShieldAlert, FileQuestion, FolderOpen, AlertCircle } from 'lucide-react';
import styles from './ProblemSection.module.css';

gsap.registerPlugin(ScrollTrigger);

interface ProblemCardProps {
    className: string;
    speed: number;
    icon: React.ReactNode;
    title: string;
    previewText: string;
}

const ProblemCard = ({ className, speed, icon, title, previewText }: ProblemCardProps) => (
    <div className={`problem-card ${className} ${styles.card}`} data-speed={speed}>
        <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>{icon}</div>
            <div className={styles.cardTitle}>{title}</div>
        </div>
        <div className={styles.cardContent}>
            {previewText}
        </div>
    </div>
);

const ProblemSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const text1Ref = useRef<HTMLHeadingElement>(null);
    const text2Ref = useRef<HTMLHeadingElement>(null);
    const text3Ref = useRef<HTMLHeadingElement>(null);
    const rightPinnedRef = useRef<HTMLDivElement>(null);
    const contradictionRef = useRef<HTMLDivElement>(null);
    const docARef = useRef<HTMLDivElement>(null);
    const docBRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pin the left column while scrolling through the section
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: leftColRef.current,
            });

            // Pin the Phase 3 contradiction visual container
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: rightPinnedRef.current,
            });

            // Timeline for cross-fading text
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                },
            });

            // Phase 1: text1 visible initially, then fades out, text2 fades in
            tl.set(text1Ref.current, { opacity: 1, y: 0 });
            tl.to(text1Ref.current, { opacity: 0, y: -40, duration: 1 }, 0.8);
            tl.fromTo(text2Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0.8);

            // Phase 2: text2 fades out, text3 fades in
            tl.to(text2Ref.current, { opacity: 0, y: -40, duration: 1 }, 2.2);
            tl.fromTo(text3Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 2.2);

            // Phase 3: The contradiction visual!
            // Show the wrapper
            tl.fromTo(contradictionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.2);

            // Documents fly in and smash together
            tl.fromTo(docARef.current, { x: -150, y: -50, rotation: -15 }, { x: 0, y: 0, rotation: -4, duration: 0.8, ease: 'back.out(1.2)' }, 2.4);
            tl.fromTo(docBRef.current, { x: 150, y: 50, rotation: 15 }, { x: 0, y: 0, rotation: 6, duration: 0.8, ease: 'back.out(1.2)' }, 2.4);

            // Pulse the red glow
            tl.fromTo(glowRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4 }, 2.8);

            // Pop the badge
            tl.fromTo(badgeRef.current, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 2.9);

            // Fade out the chaotic cards below so they don't distract too much
            tl.to('.problem-card', { opacity: 0, duration: 0.5 }, 2.4);

            // Parallax cards at different speeds
            const cards = gsap.utils.toArray('.problem-card') as HTMLElement[];
            cards.forEach((card) => {
                const speed = parseFloat(card.dataset.speed || '1');
                gsap.fromTo(
                    card,
                    { y: window.innerHeight * 0.5 },
                    {
                        y: -window.innerHeight * speed * 0.6,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.2,
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section} id="knowledge-chaos">
            <p className="sr-only">Enterprise knowledge silos cause document contradictions, outdated policies, and compliance risks. fynqAI solves scattered documentation across your organization.</p>
            <div className={styles.inner}>
                <div ref={leftColRef} className={styles.leftCol}>
                    <div className={styles.headingWrapper}>
                        <h2
                            ref={text1Ref}
                            className={`${styles.heading} ${styles.active} text-gradient`}
                        >
                            Thousands of<br />documents.
                        </h2>
                        <h2
                            ref={text2Ref}
                            className={`${styles.heading} text-gradient`}
                        >
                            Dozens of<br />tools.
                        </h2>
                        <h2
                            ref={text3Ref}
                            className={styles.heading}
                            style={{ color: 'var(--color-ember)' }}
                        >
                            Endless<br />contradictions.
                        </h2>
                    </div>
                    <p className={styles.subtext}>
                        Information is scattered, outdated, and contradictory. Your team
                        wastes hours searching — and still isn't sure they found the
                        right answer.
                    </p>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.cardsContainer}>
                        <ProblemCard
                            className={styles.card1}
                            speed={0.6}
                            icon={<FileText size={18} color="var(--color-text-muted)" />}
                            title="Q3 Onboarding SOP.pdf"
                            previewText="All new hires must provision their own API keys via the internal portal before requesting dashboard access..."
                        />
                        <ProblemCard
                            className={styles.card2}
                            speed={1.0}
                            icon={<Database size={18} color="var(--color-text-muted)" />}
                            title="HR Knowledge Base"
                            previewText="Note: The 2023 remote work policy has been superseded by the October mandate. Do not reference..."
                        />
                        <ProblemCard
                            className={styles.card3}
                            speed={0.4}
                            icon={<ShieldAlert size={18} color="var(--color-text-muted)" />}
                            title="Security Policy v1.2"
                            previewText="Passwords must be rotated every 90 days. Exceptions require VP approval and must be logged in..."
                        />
                        <ProblemCard
                            className={styles.card4}
                            speed={0.8}
                            icon={<FolderOpen size={18} color="var(--color-text-muted)" />}
                            title="Leave Policy 2024.docx"
                            previewText="Unlimited PTO is subject to manager discretion and cannot be taken concurrently with sabbatical leave..."
                        />
                        <ProblemCard
                            className={styles.card5}
                            speed={1.2}
                            icon={<FileQuestion size={18} color="var(--color-text-muted)" />}
                            title="Legacy Backend Docs"
                            previewText="DEPRECATED: We no longer use the V2 authentication flow. If you encounter a token mismatch error, see..."
                        />
                    </div>

                    {/* Phase 3 visual: Overlapping Contradictions */}
                    <div ref={rightPinnedRef} className={styles.pinnedRight}>
                        <div ref={contradictionRef} className={styles.contradictionWrapper}>
                            <div ref={glowRef} className={styles.conflictGlow} />

                            <div ref={docARef} className={`${styles.conflictDoc} ${styles.docA}`}>
                                <div className={styles.conflictHeader}>
                                    <FileText size={14} /> main_policy_v2.pdf
                                </div>
                                <div className={styles.conflictText}>
                                    "Refunds are permissible within a <span className={styles.highlightEmber}>30-day</span> window."
                                </div>
                            </div>

                            <div ref={docBRef} className={`${styles.conflictDoc} ${styles.docB}`}>
                                <div className={styles.conflictHeader}>
                                    <Database size={14} /> HR Knowledge Base
                                </div>
                                <div className={styles.conflictText}>
                                    "All refunds must be processed strictly within <span className={styles.highlightEmber}>14 days</span>."
                                </div>
                            </div>

                            <div ref={badgeRef} className={styles.conflictBadge}>
                                <AlertCircle size={16} /> Contradiction Detected
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
