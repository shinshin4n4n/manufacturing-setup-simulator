import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { EquipmentCard, Equipment } from './EquipmentCard';

export interface EquipmentDragOverlayProps {
  activeEquipment: Equipment | null;
}

export const EquipmentDragOverlay: React.FC<EquipmentDragOverlayProps> = ({
  activeEquipment,
}) => {
  return (
    <DragOverlay dropAnimation={null}>
      {activeEquipment ? (
        <div className="cursor-grabbing">
          <EquipmentCard
            equipment={activeEquipment}
            isDragging={true}
          />
        </div>
      ) : null}
    </DragOverlay>
  );
};
