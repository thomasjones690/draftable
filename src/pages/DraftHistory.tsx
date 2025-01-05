import React from 'react';
import { Player } from '../types';
import { calculateScore } from '../utils/calculateScore';

interface Props {
  players: Player[];
}

export const DraftHistory: React.FC<Props> = ({ players }) => {
  const draftedPlayers = players
    .filter(player => player.drafted)
    .sort((a, b) => (b.draftedAt || 0) - (a.draftedAt || 0)); // Sort by draft timestamp

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white">
          Draft History
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Player</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Team</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Stats</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {draftedPlayers.map((player) => (
                <tr key={player.id}>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.name}
                    {player.draftedAt && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(player.draftedAt).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.draftedBy}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    <span className="space-x-2">
                      <span>PPG: {player.ppg}</span>
                      <span>RPG: {player.rpg}</span>
                      <span>APG: {player.apg}</span>
                      <span>FG: {player.fg}%</span>
                      <span>FI: {player.fi}</span>
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {calculateScore(player)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 