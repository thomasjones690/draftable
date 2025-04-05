import React, { useState, useEffect } from 'react';
import { RecommendedPick } from '../components/RecommendedPick';
import { DraftBoard } from '../components/DraftBoard';
import { getPlayers, savePlayers } from '../services/storage';
import { Player, NewPlayer, Team, Draft } from '../types';
import { AddPlayerModal } from '../components/AddPlayerModal';
import { EditPlayerModal } from '../components/EditPlayerModal';
import { BulkAddPlayersModal } from '../components/BulkAddPlayersModal';
import { calculateScore } from '../utils/calculateScore';
import { createPlayer, updatePlayer as updateSupabasePlayer } from '../services/supabaseStorage';
import { isSupabaseConfigured } from '../services/supabase';

interface Props {
  teams: Team[];
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  timerDuration: number;
  currentDraft: Draft | null;
}

export const DraftPage: React.FC<Props> = ({ teams, players, setPlayers, currentDraft }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<NewPlayer>({
    name: "",
    ppg: "",
    rpg: "",
    apg: "",
    fg: "",
    fi: ""
  });
  const [useSupabase, setUseSupabase] = useState(false);

  // Check if Supabase is configured
  useEffect(() => {
    setUseSupabase(isSupabaseConfigured());
  }, []);

  // Update existing players to use captain names instead of team names
  useEffect(() => {
    if (players.length > 0 && teams.length > 0) {
      let needsUpdate = false;
      const updatedPlayers = players.map(player => {
        if (player.drafted && player.draftedBy !== 'REMOVED') {
          // Find if there's a team with this name
          const team = teams.find(t => t.name === player.draftedBy);
          if (team) {
            needsUpdate = true;
            return { ...player, draftedBy: team.captain };
          }
        }
        return player;
      });

      if (needsUpdate) {
        setPlayers(updatedPlayers);
        if (useSupabase) {
          updatedPlayers.forEach(player => {
            if (player.drafted && player.draftedBy !== 'REMOVED') {
              updateSupabasePlayer(player);
            }
          });
        }
      }
    }
  }, [players, teams, useSupabase, setPlayers]);

  // Skip local storage data loading if we're using Supabase
  useEffect(() => {
    if (!useSupabase) {
      const loadedPlayers = getPlayers();
      setPlayers(loadedPlayers);
    }
  }, [useSupabase, setPlayers]);

  // Save to local storage only when not using Supabase
  useEffect(() => {
    if (!useSupabase) {
      savePlayers(players);
    }
  }, [players, useSupabase]);

  const calculateDraftProbability = (score: string): string => {
    const scoreNum = parseFloat(score);
    let probability = 0;

    if (scoreNum >= 40) probability = 95;
    else if (scoreNum >= 35) probability = 85;
    else if (scoreNum >= 30) probability = 75;
    else if (scoreNum >= 25) probability = 65;
    else if (scoreNum >= 20) probability = 55;
    else if (scoreNum >= 15) probability = 45;
    else probability = 35;

    return probability.toString();
  };

  const defaultPlayerValues = {
    ppg: 0,
    rpg: 0,
    apg: 0,
    fg: 0,
    fi: 0,
  };

  const addPlayer = async () => {
    if (!newPlayer.name) {
      console.log('Name is required');
      return;
    }

    setIsLoading(true);

    try {
      const basePlayerData = {
        name: newPlayer.name,
        ppg: parseFloat(newPlayer.ppg) || defaultPlayerValues.ppg,
        rpg: parseFloat(newPlayer.rpg) || defaultPlayerValues.rpg,
        apg: parseFloat(newPlayer.apg) || defaultPlayerValues.apg,
        fg: parseFloat(newPlayer.fg) || defaultPlayerValues.fg,
        fi: parseFloat(newPlayer.fi) || defaultPlayerValues.fi,
        probability: 0,
        rank: players.length + 1,
        drafted: false,
        draftedBy: ""
      };

      const score = calculateScore(basePlayerData as any);
      const probability = parseFloat(calculateDraftProbability(score));
      
      let playerToAdd: Player;
      
      if (useSupabase && currentDraft) {
        // Create in Supabase
        const newPlayerData = {
          ...basePlayerData,
          probability,
          draftId: currentDraft.id
        };
        
        const createdPlayer = await createPlayer(newPlayerData);
        if (!createdPlayer) {
          console.error('Failed to create player in Supabase');
          return;
        }
        playerToAdd = createdPlayer;
      } else {
        // Create locally
        playerToAdd = {
          id: Date.now(),
          ...basePlayerData,
          probability
        };
      }

      setPlayers((prevPlayers: Player[]) => {
        const updatedPlayers = [...prevPlayers, playerToAdd]
          .sort((a, b) => parseFloat(calculateScore(b as any)) - parseFloat(calculateScore(a as any)))
          .map((player, index) => ({ ...player, rank: index + 1 }));
        
        return updatedPlayers;
      });

      setNewPlayer({
        name: "",
        ppg: "",
        rpg: "",
        apg: "",
        fg: "",
        fi: ""
      });
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const bulkAddPlayers = async (playerNames: string[]) => {
    if (!currentDraft && useSupabase) {
      console.error('No draft selected');
      return;
    }

    setIsLoading(true);

    try {
      const newPlayers: Player[] = [];

      // Process players in batches to avoid overwhelming the database
      for (const name of playerNames) {
        const basePlayerData = {
          name,
          ...defaultPlayerValues,
          probability: 0,
          rank: players.length + newPlayers.length + 1,
          drafted: false,
          draftedBy: ""
        };

        const score = calculateScore(basePlayerData as any);
        const probability = parseFloat(calculateDraftProbability(score));

        let playerToAdd: Player;

        if (useSupabase && currentDraft) {
          // Create in Supabase
          const newPlayerData = {
            ...basePlayerData,
            probability,
            draftId: currentDraft.id
          };
          
          const createdPlayer = await createPlayer(newPlayerData);
          if (!createdPlayer) {
            console.error(`Failed to create player "${name}" in Supabase`);
            continue;
          }
          playerToAdd = createdPlayer;
        } else {
          // Create locally
          playerToAdd = {
            id: Date.now() + newPlayers.length, // Ensure unique IDs
            ...basePlayerData,
            probability
          };
        }

        newPlayers.push(playerToAdd);
      }

      if (newPlayers.length > 0) {
        setPlayers((prevPlayers: Player[]) => {
          const updatedPlayers = [...prevPlayers, ...newPlayers]
            .sort((a, b) => parseFloat(calculateScore(b as any)) - parseFloat(calculateScore(a as any)))
            .map((player, index) => ({ ...player, rank: index + 1 }));
          
          return updatedPlayers;
        });
      }

      setIsBulkModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsDrafted = async (playerId: number, teamName: string) => {
    const playerToUpdate = players.find(p => p.id === playerId);
    if (!playerToUpdate) return;
    
    // Find the team by name and use its captain
    const team = teams.find(t => t.name === teamName);
    const captainName = team ? team.captain : teamName;
    
    const updatedPlayerData = { 
      ...playerToUpdate, 
      drafted: true, 
      draftedBy: captainName,
      draftedAt: Date.now()
    };
    
    if (useSupabase) {
      const result = await updateSupabasePlayer(updatedPlayerData);
      if (!result) {
        console.error('Failed to update player in Supabase');
        return;
      }
    }
    
    setPlayers((prevPlayers: Player[]) => {
      const updatedPlayers = prevPlayers.map(player => 
        player.id === playerId ? updatedPlayerData : player
      );
      
      if (!useSupabase) {
        savePlayers(updatedPlayers);
      }
      
      return updatedPlayers;
    });
  };

  const updatePlayer = async (updatedPlayer: Player) => {
    const score = calculateScore(updatedPlayer as any);
    const probability = calculateDraftProbability(score);

    const playerWithScore = {
      ...updatedPlayer,
      probability: parseFloat(probability)
    };

    if (useSupabase) {
      const result = await updateSupabasePlayer(playerWithScore as any);
      if (!result) {
        console.error('Failed to update player in Supabase');
        return;
      }
    }

    const updatedPlayers = players
      .map(p => p.id === playerWithScore.id ? playerWithScore : p)
      .sort((a, b) => parseFloat(calculateScore(b as any)) - parseFloat(calculateScore(a as any)))
      .map((player, index) => ({ ...player, rank: index + 1 }));

    setPlayers(updatedPlayers);
    setEditingPlayer(null);
  };

  const removePlayer = async (playerId: number) => {
    if (useSupabase) {
      const playerToRemove = players.find(p => p.id === playerId);
      if (playerToRemove) {
        // Instead of deleting, mark as removed in Supabase
        const updatedPlayer = {
          ...playerToRemove,
          drafted: true,
          draftedBy: 'REMOVED'
        };
        
        const result = await updateSupabasePlayer(updatedPlayer as any);
        if (!result) {
          console.error('Failed to mark player as removed in Supabase');
          return;
        }
      }
    }
    
    const updatedPlayers = players
      .filter(p => p.id !== playerId)
      .sort((a, b) => parseFloat(calculateScore(b as any)) - parseFloat(calculateScore(a as any)))
      .map((player, index) => ({ ...player, rank: index + 1 }));

    setPlayers(updatedPlayers);
    setEditingPlayer(null);
  };

  // const chartData = players
  //   .filter(player => !player.drafted)
  //   .map(player => ({
  //     name: player.name,
  //     score: parseFloat(calculateScore(player as any)),
  //     probability: player.probability
  //   }))
  //   .sort((a, b) => b.score - a.score);

  const getRecommendedPicks = () => {
    const undraftedPlayers = players.filter(player => !player.drafted);
    if (undraftedPlayers.length === 0) return [];

    return undraftedPlayers
      .sort((a, b) => {
        const scoreA = parseFloat(calculateScore(a as any));
        const scoreB = parseFloat(calculateScore(b as any));
        const probA = a.probability;
        const probB = b.probability;
        
        const weightedScoreA = scoreA * (probA / 100);
        const weightedScoreB = scoreB * (probB / 100);
        
        return weightedScoreB - weightedScoreA;
      })
      .slice(0, 2);
  };

  const recommendedPicks = getRecommendedPicks();

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {currentDraft && (
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold dark:text-white">Draft Board</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Add Player
              </button>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                Bulk Add Players
              </button>
            </div>
          </div>
        )}

        {!currentDraft && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
            Please select a draft first to manage players.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendedPicks.map((pick, index) => (
            <RecommendedPick
              key={pick.id}
              recommendedPick={pick}
              calculateScore={calculateScore}
              label={index === 0 ? "First Pick" : "Next Pick"}
            />
          ))}
        </div>

        <div className="overflow-hidden">
          <DraftBoard 
            players={players}
            teams={teams}
            calculateScore={calculateScore}
            markAsDrafted={markAsDrafted}
            onEditPlayer={handleEditPlayer}
            onAddPlayer={() => setIsModalOpen(true)}
          />
        </div>
        
        {/* <div className="h-[36rem] sm:h-[48rem]">
          <PlayerChart chartData={chartData} />
        </div> */}
      </div>

      {/* Modals */}
      <AddPlayerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
        onAdd={addPlayer}
        isLoading={isLoading}
      />
      
      <EditPlayerModal
        isOpen={!!editingPlayer}
        onClose={() => setEditingPlayer(null)}
        player={editingPlayer}
        teams={teams}
        onUpdate={updatePlayer}
        onRemove={removePlayer}
      />

      <BulkAddPlayersModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onAdd={bulkAddPlayers}
        isLoading={isLoading}
      />
    </div>
  );
}; 