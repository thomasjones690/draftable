import { Player, NewPlayer } from '../types';

export const calculateScore = (player: Player | NewPlayer): string => {
  // Handle null or undefined values
  if (!player) return "0.00";

  // Ensure all values are numbers
  const ppg = typeof player.ppg === 'string' ? parseFloat(player.ppg) || 0 : player.ppg || 0;
  const rpg = typeof player.rpg === 'string' ? parseFloat(player.rpg) || 0 : player.rpg || 0;
  const apg = typeof player.apg === 'string' ? parseFloat(player.apg) || 0 : player.apg || 0;
  const fg = typeof player.fg === 'string' ? parseFloat(player.fg) || 0 : player.fg || 0;
  const fi = typeof player.fi === 'string' ? parseFloat(player.fi) || 0 : player.fi || 0;

  const score = (ppg * 1.5) + (rpg * 1.2) + (apg * 1.2) + (fg * 0.5) + (fi * 0.3);
  return score.toFixed(2);
}; 