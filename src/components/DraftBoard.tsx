import React, { useState } from 'react';
import { Player, Team } from '../types';

interface Props {
  players: Player[];
  teams: Team[];
  calculateScore: (player: Player) => string;
  markAsDrafted: (playerId: number, teamName: string) => void;
  onEditPlayer: (player: Player) => void;
  onAddPlayer: () => void;
}

export const DraftBoard: React.FC<Props> = ({
  players,
  teams,
  calculateScore,
  markAsDrafted,
  onEditPlayer,
  onAddPlayer
}) => {
  // Track selected team for each player
  const [selectedTeams, setSelectedTeams] = useState<Record<number, string>>({});
  
  // Filter out drafted players
  const availablePlayers = players.filter(player => !player.drafted);

  const handleTeamSelect = (playerId: number, teamName: string) => {
    setSelectedTeams(prev => ({
      ...prev,
      [playerId]: teamName
    }));
  };

  const handleMarkAsDrafted = (playerId: number) => {
    const teamName = selectedTeams[playerId];
    if (!teamName) return;

    markAsDrafted(playerId, teamName);
    // Clear the selection after marking as drafted
    setSelectedTeams(prev => {
      const updated = { ...prev };
      delete updated[playerId];
      return updated;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold dark:text-white">Live Draft Board</h2>
        <button
          onClick={onAddPlayer}
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Add New Player
        </button>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Rank</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Name</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">PPG</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">RPG</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">APG</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">FG%</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">FI</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Score</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Status</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availablePlayers.map((player) => (
                <tr key={player.id} className="border-b dark:border-gray-700">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.rank}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onEditPlayer(player);
                      }}
                      className="text-left w-full cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600 dark:focus:text-blue-400"
                    >
                      {player.name}
                    </button>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.ppg}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.rpg}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.apg}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.fg}%
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {player.fi}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm dark:text-gray-200">
                    {calculateScore(player)}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                    {player.drafted ? (
                      <span className="text-red-600 dark:text-red-400">
                        Drafted by {player.draftedBy}
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <div className="flex items-center gap-2">
                      <select
                        className="px-2 py-1 border rounded-lg text-xs sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={selectedTeams[player.id] || ""}
                        onChange={(e) => handleTeamSelect(player.id, e.target.value)}
                      >
                        <option value="">Select Team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.name}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleMarkAsDrafted(player.id)}
                        disabled={!selectedTeams[player.id]}
                        className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs sm:text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark as Drafted
                      </button>
                    </div>
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