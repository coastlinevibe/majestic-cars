import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse cars', path: '/inventory' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/20 shadow-lg' 
        : 'bg-[#0a0a0a] border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-[70px]' : 'h-[90px]'
        }`}>
          {/* Logo - Responsive sizing */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img 
              src="/website logo.png" 
              alt="Majestic Cars Logo"
              width="70"
              height="70"
              className={`transition-all duration-300 ${
                scrolled ? 'h-[58px]' : 'h-[70px]'
              }`}
            />
            <div className="flex flex-col">
              <span className={`text-white font-bold tracking-tight leading-none transition-all duration-300 ${
                scrolled ? 'text-base' : 'text-base sm:text-lg'
              }`}>
                Majesticars
              </span>
              <span className={`text-primary font-semibold tracking-widest uppercase transition-all duration-300 ${
                scrolled ? 'text-[10px]' : 'text-xs'
              }`}>
                Sinoville
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Adaptive spacing */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 xl:px-5 py-2 rounded-[9px] text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Tablet Navigation - Simplified */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-[9px] text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons - Responsive */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <a
              href="tel:0608579146"
              className="hidden xl:flex items-center gap-2 text-white/80 hover:text-primary transition-colors text-sm"
            >
              <Phone size={16} />
              <span>060 857 9146</span>
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white/80 hover:text-primary hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button asChild size={scrolled ? "sm" : "default"} className="transition-all duration-300">
              <Link to="/inventory">
                <span className="hidden xl:inline">Browse cars</span>
                <span className="xl:hidden">Browse cars</span>
              </Link>
            </Button>
          </div>

          {/* Tablet CTA Buttons */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white/80 hover:text-primary hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button asChild size="sm">
              <Link to="/inventory">Browse cars</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white/80 hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-[9px] text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Contact */}
              <a
                href="tel:0608579146"
                className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-primary transition-colors text-sm border-t border-white/10 mt-2 pt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone size={16} />
                <span>060 857 9146</span>
              </a>
              
              {/* Mobile CTA */}
              <div className="px-4 pt-2">
                <Button asChild className="w-full">
                  <Link to="/inventory" onClick={() => setIsMenuOpen(false)}>
                    Browse cars
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
