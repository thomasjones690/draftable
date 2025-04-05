import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { Team, Player, Draft } from './types';
import { getTeams, saveTeams, getPlayers, savePlayers } from './services/storage';
import { 
  getTeamsByDraftId,
  getPlayersByDraftId,
  updateTeam,
  deleteTeam,
  createTeam as createSupabaseTeam,
  bulkUpdatePlayers,
} from './services/supabaseStorage';
import { DraftPage } from './pages/Draft';
import { TeamsPage } from './pages/Teams';
import { DraftHistory } from './pages/DraftHistory';
import { DraftsListPage } from './pages/DraftsList';
import { DashboardLayout } from './components/DashboardLayout';
import { isSupabaseConfigured } from './services/supabase';

// Create context for current draft
export const DraftContext = createContext<{
  currentDraft: Draft | null;
  setCurrentDraft: (draft: Draft | null) => void;
}>({
  currentDraft: null,
  setCurrentDraft: () => {}
});

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timerDuration, setTimerDuration] = useState(60); // Default 60 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(false);

  // Check if Supabase is configured
  useEffect(() => {
    setUseSupabase(isSupabaseConfigured());
  }, []);

  // Load data based on current draft
  useEffect(() => {
    const loadData = async () => {
      if (currentDraft && useSupabase) {
        setIsLoading(true);
        try {
          const [loadedTeams, loadedPlayers] = await Promise.all([
            getTeamsByDraftId(currentDraft.id),
            getPlayersByDraftId(currentDraft.id)
          ]);
          setTeams(loadedTeams);
          setPlayers(loadedPlayers);
        } catch (error) {
          console.error('Error loading data from Supabase:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!useSupabase) {
        // Fallback to local storage when Supabase is not configured
        const loadedTeams = getTeams();
        const loadedPlayers = getPlayers();
        
        if (isValidData(loadedPlayers, loadedTeams)) {
          setTeams(loadedTeams);
          setPlayers(loadedPlayers);
        }
      }
    };

    loadData();
  }, [currentDraft, useSupabase]);

  // Save teams changes
  useEffect(() => {
    if (!currentDraft || isLoading) return;

    if (useSupabase) {
      // We handle saving teams individually in the addTeam, updateTeam, removeTeam functions
    } else {
      saveTeams(teams);
    }
  }, [teams, currentDraft, isLoading, useSupabase]);

  // Save players changes
  useEffect(() => {
    if (!currentDraft || isLoading) return;

    if (useSupabase) {
      const savePlayersToSupabase = async () => {
        await bulkUpdatePlayers(players);
      };
      savePlayersToSupabase();
    } else {
      savePlayers(players);
    }
  }, [players, currentDraft, isLoading, useSupabase]);

  const addTeam = async (newTeam: Omit<Team, 'id' | 'players'>) => {
    if (useSupabase && currentDraft) {
      const teamToAdd = {
        ...newTeam,
        draftId: currentDraft.id
      };
      
      const createdTeam = await createSupabaseTeam(teamToAdd);
      if (createdTeam) {
        setTeams([...teams, createdTeam]);
      }
    } else {
      const teamToAdd: Team = {
        id: Date.now(),
        ...newTeam,
        players: []
      };
      setTeams([...teams, teamToAdd]);
    }
  };

  const removeTeam = async (teamId: number) => {
    if (useSupabase) {
      const success = await deleteTeam(teamId);
      if (success) {
        setTeams(teams.filter(team => team.id !== teamId));
      }
    } else {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  const handleImport = (data: { players: Player[], teams: Team[] }) => {
    if (useSupabase && currentDraft) {
      // Update draft ID for all imported items
      const teamsWithDraftId = data.teams.map(team => ({
        ...team,
        draftId: currentDraft.id
      }));
      
      const playersWithDraftId = data.players.map(player => ({
        ...player,
        draftId: currentDraft.id
      }));
      
      setTeams(teamsWithDraftId);
      setPlayers(playersWithDraftId);
      
      // Bulk save to Supabase
      const saveImportedData = async () => {
        await Promise.all([
          bulkUpdatePlayers(playersWithDraftId),
          ...teamsWithDraftId.map(team => createSupabaseTeam({
            name: team.name,
            captain: team.captain,
            draftId: team.draftId
          }))
        ]);
      };
      
      saveImportedData();
    } else {
      setTeams(data.teams);
      setPlayers(data.players);
    }
  };

  const updateTeamData = async (updatedTeam: Team) => {
    if (useSupabase) {
      const result = await updateTeam(updatedTeam);
      if (result) {
        setTeams(teams.map(team => 
          team.id === updatedTeam.id ? result : team
        ));
      }
    } else {
      setTeams(teams.map(team => 
        team.id === updatedTeam.id ? updatedTeam : team
      ));
    }
  };

  // Helper function to validate data structure
  const isValidData = (players: any[], teams: any[]) => {
    return (
      Array.isArray(players) &&
      Array.isArray(teams) &&
      players.every(p => 
        typeof p.id === 'number' &&
        typeof p.name === 'string'
      ) &&
      teams.every(t => 
        typeof t.id === 'number' &&
        typeof t.name === 'string'
      )
    );
  };

  const handleTimerDurationChange = (duration: number) => {
    // Ensure duration is between 30 and 300 seconds
    const validDuration = Math.min(Math.max(duration, 30), 300);
    setTimerDuration(validDuration);
    // Optionally save to localStorage
    localStorage.setItem('draft-timer-duration', validDuration.toString());
  };

  // Load timer duration from localStorage on mount
  useEffect(() => {
    const savedDuration = localStorage.getItem('draft-timer-duration');
    if (savedDuration) {
      setTimerDuration(parseInt(savedDuration, 10));
    }
  }, []);

  return (
    <DraftContext.Provider value={{ currentDraft, setCurrentDraft }}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={<DraftsListPage />} 
          />
          <Route
            path="/draft/:draftId/*"
            element={
              <DashboardLayout
                onImport={handleImport}
                players={players}
                teams={teams}
                timerDuration={timerDuration}
                onTimerDurationChange={handleTimerDurationChange}
                isTimerRunning={isTimerRunning}
                setIsTimerRunning={setIsTimerRunning}
                isLoading={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <DraftPage 
                          teams={teams} 
                          players={players}
                          setPlayers={setPlayers}
                          timerDuration={timerDuration}
                          currentDraft={currentDraft}
                        />
                      } 
                    />
                    <Route 
                      path="teams" 
                      element={
                        <TeamsPage 
                          teams={teams} 
                          players={players}
                          addTeam={addTeam} 
                          removeTeam={removeTeam}
                          updateTeam={updateTeamData}
                        />
                      } 
                    />
                    <Route 
                      path="history" 
                      element={<DraftHistory players={players} />} 
                    />
                    <Route path="*" element={<Navigate to="." replace />} />
                  </Routes>
                )}
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </DraftContext.Provider>
  );
}

export default App;
