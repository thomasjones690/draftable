import React from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface Props {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const DraftTimerControls: React.FC<Props> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={isRunning ? onPause : onStart}
        className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        {isRunning ? (
          <PauseIcon className="h-6 w-6" />
        ) : (
          <PlayIcon className="h-6 w-6" />
        )}
      </button>
      <button
        onClick={onReset}
        className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
      >
        <ArrowPathIcon className="h-6 w-6" />
      </button>
    </div>
  );
}; 