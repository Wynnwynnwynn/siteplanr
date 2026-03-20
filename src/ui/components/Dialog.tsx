import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  fullscreen: 'max-w-full h-full',
};

/**
 * Dialog Component
 *
 * Modal dialog with backdrop, optional close button, and configurable sizing.
 * Supports keyboard (Escape) and backdrop click to close.
 *
 * @example
 * <Dialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Dialog>
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'md',
      closeOnBackdropClick = true,
      closeOnEsc = true,
    },
    ref
  ) => {
    // Handle escape key
    useEffect(() => {
      if (!isOpen || !closeOnEsc) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEsc, onClose]);

    // Prevent body scroll when dialog is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'unset';
        };
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 transition-opacity"
          onClick={() => closeOnBackdropClick && onClose()}
          aria-hidden="true"
        />

        {/* Dialog */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-lg">
          <div
            ref={ref}
            className={`
              bg-neutral-0 dark:bg-neutral-900
              rounded-xl shadow-xl
              max-h-[calc(100vh-64px)] overflow-y-auto
              w-full ${sizeClasses[size]}
              animate-scale-in
            `}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-lg py-md border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-h4 font-semibold text-neutral-900 dark:text-neutral-50">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-xs rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="px-lg py-lg">
              {children}
            </div>
          </div>
        </div>
      </>
    );
  }
);

Dialog.displayName = 'Dialog';

export default Dialog;
