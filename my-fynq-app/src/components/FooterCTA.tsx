import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowRight } from 'lucide-react';
import styles from './FooterCTA.module.css';

gsap.registerPlugin(ScrollTrigger);

const FooterCTA = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const pillLabelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                    end: 'top 10%',
                    scrub: 1,
                },
            });

            // Phase 1: Expand clip-path from pill button near top, outward to full screen
            tl.fromTo(
                revealRef.current,
                {
                    clipPath: () => {
                        const w = window.innerWidth;
                        const bw = w < 768 ? 180 : 220;
                        const lrInset = ((w - bw) / 2);
                        // Pill at ~15% from top: top inset 12%, bottom inset 84%
                        return `inset(12% ${lrInset}px 84% ${lrInset}px round 30px)`;
                    },
                },
                {
                    clipPath: 'inset(0% 0% 0% 0% round 0px)',
                    ease: 'power2.inOut',
                    duration: 1,
                }
            );

            // Phase 1b: Fade out the pill label quickly
            tl.to(
                pillLabelRef.current,
                {
                    opacity: 0,
                    scale: 1.3,
                    duration: 0.2,
                },
                0.05
            );

            // Phase 2: Fade in the content EARLY so it's visible during mid-expansion
            tl.to(
                contentRef.current,
                {
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    duration: 0.5,
                },
                0.3
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section} id="contact">
            <div className={styles.stickyWrapper}>
                {/* Background that reveals via clip-path */}
                <div ref={revealRef} className={styles.revealBg}>
                    <div className={styles.revealGlow} />
                </div>

                {/* Label visible before expansion */}
                <div ref={pillLabelRef} className={styles.pillLabel}>
                    Book a Demo ↓
                </div>

                {/* Content revealed after expansion */}
                <div ref={contentRef} className={styles.footerContent}>
                    <h2 className={`${styles.headline} text-gradient`}>
                        Ready to build your company's intelligence layer?
                    </h2>

                    <div className={styles.formWrapper}>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} size={16} />
                            <input
                                type="email"
                                placeholder="Work email"
                                className={styles.inputField}
                                aria-label="Enter your work email address"
                            />
                        </div>
                        <button className={styles.submitBtn} aria-label="Book a demo of fynqAI">
                            Book Demo <ArrowRight size={15} />
                        </button>
                        <div className={styles.finePrint}>
                            No credit card required. 14-day free trial.
                        </div>
                    </div>
                </div>

                {/* Bottom footer bar */}
                <div className={styles.footerBottom}>
                    <div className={styles.copyMark}>
                        &copy; 2026 fynqAI. All rights reserved.
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="/privacy" className={styles.footerLink}>Privacy</a>
                        <a href="/terms" className={styles.footerLink}>Terms</a>
                        <a href="mailto:hello@fynqai.com" className={styles.footerLink}>Contact</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FooterCTA;
