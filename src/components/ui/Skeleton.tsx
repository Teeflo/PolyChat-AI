import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  animation = 'shimmer',
}) => {
  const variants = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`
        bg-neutral-800/50
        ${variants[variant]}
        ${animations[animation]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  );
};

// Skeleton group for message loading
export const MessageSkeleton: React.FC = () => (
  <div className="flex gap-3 p-4 animate-fade-in">
    <Skeleton variant="circular" width={36} height={36} />
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton width={80} height={16} />
        <Skeleton width={40} height={12} />
      </div>
      <Skeleton width="100%" height={60} />
      <Skeleton width="70%" height={16} />
    </div>
  </div>
);

// Skeleton for settings sections
export const SettingsSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-3">
        <Skeleton width={120} height={20} />
        <div className="space-y-2">
          {[1, 2].map((j) => (
            <div key={j} className="flex items-center justify-between p-3">
              <div className="space-y-1">
                <Skeleton width={140} height={16} />
                <Skeleton width={200} height={12} />
              </div>
              <Skeleton width={44} height={24} variant="circular" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for model list
export const ModelListSkeleton: React.FC = () => (
  <div className="space-y-2 animate-fade-in">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/30">
        <Skeleton width={32} height={32} variant="circular" />
        <div className="flex-1 space-y-1">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
