import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    select-none whitespace-nowrap
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-violet-500 via-violet-400 to-violet-300
      text-white border-0 shadow-sm
      hover:shadow-md hover:shadow-violet-500/20 hover:-translate-y-0.5
      focus-visible:ring-violet-500
      active:translate-y-0
    `,
    secondary: `
      bg-neutral-800/50 backdrop-blur-sm
      text-neutral-100 border border-white/10
      hover:bg-neutral-700/50 hover:border-white/20
      focus-visible:ring-neutral-500
    `,
    ghost: `
      bg-transparent text-neutral-300
      hover:bg-white/5 hover:text-white
      focus-visible:ring-neutral-500
    `,
    danger: `
      bg-red-500/10 text-red-400 border border-red-500/30
      hover:bg-red-500/20 hover:border-red-500/50
      focus-visible:ring-red-500
    `,
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 rounded-xl',
    lg: 'text-base px-6 py-3 rounded-xl',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon && iconPosition === 'left' ? (
        icon
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'right' ? icon : null}
    </button>
  );
};

export default Button;
