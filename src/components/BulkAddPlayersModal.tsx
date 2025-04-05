import React, { useState, useContext } from 'react';
import { DraftContext } from '../App';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (names: string[]) => Promise<void>;
  isLoading?: boolean;
}

export const BulkAddPlayersModal: React.FC<Props> = ({ isOpen, onClose, onAdd, isLoading = false }) => {
  const [playerNames, setPlayerNames] = useState<string>('');
  const { currentDraft } = useContext(DraftContext);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !playerNames.trim()) return;

    // Split by newlines and filter out empty lines
    const names = playerNames
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) return;

    await onAdd(names);
    setPlayerNames('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold dark:text-white">Bulk Add Players</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isLoading}
            type="button"
          >
            ✕
          </button>
        </div>
        
        {!currentDraft && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
            Please select a draft first to add players.
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enter one player name per line:
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70"
              placeholder="John Smith
Michael Johnson
Sarah Williams"
              value={playerNames}
              onChange={(e) => setPlayerNames(e.target.value)}
              disabled={isLoading || !currentDraft}
              rows={10}
            />
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Players will be added with default stats. You can edit them later.
          </div>
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
            disabled={isLoading || !currentDraft || !playerNames.trim()}
          >
            {isLoading ? 'Adding...' : 'Add Players'}
          </button>
        </div>
      </form>
    </div>
  );
}; 