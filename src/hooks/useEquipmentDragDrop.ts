import { useState, useCallback } from 'react';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Equipment } from '@/components/game/EquipmentCard';

export interface PlacedEquipment {
  equipment: Equipment;
  position: number;
}

export interface UseEquipmentDragDropReturn {
  placedEquipment: PlacedEquipment[];
  activeEquipment: Equipment | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  isEquipmentPlaced: (equipmentId: string) => boolean;
  removeEquipment: (equipmentId: string) => void;
  resetPlacement: () => void;
  getNextPosition: () => number;
}

export function useEquipmentDragDrop(): UseEquipmentDragDropReturn {
  const [placedEquipment, setPlacedEquipment] = useState<PlacedEquipment[]>([]);
  const [activeEquipment, setActiveEquipment] = useState<Equipment | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const equipment = active.data.current?.equipment as Equipment | undefined;

    if (equipment) {
      setActiveEquipment(equipment);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveEquipment(null);

    if (!over) {
      return;
    }

    const equipment = active.data.current?.equipment as Equipment | undefined;

    if (!equipment) {
      return;
    }

    // Check if equipment is already placed
    const isAlreadyPlaced = placedEquipment.some(
      (pe) => pe.equipment.id === equipment.id
    );

    if (isAlreadyPlaced) {
      return;
    }

    // Add equipment to placed list with next position
    const nextPosition = placedEquipment.length;
    setPlacedEquipment((prev) => [
      ...prev,
      { equipment, position: nextPosition },
    ]);
  }, [placedEquipment]);

  const handleDragCancel = useCallback(() => {
    setActiveEquipment(null);
  }, []);

  const isEquipmentPlaced = useCallback(
    (equipmentId: string): boolean => {
      return placedEquipment.some((pe) => pe.equipment.id === equipmentId);
    },
    [placedEquipment]
  );

  const removeEquipment = useCallback((equipmentId: string) => {
    setPlacedEquipment((prev) =>
      prev
        .filter((pe) => pe.equipment.id !== equipmentId)
        .map((pe, index) => ({ ...pe, position: index }))
    );
  }, []);

  const resetPlacement = useCallback(() => {
    setPlacedEquipment([]);
    setActiveEquipment(null);
  }, []);

  const getNextPosition = useCallback(() => {
    return placedEquipment.length;
  }, [placedEquipment]);

  return {
    placedEquipment,
    activeEquipment,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    isEquipmentPlaced,
    removeEquipment,
    resetPlacement,
    getNextPosition,
  };
}
