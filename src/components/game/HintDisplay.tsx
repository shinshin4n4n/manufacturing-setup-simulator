'use client';

import React from 'react';
import type { Equipment } from './EquipmentCard';

export interface HintData {
  level: 1 | 2 | 3;
  candidates?: Equipment[]; // For level 1 and 2
  matrix?: Array<{
    from: string;
    to: string;
    time: number;
  }>; // For level 3
}

export interface HintDisplayProps {
  hintData: HintData | null;
  onClose: () => void;
}

export const HintDisplay: React.FC<HintDisplayProps> = ({
  hintData,
  onClose,
}) => {
  if (!hintData) return null;

  const renderLevel1 = () => {
    if (!hintData.candidates || hintData.candidates.length === 0) {
      return <p className="text-gray-600">候補がありません</p>;
    }

    return (
      <div>
        <p className="text-gray-700 mb-4">
          次に配置すると段取り時間が短くなる可能性が高い設備:
        </p>
        <div className="space-y-3">
          {hintData.candidates.slice(0, 2).map((equipment, index) => (
            <div
              key={equipment.id}
              className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-blue-600">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {equipment.code}: {equipment.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {equipment.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLevel2 = () => {
    if (!hintData.candidates || hintData.candidates.length === 0) {
      return <p className="text-gray-600">候補がありません</p>;
    }

    const bestEquipment = hintData.candidates[0];

    return (
      <div>
        <p className="text-gray-700 mb-4">最適な次の設備:</p>
        <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-400">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎯</span>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">
                {bestEquipment.code}: {bestEquipment.name}
              </h4>
              <p className="text-gray-600 mt-1">{bestEquipment.description}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          この設備を次に配置すると、段取り時間が最も短くなります
        </p>
      </div>
    );
  };

  const renderLevel3 = () => {
    if (!hintData.matrix || hintData.matrix.length === 0) {
      return <p className="text-gray-600">マトリックスデータがありません</p>;
    }

    // Get unique equipment codes
    const allCodes = Array.from(
      new Set([
        ...hintData.matrix.map((m) => m.from),
        ...hintData.matrix.map((m) => m.to),
      ])
    ).sort();

    // Create matrix lookup
    const matrixLookup = new Map<string, number>();
    hintData.matrix.forEach((m) => {
      matrixLookup.set(`${m.from}-${m.to}`, m.time);
    });

    // Find min and max times for color scaling
    const times = hintData.matrix.map((m) => m.time);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    const getColor = (time: number) => {
      if (time === 0) return 'bg-gray-100 text-gray-400';

      const ratio = (time - minTime) / (maxTime - minTime);
      if (ratio < 0.33) return 'bg-green-100 text-green-800 font-bold';
      if (ratio < 0.67) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    };

    return (
      <div>
        <p className="text-gray-700 mb-4">
          段取り時間マトリックス（単位: 分）
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-100 p-2 text-sm font-bold">
                  From \ To
                </th>
                {allCodes.map((code) => (
                  <th
                    key={code}
                    className="border border-gray-300 bg-gray-100 p-2 text-sm font-bold"
                  >
                    {code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCodes.map((fromCode) => (
                <tr key={fromCode}>
                  <td className="border border-gray-300 bg-gray-100 p-2 text-sm font-bold">
                    {fromCode}
                  </td>
                  {allCodes.map((toCode) => {
                    const time = matrixLookup.get(`${fromCode}-${toCode}`) || 0;
                    return (
                      <td
                        key={toCode}
                        className={`border border-gray-300 p-2 text-center text-sm ${getColor(
                          time
                        )}`}
                      >
                        {time}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">短い時間</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-gray-600">中程度</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-gray-600">長い時間</span>
          </div>
        </div>
      </div>
    );
  };

  const renderHintContent = () => {
    switch (hintData.level) {
      case 1:
        return renderLevel1();
      case 2:
        return renderLevel2();
      case 3:
        return renderLevel3();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-400">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          ヒント {hintData.level}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {renderHintContent()}
    </div>
  );
};
