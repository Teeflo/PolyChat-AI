import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconPosition = 'left', className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-200">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 
              bg-neutral-900/50 backdrop-blur-sm
              border border-white/10 rounded-xl
              text-neutral-100 text-sm
              placeholder:text-neutral-500
              transition-all duration-200
              hover:border-white/20
              focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-red-400">{error}</span>}
        {hint && !error && <span className="text-xs text-neutral-500">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
