import React, { useState, useEffect } from 'react';

interface Props {
  duration: number;
  isRunning: boolean;
  onTimeUp: () => void;
  resetSignal?: number; // Timestamp to trigger reset
}

export const DraftTimer: React.FC<Props> = ({ duration, isRunning, onTimeUp, resetSignal }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Update when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Reset timer when resetSignal changes
  useEffect(() => {
    if (resetSignal) {
      setTimeLeft(duration);
    }
  }, [resetSignal, duration]);

  useEffect(() => {
    let timer: number;

    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-4xl font-mono font-bold text-center dark:text-white">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}; 