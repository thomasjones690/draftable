import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DarkModeToggle } from './DarkModeToggle';
import { BackupControl } from './BackupControl';
import { XMarkIcon, Bars3Icon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { AutoBackupStatus } from './AutoBackupStatus';
import { Player, Team } from '../types';
import { DraftTimer } from './DraftTimer';
import { DraftTimerControls } from './DraftTimerControls';

interface Props {
  children: React.ReactNode;
  onImport: (data: any) => void;
  players: Player[];
  teams: Team[];
  timerDuration: number;
  onTimerDurationChange: (duration: number) => void;
}

export const DashboardLayout: React.FC<Props> = ({ children, onImport, players, teams, timerDuration, onTimerDurationChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Draft Board' },
    { path: '/teams', label: 'Teams' },
    { path: '/history', label: 'History' },
  ];

  const handleTimeUp = () => {
    setIsTimerRunning(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 
        dark:border-gray-700 flex flex-col transform transition-transform duration-200 ease-in-out
        overflow-y-auto z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo area */}
        <div className="sticky top-0 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
          <h1 className="text-xl font-bold dark:text-white">
            Baybrook Open Draft
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Timer Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <DraftTimer
            duration={timerDuration}
            isRunning={isTimerRunning}
            onTimeUp={handleTimeUp}
          />
          <div className="mt-2">
            <DraftTimerControls
              isRunning={isTimerRunning}
              onStart={() => setIsTimerRunning(true)}
              onPause={() => setIsTimerRunning(false)}
              onReset={() => setIsTimerRunning(false)}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isActivePath(path)
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom controls */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Settings Section */}
          <div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <span>Settings</span>
              <svg
                className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {settingsOpen && (
              <div className="mt-2 space-y-3">
                <div className="px-4 py-2">
                  <span className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Draft Timer
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="30"
                      max="300"
                      value={timerDuration}
                      onChange={(e) => onTimerDurationChange(parseInt(e.target.value, 10))}
                      className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">seconds</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="z-10 flex-direction-row">
                    <DarkModeToggle />
                  </div>
                </div>
                <div className="px-4 py-2 flex-direction-row">
                  <BackupControl onImport={onImport} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 relative">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>

        {/* Auto backup status */}
        <AutoBackupStatus players={players} teams={teams} />
      </div>
    </div>
  );
}; 