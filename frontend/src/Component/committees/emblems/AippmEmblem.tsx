import React from 'react';
import LaurelWreath from './LaurelWreath';

interface EmblemProps {
  className?: string;
}

export const AippmEmblem: React.FC<EmblemProps> = ({ className = 'committee-emblem-svg' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Universal Laurel Wreath */}
      <LaurelWreath />

      {/* AIPPM Center Motif: Indian Parliament (Sansad Bhavan) & Ashoka Lion Capital */}
      <g className="aippm-motif" fill="currentColor">
        {/* --- Sansad Bhavan Base & Colonnade --- */}
        {/* Stepped Plinth Foundation */}
        <rect x="68" y="172" width="104" height="2.5" rx="1" />
        <rect x="72" y="168" width="96" height="2.5" rx="1" />
        <rect x="76" y="165" width="88" height="2" rx="0.8" />

        {/* Vertical Colonnade Pillars with Crisp Spacing */}
        <rect x="80" y="148" width="2" height="15" rx="0.5" />
        <rect x="86" y="148" width="2" height="15" rx="0.5" />
        <rect x="92" y="148" width="2" height="15" rx="0.5" />
        <rect x="98" y="148" width="2" height="15" rx="0.5" />
        <rect x="104" y="148" width="2" height="15" rx="0.5" />
        <rect x="110" y="148" width="2" height="15" rx="0.5" />
        <rect x="116" y="148" width="2" height="15" rx="0.5" />
        <rect x="122" y="148" width="2" height="15" rx="0.5" />
        <rect x="128" y="148" width="2" height="15" rx="0.5" />
        <rect x="134" y="148" width="2" height="15" rx="0.5" />
        <rect x="140" y="148" width="2" height="15" rx="0.5" />
        <rect x="146" y="148" width="2" height="15" rx="0.5" />
        <rect x="152" y="148" width="2" height="15" rx="0.5" />
        <rect x="158" y="148" width="2" height="15" rx="0.5" />

        {/* Roof Cornice / Architrave */}
        <rect x="76" y="144" width="88" height="2.5" rx="1" />
        <rect x="79" y="141" width="82" height="2" rx="0.8" />

        {/* Central Rotunda Dome */}
        <path d="M102 139 C102 131, 110 125, 120 125 C130 125, 138 131, 138 139 Z" />

        {/* --- Ashoka Lion Capital (Emblem of India) --- */}
        {/* Abacus Base with Ashoka Chakra */}
        <rect x="105" y="122" width="30" height="3" rx="0.8" />
        <circle cx="120" cy="116" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="120" cy="116" r="1.5" />
        {/* Chakra mini spokes */}
        <line x1="120" y1="112" x2="120" y2="120" stroke="currentColor" strokeWidth="0.8" />
        <line x1="116" y1="116" x2="124" y2="116" stroke="currentColor" strokeWidth="0.8" />

        {/* Abacus Relief Animals (Side flourishes) */}
        <path d="M107 116 c-1 0 -2 1 -3 1 v-2 c1 0 2 0 3 1 z" />
        <path d="M133 116 c1 0 2 1 3 1 v-2 c-1 0 -2 0 -3 1 z" />

        {/* Central Guardian Lion */}
        {/* Head & Alert Ears */}
        <path d="M120 78 C115 78, 112 82, 112 87 C112 92, 115 96, 120 96 C125 96, 128 92, 128 87 C128 82, 125 78, 120 78 Z" />
        <path d="M113 78 C112 75, 113 73, 115 73 C116 75, 115 77, 113 78 Z" />
        <path d="M127 78 C128 75, 127 73, 125 73 C124 75, 125 77, 127 78 Z" />

        {/* Mane Curls & Torso */}
        <path d="M116 96 C112 99, 111 104, 113 110 C116 112, 124 112, 127 110 C129 104, 128 99, 124 96 Z" />
        <path d="M113 90 C110 93, 108 97, 108 102 C110 104, 112 105, 114 103 C113 99, 113 95, 113 90 Z" />
        <path d="M127 90 C130 93, 132 97, 132 102 C130 104, 128 105, 126 103 C127 99, 127 95, 127 90 Z" />

        {/* Left Profile Lion */}
        <path d="M111 82 C108 83, 105 85, 104 88 C103 91, 104 94, 107 95 C107 93, 108 90, 110 88 Z" />
        <path d="M104 87 C101 87, 99 89, 99 92 C101 93, 103 93, 104 91 Z" />
        <path d="M106 96 C103 99, 103 103, 105 107 C107 105, 107 102, 107 99 Z" />

        {/* Right Profile Lion */}
        <path d="M129 82 C132 83, 135 85, 136 88 C137 91, 136 94, 133 95 C133 93, 132 90, 130 88 Z" />
        <path d="M136 87 C139 87, 141 89, 141 92 C139 93, 137 93, 136 91 Z" />
        <path d="M134 96 C137 99, 137 103, 135 107 C133 105, 133 102, 133 99 Z" />
      </g>
    </svg>
  );
};

export default AippmEmblem;
