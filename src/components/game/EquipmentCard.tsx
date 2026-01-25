import React from 'react';

export interface Equipment {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

export interface EquipmentCardProps {
  equipment: Equipment;
  isDragging?: boolean;
  isPlaced?: boolean;
  onClick?: () => void;
  className?: string;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  isDragging = false,
  isPlaced = false,
  onClick,
  className = '',
}) => {
  // Base styles
  const baseStyles = 'w-64 h-40 rounded-lg transition-all duration-200 cursor-pointer select-none';

  // Background and border styles based on state
  const stateStyles = isPlaced
    ? 'bg-white border-2 border-green-500 shadow-md'
    : 'bg-white border-2 border-blue-500 shadow-md';

  // Hover effect (not applied when dragging)
  const hoverStyles = !isDragging
    ? 'hover:shadow-xl hover:-translate-y-1 hover:border-blue-600'
    : '';

  // Dragging state
  const draggingStyles = isDragging ? 'opacity-50 scale-95' : '';

  // Combine all classes
  const cardClasses = [
    baseStyles,
    stateStyles,
    hoverStyles,
    draggingStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Card Content Container */}
      <div className="flex h-full p-4">
        {/* Left side - Equipment Code (Large) */}
        <div className="flex items-center justify-center w-20 h-full">
          <div
            className={`text-5xl font-bold ${
              isPlaced ? 'text-green-600' : 'text-blue-600'
            }`}
          >
            {equipment.code}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300 mx-4" />

        {/* Right side - Equipment Details */}
        <div className="flex flex-col justify-center flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {equipment.name}
          </h3>
          <p className="text-sm text-gray-600">
            {equipment.description || '設備の説明がありません'}
          </p>
        </div>
      </div>

      {/* Status Indicator Badge */}
      {isPlaced && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            配置済み
          </span>
        </div>
      )}
    </div>
  );
};
