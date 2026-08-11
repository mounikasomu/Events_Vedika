interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const BrandLogo = ({ size = 'md', showText = true }: BrandLogoProps) => {
  const iconDimensions = {
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 68, height: 68 }
  }[size];

  const textSize = {
    sm: '1.25rem',
    md: '1.65rem',
    lg: '2.5rem'
  }[size];

  return (
    <div className="brand-logo-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg 
        width={iconDimensions.width} 
        height={iconDimensions.height} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.12))' }}
      >
        {/* Outer Rainbow Canopy Tent Arcs */}
        <path d="M 30 140 C 40 80, 80 40, 100 25 C 120 40, 160 80, 170 140" stroke="url(#rainbow1)" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 45 140 C 55 90, 85 52, 100 38 C 115 52, 145 90, 155 140" stroke="url(#rainbow2)" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M 60 140 C 68 100, 90 65, 100 52 C 110 65, 132 100, 140 140" stroke="url(#rainbow3)" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Central Lotus Flower */}
        <path d="M 100 135 C 80 135, 70 120, 75 105 C 85 105, 95 120, 100 135 Z" fill="#ec4899" />
        <path d="M 100 135 C 120 135, 130 120, 125 105 C 115 105, 105 120, 100 135 Z" fill="#ec4899" />
        <path d="M 100 138 C 85 138, 78 125, 82 110 C 92 112, 98 125, 100 138 Z" fill="#f43f5e" />
        <path d="M 100 138 C 115 138, 122 125, 118 110 C 108 112, 102 125, 100 138 Z" fill="#f43f5e" />
        <path d="M 100 140 C 90 140, 82 100, 100 82 C 118 100, 110 140, 100 140 Z" fill="#e11d48" />
        <path d="M 100 95 C 96 110, 98 135, 100 138 C 102 135, 104 110, 100 95 Z" fill="#fef08a" />

        {/* Top Gold Star */}
        <polygon points="100,8 105,20 118,20 108,28 112,40 100,32 88,40 92,28 82,20 95,20" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />

        {/* Balloons */}
        <ellipse cx="32" cy="75" rx="10" ry="13" fill="#a855f7" />
        <path d="M 32 88 Q 30 105 34 120" stroke="#c084fc" strokeWidth="1.5" fill="none" />

        <ellipse cx="168" cy="80" rx="10" ry="13" fill="#f97316" />
        <path d="M 168 93 Q 170 110 166 125" stroke="#fb923c" strokeWidth="1.5" fill="none" />

        {/* Sparkles / Confetti Dots */}
        <circle cx="50" cy="45" r="3" fill="#06b6d4" />
        <circle cx="150" cy="45" r="3" fill="#10b981" />
        <circle cx="70" cy="30" r="2.5" fill="#f43f5e" />
        <circle cx="130" cy="30" r="2.5" fill="#8b5cf6" />
        <circle cx="90" cy="20" r="2" fill="#f59e0b" />
        <circle cx="110" cy="20" r="2" fill="#ec4899" />

        {/* Swash underline */}
        <path d="M 25 155 Q 100 175 175 155" stroke="url(#swashGradient)" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Gradients */}
        <defs>
          <linearGradient id="rainbow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#db2777" />
            <stop offset="20%" stopColor="#9333ea" />
            <stop offset="40%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#0d9488" />
            <stop offset="80%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="rainbow2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="rainbow3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="swashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#db2777" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span 
          style={{ 
            fontFamily: "'Caveat', 'Dancing Script', 'Brush Script MT', cursive, sans-serif",
            fontSize: textSize,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #db2777 0%, #e11d48 40%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
            lineHeight: 1
          }}
        >
          EventsVedika
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
