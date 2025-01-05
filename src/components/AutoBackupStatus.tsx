import React, { useState, useEffect } from 'react';
import { Player, Team } from '../types';

interface Props {
  players: Player[];
  teams: Team[];
}

export const AutoBackupStatus: React.FC<Props> = ({ players, teams }) => {
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [backupCount, setBackupCount] = useState(0);

  useEffect(() => {
    // Initial backup
    handleBackup();

    // Set up interval for automatic backups
    const intervalId = setInterval(handleBackup, 7000); // Every 7 seconds

    return () => clearInterval(intervalId);
  }, [players, teams]);

  const handleBackup = () => {
    const data = {
      players,
      teams,
      exportDate: new Date().toISOString(),
      backupId: Date.now()
    };

    try {
      // Save current backup
      localStorage.setItem('draft-backup', JSON.stringify(data));
      
      // Keep last 5 backups in rotation
      const backupKey = `draft-backup-${backupCount % 5}`;
      localStorage.setItem(backupKey, JSON.stringify(data));
      
      setBackupCount(prev => prev + 1);
      setLastBackup(new Date());
    } catch (error) {
      console.error('Backup failed:', error);
    }
  };

  if (!lastBackup) return null;

  return (
    <div className="fixed bottom-2 right-2 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs text-gray-400 dark:text-gray-600">
        Last backup: {lastBackup.toLocaleTimeString()}
      </span>
    </div>
  );
}; 