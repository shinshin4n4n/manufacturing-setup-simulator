'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
import {
  DraggableEquipmentCard,
  PlacementArea,
  EquipmentDragOverlay,
  ScoreDisplay,
  HintPanel,
  HintDisplay,
  Timer,
  type Equipment,
  type HintData,
} from '@/components/game';
import { Button, Loading } from '@/components/ui';
import { useGameStore } from '@/store/gameStore';
import {
  playDropSound,
  playCompleteSound,
  playScoreSound,
  resumeAudioContext,
} from '@/lib/utils';
import { showToast, showErrorWithRetry } from '@/lib/utils/toast';

export default function GamePage() {
  const router = useRouter();
  const {
    gameState,
    equipments,
    placedSequence,
    totalTime,
    optimalTime,
    hintsUsed,
    timerStartTime,
    isMuted,
    setGameState,
    setSessionId,
    setEquipments,
    setOptimalData,
    addPlacedEquipment,
    removePlacedEquipment,
    setTotalTime,
    addHintUsage,
    startTimer,
    stopTimer,
    toggleMute,
    resetGame,
  } = useGameStore();

  const [activeEquipment, setActiveEquipment] = useState<Equipment | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [scoreData, setScoreData] = useState<{
    score: number;
    rank: 'S' | 'A' | 'B' | 'C' | 'D';
    ranking: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hintData, setHintData] = useState<HintData | null>(null);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Calculate total time when placement changes
  useEffect(() => {
    if (placedSequence.length > 0) {
      calculateCurrentTime();
    } else {
      setTotalTime(0);
    }
  }, [placedSequence]);

  const initializeGame = async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    setGameState('loading');
    const loadingToast = showToast.loading('ゲームを初期化中...');

    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to start game');
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setEquipments(data.equipments);
      setOptimalData(data.optimalTime, data.optimalSequence);
      setGameState('playing');
      startTimer();

      // Resume audio context on user interaction
      resumeAudioContext();

      showToast.dismiss(loadingToast);
      showToast.success('ゲームを開始しました！');
    } catch (error) {
      console.error('Error initializing game:', error);
      showToast.dismiss(loadingToast);

      // Retry logic with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        showToast.warning(`再試行中... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => initializeGame(retryCount + 1), delay);
      } else {
        // Show error with retry button after max retries
        showErrorWithRetry(
          'ゲームの初期化に失敗しました。ネットワーク接続を確認してください。',
          () => initializeGame(0)
        );
        router.push('/');
      }
    }
  };

  const calculateCurrentTime = async () => {
    if (placedSequence.length < 2) {
      setTotalTime(0);
      return;
    }

    setIsCalculating(true);
    try {
      const sequence = placedSequence
        .sort((a, b) => a.position - b.position)
        .map((pe) => pe.equipment.code);

      const response = await fetch('/api/game/calculate-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate time');
      }

      const data = await response.json();
      setTotalTime(data.totalTime);
    } catch (error) {
      console.error('Error calculating time:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    const equipment = event.active.data.current?.equipment as Equipment;
    setActiveEquipment(equipment);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveEquipment(null);

    if (!over) return;

    const equipment = active.data.current?.equipment as Equipment;
    if (!equipment) return;

    // Check if already placed
    const isAlreadyPlaced = placedSequence.some(
      (pe) => pe.equipment.id === equipment.id
    );

    if (isAlreadyPlaced) return;

    // Extract position from drop zone ID (e.g., "placement-slot-1" -> 0)
    const slotId = over.id as string;
    const match = slotId.match(/placement-slot-(\d+)/);
    if (!match) return;

    const position = parseInt(match[1], 10) - 1;
    addPlacedEquipment(equipment, position);

    // Play drop sound
    playDropSound();

    // Check if all equipment placed and play complete sound
    if (placedSequence.length + 1 === equipments.length) {
      setTimeout(() => playCompleteSound(), 200);
    }
  };

  const handleRemoveEquipment = (equipmentId: string) => {
    removePlacedEquipment(equipmentId);
  };

  const handleReset = () => {
    if (confirm('ゲームをリセットしてもよろしいですか？')) {
      resetGame();
      initializeGame();
    }
  };

  const handleComplete = async () => {
    if (placedSequence.length !== equipments.length) {
      showToast.warning('すべての設備を配置してください');
      return;
    }

    setGameState('loading');
    const loadingToast = showToast.loading('スコアを送信中...');

    try {
      const sequence = placedSequence
        .sort((a, b) => a.position - b.position)
        .map((pe) => pe.equipment.code);

      const response = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: 'Player', // TODO: Get from user input
          sequence,
          totalTime,
          difficulty: 1,
          hintsUsed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit score');
      }

      const data = await response.json();
      setScoreData({
        score: data.score,
        rank: data.rank,
        ranking: data.ranking,
      });
      setGameState('finished');
      stopTimer();
      setShowScore(true);

      showToast.dismiss(loadingToast);
      showToast.success('スコアを送信しました！');

      // Play score display sound
      setTimeout(() => playScoreSound(), 300);
    } catch (error) {
      console.error('Error submitting score:', error);
      showToast.dismiss(loadingToast);
      showErrorWithRetry(
        'スコアの送信に失敗しました',
        handleComplete
      );
      setGameState('playing');
    }
  };

  const handlePlayAgain = () => {
    setShowScore(false);
    resetGame();
    initializeGame();
  };

  const handleViewRanking = () => {
    router.push('/ranking');
  };

  const handleHintRequest = async (level: 1 | 2 | 3) => {
    try {
      // Prepare request body based on hint level
      const requestBody: {
        level: 1 | 2 | 3;
        difficulty: number;
        lastPlacedCode?: string | null;
        availableCodes?: string[];
      } = { level, difficulty: 1 };

      // Level 3 doesn't require available equipment or last placed code
      if (level !== 3) {
        // Get available equipment (not yet placed)
        const placedIds = placedSequence.map((pe) => pe.equipment.id);
        const availableEquipment = equipments.filter(
          (eq) => !placedIds.includes(eq.id)
        );

        // Get last placed equipment code
        const lastPlaced =
          placedSequence.length > 0
            ? placedSequence.sort((a, b) => b.position - a.position)[0]
                .equipment.code
            : null;

        requestBody.lastPlacedCode = lastPlaced;
        requestBody.availableCodes = availableEquipment.map((eq) => eq.code);
      }

      const response = await fetch('/api/game/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch hint');
      }

      const data = await response.json();
      setHintData(data);
      addHintUsage();
    } catch (error) {
      console.error('Error fetching hint:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'ヒントの取得に失敗しました';
      showToast.error(errorMessage);
    }
  };

  const handleCloseHint = () => {
    setHintData(null);
  };

  const isComplete = placedSequence.length === equipments.length;
  const isEquipmentPlaced = (equipmentId: string) =>
    placedSequence.some((pe) => pe.equipment.id === equipmentId);

  const getAvailableEquipment = () => {
    const placedIds = placedSequence.map((pe) => pe.equipment.id);
    return equipments.filter((eq) => !placedIds.includes(eq.id));
  };

  const getLastPlacedCode = () => {
    if (placedSequence.length === 0) return null;
    const sorted = [...placedSequence].sort((a, b) => b.position - a.position);
    return sorted[0].equipment.code;
  };

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="読み込み中..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🏭 段取りシミュレーションゲーム
            </motion.h1>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <Timer
                startTime={timerStartTime}
                isRunning={gameState === 'playing'}
              />

              {/* Mute Button */}
              <motion.button
                onClick={toggleMute}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all"
                title={isMuted ? '音声をオンにする' : '音声をオフにする'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">
                  {isMuted ? '🔇' : '🔊'}
                </span>
              </motion.button>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleReset}>
                  リセット
                </Button>
                <Button variant="secondary" onClick={() => router.push('/')}>
                  ホームに戻る
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl xl:max-w-[1280px] mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Side: Equipment Cards */}
            <div className="lg:col-span-1 order-1 lg:order-1">
              <motion.div
                className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-xl shadow-xl border border-blue-100 p-4 sm:p-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-2xl">📦</span>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    設備一覧
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 pl-8">
                  設備をドラッグして配置エリアにドロップしてください
                </p>
                <div className="space-y-3 sm:space-y-4">
                  {equipments.map((equipment) => (
                    <DraggableEquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      isPlaced={isEquipmentPlaced(equipment.id)}
                      disabled={isEquipmentPlaced(equipment.id)}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Hint Panel */}
              <motion.div
                className="mt-4 sm:mt-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <HintPanel
                  availableEquipment={getAvailableEquipment()}
                  lastPlacedCode={getLastPlacedCode()}
                  hintsUsed={hintsUsed}
                  maxHints={3}
                  onHintRequest={handleHintRequest}
                />
              </motion.div>
            </div>

            {/* Right Side: Placement Area */}
            <div className="lg:col-span-2 order-2 lg:order-2">
              <motion.div
                className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-xl shadow-xl border border-indigo-100 p-4 sm:p-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <PlacementArea
                  placedEquipment={placedSequence}
                  onRemoveEquipment={handleRemoveEquipment}
                />
              </motion.div>

              {/* Hint Display */}
              {hintData && (
                <motion.div
                  className="mt-4 sm:mt-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <HintDisplay hintData={hintData} onClose={handleCloseHint} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Drag Overlay */}
          <EquipmentDragOverlay activeEquipment={activeEquipment} />
        </DndContext>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-white via-indigo-50 to-purple-50 shadow-lg border-t-4 border-indigo-500 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-4 bg-white rounded-xl shadow-md px-6 py-4 border-2 border-indigo-200"
              animate={isCalculating ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: isCalculating ? Infinity : 0, duration: 1 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="text-sm font-medium text-gray-700">
                  段取り時間:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">
                  {isCalculating ? '計算中...' : `${totalTime}分`}
                </span>
                {optimalTime > 0 && !isCalculating && (
                  <span className="text-sm text-gray-500">
                    (最適: {optimalTime}分)
                  </span>
                )}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleComplete}
                disabled={!isComplete || gameState !== 'playing'}
              >
                🎯 完了
              </Button>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Score Display Modal */}
      {scoreData && (
        <ScoreDisplay
          isOpen={showScore}
          userTime={totalTime}
          optimalTime={optimalTime}
          score={scoreData.score}
          rank={scoreData.rank}
          onClose={() => setShowScore(false)}
          onPlayAgain={handlePlayAgain}
          onViewRanking={handleViewRanking}
        />
      )}
    </div>
  );
}
