import React, { useState, useEffect } from 'react';
import { KairooLogo } from './KairooLogo';
import { ArrowRight, Menu, X, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenSignup,
  onOpenDemo,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 28);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#features', key: 'product' },
    { label: 'Solutions', href: '#succeed', key: 'solutions' },
    { label: 'Workflow', href: '#journey', key: 'workflow' },
    { label: 'AI Engine', href: '#ai', key: 'ai' },
    { label: 'Pricing & Plans', href: '/pricing', key: 'pricing', isRoute: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute?: boolean) => {
    if (isRoute || href.startsWith('/')) {
      return; // allow natural navigation
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/' + href;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF6F0]/85 backdrop-blur-md border-b border-[#0D2218]/8 shadow-[0_4px_20px_-4px_rgba(13,34,24,0.06)] py-3'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT: Kairoo Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2 group transition-opacity hover:opacity-90 focus:outline-none"
            aria-label="Kairoo CRM Home"
          >
            <KairooLogo size="md" variant="dark" />
          </a>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                className="relative text-sm font-bold tracking-tight text-[#1F2623]/80 hover:text-[#0D2218] transition-colors py-1 group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#BA5D38] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* RIGHT: Auth status aware buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <a
                href="/dashboard"
                className="text-xs font-extrabold text-[#0D2218] px-4 py-2 rounded-full border border-[#0D2218]/20 bg-[#0D2218]/5 hover:bg-[#0D2218]/10 transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Go to Workspace ({user?.name ? user.name.split(' ')[0] : 'Workspace'})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="text-sm font-bold text-[#1F2623] hover:text-[#0D2218] px-3 py-1.5 transition-colors focus:outline-none cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={onOpenSignup}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSignup}
              className="text-xs font-medium px-3 py-1.5 bg-[#0D2218] text-[#FAF6F0] rounded-full"
            >
              Get Started
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0D2218] hover:bg-[#0D2218]/5 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F0] border-b border-[#0D2218]/10 px-6 py-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                className="text-base font-bold text-[#1F2623] hover:text-[#BA5D38] py-1 border-b border-[#0D2218]/5"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full text-center py-2.5 text-sm font-medium text-[#1F2623] border border-[#0D2218]/15 rounded-lg hover:bg-white"
            >
              Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignup();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#FAF6F0] bg-[#0D2218] hover:bg-[#163827] rounded-lg shadow-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
