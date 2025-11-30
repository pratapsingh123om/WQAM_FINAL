

// FRONTEND/frontend/src/components/DashboardAnimation.jsx
import React from 'react';

export default function DashboardAnimation({ small = false, className = '', style = {} }) {
  return (
    <div
      className={`wqam-animation-root ${small ? 'small' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="wqam-waves">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#59C3C3" />
            <stop offset="100%" stopColor="#3A9AB7" />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#7BDFF0" />
            <stop offset="100%" stopColor="#4AB5D6" />
          </linearGradient>
        </defs>

        {/* Back wave (slow) */}
        <g className="wave wave--back">
          <path
            d="M0 120 C 150 90 350 150 500 120 C 650 90 800 140 950 120 L 950 200 L 0 200 Z"
            fill="url(#g2)"
            opacity="0.9"
          />
        </g>

        {/* Front wave (faster) */}
        <g className="wave wave--front">
          <path
            d="M0 140 C 120 110 320 170 480 140 C 640 110 820 160 1000 140 L 1000 200 L 0 200 Z"
            fill="url(#g1)"
            opacity="0.95"
          />
        </g>

        {/* Droplet (center) */}
        <g className="droplet" transform="translate(400,60)">
          <ellipse cx="0" cy="0" rx="8" ry="12" fill="#ffffff" opacity="0.95" />
          <circle cx="-3" cy="-4" r="2.2" fill="#ffffff" opacity="0.7" />
        </g>

        {/* Bubbles (left/right) */}
        <g className="bubbles">
          <circle className="b" cx="120" cy="160" r="4" fill="#ffffff" opacity="0.7" />
          <circle className="b" cx="200" cy="170" r="6" fill="#ffffff" opacity="0.5" />
          <circle className="b" cx="680" cy="155" r="5" fill="#ffffff" opacity="0.6" />
        </g>
      </svg>

      {/* Small, friendly headline to pair with dashboard UI */}
      <div className="wqam-anim-text">
        <div className="title">Welcome to WQAM</div>
        <div className="subtitle">Real-time water quality monitoring</div>
      </div>

      <style>{`
        .wqam-animation-root {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          border-radius: 12px;
          background: linear-gradient(180deg,#eafcff 0%, #d4f7ff 60%);
          box-shadow: 0 6px 18px rgba(10,40,60,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wqam-animation-root.small { height: 140px }
        .wqam-waves { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; }

        /* Waves movement using transform animation */
        .wave { transform-origin: 50% 50%; }
        .wave--back { animation: move-back 8s linear infinite; }
        .wave--front { animation: move-front 5s linear infinite; }

        @keyframes move-back {
          0% { transform: translateX(0px); }
          100% { transform: translateX(-250px); }
        }
        @keyframes move-front {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-120px) translateY(3px); }
          100% { transform: translateX(-240px) translateY(0px); }
        }

        /* Droplet bounce */
        .droplet { animation: drop-bounce 1.9s ease-in-out infinite; }
        @keyframes drop-bounce {
          0% { transform: translate(400px, 40px) scale(1); opacity: 0.95 }
          40% { transform: translate(400px, 70px) scale(0.95); opacity: 0.9 }
          70% { transform: translate(400px, 90px) scale(0.85); opacity: 0.6 }
          100% { transform: translate(400px, 40px) scale(1); opacity: 0.95 }
        }

        /* Bubbles rising */
        .bubbles .b { animation: bubble 6s linear infinite; }
        .bubbles .b:nth-child(1) { animation-delay: 0s; }
        .bubbles .b:nth-child(2) { animation-delay: 1.2s; }
        .bubbles .b:nth-child(3) { animation-delay: 2.6s; }
        @keyframes bubble {
          0% { transform: translateY(0) scale(0.8); opacity: 0.6 }
          50% { transform: translateY(-18px) scale(1); opacity: 0.9 }
          100% { transform: translateY(-36px) scale(0.9); opacity: 0.3 }
        }

        /* Text overlay */
        .wqam-anim-text {
          position: relative;
          z-index: 3;
          text-align: center;
          pointer-events: none;
        }
        .wqam-anim-text .title { font-size: 18px; font-weight: 700; color: #033a4b; }
        .wqam-anim-text .subtitle { font-size: 12px; color: #075e6b; opacity: 0.9; margin-top: 6px }

        /* responsive tweaks */
        @media (max-width: 640px) {
          .wqam-animation-root { height: 160px }
          .wqam-anim-text .title { font-size: 16px }
        }
      `}</style>
    </div>
  )
}