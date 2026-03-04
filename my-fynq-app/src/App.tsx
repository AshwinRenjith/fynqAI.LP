import { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import FeatureOne from './components/FeatureOne';
import FeatureTwo from './components/FeatureTwo';

// Lazy-load heavy 3D components for better LCP
const InterfaceReveal = lazy(() => import('./components/InterfaceReveal'));
const EcosystemOrbit = lazy(() => import('./components/EcosystemOrbit'));
const ValueProp = lazy(() => import('./components/ValueProp'));

import FooterCTA from './components/FooterCTA';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5, // Increased duration for extreme buttery feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease-out curve, but lengthened by duration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly softer wheel to allow the duration to float
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    // Navbar fade on scroll
    const nav = document.querySelector('.site-nav') as HTMLElement;
    if (nav) {
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
          if (self.direction === 1) {
            nav.style.transform = 'translateY(-100%)';
          } else {
            nav.style.transform = 'translateY(0)';
          }
        },
      });
    }

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <HelmetProvider>
      <div className="bg-bg text-text-primary min-h-screen overflow-x-hidden">
        {/* Global SEO Metadata */}
        <Helmet>
          <html lang="en" />
          <title>fynqAI | The Enterprise Knowledge Intelligence Platform</title>
          <meta name="description" content="fynqAI synthesizes your scattered enterprise knowledge across Slack, Jira, and Drive into instant, verified answers. Secure, SOC2 compliant, and blazingly fast." />
          <link rel="canonical" href="https://fynqai.com/" />

          {/* OpenGraph / Social Media */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://fynqai.com/" />
          <meta property="og:title" content="fynqAI | The Enterprise Knowledge Intelligence Platform" />
          <meta property="og:description" content="fynqAI synthesizes your scattered enterprise knowledge across Slack, Jira, and Drive into instant, verified answers." />
          <meta property="og:site_name" content="fynqAI" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="fynqAI | The Enterprise Knowledge Intelligence Platform" />
          <meta name="twitter:description" content="fynqAI synthesizes your scattered enterprise knowledge across Slack, Jira, and Drive into instant, verified answers." />
        </Helmet>

        {/* Navigation */}
        <nav className="site-nav" role="navigation" aria-label="Main navigation">
          <div className="nav-logo">
            fynq<span className="nav-logo-accent">AI</span>
          </div>
          <button className="nav-cta" aria-label="Get started with fynqAI enterprise knowledge intelligence">
            Get Started
          </button>
        </nav>

        <main>
          <Hero />
          <div className="relative z-10">
            <ProblemSection />
            <FeatureOne />
            <FeatureTwo />
            <Suspense fallback={null}>
              <InterfaceReveal />
              <EcosystemOrbit />
              <ValueProp />
            </Suspense>
            <FooterCTA />
          </div>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default App;
