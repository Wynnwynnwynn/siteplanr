import React from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
  helpText?: string;
}

/**
 * Checkbox Component
 *
 * Toggle checkbox with optional label and help text.
 * Supports indeterminate state for mixed selections.
 *
 * @example
 * <Checkbox label="I agree to terms" />
 * <Checkbox label="Select all" indeterminate={someSelected && !allSelected} />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, helpText, className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    return (
      <div className="flex items-start gap-sm">
        <div className="relative flex items-center mt-xs">
          <input
            ref={resolvedRef}
            type="checkbox"
            className="sr-only"
            {...props}
          />

          <div
            className={`
              flex items-center justify-center
              w-5 h-5 rounded border-2
              transition-colors duration-200
              border-neutral-300 dark:border-neutral-700
              bg-neutral-0 dark:bg-neutral-800
              cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              focus-visible:ring-primary
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${
                props.checked
                  ? 'border-primary bg-primary dark:border-primary dark:bg-primary'
                  : ''
              }
            `}
          >
            {props.checked && (
              <Check size={14} className="text-neutral-0 dark:text-neutral-900" />
            )}
            {indeterminate && (
              <Minus size={14} className="text-neutral-0 dark:text-neutral-900" />
            )}
          </div>
        </div>

        {label && (
          <div className="flex-1 min-w-0">
            <label className="text-body_md text-neutral-900 dark:text-neutral-50 cursor-pointer font-medium">
              {label}
            </label>
            {helpText && (
              <p className="text-caption text-neutral-500 dark:text-neutral-400 mt-xs">
                {helpText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
