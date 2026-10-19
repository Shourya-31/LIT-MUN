import React from 'react';
import FAQ from '../../Component/faq/FAQ';
import About from '../../Component/about/About';

export const LandingPage: React.FC = () => {
    return (
        <main className="litmun-home-preview">
            <About />
            <FAQ />
        </main>
    );
};

export default LandingPage;
