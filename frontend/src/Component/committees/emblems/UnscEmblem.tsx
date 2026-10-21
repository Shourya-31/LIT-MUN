import React from 'react';
import LaurelWreath from './LaurelWreath';

interface EmblemProps {
  className?: string;
}

export const UnscEmblem: React.FC<EmblemProps> = ({ className = 'committee-emblem-svg' }) => {
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

      {/* UNSC Peace Dove Motif */}
      <g className="unsc-peace-dove" fill="currentColor">
        {/* Dove Torso, Breast, Head & Tail */}
        <path d="M148 108 c3-1 6 0 8 2 2 2 3 4 2 6 -2 3 -5 4 -8 4 -4 0 -8-2 -10-5 -4 5 -10 9 -16 12 -5 2 -11 3 -16 3 -7 0 -14-2 -20-5 -6-4 -11-9 -14-15 4 1 8 1 12 0 6-1 12-4 17-8 4-3 7-7 10-11 5-2 10-3 15-2 4 1 8 3 11 6 3 3 7 7 11 10 z" />

        {/* Lower Body & Fanning Tail Feathers */}
        <path d="M108 126 c-3 7-5 15-4 22 1 6 4 11 8 16 3 4 8 7 13 8 7 1 14-1 20-4 4-2 8-5 11-9 -4 1-8 1-12 0 -7-2 -13-6 -18-11 -4-5-7-12-8-19 -4-1-7-2-10-3 z" />
        <path d="M106 148 c-8 4-17 6-26 5 -5-1-10-3-14-6 6 1 12 0 17-2 6-2 11-6 15-10 3 3 5 8 8 13 z" />
        <path d="M110 156 c-7 6-16 10-25 12 -5 1-10 0-15-2 6 0 12-2 17-5 6-4 10-8 13-14 3 3 6 6 10 9 z" />
        <path d="M117 163 c-5 7-12 13-20 17 -5 2-10 3-15 1 5-1 10-4 14-8 5-5 8-11 10-18 4 3 7 6 11 8 z" />

        {/* Soaring Primary Wings (Layered Graceful Feathers) */}
        {/* Feather 1 (Leading Wing Feather) */}
        <path d="M112 120 C122 96, 138 72, 158 52 C155 58, 146 72, 136 90 C128 102, 122 114, 118 124 Z" />
        {/* Feather 2 */}
        <path d="M106 122 C114 98, 126 74, 144 56 C141 62, 132 76, 124 92 C118 104, 114 116, 110 126 Z" />
        {/* Feather 3 */}
        <path d="M100 124 C106 102, 116 80, 130 64 C128 70, 120 82, 114 96 C108 108, 105 118, 103 128 Z" />
        {/* Feather 4 */}
        <path d="M95 126 C98 106, 106 88, 118 74 C116 80, 110 90, 104 102 C100 112, 97 121, 96 130 Z" />
        {/* Feather 5 (Trailing Feather) */}
        <path d="M90 128 C92 112, 97 98, 106 86 C104 92, 100 100, 96 110 C93 118, 91 125, 90 132 Z" />

        {/* Dove Beak Holding Olive Branch */}
        <path d="M156 112 l10 -3 -5 6 z" />

        {/* Olive Branch Sprig */}
        <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M162 113 C168 111, 175 107, 182 101" />
        </g>
        {/* Delicate Olive Leaves on Sprig */}
        <path d="M167 111 C168 107, 172 104, 176 104 C175 107, 173 111, 169 112 Z" />
        <path d="M174 107 C177 104, 182 103, 186 105 C184 108, 180 110, 176 109 Z" />
        <path d="M178 102 C181 97, 186 95, 190 97 C188 100, 184 103, 180 103 Z" />
        <path d="M169 113 C172 116, 175 120, 175 124 C172 123, 170 120, 168 115 Z" />
      </g>
    </svg>
  );
};

export default UnscEmblem;
