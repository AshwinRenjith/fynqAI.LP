import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, ScanSearch } from 'lucide-react';
import styles from './FeatureTwo.module.css';

gsap.registerPlugin(ScrollTrigger);

const FeatureTwo = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const track = trackRef.current;
            if (!track) return;

            const totalScroll = track.scrollWidth - window.innerWidth;

            // Horizontal scroll animation with timeline for a resting pause at the end
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: containerRef.current,
                    start: 'top top',
                    end: () => `+=${totalScroll + window.innerHeight * 1.5}`, // Much longer pin for comfortable reading
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            tl.to(track, {
                x: () => -totalScroll,
                ease: 'none',
                duration: 1,
            });

            // Add empty space to the timeline so it stays pinned and still AFTER horizontal scroll is done
            tl.to({}, { duration: 0.4 });

            // Animate the scan line and audit node
            const node = document.querySelector(`.${styles.auditNode}`);
            const scanLine = document.querySelector(`.${styles.scanLine}`);

            if (node) {
                gsap.to(node, {
                    x: 300,
                    y: -80,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                });
            }

            if (scanLine) {
                gsap.to(scanLine, {
                    x: 300,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'linear',
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section} id="audit-agent">
            <p className="sr-only">AI Audit Agent for enterprise document compliance. Automatically detects policy contradictions, outdated information, and compliance risks across your knowledge base.</p>
            <div ref={containerRef} className={styles.horizontalScrollContainer}>
                <div className={styles.headingWrapper}>
                    <h2 className={styles.heading}>
                        The Audit Agent:
                        <br />
                        <span className={styles.headingSub}>
                            Keeping your knowledge flawless.
                        </span>
                    </h2>
                </div>

                <div ref={trackRef} className={styles.cardsTrack}>
                    {/* Card 1: The Conflict */}
                    <div className={styles.card}>
                        <div className={styles.cardStep}>Step 01</div>
                        <div className={styles.cardTitle}>The Conflict</div>
                        <div className={styles.cardDesc}>
                            Outdated policies and contradictory documentation sit unnoticed
                            across thousands of folders and dozens of tools.
                        </div>
                        <div className={styles.visualArea}>
                            <div className={`${styles.docFile} ${styles.docA}`}>
                                "Refunds allowed within <strong>30 days</strong>."
                            </div>
                            <div className={`${styles.docFile} ${styles.docB}`}>
                                "Refunds allowed within <strong>14 days</strong>."
                            </div>
                        </div>
                    </div>

                    {/* Card 2: The Detection */}
                    <div className={styles.card}>
                        <div className={styles.cardStep}>Step 02</div>
                        <div className={styles.cardTitle}>The Detection</div>
                        <div className={styles.cardDesc}>
                            The Audit Agent continuously scans your document network to detect
                            inconsistencies in meaning — not just keywords.
                        </div>
                        <div className={styles.visualArea}>
                            <div className={`${styles.docFile} ${styles.docA}`}>
                                "Refunds allowed within <strong>30 days</strong>."
                            </div>
                            <div className={`${styles.docFile} ${styles.docB}`}>
                                "Refunds allowed within <strong>14 days</strong>."
                            </div>
                            <div className={styles.connectionLine} />
                            <div className={styles.scanLine} />
                            <div className={styles.auditNode}>
                                <ScanSearch size={16} color="#fff" />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: The Resolution */}
                    <div className={styles.card}>
                        <div className={styles.cardStep}>Step 03</div>
                        <div className={styles.cardTitle}>The Resolution</div>
                        <div className={styles.cardDesc}>
                            Contradictions are surfaced in a clean report for your team to
                            review and resolve — the system never changes anything itself.
                        </div>
                        <div className={styles.visualArea}>
                            <div className={styles.dashboardMock}>
                                <div className={styles.dashboardHeader}>Active Alerts (1)</div>
                                <div className={styles.alertRow}>
                                    <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                                    <div className={styles.alertText}>
                                        <strong>Policy Contradiction Detected</strong>
                                        <span>
                                            Refund timelines conflict between Q3_Policy.pdf and
                                            Main_Handbook.docx — 14 days vs 30 days.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureTwo;
