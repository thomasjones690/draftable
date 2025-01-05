import React, { useState, useEffect } from 'react';
import { RecommendedPick } from '../components/RecommendedPick';
import { DraftBoard } from '../components/DraftBoard';
import { PlayerChart } from '../components/PlayerChart';
import { getPlayers, savePlayers } from '../services/storage';
import { Player, NewPlayer, Team } from '../types';
import { AddPlayerModal } from '../components/AddPlayerModal';
import { EditPlayerModal } from '../components/EditPlayerModal';
import { calculateScore } from '../utils/calculateScore';

interface Props {
  teams: Team[];
  players: Player[];
  setPlayers: (players: Player[]) => void;
  timerDuration: number;
}

export const DraftPage: React.FC<Props> = ({ teams, players, setPlayers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<NewPlayer>({
    name: "",
    ppg: "",
    rpg: "",
    apg: "",
    fg: "",
    fi: ""
  });

  useEffect(() => {
    const loadedPlayers = getPlayers();
    setPlayers(loadedPlayers);
  }, []);

  useEffect(() => {
    savePlayers(players);
  }, [players]);

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

  const addPlayer = () => {
    if (!newPlayer.name) {
      console.log('Name is required');
      return;
    }

    const playerToAdd: Player = {
      id: Date.now(),
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

    const score = calculateScore(playerToAdd);
    playerToAdd.probability = parseFloat(calculateDraftProbability(score));

    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers, playerToAdd]
        .sort((a, b) => parseFloat(calculateScore(b)) - parseFloat(calculateScore(a)))
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
  };

  const markAsDrafted = (playerId: number, teamName: string) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(player => 
        player.id === playerId 
          ? { 
              ...player, 
              drafted: true, 
              draftedBy: teamName,
              draftedAt: Date.now()
            }
          : player
      );
      
      savePlayers(updatedPlayers);
      return updatedPlayers;
    });
  };

  const updatePlayer = (updatedPlayer: Player) => {
    const score = calculateScore(updatedPlayer);
    const probability = calculateDraftProbability(score);

    const playerWithScore = {
      ...updatedPlayer,
      probability: parseFloat(probability)
    };

    const updatedPlayers = players
      .map(p => p.id === playerWithScore.id ? playerWithScore : p)
      .sort((a, b) => parseFloat(calculateScore(b)) - parseFloat(calculateScore(a)))
      .map((player, index) => ({ ...player, rank: index + 1 }));

    setPlayers(updatedPlayers);
    setEditingPlayer(null);
  };

  const removePlayer = (playerId: number) => {
    const updatedPlayers = players
      .filter(p => p.id !== playerId)
      .sort((a, b) => parseFloat(calculateScore(b)) - parseFloat(calculateScore(a)))
      .map((player, index) => ({ ...player, rank: index + 1 }));

    setPlayers(updatedPlayers);
    setEditingPlayer(null);
  };

  const chartData = players
    .filter(player => !player.drafted)
    .map(player => ({
      name: player.name,
      score: parseFloat(calculateScore(player)),
      probability: player.probability
    }))
    .sort((a, b) => b.score - a.score);

  const getRecommendedPicks = () => {
    const undraftedPlayers = players.filter(player => !player.drafted);
    if (undraftedPlayers.length === 0) return [];

    return undraftedPlayers
      .sort((a, b) => {
        const scoreA = parseFloat(calculateScore(a));
        const scoreB = parseFloat(calculateScore(b));
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
        
        <div className="h-[36rem] sm:h-[48rem]">
          <PlayerChart chartData={chartData} />
        </div>
      </div>

      {/* Modals */}
      <AddPlayerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
        onAdd={addPlayer}
      />
      
      <EditPlayerModal
        isOpen={!!editingPlayer}
        onClose={() => setEditingPlayer(null)}
        player={editingPlayer}
        teams={teams}
        onUpdate={updatePlayer}
        onRemove={removePlayer}
      />
    </div>
  );
}; 