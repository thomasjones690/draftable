import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Team, Player } from './types';
import { getTeams, saveTeams, getPlayers, savePlayers, tryRestoreFromBackup } from './services/storage';
import { DraftPage } from './pages/Draft';
import { TeamsPage } from './pages/Teams';
import { DraftHistory } from './pages/DraftHistory';
import { DashboardLayout } from './components/DashboardLayout';

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timerDuration, setTimerDuration] = useState(60); // Default 60 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedTeams = getTeams();
    const loadedPlayers = getPlayers();

    // Try to restore from backup if:
    // 1. We have no data, or
    // 2. The data appears to be corrupted
    if (
      loadedPlayers.length === 0 && loadedTeams.length === 0 ||
      !isValidData(loadedPlayers, loadedTeams)
    ) {
      const backup = tryRestoreFromBackup();
      if (backup) {
        console.log('Restored data from backup');
        setTeams(backup.teams);
        setPlayers(backup.players);
        // Save the restored data to localStorage
        saveTeams(backup.teams);
        savePlayers(backup.players);
        return;
      }
    }

    setTeams(loadedTeams);
    setPlayers(loadedPlayers);
  }, []);

  // Save teams changes
  useEffect(() => {
    saveTeams(teams);
  }, [teams]);

  // Save players changes
  useEffect(() => {
    savePlayers(players);
  }, [players]);

  const addTeam = (newTeam: Omit<Team, 'id' | 'players'>) => {
    const teamToAdd: Team = {
      id: Date.now(),
      ...newTeam,
      players: []
    };
    setTeams([...teams, teamToAdd]);
  };

  const removeTeam = (teamId: number) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const handleImport = (data: { players: Player[], teams: Team[] }) => {
    setTeams(data.teams);
    setPlayers(data.players);
  };

  const updateTeam = (updatedTeam: Team) => {
    setTeams(teams.map(team => 
      team.id === updatedTeam.id ? updatedTeam : team
    ));
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
    <BrowserRouter>
      <DashboardLayout 
        onImport={handleImport}
        players={players}
        teams={teams}
        timerDuration={timerDuration}
        onTimerDurationChange={handleTimerDurationChange}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <DraftPage 
                teams={teams} 
                players={players}
                setPlayers={setPlayers}
                timerDuration={timerDuration}
              />
            } 
          />
          <Route 
            path="/teams" 
            element={
              <TeamsPage 
                teams={teams} 
                players={players}
                addTeam={addTeam} 
                removeTeam={removeTeam}
                updateTeam={updateTeam}
              />
            } 
          />
          <Route 
            path="/history" 
            element={<DraftHistory players={players} />} 
          />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
