import React, { useState } from 'react';
import { Team, Player } from '../types';
import { AddTeamModal } from '../components/AddTeamModal';
import { calculateScore } from '../utils/calculateScore';
import { TeamEditModal } from '../components/TeamEditModal';

interface Props {
  teams: Team[];
  players: Player[];
  addTeam: (team: Omit<Team, 'id' | 'players'>) => void;
  removeTeam: (teamId: number) => void;
  updateTeam: (team: Team) => void;
}

export const TeamsPage: React.FC<Props> = ({ teams, players, addTeam, removeTeam, updateTeam }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const getTeamPlayers = (teamName: string) => {
    return players.filter(player => player.draftedBy === teamName);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Teams
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Add New Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => {
            const teamPlayers = getTeamPlayers(team.name);
            return (
              <div 
                key={team.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{team.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Captain: {team.captain}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTeam(team)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeTeam(team.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drafted Players ({teamPlayers.length})
                  </h4>
                  {teamPlayers.length > 0 ? (
                    <ul className="space-y-1">
                      {teamPlayers.map(player => (
                        <li 
                          key={player.id}
                          className="text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center"
                        >
                          <span className="font-medium">{player.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs">
                              Score: {calculateScore(player)}
                            </span>
                            <span className="text-xs">
                              PPG: {player.ppg} | RPG: {player.rpg} | APG: {player.apg}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No players drafted yet
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddTeamModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTeam}
      />

      <TeamEditModal
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        team={editingTeam}
        onUpdate={updateTeam}
      />
    </div>
  );
}; 