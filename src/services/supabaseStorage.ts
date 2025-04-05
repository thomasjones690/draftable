import { supabase } from './supabase';
import { Draft, Player, Team } from '../types';

// DRAFT OPERATIONS
export const getDrafts = async (): Promise<Draft[]> => {
  const { data, error } = await supabase
    .from('drafts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching drafts:', error);
    return [];
  }
  
  return data.map(draft => ({
    id: draft.id,
    name: draft.name,
    description: draft.description || '',
    createdAt: draft.created_at
  }));
};

export const getDraftById = async (draftId: number): Promise<Draft | null> => {
  const { data, error } = await supabase
    .from('drafts')
    .select('*')
    .eq('id', draftId)
    .single();
  
  if (error) {
    console.error(`Error fetching draft ${draftId}:`, error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    createdAt: data.created_at
  };
};

export const createDraft = async (name: string, description?: string): Promise<Draft | null> => {
  const { data, error } = await supabase
    .from('drafts')
    .insert([{ name, description }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating draft:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    createdAt: data.created_at
  };
};

// TEAM OPERATIONS
export const getTeamsByDraftId = async (draftId: number): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('draft_id', draftId);
  
  if (error) {
    console.error(`Error fetching teams for draft ${draftId}:`, error);
    return [];
  }
  
  return data.map(team => ({
    id: team.id,
    name: team.name,
    captain: team.captain,
    players: [],
    draftId: team.draft_id
  }));
};

export const createTeam = async (team: Omit<Team, 'id' | 'players'>): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .insert([{ 
      name: team.name, 
      captain: team.captain,
      draft_id: team.draftId
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating team:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    captain: data.captain,
    players: [],
    draftId: data.draft_id
  };
};

export const updateTeam = async (team: Team): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .update({ 
      name: team.name, 
      captain: team.captain 
    })
    .eq('id', team.id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating team ${team.id}:`, error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    captain: data.captain,
    players: team.players,
    draftId: data.draft_id
  };
};

export const deleteTeam = async (teamId: number): Promise<boolean> => {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId);
  
  if (error) {
    console.error(`Error deleting team ${teamId}:`, error);
    return false;
  }
  
  return true;
};

// PLAYER OPERATIONS
export const getPlayersByDraftId = async (draftId: number): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('draft_id', draftId);
  
  if (error) {
    console.error(`Error fetching players for draft ${draftId}:`, error);
    return [];
  }
  
  return data.map(player => ({
    id: player.id,
    name: player.name,
    ppg: player.ppg,
    rpg: player.rpg,
    apg: player.apg,
    fg: player.fg,
    fi: player.fi,
    probability: player.probability,
    rank: player.rank,
    drafted: player.drafted,
    draftedBy: player.drafted_by || '',
    draftedAt: player.drafted_at || undefined,
    draftId: player.draft_id,
    teamId: player.team_id || undefined
  }));
};

export const createPlayer = async (player: Omit<Player, 'id'>): Promise<Player | null> => {
  const { data, error } = await supabase
    .from('players')
    .insert([{
      name: player.name,
      ppg: player.ppg,
      rpg: player.rpg,
      apg: player.apg,
      fg: player.fg,
      fi: player.fi,
      probability: player.probability,
      rank: player.rank,
      drafted: player.drafted,
      drafted_by: player.draftedBy,
      drafted_at: player.draftedAt,
      draft_id: player.draftId,
      team_id: player.teamId
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating player:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    ppg: data.ppg,
    rpg: data.rpg,
    apg: data.apg,
    fg: data.fg,
    fi: data.fi,
    probability: data.probability,
    rank: data.rank,
    drafted: data.drafted,
    draftedBy: data.drafted_by || '',
    draftedAt: data.drafted_at || undefined,
    draftId: data.draft_id,
    teamId: data.team_id || undefined
  };
};

export const updatePlayer = async (player: Player): Promise<Player | null> => {
  const { data, error } = await supabase
    .from('players')
    .update({
      name: player.name,
      ppg: player.ppg,
      rpg: player.rpg,
      apg: player.apg,
      fg: player.fg,
      fi: player.fi,
      probability: player.probability,
      rank: player.rank,
      drafted: player.drafted,
      drafted_by: player.draftedBy,
      drafted_at: player.draftedAt,
      team_id: player.teamId
    })
    .eq('id', player.id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating player ${player.id}:`, error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    ppg: data.ppg,
    rpg: data.rpg,
    apg: data.apg,
    fg: data.fg,
    fi: data.fi,
    probability: data.probability,
    rank: data.rank,
    drafted: data.drafted,
    draftedBy: data.drafted_by || '',
    draftedAt: data.drafted_at || undefined,
    draftId: data.draft_id,
    teamId: data.team_id || undefined
  };
};

export const bulkUpdatePlayers = async (players: Player[]): Promise<boolean> => {
  // Split updates into chunks to avoid hitting size limits
  const chunkSize = 50;
  const playerChunks = [];
  
  for (let i = 0; i < players.length; i += chunkSize) {
    playerChunks.push(players.slice(i, i + chunkSize));
  }
  
  for (const chunk of playerChunks) {
    const { error } = await supabase
      .from('players')
      .upsert(
        chunk.map(player => ({
          id: player.id,
          name: player.name,
          ppg: player.ppg,
          rpg: player.rpg,
          apg: player.apg,
          fg: player.fg,
          fi: player.fi,
          probability: player.probability,
          rank: player.rank,
          drafted: player.drafted,
          drafted_by: player.draftedBy,
          drafted_at: player.draftedAt,
          draft_id: player.draftId,
          team_id: player.teamId
        })),
        { onConflict: 'id' }
      );
    
    if (error) {
      console.error('Error bulk updating players:', error);
      return false;
    }
  }
  
  return true;
}; 