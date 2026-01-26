import React from 'react';
import { motion } from 'framer-motion';

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

const EquipmentCardComponent: React.FC<EquipmentCardProps> = ({
  equipment,
  isDragging = false,
  isPlaced = false,
  onClick,
  className = '',
}) => {
  // Base styles - Responsive sizing
  const baseStyles = 'w-full sm:w-56 md:w-64 h-32 sm:h-36 md:h-40 rounded-lg cursor-pointer select-none relative';

  // Background and border styles based on state
  const stateStyles = isPlaced
    ? 'bg-white border-2 border-green-500 shadow-md'
    : 'bg-white border-2 border-blue-500 shadow-md';

  // Dragging state
  const draggingStyles = isDragging ? 'opacity-50' : '';

  // Combine all classes
  const cardClasses = [
    baseStyles,
    stateStyles,
    draggingStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isDragging && !isPlaced ? {
        scale: 1.03,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      } : undefined}
      whileTap={!isDragging && !isPlaced ? { scale: 0.98 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Card Content Container */}
      <div className="flex h-full p-3 sm:p-4">
        {/* Left side - Equipment Code (Large) */}
        <div className="flex items-center justify-center w-14 sm:w-16 md:w-20 h-full">
          <div
            className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
              isPlaced ? 'text-green-600' : 'text-blue-600'
            }`}
          >
            {equipment.code}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300 mx-2 sm:mx-3 md:mx-4" />

        {/* Right side - Equipment Details */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
            {equipment.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {equipment.description || '設備の説明がありません'}
          </p>
        </div>
      </div>

      {/* Status Indicator Badge */}
      {isPlaced && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            配置済み
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

EquipmentCardComponent.displayName = 'EquipmentCard';

export const EquipmentCard = React.memo(EquipmentCardComponent);
