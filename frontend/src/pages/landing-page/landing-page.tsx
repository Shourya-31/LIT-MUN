import React from 'react';
import Navbar from '../../Component/navbar/Navbar';
import Hero from '../../Component/hero/Hero';
import FAQ from '../../Component/faq/FAQ';
import About from '../../Component/about/About';
import WaterPulseProgress from '../../Component/animations/WaterPulseProgress';
import ScrollReveal from '../../Component/animations/ScrollReveal';

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
        </main>
    );
};

export default LandingPage;
