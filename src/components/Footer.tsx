import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy" },
    ],
    browse: [
      { title: "Movies", href: "/category/phim-le" },
      { title: "TV Series", href: "/category/phim-bo" },
      { title: "Anime", href: "/category/hoat-hinh" },
      { title: "Top IMDb", href: "/category/phim-chieu-rap" },
    ],
    genre: [
      { title: "Action", href: "/genre/action" },
      { title: "Comedy", href: "/genre/comedy" },
      { title: "Drama", href: "/genre/drama" },
      { title: "Horror", href: "/genre/horror" },
      { title: "Sci-Fi", href: "/genre/sci-fi" },
    ],
  };

  return (
    <footer className="bg-card/50 border-t border-border/40 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-foreground">
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  M
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">Movie<span className="text-primary">Flex</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover and watch thousands of movies and TV shows in high quality.
              The ultimate streaming platform for all your entertainment needs.
            </p>

            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-full p-2 bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="rounded-full p-2 bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <FiTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full p-2 bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <FiFacebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full p-2 bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <FiInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full p-2 bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <FiYoutube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold after:content-[''] after:block after:w-10 after:h-0.5 after:bg-primary after:mt-2">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold after:content-[''] after:block after:w-10 after:h-0.5 after:bg-primary after:mt-2">
              Browse
            </h3>
            <ul className="space-y-3">
              {footerLinks.browse.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genre Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold after:content-[''] after:block after:w-10 after:h-0.5 after:bg-primary after:mt-2">
              Genres
            </h3>
            <ul className="space-y-3">
              {footerLinks.genre.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border/20 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} MovieFlex. All rights reserved. This site does not store any files on its server.</p>
        </div>
      </div>
    </footer>
  );
}