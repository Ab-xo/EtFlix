import { useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AboutPage() {
  const pageRef = useRef(null);
  const navigate = useNavigate();

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
      gsap.from(".about-section", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3,
      });
      gsap.from(".feature-highlight", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-features",
          start: "top 75%",
          once: true,
        },
      });
      gsap.from(".about-stats__item", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".about-stats",
          start: "top 80%",
          once: true,
        },
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar />

      <main>
        <section className="about-page">
          {/* Hero Section */}
          <div className="about-hero">
            <div className="about-hero__content">
              <span className="eyebrow">ABOUT ETFLIX</span>
              <h1>
                Streaming <em>reimagined</em> for movie lovers
              </h1>
              <p>
                We're not just another streaming service. We're a carefully
                curated experience designed for people who value quality over
                quantity, and storytelling over algorithms.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="about-mission">
            <div className="about-mission__content">
              <span className="eyebrow">OUR MISSION</span>
              <h2>Bringing great stories to life</h2>
              <p>
                In a world drowning in content, EtFlix stands apart. We believe
                the best streaming experience isn't about having everything —
                it's about having the right things. Every title on our platform
                is handpicked by our team of film enthusiasts, ensuring you
                spend less time scrolling and more time watching what matters.
              </p>
              <p>
                From timeless classics to modern masterpieces, we celebrate
                cinema in all its forms. Our mission is simple: connect you with
                stories that move, inspire, and entertain.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="about-content">
            <div className="about-section">
              <div className="about-section__icon">🎬</div>
              <h2>Curated Collections</h2>
              <p>
                Every title on EtFlix is handpicked by our team of film
                enthusiasts. We focus on quality over quantity, bringing you the
                best movies and series worth your time. No bloat, no filler —
                just exceptional storytelling.
              </p>
            </div>

            <div className="about-section">
              <div className="about-section__icon">✨</div>
              <h2>Premium Experience</h2>
              <p>
                Enjoy a clean, modern interface designed for discovery. No
                clutter, no autoplay, no interruptions — just a beautiful way to
                explore and watch great content. Every detail is crafted with
                care.
              </p>
            </div>

            <div className="about-section">
              <div className="about-section__icon">🌟</div>
              <h2>For Movie Lovers</h2>
              <p>
                Built by people who love cinema as much as you do. We believe in
                the power of storytelling and want to help you find your next
                favorite. Join a community that appreciates the art of film.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="about-features">
            <div className="about-features__header">
              <span className="eyebrow">WHAT MAKES US DIFFERENT</span>
              <h2>Built for how you actually watch</h2>
            </div>
            <div className="about-features__grid">
              <div className="feature-highlight">
                <div className="feature-highlight__number">01</div>
                <h3>Smart Recommendations</h3>
                <p>
                  Our algorithm learns what you love, not what's trending. Get
                  personalized suggestions based on your unique taste.
                </p>
              </div>
              <div className="feature-highlight">
                <div className="feature-highlight__number">02</div>
                <h3>Seamless Streaming</h3>
                <p>
                  Crystal-clear 4K streaming with adaptive quality. Watch
                  anywhere, on any device, without buffering or interruptions.
                </p>
              </div>
              <div className="feature-highlight">
                <div className="feature-highlight__number">03</div>
                <h3>No Ads, Ever</h3>
                <p>
                  Your movie night shouldn't be interrupted. We're ad-free by
                  design, so you can immerse yourself completely.
                </p>
              </div>
              <div className="feature-highlight">
                <div className="feature-highlight__number">04</div>
                <h3>Offline Downloads</h3>
                <p>
                  Take your favorites anywhere. Download titles to watch
                  offline, perfect for travel or spotty connections.
                </p>
              </div>
              <div className="feature-highlight">
                <div className="feature-highlight__number">05</div>
                <h3>Family Friendly</h3>
                <p>
                  Create profiles for everyone in your household. Parental
                  controls ensure kids only see age-appropriate content.
                </p>
              </div>
              <div className="feature-highlight">
                <div className="feature-highlight__number">06</div>
                <h3>Cancel Anytime</h3>
                <p>
                  No contracts, no commitments. Love it or leave it — we're
                  confident you'll stay for the content.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="about-stats">
            <div className="about-stats__item">
              <div className="about-stats__number">1M+</div>
              <div className="about-stats__label">Active Members</div>
            </div>
            <div className="about-stats__item">
              <div className="about-stats__number">10K+</div>
              <div className="about-stats__label">Curated Titles</div>
            </div>
            <div className="about-stats__item">
              <div className="about-stats__number">150+</div>
              <div className="about-stats__label">Countries</div>
            </div>
            <div className="about-stats__item">
              <div className="about-stats__number">4.9★</div>
              <div className="about-stats__label">User Rating</div>
            </div>
          </div>

          {/* Values Section */}
          <div className="about-values">
            <div className="about-values__header">
              <span className="eyebrow">OUR VALUES</span>
              <h2>What we stand for</h2>
            </div>
            <div className="about-values__grid">
              <div className="value-card">
                <div className="value-card__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Quality First</h3>
                <p>
                  We'd rather have 100 great titles than 10,000 mediocre ones.
                  Every addition is deliberate.
                </p>
              </div>
              <div className="value-card">
                <div className="value-card__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 11.08V12a10 10 0 11-5.93-9.14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 4L12 14.01l-3-3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>User Respect</h3>
                <p>
                  No dark patterns, no data mining, no manipulation. Your
                  privacy and time matter to us.
                </p>
              </div>
              <div className="value-card">
                <div className="value-card__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Community</h3>
                <p>
                  Cinema is better together. We're building a community of
                  passionate viewers who appreciate the art.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="about-cta">
            <h2>Ready to experience the difference?</h2>
            <p>
              Join millions of viewers who've rediscovered the joy of great
              storytelling.
            </p>
            <div className="about-cta__buttons">
              <button
                className="button button--primary"
                onClick={() => navigate("/signup")}
                type="button"
              >
                <span className="button__play">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M4 2.5v7L9.5 6 4 2.5Z" fill="currentColor" />
                  </svg>
                </span>
                <span>Start your free trial</span>
                <svg
                  aria-hidden="true"
                  className="button__arrow"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M4 10h11m-4-4 4 4-4 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
              <button
                className="button button--secondary"
                onClick={() => navigate("/movies")}
                type="button"
              >
                Browse catalog
              </button>
            </div>
            <p className="about-cta__note">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;
