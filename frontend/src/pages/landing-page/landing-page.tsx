import React from 'react';
import Navbar from '../../Component/navbar/Navbar';
import Hero from '../../Component/hero/Hero';
import FAQ from '../../Component/faq/FAQ';
import About from '../../Component/about/About';
import WaterPulseProgress from '../../Component/animations/WaterPulseProgress';
import ScrollReveal from '../../Component/animations/ScrollReveal';
import Schedule from '../../Component/schedule/Schedule';
import Resources from '../../Component/resources/Resources';
import Gallery from '../../Component/gallery/Gallery';

interface LandingPageProps {
    onNavigateToPortal: (view: 'registration' | 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToPortal }) => {
    return (
        <main className="litmun-home-preview relative">
            <WaterPulseProgress />
            <Navbar onNavigateToPortal={onNavigateToPortal} />
            <Hero onRegister={() => onNavigateToPortal('registration')} />

            <ScrollReveal delay={150}>
                <About />
            </ScrollReveal>

            <Schedule />
            <Resources />
            <Gallery />

            <ScrollReveal delay={150}>
                <FAQ />
            </ScrollReveal>
        </main>
    );
};

export default LandingPage;
