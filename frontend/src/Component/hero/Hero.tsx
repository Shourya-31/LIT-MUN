import React from 'react';
import { ArrowRight } from 'lucide-react';
import OceanWaveDivider from '../animations/OceanWaveDivider';

export const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex flex-col justify-between pt-32 bg-navy overflow-hidden" id="home">

            <div
                className="absolute inset-0 z-0 bg-cover bg-right bg-no-repeat"
                style={{
                    backgroundImage: `
            linear-gradient(
      90deg,
      #0B1F3A 0%,
      rgba(11,31,58,0.97) 25%,
      rgba(11,31,58,0.82) 45%,
      rgba(11,31,58,0.42) 72%,
      rgba(11,31,58,0.20) 100%
    ),
    linear-gradient(
      180deg,
      rgba(11,31,58,0.35) 0%,
      transparent 35%,
      rgba(11,31,58,0.25) 70%,
      #0B1F3A 100%
    ),
            url('https://plus.unsplash.com/premium_photo-1683121190760-e8f42c972291?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D')
          `
                }}
            />

            <div className="relative z-10 max-w-[1320px] w-full mx-auto px-6 md:px-8 pt-12 pb-16">
                <div className="max-w-2xl">

                    <h1 className="font-serif text-5xl md:text-6xl font-semibold text-gold leading-[1.12] mb-6">
                        Model United Nations<br />
                    </h1>

                    <p className="font-sans text-base md:text-lg text-[#c4cede] leading-relaxed max-w-lg mb-9">
                        Step into the global arena. Engage in meaningful debates, build lasting
                        connections, and be a part of a movement that shapes a better tomorrow.
                    </p>

                    <div className="flex flex-wrap items-center gap-7">
                        <a
                            href="#register"
                            className="inline-flex items-center gap-2.5 bg-gold text-navy font-semibold text-sm md:text-base px-7 py-3 rounded hover:brightness-110 hover:-translate-y-1 transition-all shadow-[0_6px_20px_rgba(212,175,105,0.35)]"
                        >
                            <span>Register Now</span>
                            <ArrowRight size={17} />
                        </a>

                        <a
                            href="#about"
                            className="group inline-flex items-center gap-2 text-ivory font-medium text-sm md:text-base border-b border-ivory pb-0.5 hover:text-gold hover:border-gold transition-colors"
                        >
                            <span>Read Press Release</span>
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </div>

            <OceanWaveDivider />


        </section>
    );
};

export default Hero