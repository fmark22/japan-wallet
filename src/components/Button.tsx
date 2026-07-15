import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'large' | 'medium' | 'small' | 'xSmall';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-regular text-white',
  secondary: 'bg-blue-100 text-primary-strong',
  tertiary: 'bg-gray-100 text-text-primary',
};

const sizeStyles: Record<ButtonSize, string> = {
  large: 'h-[56px] px-5 text-title2 rounded-[14px]',
  medium: 'h-[46px] px-4 text-title3 rounded-[12px]',
  small: 'h-[40px] px-3 text-caption2 rounded-[10px]',
  xSmall: 'h-[32px] px-2 text-caption2 rounded-[8px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  children,
  fullWidth = true,
  className,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.92 } : {}}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      className={clsx(
        'relative flex items-center justify-center overflow-hidden font-semibold select-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : 'w-auto',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Ripple overlay element could go here, but Framer motion active scale is good enough for MVP */}
      {children}
    </motion.button>
  );
};
