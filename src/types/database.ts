export interface Database {
  public: {
    Tables: {
      papers: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          file_name: string
          author_id: string
          created_at: string
          updated_at: string
          view_count: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          file_name: string
          author_id: string
          created_at?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_name?: string
          author_id?: string
          created_at?: string
          updated_at?: string
          view_count?: number
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          paper_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          paper_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          paper_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          paper_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          paper_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          paper_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}