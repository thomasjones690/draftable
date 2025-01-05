import React from 'react';
import { Player } from '../types';

interface Props {
  recommendedPick: Player;
  calculateScore: (player: Player) => string;
  label: string;
}

export const RecommendedPick: React.FC<Props> = ({ recommendedPick, calculateScore, label }) => {
  return (
    <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg h-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex-1">
          <p className="text-base sm:text-lg font-bold text-green-700 dark:text-green-300 mb-1">
            {label}
          </p>
          <div className="text-sm sm:text-base text-green-900 dark:text-green-100 space-y-1">
            <p className="font-medium">{recommendedPick.name} - Score: {calculateScore(recommendedPick)}</p>
            <p className="flex flex-wrap gap-x-4">
              <span>PPG: {recommendedPick.ppg}</span>
              <span>RPG: {recommendedPick.rpg}</span>
              <span>APG: {recommendedPick.apg}</span>
              <span>FI: {recommendedPick.fi}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 