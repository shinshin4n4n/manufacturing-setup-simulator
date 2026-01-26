'use client';

import React, { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import type { Equipment } from './EquipmentCard';
import { showToast } from '@/lib/utils/toast';

export interface HintPanelProps {
  /**
   * Available equipment that can be placed next
   */
  availableEquipment: Equipment[];

  /**
   * Last placed equipment code (null if none placed yet)
   */
  lastPlacedCode: string | null;

  /**
   * Current hint usage count
   */
  hintsUsed: number;

  /**
   * Maximum hints allowed
   */
  maxHints: number;

  /**
   * Callback when a hint is requested
   */
  onHintRequest: (level: 1 | 2 | 3) => void;

  /**
   * Setup time matrix data for level 3
   */
  setupMatrix?: Array<{
    from: string;
    to: string;
    time: number;
  }>;
}

interface HintLevel {
  level: 1 | 2 | 3;
  title: string;
  description: string;
  icon: string;
}

const hintLevels: HintLevel[] = [
  {
    level: 1,
    title: '候補を2つ表示',
    description: '次に配置すべき設備の候補を2つ表示します',
    icon: '💡',
  },
  {
    level: 2,
    title: '最適な次の設備を表示',
    description: '最適な次の設備を1つ表示します',
    icon: '🎯',
  },
  {
    level: 3,
    title: '段取り時間マトリックス表示',
    description: 'すべての設備間の段取り時間を可視化します',
    icon: '📊',
  },
];

export const HintPanel: React.FC<HintPanelProps> = ({
  availableEquipment,
  lastPlacedCode,
  hintsUsed,
  maxHints,
  onHintRequest,
  setupMatrix = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | null>(null);

  const hintsRemaining = maxHints - hintsUsed;
  const canUseHint = hintsRemaining > 0;

  const handleHintClick = (level: 1 | 2 | 3) => {
    if (!canUseHint) {
      showToast.warning('ヒントの使用回数が上限に達しました');
      return;
    }

    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedLevel) {
      onHintRequest(selectedLevel);
      setIsModalOpen(false);
      setSelectedLevel(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedLevel(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">ヒント機能</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">残り:</span>
          <span
            className={`text-xl font-bold ${
              hintsRemaining > 0 ? 'text-blue-600' : 'text-red-600'
            }`}
          >
            {hintsRemaining}/{maxHints}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        ヒントを使用すると、スコアが1回につき5%減点されます
      </p>

      <div className="space-y-3">
        {hintLevels.map((hint) => {
          // Level 3 (matrix) doesn't require available equipment
          const isDisabled = !canUseHint || (hint.level !== 3 && availableEquipment.length === 0);
          const isEnabled = canUseHint && (hint.level === 3 || availableEquipment.length > 0);

          return (
            <button
              key={hint.level}
              onClick={() => handleHintClick(hint.level)}
              disabled={isDisabled}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isEnabled
                  ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{hint.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{hint.title}</h3>
                  <p className="text-sm text-gray-600">{hint.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCancel}>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ヒントを使用しますか？
          </h3>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>注意:</strong> ヒントを使用すると、最終スコアが5%減点されます
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  現在の減点: {hintsUsed * 5}% → 使用後: {(hintsUsed + 1) * 5}%
                </p>
              </div>
            </div>
          </div>

          {selectedLevel && (
            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-3xl">
                  {hintLevels[selectedLevel - 1].icon}
                </span>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {hintLevels[selectedLevel - 1].title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {hintLevels[selectedLevel - 1].description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              className="flex-1"
            >
              使用する
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
