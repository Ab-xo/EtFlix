import { useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const genres = [
  {
    id: 1,
    name: "Action",
    icon: "⚡",
    color: "from-orange-500/20 to-red-500/20",
    count: 156,
  },
  {
    id: 2,
    name: "Drama",
    icon: "🎭",
    color: "from-purple-500/20 to-pink-500/20",
    count: 243,
  },
  {
    id: 3,
    name: "Sci-Fi",
    icon: "🚀",
    color: "from-blue-500/20 to-cyan-500/20",
    count: 89,
  },
  {
    id: 4,
    name: "Horror",
    icon: "👻",
    color: "from-red-500/20 to-black/20",
    count: 127,
  },
  {
    id: 5,
    name: "Comedy",
    icon: "😂",
    color: "from-yellow-500/20 to-orange-500/20",
    count: 198,
  },
  {
    id: 6,
    name: "Animation",
    icon: "🎨",
    color: "from-pink-500/20 to-purple-500/20",
    count: 76,
  },
  {
    id: 7,
    name: "Crime",
    icon: "🔫",
    color: "from-gray-500/20 to-red-500/20",
    count: 134,
  },
  {
    id: 8,
    name: "Adventure",
    icon: "🗺️",
    color: "from-green-500/20 to-teal-500/20",
    count: 165,
  },
  {
    id: 9,
    name: "Music",
    icon: "🎵",
    color: "from-purple-500/20 to-blue-500/20",
    count: 54,
  },
  {
    id: 10,
    name: "History",
    icon: "📜",
    color: "from-amber-500/20 to-yellow-500/20",
    count: 87,
  },
  {
    id: 11,
    name: "Thriller",
    icon: "🔪",
    color: "from-red-500/20 to-gray-500/20",
    count: 142,
  },
  {
    id: 12,
    name: "Fantasy",
    icon: "🧙",
    color: "from-purple-500/20 to-indigo-500/20",
    count: 92,
  },
];

function GenresPage() {
  const pageRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const context = gsap.context(() => {
      gsap.from(".navbar", { y: -22, duration: 0.7, ease: "power3.out" });
      gsap.from(".genres-hero", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.from(".genre-card", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  const handleGenreClick = (genreName) => {
    // Navigate to movies page - the MoviesPage will handle the genre filter via URL params if needed
    navigate("/movies");
  };

  return (
    <div className="site-shell" ref={pageRef}>
      <Navbar />

      <main>
        <section className="genres-page">
          <div className="genres-hero">
            <span className="eyebrow">BROWSE BY CATEGORY</span>
            <h1>Explore Genres</h1>
            <p>
              Discover movies and series across different genres. Find exactly
              what you're in the mood for.
            </p>
          </div>

          <div className="genres-grid">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="genre-card"
                onClick={() => handleGenreClick(genre.name)}
              >
                <div className="genre-card__icon">{genre.icon}</div>
                <h3 className="genre-card__name">{genre.name}</h3>
                <p className="genre-card__count">{genre.count} titles</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default GenresPage;
