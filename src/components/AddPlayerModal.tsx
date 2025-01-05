import React from 'react';
import { NewPlayer } from '../types';
import { PlayerInput } from './PlayerInput';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newPlayer: NewPlayer;
  setNewPlayer: (player: NewPlayer) => void;
  onAdd: () => void;
}

export const AddPlayerModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  newPlayer, 
  setNewPlayer,
  onAdd 
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Player</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <PlayerInput
              label="Name"
              value={newPlayer.name}
              onChange={(value) => setNewPlayer({ ...newPlayer, name: value })}
            />
            <PlayerInput
              label="PPG"
              value={newPlayer.ppg}
              onChange={(value) => setNewPlayer({ ...newPlayer, ppg: value })}
              type="number"
            />
            <PlayerInput
              label="RPG"
              value={newPlayer.rpg}
              onChange={(value) => setNewPlayer({ ...newPlayer, rpg: value })}
              type="number"
            />
            <PlayerInput
              label="APG"
              value={newPlayer.apg}
              onChange={(value) => setNewPlayer({ ...newPlayer, apg: value })}
              type="number"
            />
            <PlayerInput
              label="FG%"
              value={newPlayer.fg}
              onChange={(value) => setNewPlayer({ ...newPlayer, fg: value })}
              type="number"
            />
            <PlayerInput
              label="FI"
              value={newPlayer.fi}
              onChange={(value) => setNewPlayer({ ...newPlayer, fi: value })}
              type="number"
            />
          </div>
          <div className="flex justify-end gap-2">
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
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 