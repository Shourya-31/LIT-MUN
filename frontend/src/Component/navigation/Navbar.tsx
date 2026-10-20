import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useMagneticPointer } from '../../hooks/useMagneticPointer';
import './Navbar.css';

type PortalTab = 'landing' | 'registration' | 'signin' | 'signup';

export interface NavbarProps {
  activeTab: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
}

const navItems: { label: string; tab: PortalTab }[] = [
  { label: 'Home', tab: 'landing' },
  { label: 'Registration', tab: 'registration' },
  { label: 'Sign In', tab: 'signin' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const accountButtonRef = useMagneticPointer<HTMLButtonElement>(0.055);
  const reduceMotion = useReducedMotion() === true;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const selectTab = (tab: PortalTab) => {
    setMenuOpen(false);
    onSelectTab(tab);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: reduceMotion ? 0 : -8,
      transition: { duration: reduceMotion ? 0 : 0.16 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.2, staggerChildren: reduceMotion ? 0 : 0.045 },
    },
  };
  const itemVariants = {
    closed: { opacity: 0, x: reduceMotion ? 0 : -8 },
    open: { opacity: 1, x: 0, transition: { duration: reduceMotion ? 0 : 0.16 } },
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        <button
          type="button"
          className="navbar-brand"
          onClick={() => selectTab('landing')}
          aria-label="LIT-MUN home"
        >
          <span className="brand-mark" aria-hidden="true">L</span>
          <span className="brand-text">
            <span className="brand-title">LIT-MUN</span>
            <span className="brand-subtitle">Model United Nations</span>
          </span>
        </button>

        <nav className="navbar-nav" id="portal-navigation-desktop" aria-label="Main navigation">
          {navItems.map(({ label, tab }) => (
            <button
              key={tab}
              type="button"
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => selectTab(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {label}
              {activeTab === tab && (
                <motion.span
                  className="nav-active-indicator"
                  layoutId="navbar-active-indicator"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
          <button
            ref={accountButtonRef}
            type="button"
            className={`nav-cta magnetic-button ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => selectTab('signup')}
            aria-current={activeTab === 'signup' ? 'page' : undefined}
          >
            <span>Create Account</span>
          </button>
        </nav>

        <div className="navbar-mobile-menu-host" id="portal-navigation">
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                className="navbar-mobile-menu"
                aria-label="Mobile navigation"
                initial={reduceMotion ? false : 'closed'}
                animate="open"
                exit="closed"
                variants={menuVariants}
              >
                {navItems.map(({ label, tab }) => (
                  <motion.button
                    key={tab}
                    type="button"
                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => selectTab(tab)}
                    aria-current={activeTab === tab ? 'page' : undefined}
                    variants={itemVariants}
                  >
                    {label}
                  </motion.button>
                ))}
                <motion.button
                  type="button"
                  className={`nav-cta ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => selectTab('signup')}
                  aria-current={activeTab === 'signup' ? 'page' : undefined}
                  variants={itemVariants}
                >
                  <span>Create Account</span>
                </motion.button>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="navbar-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="portal-navigation"
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
