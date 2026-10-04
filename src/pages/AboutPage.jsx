import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AboutPage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap.from(".navbar", { y: -22, duration: 0.7, ease: "power3.out" });
      gsap.from(".about-hero", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" });
      gsap.from(".about-section", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar />

      <main>
        <section className="about-page">
          <div className="about-hero">
            <span className="eyebrow">ABOUT ETFLIX</span>
            <h1>A Better Kind of Movie Night</h1>
            <p>
              We're building a streaming experience that puts great stories first.
              Less scrolling, more watching.
            </p>
          </div>

          <div className="about-content">
            <div className="about-section">
              <div className="about-section__icon">🎬</div>
              <h2>Curated Collections</h2>
              <p>
                Every title on EtFlix is handpicked by our team of film enthusiasts.
                We focus on quality over quantity, bringing you the best movies and series
                worth your time.
              </p>
            </div>

            <div className="about-section">
              <div className="about-section__icon">✨</div>
              <h2>Premium Experience</h2>
              <p>
                Enjoy a clean, modern interface designed for discovery. No clutter,
                no autoplay, just a beautiful way to explore and watch great content.
              </p>
            </div>

            <div className="about-section">
              <div className="about-section__icon">🌟</div>
              <h2>For Movie Lovers</h2>
              <p>
                Built by people who love cinema as much as you do. We believe in
                the power of storytelling and want to help you find your next favorite.
              </p>
            </div>
          </div>

          <div className="about-cta">
            <h2>Ready to explore?</h2>
            <p>Join thousands of movie enthusiasts already discovering great content.</p>
            <a href="/signup" className="button button--primary">
              <div className="button__play">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              Get Started
              <div className="button__arrow">→</div>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;
