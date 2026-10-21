import React from 'react';
import LaurelWreath from './LaurelWreath';

interface EmblemProps {
  className?: string;
}

export const UnhrcEmblem: React.FC<EmblemProps> = ({ className = 'committee-emblem-svg' }) => {
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

      {/* UN Globe Grid Background Projection */}
      <g className="un-globe-grid" stroke="currentColor" fill="none">
        <circle cx="120" cy="120" r="56" strokeWidth="1.1" opacity="0.3" />
        <circle cx="120" cy="120" r="42" strokeWidth="1.1" opacity="0.35" />
        <circle cx="120" cy="120" r="28" strokeWidth="1" opacity="0.4" />
        <circle cx="120" cy="120" r="14" strokeWidth="0.9" opacity="0.45" />

        <line x1="120" y1="64" x2="120" y2="176" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
        <line x1="64" y1="120" x2="176" y2="120" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
        <line x1="80" y1="80" x2="160" y2="160" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.3" />
        <line x1="80" y1="160" x2="160" y2="80" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.3" />
      </g>

      {/* Official UN Human Rights Council Emblem: Soaring Dove / Human Hand Motif */}
      <g className="unhrc-motif" fill="currentColor">
        {/* Palm & Wrist Base */}
        <path d="M114 172 C111 162, 110 152, 114 144 C118 144, 122 144, 126 144 C130 152, 129 162, 126 172 Z" />

        {/* 4 Soaring Finger Feathers with crisp negative space cutouts */}
        {/* Feather 1 (Index Finger / Leftmost) */}
        <path d="M112 142 C106 130, 98 114, 94 96 C98 96, 106 106, 112 120 C114 126, 116 134, 116 142 Z" />
        {/* Feather 2 (Middle Finger / Upper-Left) */}
        <path d="M118 140 C116 122, 114 102, 112 78 C117 80, 124 96, 126 114 C126 124, 125 132, 123 140 Z" />
        {/* Feather 3 (Ring Finger / Upper-Right) */}
        <path d="M125 140 C128 124, 134 104, 138 84 C142 88, 144 104, 140 120 C138 128, 134 135, 130 140 Z" />
        {/* Feather 4 (Little Finger / Rightmost Wing Feather) */}
        <path d="M132 142 C138 132, 148 116, 156 102 C158 106, 158 120, 152 130 C148 136, 142 141, 137 144 Z" />

        {/* Thumb transforming into Dove Breast, Neck, Head & Beak */}
        <path d="M126 148 C134 148, 144 146, 152 141 C158 137, 164 130, 169 124 C171 122, 174 124, 172 127 C168 134, 160 143, 152 148 C144 153, 134 155, 126 154 Z" />
        <path d="M168 122 C170 120, 173 120, 175 122 C177 124, 176 127, 173 128 C171 129, 169 127, 168 125 Z" />
        <path d="M174 123 l8 -2 -4 5 z" />

        {/* Olive Branch Sprig in Beak */}
        <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M178 124 C184 122, 190 118, 194 112" />
        </g>
        <path d="M182 122 C184 118, 188 116, 192 116 C190 119, 188 122, 184 123 Z" />
        <path d="M188 117 C191 113, 196 112, 199 114 C198 117, 194 119, 190 119 Z" />
        <path d="M184 124 C187 127, 190 131, 189 135 C186 134, 184 130, 183 126 Z" />
      </g>
    </svg>
  );
};

export default UnhrcEmblem;
