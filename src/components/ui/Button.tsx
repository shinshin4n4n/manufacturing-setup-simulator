import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled && disabledStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
