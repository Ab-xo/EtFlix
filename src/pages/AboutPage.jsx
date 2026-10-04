import { useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { heroMovies } from "../data/movie";

function AboutPage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap.from(".navbar", { y: -22, duration: 0.7, ease: "power3.out" });
      gsap.from(".about-hero__content > *", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });
      gsap.from(".about-stats__item", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      });
      gsap.from(".about-feature", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
      });
      gsap.from(".about-timeline__item", {
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.4,
      });
      gsap.from(".about-cta-premium > *", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5,
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
            <div
              aria-hidden="true"
              className="about-hero__bg"
              style={{ backgroundImage: `url("${heroMovies[2].backdrop}")` }}
            />
            <div aria-hidden="true" className="about-hero__overlay" />
            <div className="about-hero__content">
              <span className="eyebrow">ABOUT ETFLIX</span>
              <h1>A better kind of <em>movie night</em></h1>
              <p>
                We're building a streaming experience that puts great stories
                first. Less scrolling, more watching. Thoughtfully picked,
                always worth the watch.
              </p>
            </div>

            <div className="about-stats">
              <div className="about-stats__item">
                <span className="about-stats__number">38+</span>
                <span className="about-stats__label">Curated Titles</span>
              </div>
              <div className="about-stats__divider" />
              <div className="about-stats__item">
                <span className="about-stats__number">12</span>
                <span className="about-stats__label">Genres</span>
              </div>
              <div className="about-stats__divider" />
              <div className="about-stats__item">
                <span className="about-stats__number">4.9</span>
                <span className="about-stats__label">Avg Rating</span>
              </div>
            </div>
          </div>

          <div className="about-features">
            <div className="about-feature">
              <div className="about-feature__icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>Curated Collections</h2>
              <p>
                Every title is handpicked by our team of film enthusiasts. We
                focus on quality over quantity, bringing you the best movies and
                series worth your time.
              </p>
            </div>

            <div className="about-feature about-feature--accent">
              <div className="about-feature__icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                </svg>
              </div>
              <h2>Premium Experience</h2>
              <p>
                A clean, modern interface designed for discovery. No clutter,
                no autoplay, just a beautiful way to explore and watch great
                content.
              </p>
            </div>

            <div className="about-feature">
              <div className="about-feature__icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 21l-1.5-1.4C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.1L12 21z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>For Movie Lovers</h2>
              <p>
                Built by people who love cinema as much as you do. We believe in
                the power of storytelling and want to help you find your next
                favorite.
              </p>
            </div>
          </div>

          <div className="about-timeline">
            <span className="eyebrow about-timeline__eyebrow">OUR JOURNEY</span>
            <h2 className="about-timeline__title">How we got here</h2>

            <div className="about-timeline__track">
              <div className="about-timeline__item">
                <span className="about-timeline__marker" />
                <span className="about-timeline__year">2023</span>
                <h3>The idea</h3>
                <p>Frustrated by endless scrolling on every streaming platform, we set out to build something simpler.</p>
              </div>
              <div className="about-timeline__item">
                <span className="about-timeline__marker" />
                <span className="about-timeline__year">2024</span>
                <h3>The collection</h3>
                <p>We began curating our first titles, handpicking films and series that deserved more attention.</p>
              </div>
              <div className="about-timeline__item">
                <span className="about-timeline__marker" />
                <span className="about-timeline__year">Today</span>
                <h3>The experience</h3>
                <p>EtFlix is live with a growing library, a beautiful interface, and a community of movie lovers.</p>
              </div>
            </div>
          </div>

          <div className="about-cta-premium">
            <div
              aria-hidden="true"
              className="about-cta-premium__bg"
              style={{ backgroundImage: `url("${heroMovies[1].backdrop}")` }}
            />
            <div aria-hidden="true" className="about-cta-premium__overlay" />
            <span className="eyebrow">READY TO EXPLORE?</span>
            <h2>Your next favorite film is waiting</h2>
            <p>Join thousands of movie enthusiasts already discovering great content.</p>
            <Link to="/signup" className="button button--primary">
              <span className="button__play">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span>Get started</span>
              <svg aria-hidden="true" className="button__arrow" fill="none" viewBox="0 0 20 20">
                <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;
