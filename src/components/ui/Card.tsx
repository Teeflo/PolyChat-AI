import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}) => {
  const variants = {
    default: `
      bg-neutral-900/50 backdrop-blur-xl
      border border-white/5
    `,
    elevated: `
      bg-neutral-900/70 backdrop-blur-xl
      border border-white/10
      shadow-xl shadow-black/20
    `,
    outlined: `
      bg-transparent
      border border-white/10
    `,
    glass: `
      bg-white/5 backdrop-blur-2xl
      border border-white/10
    `,
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverStyles = hover
    ? 'cursor-pointer transition-all duration-200 hover:border-white/20 hover:bg-neutral-800/50 hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`
        rounded-2xl
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
