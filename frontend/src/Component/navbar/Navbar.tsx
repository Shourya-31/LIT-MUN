import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
    onNavigateToPortal: (view: 'registration' | 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToPortal }) => {
    const [isScrolled, setIsScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 20);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Schedule', href: '#schedule' },
        { label: 'Resources', href: '#resources' },
        { label: 'Gallery', href: '#gallery' },
        { label: 'FAQs', href: '#faq' },
    ];

    return (
        <header
            data-scrolled={isScrolled}
            onKeyDown={(event) => {
                if (event.key === 'Escape' && mobileMenuOpen) {
                    setMobileMenuOpen(false);
                    document.getElementById('conference-menu-toggle')?.focus();
                }
            }}
            className={`litmun-section-navbar fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#0B1F3A]/90 backdrop-blur-md py-3.5 border-b border-[#D4AF69]/20 shadow-[0_4px_25px_rgba(0,0,0,0.35)]'
                : 'bg-transparent py-5 md:py-6 border-b border-transparent'
                }`}
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-8 flex items-center justify-between">

                {/* Brand Logo */}
                <a href="#home" className="flex items-center gap-3 group">
                    <svg className="w-10 h-10 transition-transform group-hover:scale-105" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <circle cx="50" cy="50" r="42" stroke="#D4AF69" strokeWidth="2.5" />
                        <ellipse cx="50" cy="50" rx="30" ry="42" stroke="#D4AF69" strokeWidth="1.8" />
                        <ellipse cx="50" cy="50" rx="16" ry="42" stroke="#D4AF69" strokeWidth="1.5" />
                        <line x1="8" y1="50" x2="92" y2="50" stroke="#D4AF69" strokeWidth="2" />
                        <line x1="18" y1="30" x2="82" y2="30" stroke="#D4AF69" strokeWidth="1.5" />
                        <line x1="18" y1="70" x2="82" y2="70" stroke="#D4AF69" strokeWidth="1.5" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="font-serif text-2xl font-bold tracking-widest text-ivory leading-none">
                            LIT-MUN
                        </span>
                    </div>
                </a>

                <nav className="hidden xl:flex items-center gap-6" aria-label="Conference sections">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-ivory/85 hover:text-gold transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-gold after:transition-all after:duration-200"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <button type="button" className="hidden xl:block text-sm text-ivory hover:text-gold transition-colors" onClick={() => onNavigateToPortal('signin')}>Sign In</button>
                    <button type="button" className="hidden xl:block text-sm text-ivory hover:text-gold transition-colors" onClick={() => onNavigateToPortal('signup')}>Sign Up</button>
                    <button
                        type="button"
                        onClick={() => onNavigateToPortal('registration')}
                        className="landing-register-button inline-flex items-center gap-1.5 bg-gold text-navy font-semibold text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:brightness-110 hover:-translate-y-0.5 transition-all"
                    >
                        <span>Register</span>
                        <ArrowRight size={14} aria-hidden="true" />
                    </button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        type="button"
                        id="conference-menu-toggle"
                        className="xl:hidden text-ivory hover:text-gold p-2 transition-colors"
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="conference-mobile-menu"
                    >
                        {mobileMenuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div id="conference-mobile-menu" className="xl:hidden bg-[#0B1F3A]/98 backdrop-blur-xl border-b border-[#D4AF69]/20 px-6 py-6 transition-all animate-fadeIn">
                    <nav className="flex flex-col gap-2" aria-label="Mobile conference sections">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-base font-medium text-ivory/90 hover:text-gold py-2.5 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="flex gap-6 border-t border-gold/20 pt-3 mt-2">
                            <button type="button" className="py-2 text-ivory hover:text-gold" onClick={() => { setMobileMenuOpen(false); onNavigateToPortal('signin'); }}>Sign In</button>
                            <button type="button" className="py-2 text-ivory hover:text-gold" onClick={() => { setMobileMenuOpen(false); onNavigateToPortal('signup'); }}>Sign Up</button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
