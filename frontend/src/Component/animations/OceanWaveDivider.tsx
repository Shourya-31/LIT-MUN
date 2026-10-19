import React from 'react';

export const OceanWaveDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`relative z-10 w-full leading-none -mb-[1px] overflow-hidden ${className}`}>
            <svg
                viewBox="0 0 1440 200"
                fill="none"
                className="block w-full h-24 md:h-36 lg:h-44"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="oceanFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#142c4f" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0B1F3A" stopOpacity="1" />
                    </linearGradient>

                    <linearGradient id="oceanMidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0.8" />
                    </linearGradient>

                    <linearGradient id="cyanCrest" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                        <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#D4AF69" stopOpacity="0.4" />
                    </linearGradient>
                </defs>

                <path
                    d="M0,110 C220,50 440,150 720,80 C980,20 1220,130 1440,70 L1440,200 L0,200 Z"
                    fill="rgba(14, 165, 233, 0.12)"
                />

                <path
                    d="M0,130 C190,80 460,160 760,100 C1060,50 1280,140 1440,95 L1440,200 L0,200 Z"
                    fill="url(#oceanMidGrad)"
                />
                <path
                    d="M0,130 C190,80 460,160 760,100 C1060,50 1280,140 1440,95"
                    stroke="rgba(56, 189, 248, 0.35)"
                    strokeWidth="1.2"
                    fill="none"
                />

                <path
                    d="M0,150 C260,100 500,175 780,125 C1040,80 1260,160 1440,120 L1440,200 L0,200 Z"
                    fill="url(#oceanFrontGrad)"
                />
                <path
                    d="M0,150 C260,100 500,175 780,125 C1040,80 1260,160 1440,120"
                    stroke="url(#cyanCrest)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                />
            </svg>
        </div>
    );
};

export default OceanWaveDivider;
