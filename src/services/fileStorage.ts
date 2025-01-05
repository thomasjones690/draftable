import { Player, Team } from '../types';

export const exportToJson = () => {
  const players = localStorage.getItem('draft-players');
  const teams = localStorage.getItem('draft-teams');
  
  const data = {
    players: players ? JSON.parse(players) : [],
    teams: teams ? JSON.parse(teams) : [],
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `draft-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromJson = async (file: File): Promise<{ players: Player[], teams: Team[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        localStorage.setItem('draft-players', JSON.stringify(data.players));
        localStorage.setItem('draft-teams', JSON.stringify(data.teams));
        resolve({
          players: data.players,
          teams: data.teams
        });
      } catch (error) {
        reject(new Error('Invalid backup file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}; 