import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  disabled?: boolean;
}

export const PlayerInput: React.FC<Props> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  disabled = false
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70"
        min={type === 'number' ? "0" : undefined}
        step={type === 'number' ? "0.1" : undefined}
        disabled={disabled}
      />
    </div>
  );
}; 