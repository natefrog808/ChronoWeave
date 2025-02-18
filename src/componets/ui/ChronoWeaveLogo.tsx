// Save as: src/components/ChronoWeaveLogo.tsx

import React from 'react';

const ChronoWeaveLogo: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" className="w-full h-full">
      <defs>
        <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }}>
            <animate
              attributeName="stop-color"
              values="#4F46E5; #9333EA; #4F46E5"
              dur="6s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" style={{ stopColor: '#9333EA', stopOpacity: 1 }}>
            <animate
              attributeName="stop-color"
              values="#9333EA; #4F46E5; #9333EA"
              dur="6s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(200, 100)">
        <circle
          r="80"
          fill="url(#timeGradient)"
          filter="url(#glow)"
        >
          <animate
            attributeName="r"
            values="80;85;80"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        <path
          d="M-60,-60 C-40,-20 40,-20 60,-60"
          stroke="url(#timeGradient)"
          fill="none"
          strokeWidth="3"
          filter="url(#glow)"
        >
          <animate
            attributeName="d"
            values="M-60,-60 C-40,-20 40,-20 60,-60;
                    M-60,60 C-40,20 40,20 60,60;
                    M-60,-60 C-40,-20 40,-20 60,-60"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      <text
        x="200"
        y="160"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fill="#4F46E5"
        textAnchor="middle"
        filter="url(#glow)"
      >
        ChronoWeave
        <animate
          attributeName="fill"
          values="#4F46E5;#9333EA;#4F46E5"
          dur="6s"
          repeatCount="indefinite"
        />
      </text>
    </svg>
  );
};

export default ChronoWeaveLogo;
