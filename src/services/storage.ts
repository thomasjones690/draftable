import { Player, Team } from '../types';

const PLAYERS_KEY = 'draft-players';
const TEAMS_KEY = 'draft-teams';
const BACKUP_KEY = 'draft-backup';
const BACKUP_ROTATION_SIZE = 5;

export const getPlayers = (): Player[] => {
  const stored = localStorage.getItem(PLAYERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePlayers = (players: Player[]) => {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

export const getTeams = (): Team[] => {
  const stored = localStorage.getItem(TEAMS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTeams = (teams: Team[]) => {
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
};

export const isValidData = (players: unknown[], teams: unknown[]): boolean => {
  return (
    Array.isArray(players) &&
    Array.isArray(teams) &&
    players.every(p => 
      typeof (p as any).id === 'number' &&
      typeof (p as any).name === 'string'
    ) &&
    teams.every(t => 
      typeof (t as any).id === 'number' &&
      typeof (t as any).name === 'string'
    )
  );
};

export const tryRestoreFromBackup = (): { players: Player[], teams: Team[] } | null => {
  try {
    // First try the main backup
    const mainBackup = localStorage.getItem(BACKUP_KEY);
    if (mainBackup) {
      const data = JSON.parse(mainBackup);
      if (isValidData(data.players, data.teams)) {
        return data;
      }
    }

    // If main backup fails, try the rotation backups
    for (let i = BACKUP_ROTATION_SIZE - 1; i >= 0; i--) {
      const rotationBackup = localStorage.getItem(`${BACKUP_KEY}-${i}`);
      if (rotationBackup) {
        try {
          const data = JSON.parse(rotationBackup);
          if (isValidData(data.players, data.teams)) {
            console.log(`Restored from backup rotation ${i}`);
            return data;
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