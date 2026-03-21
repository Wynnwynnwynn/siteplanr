import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  fullWidth?: boolean;
  showCharCount?: boolean;
  maxCharacters?: number;
}

/**
 * TextArea Component
 *
 * Multi-line text input with optional label, validation, help text, and character counter.
 *
 * @example
 * <TextArea
 *   label="Description"
 *   placeholder="Enter description..."
 *   rows={5}
 *   error={errors.description}
 *   showCharCount
 *   maxCharacters={500}
 * />
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helpText,
      required = false,
      fullWidth = true,
      showCharCount = false,
      maxCharacters,
      className,
      disabled,
      value = '',
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState((value as string).length);
    const hasError = !!error;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className={fullWidth ? 'w-full' : undefined}>
        {label && (
          <label className="block text-label_md text-neutral-800 dark:text-neutral-200 mb-sm font-medium">
            {label}
            {required && <span className="text-error ml-xs">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
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
              resize-vertical min-h-24
              ${hasError ? 'border-error focus:ring-error' : ''}
              ${className || ''}
            `}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            maxLength={maxCharacters}
            {...props}
          />
        </div>

        <div className="mt-xs flex items-center justify-between">
          <div>
            {hasError && (
              <p className="text-caption text-error flex items-center gap-xs">
                <AlertCircle size={14} />
                {error}
              </p>
            )}

            {helpText && !hasError && (
              <p className="text-caption text-neutral-500 dark:text-neutral-400">
                {helpText}
              </p>
            )}
          </div>

          {showCharCount && maxCharacters && (
            <span
              className={`text-caption font-medium ${
                charCount >= maxCharacters
                  ? 'text-error'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {charCount}/{maxCharacters}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
