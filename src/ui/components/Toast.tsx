import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const typeConfig = {
  success: {
    icon: Check,
    bgColor: 'bg-success-50 dark:bg-success-900/20',
    textColor: 'text-success-900 dark:text-success-100',
    borderColor: 'border-success-200 dark:border-success-800',
    iconColor: 'text-success',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-error-50 dark:bg-error-900/20',
    textColor: 'text-error-900 dark:text-error-100',
    borderColor: 'border-error-200 dark:border-error-800',
    iconColor: 'text-error',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning-50 dark:bg-warning-900/20',
    textColor: 'text-warning-900 dark:text-warning-100',
    borderColor: 'border-warning-200 dark:border-warning-800',
    iconColor: 'text-warning',
  },
  info: {
    icon: Info,
    bgColor: 'bg-info-50 dark:bg-info-900/20',
    textColor: 'text-info-900 dark:text-info-100',
    borderColor: 'border-info-200 dark:border-info-800',
    iconColor: 'text-info',
  },
};

/**
 * Toast Component
 *
 * Individual toast notification with auto-dismiss and action support.
 * Use with ToastContainer for managing multiple toasts.
 *
 * @example
 * <Toast
 *   type="success"
 *   title="Success"
 *   message="Operation completed successfully"
 *   duration={3000}
 *   onClose={handleClose}
 * />
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 4000,
  onClose,
  action,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = typeConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (duration === 0) return; // No auto-dismiss

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose?.(id), 150);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose?.(id), 150);
  };

  return (
    <div
      className={`
        flex items-start gap-md p-lg rounded-lg border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        animate-slide-up
        ${isExiting ? 'animate-fade-out' : ''}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <IconComponent size={20} className={`flex-shrink-0 mt-xs ${config.iconColor}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-body_md">{title}</p>}
        <p className={`text-body_sm ${title ? 'mt-xs' : ''}`}>{message}</p>

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-md px-md py-xs rounded-md bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-body_sm font-medium"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-xs rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

/**
 * ToastContainer Component
 *
 * Container for managing and displaying multiple toasts with stack management.
 *
 * @example
 * const [toasts, setToasts] = useState<ToastProps[]>([]);
 *
 * const addToast = (toast: Omit<ToastProps, 'id'>) => {
 *   const id = Date.now().toString();
 *   setToasts(prev => [...prev, { ...toast, id }].slice(-3));
 * };
 *
 * return (
 *   <>
 *     <ToastContainer toasts={toasts} onClose={removeToast} />
 *   </>
 * );
 */
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  const positionClasses = {
    'top-right': 'top-lg right-lg',
    'top-left': 'top-lg left-lg',
    'bottom-right': 'bottom-lg right-lg',
    'bottom-left': 'bottom-lg left-lg',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} flex flex-col gap-md max-w-sm z-[9999]`}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
