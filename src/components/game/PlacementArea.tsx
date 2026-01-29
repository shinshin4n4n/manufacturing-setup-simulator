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

  // Base styles - Responsive sizing with enhanced visual
  const baseStyles = 'w-full sm:w-56 md:w-64 h-44 sm:h-48 rounded-xl flex items-center justify-center relative transition-all duration-300';

  // State-based styles with gradient backgrounds
  const emptyStyles = isEmpty
    ? 'border-3 border-dashed border-indigo-300 bg-gradient-to-br from-gray-50 to-indigo-50/50 shadow-inner'
    : 'border-3 border-solid border-indigo-500 bg-gradient-to-br from-white to-indigo-50 shadow-xl';

  const hoverStyles = isOver && isEmpty
    ? 'border-indigo-600 bg-gradient-to-br from-indigo-100 to-blue-100 shadow-2xl scale-105 animate-pulse'
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
          animate={isOver ? { scale: 1.15, y: -5 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            {position}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
            {isOver ? '✨ 設備を配置' : '📍 ドロップエリア'}
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
              className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-lg text-xl font-bold"
              aria-label="Remove equipment"
              whileHover={{ scale: 1.15, rotate: 90, boxShadow: '0 10px 25px rgba(239, 68, 68, 0.5)' }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          )}
          <motion.div
            className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
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
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎯</span>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            配置エリア
          </h2>
        </div>
        <p className="text-sm sm:text-base text-indigo-600 font-medium pl-8">
          設備を順番に配置してください（5つすべて配置する必要があります）
        </p>
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
              <motion.div
                className="flex-shrink-0 lg:rotate-0 rotate-90"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <motion.svg
                  className="w-12 h-12 text-indigo-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Indicator */}
      <motion.div
        className="mt-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-inner border-2 border-indigo-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="text-sm font-bold text-indigo-700">配置進捗</span>
          </div>
          <motion.span
            className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            key={placedEquipment.length}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {placedEquipment.length} / {totalSlots}
          </motion.span>
        </div>
        <div className="w-full bg-white rounded-full h-3 shadow-inner border border-indigo-200">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${(placedEquipment.length / totalSlots) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </motion.div>
    </div>
  );
};
