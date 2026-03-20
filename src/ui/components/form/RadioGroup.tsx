import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  helpText?: string;
  disabled?: boolean;
}

interface RadioGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  error?: string;
  required?: boolean;
}

/**
 * RadioGroup Component
 *
 * Group of mutually exclusive radio buttons with labels.
 * Supports vertical and horizontal layouts.
 *
 * @example
 * <RadioGroup
 *   label="Select Option"
 *   options={[
 *     { value: 'opt1', label: 'Option 1' },
 *     { value: 'opt2', label: 'Option 2' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 */
export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      direction = 'vertical',
      error,
      required = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <fieldset ref={ref} className={className} {...props}>
        {label && (
          <legend className="text-label_md text-neutral-800 dark:text-neutral-200 mb-md font-medium block">
            {label}
            {required && <span className="text-error ml-xs">*</span>}
          </legend>
        )}

        <div
          className={`flex gap-lg ${
            direction === 'horizontal' ? 'flex-row' : 'flex-col'
          }`}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-start gap-sm">
              <input
                type="radio"
                id={`radio-${option.value}`}
                name={props.name || label}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className="sr-only"
              />

              <div className="relative flex items-center mt-xs">
                <div
                  className={`
                    flex items-center justify-center
                    w-5 h-5 rounded-full border-2
                    transition-colors duration-200
                    border-neutral-300 dark:border-neutral-700
                    bg-neutral-0 dark:bg-neutral-800
                    cursor-pointer
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    focus-visible:ring-primary
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${
                      value === option.value
                        ? 'border-primary bg-primary dark:border-primary dark:bg-primary'
                        : ''
                    }
                  `}
                >
                  {value === option.value && (
                    <div className="w-2 h-2 bg-neutral-0 dark:bg-neutral-900 rounded-full" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label
                  htmlFor={`radio-${option.value}`}
                  className="text-body_md text-neutral-900 dark:text-neutral-50 cursor-pointer font-medium"
                >
                  {option.label}
                </label>
                {option.helpText && (
                  <p className="text-caption text-neutral-500 dark:text-neutral-400 mt-xs">
                    {option.helpText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-caption text-error mt-sm">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
