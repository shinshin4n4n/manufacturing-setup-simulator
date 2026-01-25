import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export interface DroppableAreaProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  label?: string;
}

export const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  children,
  className = '',
  label,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const baseStyles = 'min-h-[200px] rounded-lg border-2 border-dashed transition-all duration-200 p-4';
  const defaultStyles = 'border-gray-300 bg-gray-50';
  const overStyles = 'border-blue-500 bg-blue-50 shadow-lg';

  const combinedStyles = [
    baseStyles,
    isOver ? overStyles : defaultStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={setNodeRef} className={combinedStyles}>
      {label && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
        </div>
      )}
      {children || (
        <div className="flex items-center justify-center h-full text-gray-400">
          ここに設備をドロップしてください
        </div>
      )}
    </div>
  );
};
