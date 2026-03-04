import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, FileText, FileCode, MessageSquare } from 'lucide-react';
import styles from './InterfaceReveal.module.css';

gsap.registerPlugin(ScrollTrigger);

const InterfaceReveal = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const stickyContainerRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<SVGRectElement>(null);

    // Typing text refs
    const typedTextRef = useRef<HTMLSpanElement>(null);
    const fullQuestion = "What does our NDA say about IP ownership?";

    // Flying Docs refs
    const doc1Ref = useRef<HTMLDivElement>(null);
    const doc2Ref = useRef<HTMLDivElement>(null);
    const doc3Ref = useRef<HTMLDivElement>(null);

    // Output refs
    const aiOutputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Generate the massive timeline tied to the pinned section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%", // 3 screens worth of precise scrubbing
                    pin: stickyContainerRef.current,
                    scrub: 1, // Smooth scrub
                }
            });

            // 1. The Glass Box Assembly (0% to 20%)
            // Prepare SVG stroke
            if (rectRef.current) {
                const length = rectRef.current.getTotalLength();
                gsap.set(rectRef.current, { strokeDasharray: length, strokeDashoffset: length });

                tl.to(rectRef.current, {
                    strokeDashoffset: 0,
                    duration: 1,
                    ease: "power2.inOut"
                }, "start");
            }

            // Bring the box into view and scale up
            tl.to(chatContainerRef.current, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out"
            }, "start+=0.2");

            // 2. The Typing Scrub (20% to 45%)
            // We animate an invisible proxy object holding a 'progress' value from 0 to 1
            const typeProxy = { progress: 0 };
            tl.to(typeProxy, {
                progress: 1,
                duration: 1.5,
                ease: "none",
                onUpdate: () => {
                    if (typedTextRef.current) {
                        const charCount = Math.floor(typeProxy.progress * fullQuestion.length);
                        typedTextRef.current.innerText = fullQuestion.substring(0, charCount);
                    }
                }
            }, "typing"); // Starts after box assembly

            // 3. The Synthesis Parallax (45% to 75%)
            // Docs fly from extremely close to the camera (+Z) into the chat box (Z=0)
            const docDuration = 1.2;

            tl.fromTo(doc1Ref.current,
                { z: 1000, x: -300, y: -200, opacity: 0, rotationX: 45, rotationY: 45 },
                { z: 0, x: -100, y: 50, opacity: 1, rotationX: 0, rotationY: -10, duration: docDuration, ease: "power3.out" },
                "synthesis"
            );

            tl.fromTo(doc2Ref.current,
                { z: 1200, x: 300, y: -100, opacity: 0, rotationX: -30, rotationY: -45 },
                { z: 0, x: 120, y: 0, opacity: 1, rotationX: 0, rotationY: 15, duration: docDuration, ease: "power3.out" },
                "synthesis+=0.1"
            );

            tl.fromTo(doc3Ref.current,
                { z: 800, x: 0, y: 300, opacity: 0, rotationX: 60, rotationY: 0 },
                { z: 0, x: 0, y: -50, opacity: 1, rotationX: 0, rotationY: 0, duration: docDuration, ease: "power3.out" },
                "synthesis+=0.2"
            );

            // Make the docs quickly fade/suck into the center right as the AI response hits
            tl.to([doc1Ref.current, doc2Ref.current, doc3Ref.current], {
                scale: 0,
                opacity: 0,
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "power2.in",
                stagger: 0.05
            }, "resolve");


            // 4. The Response Streams In (75% to 100%)
            tl.to(aiOutputRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "back.out(1.2)"
            }, "resolve+=0.2");


        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section} id="ai-interface">
            <h2 className="sr-only">fynqAI Knowledge Interface Example</h2>
            {/* Height 300vh created by Pinning in GSAP */}
            <div ref={stickyContainerRef} className={styles.stickyContainer}>

                {/* The main Glass UI */}
                <div ref={chatContainerRef} className={styles.chatContainer}>

                    {/* SVG specific for the animating glowing border */}
                    <svg className={styles.svgBorder} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <rect ref={rectRef} width="100%" height="100%" rx="24" />
                    </svg>

                    {/* Window Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.headerDot} />
                        <span className={styles.headerTitle}>fynqAI Assistant</span>
                    </div>

                    {/* Chat Content */}
                    <div className={styles.chatBody}>

                        {/* User Question */}
                        <div className={styles.userMsgContainer}>
                            <div className={styles.userBubble}>
                                <span ref={typedTextRef}></span>
                                <span className={styles.typingCursor}></span>
                            </div>
                        </div>

                        {/* Synthesis Animation Layer (Absolute in center) */}
                        <div className={styles.synthesisArea}>
                            <div ref={doc1Ref} className={styles.flyingDoc}>
                                <FileText size={18} color="var(--color-text-muted)" />
                                <span>Master_NDA_2024.pdf</span>
                            </div>
                            <div ref={doc2Ref} className={styles.flyingDoc}>
                                <FileCode size={18} color="var(--color-text-muted)" />
                                <span>Contractor_Agreements.docx</span>
                            </div>
                            <div ref={doc3Ref} className={styles.flyingDoc}>
                                <MessageSquare size={18} color="var(--color-text-muted)" />
                                <span>Slack: #legal-approvals</span>
                            </div>
                        </div>

                        {/* AI Streaming Response */}
                        <div ref={aiOutputRef} className={styles.aiMsgContainer}>
                            <div className={styles.aiHeader}>
                                <Sparkles size={16} />
                                <span>Synthesized Answer</span>
                            </div>
                            <div className={styles.aiResponseText}>
                                According to the Master Policy, all intellectual property developed by full-time employees or contractors actively using company hardware automatically belongs to the organization in perpetuity.
                            </div>
                            <div className={styles.citationRow}>
                                <div className={styles.citationBadge}>
                                    <FileText size={12} /> Master_NDA_2024
                                </div>
                                <div className={styles.citationBadge}>
                                    <MessageSquare size={12} /> Legal Guidance
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default InterfaceReveal;
