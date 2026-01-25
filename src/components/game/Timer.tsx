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
      className={`flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg ${className}`}
    >
      <span className="text-sm font-medium text-gray-700">経過時間:</span>
      <span className="text-2xl font-bold text-blue-600 font-mono">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
};
