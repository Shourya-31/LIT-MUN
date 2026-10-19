import React, { useEffect, useState } from 'react';

export const WaterPulseProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                const currentProgress = (window.scrollY / totalScroll) * 100;
                setProgress(Math.min(100, Math.max(0, currentProgress)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] z-[100] pointer-events-none bg-slate-900/30 backdrop-blur-xs">

            <div
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-[#D4AF69] transition-[width] duration-150 ease-out relative"
                style={{ width: `${progress}%` }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(56,189,248,0.9)] animate-pulse" />
            </div>
        </div>
    );
};

export default WaterPulseProgress;
