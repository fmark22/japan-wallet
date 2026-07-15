import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  size?: 'medium' | 'small' | 'xSmall';
}

const sizeStyles = {
  medium: 'h-[40px] px-3 text-body2',
  small: 'h-[36px] px-[10px] text-body3',
  xSmall: 'h-[32px] px-2 text-body4',
};

export const Chip: React.FC<ChipProps> = ({
  children,
  selected = false,
  onClick,
  size = 'medium'
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        'rounded-full whitespace-nowrap flex items-center justify-center flex-shrink-0 transition-colors font-medium',
        sizeStyles[size],
        selected 
          ? 'bg-primary-regular text-white shadow-md' 
          : 'bg-white text-text-secondary shadow-sm'
      )}
    >
      {children}
    </motion.button>
  );
};
