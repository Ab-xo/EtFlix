import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { heroMovies } from "../data/movie";

function AccountPage({ mode }) {
  const isSignUp = mode === "signup";
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (
      isSignUp &&
      formData.get("password") !== formData.get("confirm-password")
    ) {
      setMessage(
        "Those passwords do not match. Please check them and try again.",
      );
      return;
    }

    setMessage(
      "Your account form is ready, but sign-in is not connected yet. Connect an authentication service to continue.",
    );
  };

  return (
    <div className="account-page">
      <Navbar />

      <main className="account-layout">
        <aside className="account-story">
          <div
            aria-hidden="true"
            className="account-story__art"
            style={{ backgroundImage: `url("${heroMovies[1].backdrop}")` }}
          />
          <div aria-hidden="true" className="account-story__frames">
            {heroMovies.slice(1).map((movie, index) => (
              <figure
                className={`account-story__frame account-story__frame--${index + 1}`}
                key={movie.id}
              >
                <img alt="" src={movie.poster} />
              </figure>
            ))}
          </div>
          <div className="account-story__content">
            <span className="eyebrow">A LITTLE LESS SCROLLING</span>
            <h1>
              Stories worth
              <br />
              <em>staying for.</em>
            </h1>
            <p>
              Your next favorite film is out there. Keep the good ones close and
              find something new for tonight.
            </p>
            <div className="account-story__collection">
              <span className="account-story__collection-mark">✦</span>
              <span>
                <strong>THE ETFLIX COLLECTION</strong>
                <small>Handpicked for your next movie night</small>
              </span>
            </div>
            <div className="account-story__signature">
              <span className="account-story__signature-line" />
              <span>THE ETFLIX EDIT</span>
            </div>
          </div>
          <div aria-hidden="true" className="account-story__index">
            <span>ETFLIX</span>
            <span>01 — 04</span>
          </div>
        </aside>

        <section aria-labelledby="account-title" className="account-card">
          <span className="eyebrow">
            {isSignUp ? "MAKE IT YOURS" : "GOOD TO HAVE YOU BACK"}
          </span>
          <h2 id="account-title">
            {isSignUp ? "Join the story." : "Welcome back."}
          </h2>
          <p className="account-card__intro">
            {isSignUp
              ? "Create your EtFlix account and keep your favorites close."
              : "Sign in to pick up where your next movie night begins."}
          </p>

          <form className="account-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <label className="account-form__field">
                <span>Your name</span>
                <input
                  autoComplete="name"
                  name="name"
                  placeholder="Alex Morgan"
                  required
                  type="text"
                />
              </label>
            )}

            <label className="account-form__field">
              <span>Email address</span>
              <input
                autoComplete="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>

            <label className="account-form__field">
              <span>Password</span>
              <input
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength="8"
                name="password"
                placeholder="At least 8 characters"
                required
                type="password"
              />
            </label>

            {isSignUp && (
              <label className="account-form__field">
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  minLength="8"
                  name="confirm-password"
                  placeholder="Enter your password again"
                  required
                  type="password"
                />
              </label>
            )}

            {!isSignUp && (
              <label className="account-form__remember">
                <input name="remember" type="checkbox" />
                <span>Keep me signed in on this device</span>
              </label>
            )}

            <button className="account-form__submit" type="submit">
              <span>{isSignUp ? "Create your account" : "Sign in"}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          {message && (
            <p
              aria-live="polite"
              className="account-form__message"
              role="status"
            >
              {message}
            </p>
          )}

          <p className="account-card__switch">
            {isSignUp ? "Already have an account?" : "New to EtFlix?"}{" "}
            <Link to={isSignUp ? "/signin" : "/signup"}>
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>

          <p className="account-card__notice">
            Account access is a preview; authentication is not connected yet.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AccountPage;
