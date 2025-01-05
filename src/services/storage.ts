import { Player, Team } from '../types';

const PLAYERS_KEY = 'draft-players';
const TEAMS_KEY = 'draft-teams';
const BACKUP_KEY = 'draft-backup';
const BACKUP_ROTATION_SIZE = 5;

export const getPlayers = () => {
  const stored = localStorage.getItem(PLAYERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePlayers = (players: any[]) => {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

export const getTeams = () => {
  const stored = localStorage.getItem(TEAMS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTeams = (teams: any[]) => {
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
};

export const tryRestoreFromBackup = (): { players: Player[], teams: Team[] } | null => {
  try {
    // First try the main backup
    const mainBackup = localStorage.getItem(BACKUP_KEY);
    if (mainBackup) {
      const data = JSON.parse(mainBackup);
      if (data.players && data.teams) {
        return {
          players: data.players,
          teams: data.teams
        };
      }
    }

    // If main backup fails, try the rotation backups from newest to oldest
    for (let i = BACKUP_ROTATION_SIZE - 1; i >= 0; i--) {
      const rotationBackup = localStorage.getItem(`${BACKUP_KEY}-${i}`);
      if (rotationBackup) {
        try {
          const data = JSON.parse(rotationBackup);
          if (data.players && data.teams) {
            console.log(`Restored from backup rotation ${i}`);
            return {
              players: data.players,
              teams: data.teams
            };
          }
        } catch (e) {
          console.warn(`Failed to parse backup ${i}:`, e);
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to restore from any backup:', error);
    return null;
  }
};

// Also let's add validation to ensure the data structure is correct
const isValidBackupData = (data: any): data is { players: Player[], teams: Team[] } => {
  return (
    data &&
    Array.isArray(data.players) &&
    Array.isArray(data.teams) &&
    data.players.every((p: any) => 
      typeof p.id === 'number' &&
      typeof p.name === 'string'
    ) &&
    data.teams.every((t: any) => 
      typeof t.id === 'number' &&
      typeof t.name === 'string'
    )
  );
}; 