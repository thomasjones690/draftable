import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Draft } from '../types';
import { getDrafts, createDraft } from '../services/supabaseStorage';
import { isSupabaseConfigured } from '../services/supabase';

export const DraftsListPage = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDraftName, setNewDraftName] = useState('');
  const [newDraftDescription, setNewDraftDescription] = useState('');
  const [showNewDraftForm, setShowNewDraftForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setError('Supabase is not configured. Please set environment variables.');
          setLoading(false);
          return;
        }
        
        const draftsList = await getDrafts();
        setDrafts(draftsList);
        setLoading(false);
      } catch (err) {
        console.error('Error loading drafts:', err);
        setError('Failed to load drafts. Please try again later.');
        setLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDraftName.trim()) {
      setError('Draft name is required');
      return;
    }

    try {
      setLoading(true);
      const newDraft = await createDraft(newDraftName, newDraftDescription || undefined);
      
      if (newDraft) {
        setDrafts([newDraft, ...drafts]);
        setNewDraftName('');
        setNewDraftDescription('');
        setShowNewDraftForm(false);
        navigate(`/draft/${newDraft.id}`);
      } else {
        setError('Failed to create draft');
      }
    } catch (err) {
      console.error('Error creating draft:', err);
      setError('Failed to create draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Draft Hub</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          View all your drafts or create a new one
        </p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-8">
        {showNewDraftForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Create New Draft</h2>
            <form onSubmit={handleCreateDraft}>
              <div className="mb-4">
                <label htmlFor="draftName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Draft Name*
                </label>
                <input
                  id="draftName"
                  type="text"
                  value={newDraftName}
                  onChange={(e) => setNewDraftName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter draft name"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="draftDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="draftDescription"
                  value={newDraftDescription}
                  onChange={(e) => setNewDraftDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewDraftForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Draft'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowNewDraftForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Create New Draft
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Drafts</h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : drafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <div 
                key={draft.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => navigate(`/draft/${draft.id}`)}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{draft.name}</h3>
                  {draft.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">{draft.description}</p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Created: {new Date(draft.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">No drafts available. Create your first draft!</p>
          </div>
        )}
      </div>
    </div>
  );
}; 