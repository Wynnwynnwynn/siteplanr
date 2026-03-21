import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

/**
 * Select Component
 *
 * Dropdown select input with optional label and validation.
 * Keyboard accessible with dropdown list.
 *
 * @example
 * <Select
 *   label="Choose Option"
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helpText,
      required = false,
      value = '',
      onChange,
      placeholder = 'Select an option...',
      fullWidth = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasError = !!error;

    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption?.label || placeholder;

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (!option.disabled) {
              onChange?.(option.value);
              setIsOpen(false);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    const handleSelectOption = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setHighlightedIndex(-1);
    };

    return (
      <div ref={containerRef} className={fullWidth ? 'w-full' : undefined}>
        {label && (
          <label className="block text-label_md text-neutral-800 dark:text-neutral-200 mb-sm font-medium">
            {label}
            {required && <span className="text-error ml-xs">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Select Button */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={`
              w-full px-md py-sm rounded-lg
              border border-neutral-300 dark:border-neutral-700
              bg-neutral-0 dark:bg-neutral-800
              text-neutral-900 dark:text-neutral-50
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary
              dark:focus:ring-offset-0
              disabled:bg-neutral-100 dark:disabled:bg-neutral-900
              disabled:text-neutral-400 dark:disabled:text-neutral-600
              disabled:cursor-not-allowed
              flex items-center justify-between
              ${hasError ? 'border-error focus:ring-error' : ''}
              ${className || ''}
            `}
            disabled={disabled}
            {...props}
          >
            <span
              className={
                value ? 'text-neutral-900 dark:text-neutral-50' : 'text-neutral-400'
              }
            >
              {displayText}
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-xs bg-neutral-0 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-md py-lg text-center text-neutral-500 dark:text-neutral-400">
                  No options available
                </div>
              ) : (
                options.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleSelectOption(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`
                      w-full text-left px-md py-sm transition-colors
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      ${
                        value === option.value
                          ? 'bg-primary text-neutral-0'
                          : highlightedIndex === index
                            ? 'bg-primary-100 dark:bg-primary-900'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {hasError && (
          <p className="text-caption text-error mt-xs flex items-center gap-xs">
            <AlertCircle size={14} />
            {error}
          </p>
        )}

        {helpText && !hasError && (
          <p className="text-caption text-neutral-500 dark:text-neutral-400 mt-xs">
            {helpText}
          </p>
        )}

        {/* Hidden select for form submission */}
        <select ref={ref} value={value} onChange={(e) => onChange?.(e.target.value)} className="hidden" aria-hidden="true" tabIndex={-1}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
