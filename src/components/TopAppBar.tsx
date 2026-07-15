import React from 'react';


interface TopAppBarProps {
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  align?: 'center' | 'left';
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ title, leftSlot, rightSlot, align = 'center' }) => {
  if (align === 'left') {
    return (
      <div className="sticky top-0 w-full h-[56px] bg-white/80 backdrop-blur-xl z-40 flex items-center px-[20px] justify-between border-b border-gray-100/50">
        <div className="flex items-center">
          {leftSlot}
          {title && <h1 className="text-title1 font-bold text-text-strong tracking-tight">{title}</h1>}
        </div>
        <div className="flex items-center">
          {rightSlot}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 w-full h-[56px] bg-white/80 backdrop-blur-xl z-40 flex items-center px-[20px] border-b border-gray-100/50">
      <div className="flex-1 flex items-center justify-start">
        {leftSlot}
      </div>
      <div className="flex-[2] flex items-center justify-center">
        {title && <h1 className="text-body1 font-bold text-text-strong tracking-tight">{title}</h1>}
      </div>
      <div className="flex-1 flex items-center justify-end">
        {rightSlot}
      </div>
    </div>
  );
};
