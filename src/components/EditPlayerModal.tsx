import React, { useState, useEffect } from 'react';
import { Player, Team } from '../types';
import { PlayerInput } from './PlayerInput';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  teams: Team[];
  onUpdate: (player: Player) => void;
  onRemove: (playerId: number) => void;
}

export const EditPlayerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  player,
  teams,
  onUpdate,
  onRemove
}) => {
  const [editedPlayer, setEditedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (player) {
      setEditedPlayer(player);
    }
  }, [player]);

  if (!isOpen || !player || !editedPlayer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedPlayer) {
      onUpdate(editedPlayer);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Player</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <PlayerInput
              label="Name"
              value={editedPlayer.name}
              onChange={(value) => setEditedPlayer({ ...editedPlayer, name: value })}
            />
            <PlayerInput
              label="PPG"
              value={editedPlayer.ppg.toString()}
              onChange={(value) => setEditedPlayer({ ...editedPlayer, ppg: parseFloat(value) || 0 })}
              type="number"
            />
            <PlayerInput
              label="RPG"
              value={editedPlayer.rpg.toString()}
              onChange={(value) => setEditedPlayer({ ...editedPlayer, rpg: parseFloat(value) || 0 })}
              type="number"
            />
            <PlayerInput
              label="APG"
              value={editedPlayer.apg.toString()}
              onChange={(value) => setEditedPlayer({ ...editedPlayer, apg: parseFloat(value) || 0 })}
              type="number"
            />
            <PlayerInput
              label="FG%"
              value={editedPlayer.fg.toString()}
              onChange={(value) => setEditedPlayer({ ...editedPlayer, fg: parseFloat(value) || 0 })}
              type="number"
            />
            <PlayerInput
              label="FI"
              value={editedPlayer.fi.toString()}
              onChange={(value) => setEditedPlayer({ ...editedPlayer, fi: parseFloat(value) || 0 })}
              type="number"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Team
              </label>
              <select
                value={editedPlayer.draftedBy}
                onChange={(e) => setEditedPlayer({
                  ...editedPlayer,
                  drafted: !!e.target.value,
                  draftedBy: e.target.value
                })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">Undrafted</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                onRemove(editedPlayer.id);
                onClose();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete Player
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}; 