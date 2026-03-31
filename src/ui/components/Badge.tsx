import React from 'react';
import { X } from 'lucide-react';

type BadgeVariant = 'solid' | 'outlined' | 'subtle';
type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<BadgeVariant, Record<BadgeColor, string>> = {
  solid: {
    primary: 'bg-primary text-neutral-0',
    secondary: 'bg-secondary text-neutral-0',
    success: 'bg-success text-neutral-0',
    warning: 'bg-warning text-neutral-900',
    error: 'bg-error text-neutral-0',
    info: 'bg-info text-neutral-0',
    neutral: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50',
  },
  outlined: {
    primary: 'border border-primary text-primary bg-primary-50 dark:bg-primary-900/20',
    secondary:
      'border border-secondary text-secondary bg-secondary-50 dark:bg-secondary-900/20',
    success: 'border border-success text-success bg-success-50 dark:bg-success-900/20',
    warning: 'border border-warning text-warning bg-warning-50 dark:bg-warning-900/20',
    error: 'border border-error text-error bg-error-50 dark:bg-error-900/20',
    info: 'border border-info text-info bg-info-50 dark:bg-info-900/20',
    neutral:
      'border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-900',
  },
  subtle: {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100',
    secondary:
      'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-900 dark:text-secondary-100',
    success: 'bg-success-100 dark:bg-success-900/30 text-success-900 dark:text-success-100',
    warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-900 dark:text-warning-100',
    error: 'bg-error-100 dark:bg-error-900/30 text-error-900 dark:text-error-100',
    info: 'bg-info-100 dark:bg-info-900/30 text-info-900 dark:text-info-100',
    neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50',
  },
};

const sizeClasses = {
  sm: 'px-sm py-xs text-caption gap-xs',
  md: 'px-md py-xs text-label_sm gap-xs',
  lg: 'px-lg py-sm text-label_md gap-sm',
};

/**
 * Badge Component
 *
 * Flexible badge/chip component for labels, status, tags, etc.
 * Supports multiple variants and colors, with optional dismiss action.
 *
 * @example
 * <Badge variant="solid" color="success" icon={<CheckCircle />}>
 *   Approved
 * </Badge>
 * <Badge
 *   variant="outlined"
 *   color="primary"
 *   onDismiss={() => removeTag('tag')}
 * >
 *   Tag <X size={14} />
 * </Badge>
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      children,
      variant = 'subtle',
      color = 'primary',
      icon,
      onDismiss,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const classes = [
      'inline-flex items-center gap-sm rounded-full font-medium transition-all duration-200',
      variantClasses[variant][color],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1">{children}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-xs hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
