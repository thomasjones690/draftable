export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      drafts: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string | null
        }
      }
      teams: {
        Row: {
          id: number
          draft_id: number
          name: string
          captain: string
          created_at: string
        }
        Insert: {
          id?: number
          draft_id: number
          name: string
          captain: string
          created_at?: string
        }
        Update: {
          id?: number
          draft_id?: number
          name?: string
          captain?: string
          created_at?: string
        }
      }
      players: {
        Row: {
          id: number
          draft_id: number
          name: string
          ppg: number
          rpg: number
          apg: number
          fg: number
          fi: number
          probability: number
          rank: number
          drafted: boolean
          drafted_by: string | null
          drafted_at: number | null
          team_id: number | null
          created_at: string
        }
        Insert: {
          id?: number
          draft_id: number
          name: string
          ppg: number
          rpg: number
          apg: number
          fg: number
          fi: number
          probability?: number
          rank?: number
          drafted?: boolean
          drafted_by?: string | null
          drafted_at?: number | null
          team_id?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          draft_id?: number
          name?: string
          ppg?: number
          rpg?: number
          apg?: number
          fg?: number
          fi?: number
          probability?: number
          rank?: number
          drafted?: boolean
          drafted_by?: string | null
          drafted_at?: number | null
          team_id?: number | null
          created_at?: string
        }
      }
    }
  }
} 