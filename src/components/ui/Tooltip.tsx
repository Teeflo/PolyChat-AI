import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-neutral-800 border-l-transparent border-r-transparent border-b-transparent',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-b-neutral-800 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-neutral-800 border-t-transparent border-b-transparent border-r-transparent',
    right:
      'right-full top-1/2 -translate-y-1/2 border-r-neutral-800 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50
            ${positions[position]}
            animate-fade-in
          `}
          role="tooltip"
        >
          <div
            className={`
              px-3 py-1.5
              bg-neutral-800 text-neutral-200
              text-xs font-medium
              rounded-lg shadow-lg
              whitespace-nowrap
              border border-white/5
              ${className}
            `}
          >
            {content}
          </div>
          <span
            className={`
              absolute w-0 h-0
              border-[6px]
              ${arrows[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
