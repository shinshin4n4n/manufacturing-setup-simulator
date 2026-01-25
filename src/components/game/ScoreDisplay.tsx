import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Rank } from '@/lib/utils';

export interface ScoreDisplayProps {
  isOpen: boolean;
  userTime: number;
  optimalTime: number;
  score: number;
  rank: Rank;
  onClose?: () => void;
  onPlayAgain?: () => void;
  onViewRanking?: () => void;
}

// Rank color configurations
const rankColors: Record<Rank, { bg: string; text: string; border: string; glow: string }> = {
  S: {
    bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    text: 'text-yellow-600',
    border: 'border-yellow-500',
    glow: 'shadow-yellow-500/50',
  },
  A: {
    bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
    text: 'text-gray-600',
    border: 'border-gray-400',
    glow: 'shadow-gray-400/50',
  },
  B: {
    bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
    text: 'text-orange-600',
    border: 'border-orange-500',
    glow: 'shadow-orange-500/50',
  },
  C: {
    bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-500',
    glow: 'shadow-blue-500/50',
  },
  D: {
    bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
    text: 'text-gray-600',
    border: 'border-gray-500',
    glow: 'shadow-gray-500/50',
  },
};

// Rank messages
const rankMessages: Record<Rank, string> = {
  S: '完璧です！最適解を達成しました！',
  A: '素晴らしい！ほぼ最適な配置です！',
  B: '良い結果です！もう少しで最適解です！',
  C: 'まずまずです。もっと改善できます！',
  D: '頑張りましょう！最適な配置を探してみてください！',
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  isOpen,
  userTime,
  optimalTime,
  score,
  rank,
  onClose,
  onPlayAgain,
  onViewRanking,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedUserTime, setAnimatedUserTime] = useState(0);
  const [animatedOptimalTime, setAnimatedOptimalTime] = useState(0);

  // Animate numbers on mount
  useEffect(() => {
    if (!isOpen) {
      // Reset animations when closed
      setAnimatedScore(0);
      setAnimatedUserTime(0);
      setAnimatedOptimalTime(0);
      return;
    }

    // Animate user time
    const userTimeDuration = 1000;
    const userTimeSteps = 20;
    const userTimeIncrement = userTime / userTimeSteps;
    let userTimeCount = 0;

    const userTimeInterval = setInterval(() => {
      userTimeCount += userTimeIncrement;
      if (userTimeCount >= userTime) {
        setAnimatedUserTime(userTime);
        clearInterval(userTimeInterval);
      } else {
        setAnimatedUserTime(Math.floor(userTimeCount));
      }
    }, userTimeDuration / userTimeSteps);

    // Animate optimal time
    const optimalTimeDuration = 1000;
    const optimalTimeSteps = 20;
    const optimalTimeIncrement = optimalTime / optimalTimeSteps;
    let optimalTimeCount = 0;

    const optimalTimeInterval = setInterval(() => {
      optimalTimeCount += optimalTimeIncrement;
      if (optimalTimeCount >= optimalTime) {
        setAnimatedOptimalTime(optimalTime);
        clearInterval(optimalTimeInterval);
      } else {
        setAnimatedOptimalTime(Math.floor(optimalTimeCount));
      }
    }, optimalTimeDuration / optimalTimeSteps);

    // Animate score (with delay)
    setTimeout(() => {
      const scoreDuration = 1500;
      const scoreSteps = 30;
      const scoreIncrement = score / scoreSteps;
      let scoreCount = 0;

      const scoreInterval = setInterval(() => {
        scoreCount += scoreIncrement;
        if (scoreCount >= score) {
          setAnimatedScore(score);
          clearInterval(scoreInterval);
        } else {
          setAnimatedScore(Math.floor(scoreCount * 100) / 100);
        }
      }, scoreDuration / scoreSteps);

      return () => clearInterval(scoreInterval);
    }, 500);

    return () => {
      clearInterval(userTimeInterval);
      clearInterval(optimalTimeInterval);
    };
  }, [isOpen, userTime, optimalTime, score]);

  const rankStyle = rankColors[rank];

  return (
    <Modal isOpen={isOpen} onClose={onClose || (() => {})} title="結果発表">
      <div className="space-y-6">
        {/* Rank Badge */}
        <div className="flex flex-col items-center">
          <div
            className={`w-32 h-32 rounded-full ${rankStyle.bg} ${rankStyle.glow} shadow-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-110 animate-pulse`}
          >
            <span className="text-6xl font-bold text-white">{rank}</span>
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            {rankMessages[rank]}
          </p>
        </div>

        {/* Score Information */}
        <div className="space-y-4">
          {/* User Time */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                あなたの段取り時間
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {animatedUserTime}分
              </span>
            </div>
          </div>

          {/* Optimal Time */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-700">
                最適な段取り時間
              </span>
              <span className="text-2xl font-bold text-green-600">
                {animatedOptimalTime}分
              </span>
            </div>
          </div>

          {/* Score */}
          <div className={`bg-white rounded-lg p-4 border-2 ${rankStyle.border}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">スコア</span>
              <span className={`text-3xl font-bold ${rankStyle.text}`}>
                {animatedScore.toFixed(1)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${rankStyle.bg} transition-all duration-1000 ease-out`}
                style={{ width: `${animatedScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Comparison */}
        {userTime > optimalTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 最適解より
              <span className="font-bold text-blue-900">
                {' '}
                {userTime - optimalTime}分
              </span>{' '}
              多くかかりました。
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            className="flex-1"
            onClick={onPlayAgain}
          >
            もう一度
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onViewRanking}
          >
            ランキング
          </Button>
        </div>
      </div>
    </Modal>
  );
};
