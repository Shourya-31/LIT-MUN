
import { ArrowRight } from "lucide-react";

const Navbar = () => {
    return (
        <header className="absolute top-0 left-0 w-full z-50 py-6">
            <div className="max-w-[1320px] mx-auto px-6 md:px-8 flex items-center justify-between">

                <div className="flex items-center gap-3.5">
                    <svg className="w-11 h-11" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <circle cx="50" cy="50" r="42" stroke="#D4AF69" strokeWidth="2.5" />
                        <ellipse cx="50" cy="50" rx="30" ry="42" stroke="#D4AF69" strokeWidth="1.8" />
                        <ellipse cx="50" cy="50" rx="16" ry="42" stroke="#D4AF69" strokeWidth="1.5" />
                        <line x1="8" y1="50" x2="92" y2="50" stroke="#D4AF69" strokeWidth="2" />
                        <line x1="18" y1="30" x2="82" y2="30" stroke="#D4AF69" strokeWidth="1.5" />
                        <line x1="18" y1="70" x2="82" y2="70" stroke="#D4AF69" strokeWidth="1.5" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="font-serif text-2xl font-bold tracking-widest text-ivory leading-none">
                            MUN
                        </span>
                        <span className="font-sans text-[10px] font-semibold tracking-[0.28em] text-gold mt-1">
                            NIT RAIPUR
                        </span>
                    </div>
                </div>
                <nav className="hidden md:flex items-center gap-9">
                    <a href="#home" className="text-sm font-medium text-ivory relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-7 after:h-[2px] after:bg-gold after:rounded-full">
                        Home
                    </a>
                    <a href="#about" className="text-sm font-medium text-ivory/80 hover:text-gold transition-colors py-1">
                        About
                    </a>
                    <a href="#committees" className="text-sm font-medium text-ivory/80 hover:text-gold transition-colors py-1">
                        Committees
                    </a>
                    <a href="#events" className="text-sm font-medium text-ivory/80 hover:text-gold transition-colors py-1">
                        Events
                    </a>
                    <a href="#rules" className="text-sm font-medium text-ivory/80 hover:text-gold transition-colors py-1">
                        Rules
                    </a>
                    <a href="#faqs" className="text-sm font-medium text-ivory/80 hover:text-gold transition-colors py-1">
                        FAQs
                    </a>
                    <a href="#contact" className="text-sm font-medium text-ivory/80 hover:text-gold transition-colors py-1">
                        Contact
                    </a>
                </nav>
                <div>
                    <a
                        href="#register"
                        className="inline-flex items-center gap-2 bg-gold text-navy font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgba(212,175,105,0.3)]"
                    >
                        <span>Register Now</span>
                        <ArrowRight size={15} />
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
