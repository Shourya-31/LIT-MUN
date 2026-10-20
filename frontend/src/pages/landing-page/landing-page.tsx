import React from 'react';
import { Navbar, Hero, About, FAQ, Contact } from '../../Component';
import { WaterPulseProgress, ScrollReveal } from '../../Component/animations';

export const LandingPage: React.FC = () => {
    return (
        <main className="litmun-home-preview relative">
            <WaterPulseProgress />
            <Navbar />
            <Hero />

            <ScrollReveal delay={150}>
                <About />
            </ScrollReveal>

            <ScrollReveal delay={150}>
                <FAQ />
            </ScrollReveal>

            <ScrollReveal delay={150}>
                <Contact />
            </ScrollReveal>
        </main>
    );
};

export default LandingPage;
