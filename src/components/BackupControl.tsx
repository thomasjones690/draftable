import React, { useRef } from 'react';
import { exportToJson, importFromJson } from '../services/fileStorage';

interface Props {
  onImport: (data: { players: any[], teams: any[] }) => void;
}

export const BackupControl: React.FC<Props> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJson(file);
      onImport(data);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import backup file');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToJson}
        className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Export Backup
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Import Backup
      </button>
    </div>
  );
}; 