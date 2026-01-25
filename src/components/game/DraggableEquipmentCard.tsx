import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { EquipmentCard, Equipment } from './EquipmentCard';

export interface DraggableEquipmentCardProps {
  equipment: Equipment;
  isPlaced?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const DraggableEquipmentCard: React.FC<DraggableEquipmentCardProps> = ({
  equipment,
  isPlaced = false,
  onClick,
  disabled = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: equipment.id,
    disabled: disabled || isPlaced,
    data: {
      equipment,
    },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <EquipmentCard
        equipment={equipment}
        isDragging={isDragging}
        isPlaced={isPlaced}
        onClick={onClick}
      />
    </div>
  );
};
