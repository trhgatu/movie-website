import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiSun, FiMoon, FiHome, FiFilm, FiTv, FiTrendingUp, FiGlobe } from "react-icons/fi";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { mode, setMode } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchVisible(false);
  }, [location]);

  // Auto focus search input when search becomes visible
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchVisible]);

  // Handle scroll event for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links with icons
  const navLinks = [
    { title: "Home", href: "/", icon: <FiHome className="h-4 w-4" /> },
    { title: "Movies", href: "/category/phim-le", icon: <FiFilm className="h-4 w-4" /> },
    { title: "TV Series", href: "/category/phim-bo", icon: <FiTv className="h-4 w-4" /> },
    { title: "Anime", href: "/category/hoat-hinh", icon: <FiGlobe className="h-4 w-4" /> },
    { title: "Top IMDb", href: "/category/phim-chieu-rap", icon: <FiTrendingUp className="h-4 w-4" /> },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchVisible(false);

      // Delay scroll to allow navigation to complete
      setTimeout(() => {
        const searchSection = document.getElementById('search-section');
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] transition-all duration-500",
          isScrolled || isMenuOpen
            ? "bg-background/90 backdrop-blur-lg shadow-md"
            : "bg-gradient-to-b from-black/80 via-black/50 to-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-10 group">
              <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary-foreground/80 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  M
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                Movie<span className="text-primary animate-pulse">Flex</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative group flex items-center gap-2",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground/80"
                  )}
                >
                  <span className="hidden lg:block">{link.icon}</span>
                  {link.title}
                  <span className={cn(
                    "absolute -bottom-2 left-0 h-0.5 bg-primary transition-all duration-300 rounded-full",
                    location.pathname === link.href
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  )}></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* New Releases Badge - Small Attention Grabber */}
              <Badge
                variant="default"
                className="hidden md:flex items-center gap-1 px-3 py-1 bg-primary/90 hover:bg-primary cursor-pointer animate-pulse"
                onClick={() => navigate('/category/phim-moi')}
              >
                New
              </Badge>

              {/* Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                aria-label="Search"
                className={cn(
                  "rounded-full h-10 w-10 hover:bg-primary/10 transition-colors",
                  isSearchVisible ? "text-primary bg-primary/10" : "hover:text-primary"
                )}
              >
                <FiSearch className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary"
              >
                {mode === "dark" ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className="h-5 w-5" />
                ) : (
                  <FiMenu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="container mx-auto px-4 pb-4 md:hidden overflow-hidden animate-slide-up">
            <div className="space-y-0 py-4 rounded-lg bg-black/60 border border-white/5 p-2 shadow-xl backdrop-blur-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all hover:bg-white/5",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80"
                  )}
                >
                  <span className="text-primary/80">{link.icon}</span>
                  {link.title}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-white/10">
                <Link
                  to="/search"
                  className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-foreground/80 transition-all hover:bg-white/5"
                >
                  <FiSearch className="h-4 w-4 text-primary/80" />
                  Search
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search bar dropdown - appears below navbar */}
      {isSearchVisible && (
        <div
          className="fixed left-0 right-0 bg-background/95 backdrop-blur-lg z-[90] shadow-lg border-b border-white/5 animate-slide-down"
          style={{ top: '5rem' }} // Position right under the navbar
        >
          <div className="container mx-auto py-4 px-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies, TV series, anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-lg bg-muted/30 border border-white/10 pl-12 pr-12 text-base focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button type="submit" className="rounded-lg px-8">
                Search
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-lg flex md:hidden"
                onClick={() => setIsSearchVisible(false)}
              >
                <FiX className="h-5 w-5" />
              </Button>
            </form>

            {/* Quick suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Action", "Romance", "Comedy", "Thriller", "Anime"].map((term, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                  onClick={() => {
                    setSearchQuery(term);
                    setTimeout(() => {
                      if (searchInputRef.current) searchInputRef.current.focus();
                    }, 100);
                  }}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page content spacer - adds padding when search is visible */}
      {isSearchVisible && <div className="h-32" />}
    </>
  );
}