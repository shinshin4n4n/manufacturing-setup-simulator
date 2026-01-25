import React from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { EquipmentCard, Equipment } from './EquipmentCard';

interface PlacementSlotProps {
  id: string;
  position: number;
  equipment: Equipment | null;
  onRemove?: (equipmentId: string) => void;
}

const PlacementSlot: React.FC<PlacementSlotProps> = ({
  id,
  position,
  equipment,
  onRemove,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      position,
    },
  });

  const isEmpty = !equipment;

  // Base styles - Responsive sizing
  const baseStyles = 'w-full sm:w-56 md:w-64 h-44 sm:h-48 rounded-lg flex items-center justify-center relative';

  // State-based styles
  const emptyStyles = isEmpty
    ? 'border-2 border-dashed border-gray-300 bg-gray-50'
    : 'border-2 border-solid border-blue-500 bg-white';

  const hoverStyles = isOver && isEmpty
    ? 'border-blue-500 bg-blue-50 shadow-lg'
    : '';

  const slotClasses = [baseStyles, emptyStyles, hoverStyles]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      ref={setNodeRef}
      className={slotClasses}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: position * 0.05 }}
      whileHover={isEmpty ? { scale: 1.02 } : undefined}
    >
      {isEmpty ? (
        <motion.div
          className="text-center px-4"
          animate={isOver ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="text-3xl sm:text-4xl font-bold text-gray-400 mb-2">{position}</div>
          <p className="text-xs sm:text-sm text-gray-500">
            {isOver ? '設備を配置' : 'ドロップしてください'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <EquipmentCard equipment={equipment} isPlaced={true} />
          {onRemove && (
            <motion.button
              onClick={() => onRemove(equipment.id)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
              aria-label="Remove equipment"
              whileHover={{ scale: 1.1, backgroundColor: '#dc2626' }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          )}
          <motion.div
            className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {position}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export interface PlacementAreaProps {
  placedEquipment: Array<{
    equipment: Equipment;
    position: number;
  }>;
  onRemoveEquipment?: (equipmentId: string) => void;
  className?: string;
}

export const PlacementArea: React.FC<PlacementAreaProps> = ({
  placedEquipment,
  onRemoveEquipment,
  className = '',
}) => {
  const totalSlots = 5;

  // Create array of slots with equipment if placed
  const slots = Array.from({ length: totalSlots }, (_, index) => {
    const position = index + 1;
    const placed = placedEquipment.find((pe) => pe.position === index);
    return {
      position,
      equipment: placed?.equipment || null,
    };
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Title */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">配置エリア</h2>
        <p className="text-sm sm:text-base text-gray-600">設備を順番に配置してください（5つすべて配置する必要があります）</p>
      </motion.div>

      {/* Slots Container - Responsive */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 overflow-x-auto pb-4">
        {slots.map((slot, index) => (
          <React.Fragment key={`slot-${slot.position}`}>
            <PlacementSlot
              id={`placement-slot-${slot.position}`}
              position={slot.position}
              equipment={slot.equipment}
              onRemove={onRemoveEquipment}
            />

            {/* Arrow between slots (except after last slot) */}
            {index < totalSlots - 1 && (
              <div className="flex-shrink-0 lg:rotate-0 rotate-90">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">配置進捗</span>
          <span className="text-sm font-bold text-blue-600">
            {placedEquipment.length} / {totalSlots}
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(placedEquipment.length / totalSlots) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
