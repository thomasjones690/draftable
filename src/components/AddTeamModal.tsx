import React from 'react';
import { Team } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (team: Omit<Team, 'id' | 'players'>) => void;
  isLoading?: boolean;
}

export const AddTeamModal: React.FC<Props> = ({ isOpen, onClose, onAdd, isLoading = false }) => {
  const [teamName, setTeamName] = React.useState('');
  const [captainName, setCaptainName] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !captainName || isLoading) return;

    onAdd({
      name: teamName,
      captain: captainName,
    });

    // We'll let the onAdd handler close the modal after the async operation completes
    // Only reset the form fields here
    setTeamName('');
    setCaptainName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold dark:text-white">Add New Team</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isLoading}
            type="button"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70"
            placeholder="Captain Name"
            value={captainName}
            onChange={(e) => setCaptainName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white text-sm sm:text-base disabled:opacity-70"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Team'}
          </button>
        </div>
      </form>
    </div>
  );
}; 