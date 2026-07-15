import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface AlertProps {
  isOpen: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  isOpen,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 max-w-md mx-auto">
          {/* Dim Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-dimmed-regular"
          />
          
          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-[16px] w-full max-w-[320px] p-5 shadow-sheet flex flex-col"
          >
            <h2 className="text-title1 text-text-strong text-center mb-2">{title}</h2>
            {description && (
              <p className="text-body2 text-text-secondary text-center mb-6">{description}</p>
            )}
            
            <div className="flex space-x-2 mt-4">
              <div className="flex-1">
                <Button variant="tertiary" size="medium" onClick={onCancel} fullWidth>
                  {cancelText}
                </Button>
              </div>
              <div className="flex-1">
                <Button variant="primary" size="medium" onClick={onConfirm} fullWidth>
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
