import React, { useState, useEffect } from 'react';
import { Team } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onUpdate: (team: Team) => void;
}

export const TeamEditModal: React.FC<Props> = ({ isOpen, onClose, team, onUpdate }) => {
  const [editedTeam, setEditedTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (team) {
      setEditedTeam(team);
    }
  }, [team]);

  if (!isOpen || !team || !editedTeam) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTeam) {
      onUpdate(editedTeam);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={editedTeam.name}
                onChange={(e) => setEditedTeam({ ...editedTeam, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Captain
              </label>
              <input
                type="text"
                value={editedTeam.captain}
                onChange={(e) => setEditedTeam({ ...editedTeam, captain: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
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
        </form>
      </div>
    </div>
  );
}; 