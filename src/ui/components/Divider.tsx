import React from 'react';

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  color?: 'default' | 'muted' | 'primary';
  spacing?: 'sm' | 'md' | 'lg';
  withLabel?: string;
}

const colorClasses = {
  default: 'border-neutral-300 dark:border-neutral-700',
  muted: 'border-neutral-200 dark:border-neutral-800',
  primary: 'border-primary-200 dark:border-primary-900',
};

const spacingClasses = {
  sm: 'my-sm',
  md: 'my-md',
  lg: 'my-lg',
};

/**
 * Divider Component
 *
 * Visual separator for content with optional label and vertical orientation.
 *
 * @example
 * <Divider />
 * <Divider orientation="vertical" />
 * <Divider withLabel="OR" />
 */
export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      color = 'default',
      spacing = 'md',
      withLabel,
      className,
      ...props
    },
    ref
  ) => {
    if (withLabel) {
      return (
        <div className={`flex items-center gap-md ${spacingClasses[spacing]}`}>
          <hr
            ref={ref}
            className={`flex-1 border-none border-t ${colorClasses[color]}`}
            {...props}
          />
          <span className="text-label_sm text-neutral-500 dark:text-neutral-400 font-medium px-sm">
            {withLabel}
          </span>
          <hr
            className={`flex-1 border-none border-t ${colorClasses[color]}`}
            {...props}
          />
        </div>
      );
    }

    if (orientation === 'vertical') {
      return (
        <div className={`inline-block h-6 border-l ${colorClasses[color]}`} />
      );
    }

    return (
      <hr
        ref={ref}
        className={`border-none border-t ${colorClasses[color]} ${spacingClasses[spacing]} ${className || ''}`}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
