import React from 'react';

interface LogoProps {
    className?: string; // CSS class for custom styling
    size?: number | string; // Width/Height in pixels
    showText?: boolean; // Toggle text display
    variant?: 'default' | 'white'; // Color variant
}

export const Logo: React.FC<LogoProps> = ({
    className = '',
    size = 40,
    showText = false,
    variant = 'default'
}) => {
    // Generate unique IDs for gradients to avoid conflicts if multiple logos are on screen
    const gradientId = React.useId();

    // Color logic
    const isWhite = variant === 'white';

    // Defs for gradients
    const gradientStops = isWhite ? (
        <>
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0.5" />
        </>
    ) : (
        <>
            <stop offset="0%" stopColor="#8B5CF6" /> {/* violet-500 */}
            <stop offset="50%" stopColor="#6366F1" /> {/* indigo-500 */}
            <stop offset="100%" stopColor="#3B82F6" /> {/* blue-500 */}
        </>
    );

    const fillUrl = `url(#polyGradient-${gradientId})`;

    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm transition-transform duration-300 hover:scale-105"
            >
                <defs>
                    <linearGradient
                        id={`polyGradient-${gradientId}`}
                        x1="0"
                        y1="100"
                        x2="100"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                    >
                        {gradientStops}
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Main Shape: Stylized Hexagon/Chat Bubble Hybrid */}
                {/* We create a hexagon that morphs into a chat bubble on the right */}

                {/* Background/Base Shape - Soft Hexagon */}
                <path
                    d="M50 5 L88.97 27.5 V72.5 L50 95 L11.03 72.5 V27.5 L50 5Z"
                    stroke={isWhite ? "white" : "url(#polyGradient-" + gradientId + ")"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity={isWhite ? 0.3 : 1}
                />

                {/* Inner Filled Shape - The "Core" */}
                {/* 3 Interlocking Rhombus shapes forming a cube/hexagon effect */}
                <g opacity={isWhite ? 0.9 : 0.8}>
                    {/* Left Face */}
                    <path
                        d="M50 50 L18 68 V32 L50 14 V50Z"
                        fill={fillUrl}
                        opacity="0.8"
                    />
                    {/* Right Face (Chat Tail) */}
                    <path
                        d="M50 50 L82 32 V68 L50 86 V50Z"
                        fill={fillUrl}
                        opacity="0.6"
                    />
                    {/* Top Face (Brain) */}
                    <path
                        d="M50 50 L82 32 L50 14 L18 32 L50 50Z"
                        fill={fillUrl}
                        opacity="1"
                    />
                </g>

                {/* Connection Nodes (AI aesthetic) */}
                <circle cx="50" cy="50" r="4" fill="white" />
                <circle cx="18" cy="32" r="2.5" fill={isWhite ? "white" : "#6366F1"} />
                <circle cx="82" cy="32" r="2.5" fill={isWhite ? "white" : "#6366F1"} />
                <circle cx="50" cy="86" r="2.5" fill={isWhite ? "white" : "#6366F1"} />

                {/* Subtle highlight */}
                <circle cx="50" cy="14" r="2" fill="white" opacity="0.5" />

            </svg>

            {showText && (
                <div className="flex flex-col leading-none">
                    <span className={`font-bold text-xl tracking-tight flex items-center ${isWhite ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                        Poly
                        <span className={`ml-0.5 ${isWhite ? 'text-blue-200' : 'bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500'}`}>
                            Chat
                        </span>
                    </span>
                    {/* Optional strapline if size permits, but usually logo is just name */}
                </div>
            )}
        </div>
    );
};

export default Logo;
