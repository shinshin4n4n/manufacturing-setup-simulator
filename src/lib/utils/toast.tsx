import React from 'react';
import toast from 'react-hot-toast';

/**
 * Toast notification utilities
 * Wrapper around react-hot-toast for consistent styling and behavior
 */

const DEFAULT_DURATION = 4000;

export const showToast = {
  /**
   * Show success toast
   */
  success: (message: string, duration = DEFAULT_DURATION) => {
    return toast.success(message, {
      duration,
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  },

  /**
   * Show error toast
   */
  error: (message: string, duration = DEFAULT_DURATION) => {
    return toast.error(message, {
      duration,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  },

  /**
   * Show info toast
   */
  info: (message: string, duration = DEFAULT_DURATION) => {
    return toast(message, {
      duration,
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  /**
   * Show loading toast
   */
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#6B7280',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  /**
   * Show warning toast
   */
  warning: (message: string, duration = DEFAULT_DURATION) => {
    return toast(message, {
      duration,
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '500',
      },
    });
  },

  /**
   * Dismiss a specific toast or all toasts
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

/**
 * Show error toast with retry button
 */
export const showErrorWithRetry = (
  message: string,
  onRetry: () => void
): void => {
  toast.error(
    (t) => (
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onRetry();
          }}
          className="px-3 py-1 bg-white text-red-600 rounded font-medium hover:bg-red-50 transition-colors text-sm"
        >
          再試行
        </button>
      </div>
    ),
    {
      duration: 6000,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '500',
        minWidth: '350px',
      },
    }
  );
};
