import Brand from "./Brand";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__brand">
          <Brand className="footer__brand-link" />
          <p>Stories that stay with you.</p>
          <span className="footer__brand-note">
            Thoughtfully picked. Always worth the watch.
          </span>
        </div>

        <div className="footer__links">
          <div>
            <span className="footer__heading">EXPLORE</span>
            <a href="#movies">Browse the collection</a>
            <a href="#genres">Browse genres</a>
          </div>
          <div>
            <span className="footer__heading">ETFLIX</span>
            <a href="#about">Our story</a>
            <a href="#home">Back to top ↑</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} EtFlix. Made for movie lovers.</span>
        <a className="footer__back-to-top" href="#home">
          Back to the beginning <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
