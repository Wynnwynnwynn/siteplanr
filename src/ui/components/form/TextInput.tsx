import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * TextInput Component
 *
 * Single-line text input with optional label, validation error, and help text.
 *
 * @example
 * <TextInput
 *   label="Project Name"
 *   placeholder="Enter name..."
 *   error={errors.name}
 *   required
 * />
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      helpText,
      required = false,
      icon,
      iconPosition = 'left',
      fullWidth = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={fullWidth ? 'w-full' : undefined}>
        {label && (
          <label className="block text-label_md text-neutral-800 dark:text-neutral-200 mb-sm font-medium">
            {label}
            {required && <span className="text-error ml-xs">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 flex-shrink-0">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-md py-sm rounded-lg
              border border-neutral-300 dark:border-neutral-700
              bg-neutral-0 dark:bg-neutral-800
              text-neutral-900 dark:text-neutral-50
              placeholder-neutral-400 dark:placeholder-neutral-500
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary
              dark:focus:ring-offset-0
              disabled:bg-neutral-100 dark:disabled:bg-neutral-900
              disabled:text-neutral-400 dark:disabled:text-neutral-600
              disabled:cursor-not-allowed
              ${hasError ? 'border-error focus:ring-error' : ''}
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${className || ''}
            `}
            disabled={disabled}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-md top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 flex-shrink-0">
              {icon}
            </div>
          )}

          {hasError && (
            <div className="absolute right-md top-1/2 -translate-y-1/2 text-error flex-shrink-0">
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        {hasError && (
          <p className="text-caption text-error mt-xs flex items-center gap-xs">
            {error}
          </p>
        )}

        {helpText && !hasError && (
          <p className="text-caption text-neutral-500 dark:text-neutral-400 mt-xs">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
