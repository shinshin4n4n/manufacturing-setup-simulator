'use client';

import React, { useEffect, useState } from 'react';

export interface TimerProps {
  /**
   * Timer start timestamp (milliseconds since epoch)
   */
  startTime: number | null;

  /**
   * Whether the timer is running
   */
  isRunning: boolean;

  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * Format elapsed time in MM:SS format
 */
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const Timer: React.FC<TimerProps> = ({
  startTime,
  isRunning,
  className = '',
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isRunning || startTime === null) {
      return;
    }

    // Update timer every 100ms for smooth display
    const intervalId = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      setElapsedTime(elapsed);
    }, 100);

    return () => clearInterval(intervalId);
  }, [startTime, isRunning]);

  // If timer is stopped, calculate final time
  useEffect(() => {
    if (!isRunning && startTime !== null) {
      const finalTime = Date.now() - startTime;
      setElapsedTime(finalTime);
    }
  }, [isRunning, startTime]);

  return (
    <div
      className={`flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 rounded-xl shadow-md border-2 border-blue-200 ${className}`}
    >
      <span className="text-xl">⏱️</span>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">経過時間</span>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">
          {formatTime(elapsedTime)}
        </span>
      </div>
    </div>
  );
};
