import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
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
        { label: 'Committees', href: '#committees' },
        { label: 'Events', href: '#events' },
        { label: 'FAQs', href: '#faq' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
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

                <nav className="hidden md:flex items-center gap-8">
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
                    <a
                        href="#register"
                        className="inline-flex items-center gap-1.5 bg-gold text-navy font-semibold text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgba(212,175,105,0.25)]"
                    >
                        <span>Register Now</span>
                        <ArrowRight size={14} />
                    </a>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-ivory hover:text-gold p-1 transition-colors focus:outline-none"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0B1F3A]/98 backdrop-blur-xl border-b border-[#D4AF69]/20 px-6 py-6 transition-all animate-fadeIn">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-base font-medium text-ivory/90 hover:text-gold py-1 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
