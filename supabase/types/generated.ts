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
      Grading: {
        Row: {
          argScoreLoser: number
          argScoreWinner: number
          cargScoreLoser: number
          cargScoreWinner: number
          created_at: string
          evidScoreLoser: number
          evidScoreWinner: number
          id: number
          loserId: string
          loserMessageId: number
          summary: string
          threadId: number
          winnerId: string
          winnerMessageId: number
        }
        Insert: {
          argScoreLoser: number
          argScoreWinner: number
          cargScoreLoser: number
          cargScoreWinner: number
          created_at?: string
          evidScoreLoser: number
          evidScoreWinner: number
          id?: number
          loserId: string
          loserMessageId: number
          summary: string
          threadId: number
          winnerId: string
          winnerMessageId: number
        }
        Update: {
          argScoreLoser?: number
          argScoreWinner?: number
          cargScoreLoser?: number
          cargScoreWinner?: number
          created_at?: string
          evidScoreLoser?: number
          evidScoreWinner?: number
          id?: number
          loserId?: string
          loserMessageId?: number
          summary?: string
          threadId?: number
          winnerId?: string
          winnerMessageId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Grading_loserId_fkey"
            columns: ["loserId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Grading_loserMessageId_fkey"
            columns: ["loserMessageId"]
            isOneToOne: false
            referencedRelation: "Message"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Grading_threadId_fkey"
            columns: ["threadId"]
            isOneToOne: false
            referencedRelation: "Thread"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Grading_winnerId_fkey"
            columns: ["winnerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Grading_winnerMessageId_fkey"
            columns: ["winnerMessageId"]
            isOneToOne: false
            referencedRelation: "Message"
            referencedColumns: ["id"]
          }
        ]
      }
      Message: {
        Row: {
          content: string
          created_at: string
          id: number
          threadId: number
          userId: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          threadId: number
          userId: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          threadId?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Message_threadId_fkey"
            columns: ["threadId"]
            isOneToOne: false
            referencedRelation: "Thread"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Stat: {
        Row: {
          created_at: string
          exp: number
          id: number
          userId: string
        }
        Insert: {
          created_at?: string
          exp: number
          id?: number
          userId: string
        }
        Update: {
          created_at?: string
          exp?: number
          id?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Stat_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Thread: {
        Row: {
          created_at: string
          id: number
          title: string
          topicId: number
        }
        Insert: {
          created_at?: string
          id?: number
          title: string
          topicId: number
        }
        Update: {
          created_at?: string
          id?: number
          title?: string
          topicId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Thread_topicId_fkey"
            columns: ["topicId"]
            isOneToOne: false
            referencedRelation: "TopicRoom"
            referencedColumns: ["id"]
          }
        ]
      }
      TopicRoom: {
        Row: {
          created_at: string
          id: number
          topic: string
        }
        Insert: {
          created_at?: string
          id?: number
          topic: string
        }
        Update: {
          created_at?: string
          id?: number
          topic?: string
        }
        Relationships: []
      }
      User: {
        Row: {
          created_at: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
