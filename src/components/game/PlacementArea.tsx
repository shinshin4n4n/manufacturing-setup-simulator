import React from 'react';
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

  // Base styles
  const baseStyles = 'w-64 h-48 rounded-lg transition-all duration-200 flex items-center justify-center relative';

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
    <div ref={setNodeRef} className={slotClasses}>
      {isEmpty ? (
        <div className="text-center px-4">
          <div className="text-4xl font-bold text-gray-400 mb-2">{position}</div>
          <p className="text-sm text-gray-500">
            {isOver ? '設備を配置' : 'ドロップしてください'}
          </p>
        </div>
      ) : (
        <div className="relative">
          <EquipmentCard equipment={equipment} isPlaced={true} />
          {onRemove && (
            <button
              onClick={() => onRemove(equipment.id)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
              aria-label="Remove equipment"
            >
              ×
            </button>
          )}
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
            {position}
          </div>
        </div>
      )}
    </div>
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">配置エリア</h2>
        <p className="text-gray-600">設備を順番に配置してください（5つすべて配置する必要があります）</p>
      </div>

      {/* Slots Container - Responsive */}
      <div className="flex flex-col lg:flex-row items-center gap-4 overflow-x-auto pb-4">
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
