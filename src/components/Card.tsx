import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-[16px] border border-border-regular p-4 ${className}`}>
      {children}
    </div>
  );
};
