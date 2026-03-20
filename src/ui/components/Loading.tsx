import React from 'react';

/**
 * Spinner Component
 *
 * Animated circular loading spinner with optional size and color.
 *
 * @example
 * <Spinner size="md" />
 * <Spinner size="sm" color="primary" />
 */
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'inherit';
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};

const colorClasses = {
  primary: 'border-current border-t-primary',
  secondary: 'border-current border-t-secondary',
  inherit: 'border-current border-t-current',
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', color = 'primary', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className || ''}`}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

/**
 * ProgressBar Component
 *
 * Linear progress bar showing completion percentage.
 *
 * @example
 * <ProgressBar value={65} max={100} />
 * <ProgressBar value={3} max={5} label="3 of 5" />
 */
interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const sizeHeights = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorClasses2 = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
};

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      showLabel = false,
      color = 'primary',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
      <div ref={ref} className={className} {...props}>
        <div
          className={`w-full ${sizeHeights[size]} bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden`}
        >
          <div
            className={`h-full ${colorClasses2[color]} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <p className="text-caption text-neutral-600 dark:text-neutral-400 mt-sm">
            {Math.round(percentage)}%
          </p>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

/**
 * Skeleton Component
 *
 * Animated placeholder for loading content with shimmer effect.
 * Use for skeleton screens while loading data.
 *
 * @example
 * <Skeleton variant="text" count={3} />
 * <Skeleton variant="rect" width={200} height={100} />
 * <Skeleton variant="circle" width={50} />
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
  width?: number | string;
  height?: number | string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      count = 1,
      width = '100%',
      height = 'auto',
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded overflow-hidden';

    const variantClasses = {
      text: 'h-4 mb-md w-full',
      rect: 'rounded-lg',
      circle: 'rounded-full',
    };

    const style = {
      width: typeof width === 'number' ? `${width}px` : width,
      height:
        variant === 'text'
          ? 'auto'
          : typeof height === 'number'
            ? `${height}px`
            : height,
      aspectRatio: variant === 'circle' ? '1' : undefined,
    };

    if (count > 1) {
      return (
        <div ref={ref} {...props}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={`${baseClasses} ${variantClasses[variant]} ${className || ''} ${i < count - 1 ? 'mb-md' : ''}`}
              style={style}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default { Spinner, ProgressBar, Skeleton };
