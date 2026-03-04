import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, FileText } from 'lucide-react';
import styles from './FeatureOne.module.css';

gsap.registerPlugin(ScrollTrigger);

const FeatureOne = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinWrapperRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const uiMockupRef = useRef<HTMLDivElement>(null);
    const [typingComplete, setTypingComplete] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pin the wrapper
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: pinWrapperRef.current,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    onUpdate: (self) => {
                        // Trigger typing when mockup is roughly visible
                        if (self.progress > 0.7 && !typingComplete) {
                            setTypingComplete(true);
                        }
                    },
                },
            });

            // Phase 1: Stacked text appears (0 -> 0.3)
            const texts = gsap.utils.toArray('.stacked-text') as HTMLElement[];
            tl.to(
                texts,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.08,
                    duration: 0.8,
                    ease: 'power2.out',
                },
                0
            );

            // Phase 2: Text scales up and fades (0.3 -> 0.5)
            tl.to(
                textContainerRef.current,
                {
                    scale: 1.3,
                    opacity: 0,
                    duration: 0.8,
                },
                1.2
            );

            // Phase 3: UI mockup slides up from bottom (0.4 -> 1.0)
            tl.to(
                uiMockupRef.current,
                {
                    bottom: '0vh',
                    duration: 1.5,
                    ease: 'power2.out',
                },
                1.2
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [typingComplete]);

    return (
        <section ref={sectionRef} className={styles.section} id="conversational-ai">
            <h2 className="sr-only">Conversational AI Knowledge Search</h2>
            <div ref={pinWrapperRef} className={styles.pinWrapper}>
                {/* Kinetic Stacking Text */}
                <div ref={textContainerRef} className={styles.stackedTextContainer}>
                    <div className={`${styles.stackedText} stacked-text`}>START ASKING</div>
                    <div className={`${styles.stackedText} stacked-text`}>START ASKING</div>
                    <div
                        className={`${styles.stackedText} ${styles.highlight} stacked-text`}
                    >
                        STOP SEARCHING
                    </div>
                    <div className={`${styles.stackedText} stacked-text`}>STOP SEARCHING</div>
                    <div className={`${styles.stackedText} stacked-text`}>STOP SEARCHING</div>
                </div>

                {/* UI Mockup */}
                <div ref={uiMockupRef} className={styles.uiMockupWrapper}>
                    <div className={styles.uiHeader}>
                        <div className={styles.dot} style={{ background: '#ff5f56' }} />
                        <div className={styles.dot} style={{ background: '#ffbd2e' }} />
                        <div className={styles.dot} style={{ background: '#27c93f' }} />
                        <span className={styles.headerTitle}>
                            fynqAI Knowledge Interface
                        </span>
                    </div>

                    <div className={styles.uiBody}>
                        <div className={styles.question}>
                            What's the process for employee leave?
                        </div>

                        <div className={styles.answerBlock}>
                            <div className={styles.aiAvatar}>
                                <Sparkles size={16} color="#FFF" />
                            </div>
                            <div className={styles.answer}>
                                {typingComplete ? (
                                    <>
                                        Employees must submit a leave request via the HR portal at
                                        least <strong>14 days in advance</strong> for planned PTO.
                                        For sick leave, an email to the direct manager before 9:00 AM
                                        is required.
                                        <div className={styles.citation}>
                                            <FileText size={13} /> Leave Policy 2024 — Section 3.1
                                        </div>
                                    </>
                                ) : (
                                    <span className={styles.cursor} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureOne;
