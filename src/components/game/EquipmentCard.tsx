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
  // Color scheme based on equipment code
  const getColorScheme = (code: string) => {
    const colorMap: Record<string, {
      bg: string;
      border: string;
      text: string;
      gradient: string;
      cardBgPlaced: string;
      cardBgNotPlaced: string;
    }> = {
      'A': {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600',
        cardBgPlaced: 'from-blue-50 to-white',
        cardBgNotPlaced: 'from-white to-blue-50'
      },
      'B': {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-600',
        gradient: 'from-green-500 to-green-600',
        cardBgPlaced: 'from-green-50 to-white',
        cardBgNotPlaced: 'from-white to-green-50'
      },
      'C': {
        bg: 'bg-purple-50',
        border: 'border-purple-500',
        text: 'text-purple-600',
        gradient: 'from-purple-500 to-purple-600',
        cardBgPlaced: 'from-purple-50 to-white',
        cardBgNotPlaced: 'from-white to-purple-50'
      },
      'D': {
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-600',
        gradient: 'from-orange-500 to-orange-600',
        cardBgPlaced: 'from-orange-50 to-white',
        cardBgNotPlaced: 'from-white to-orange-50'
      },
      'E': {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-600',
        gradient: 'from-red-500 to-red-600',
        cardBgPlaced: 'from-red-50 to-white',
        cardBgNotPlaced: 'from-white to-red-50'
      },
    };
    return colorMap[code] || {
      bg: 'bg-gray-50',
      border: 'border-gray-500',
      text: 'text-gray-600',
      gradient: 'from-gray-500 to-gray-600',
      cardBgPlaced: 'from-gray-50 to-white',
      cardBgNotPlaced: 'from-white to-gray-50'
    };
  };

  const colorScheme = getColorScheme(equipment.code);

  // Base styles - Responsive sizing
  const baseStyles = 'w-full sm:w-56 md:w-64 h-32 sm:h-36 md:h-40 rounded-xl cursor-pointer select-none relative overflow-hidden';

  // Background and border styles based on state
  const stateStyles = isPlaced
    ? `bg-gradient-to-br ${colorScheme.cardBgPlaced} border-3 ${colorScheme.border} shadow-xl`
    : `bg-gradient-to-br ${colorScheme.cardBgNotPlaced} border-3 ${colorScheme.border} shadow-lg hover:shadow-2xl`;

  // Dragging state
  const draggingStyles = isDragging ? 'opacity-50 scale-95' : '';

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
        scale: 1.05,
        rotate: 1,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      } : undefined}
      whileTap={!isDragging && !isPlaced ? { scale: 0.97, rotate: 0 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-5`} />

      {/* Card Content Container */}
      <div className="flex h-full p-3 sm:p-4 relative z-10">
        {/* Left side - Equipment Code (Large) */}
        <div className="flex items-center justify-center w-14 sm:w-16 md:w-20 h-full">
          <div
            className={`text-3xl sm:text-4xl md:text-5xl font-bold ${colorScheme.text} drop-shadow-md`}
            style={{ fontFamily: 'monospace' }}
          >
            {equipment.code}
          </div>
        </div>

        {/* Divider */}
        <div className={`w-1 ${colorScheme.border} mx-2 sm:mx-3 md:mx-4 rounded-full opacity-30`} />

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
          className="absolute top-2 right-2 z-20"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-gradient-to-r ${colorScheme.gradient} text-white`}>
            ✓ 配置済み
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

EquipmentCardComponent.displayName = 'EquipmentCard';

export const EquipmentCard = React.memo(EquipmentCardComponent);
