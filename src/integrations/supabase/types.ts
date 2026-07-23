export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      aniversariantes: {
        Row: {
          created_at: string
          data_nascimento: string
          foto_url: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          data_nascimento: string
          foto_url?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          data_nascimento?: string
          foto_url?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          imagem_url: string
          ordem: number
          titulo: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url: string
          ordem?: number
          titulo?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string
          ordem?: number
          titulo?: string | null
        }
        Relationships: []
      }
      contatos_igreja: {
        Row: {
          created_at: string
          email: string
          endereco: string
          facebook: string
          id: string
          instagram: string
          mapa_url: string
          singleton: boolean
          telefone: string
          updated_at: string
          whatsapp: string
          youtube: string
        }
        Insert: {
          created_at?: string
          email?: string
          endereco?: string
          facebook?: string
          id?: string
          instagram?: string
          mapa_url?: string
          singleton?: boolean
          telefone?: string
          updated_at?: string
          whatsapp?: string
          youtube?: string
        }
        Update: {
          created_at?: string
          email?: string
          endereco?: string
          facebook?: string
          id?: string
          instagram?: string
          mapa_url?: string
          singleton?: boolean
          telefone?: string
          updated_at?: string
          whatsapp?: string
          youtube?: string
        }
        Relationships: []
      }
      cultos: {
        Row: {
          created_at: string
          descricao: string | null
          hora_fim: string | null
          hora_inicio: string | null
          id: string
          igreja: Database["public"]["Enums"]["igreja_tipo"]
          ordem: number
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          igreja: Database["public"]["Enums"]["igreja_tipo"]
          ordem?: number
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          igreja?: Database["public"]["Enums"]["igreja_tipo"]
          ordem?: number
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string
          data: string
          descricao: string | null
          foto_url: string | null
          hora: string | null
          id: string
          preletor: string | null
          titulo: string
        }
        Insert: {
          created_at?: string
          data: string
          descricao?: string | null
          foto_url?: string | null
          hora?: string | null
          id?: string
          preletor?: string | null
          titulo: string
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string | null
          foto_url?: string | null
          hora?: string | null
          id?: string
          preletor?: string | null
          titulo?: string
        }
        Relationships: []
      }
      galeria_albuns: {
        Row: {
          capa_url: string | null
          created_at: string
          evento_id: string
          id: string
          publicado: boolean
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          created_at?: string
          evento_id: string
          id?: string
          publicado?: boolean
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          created_at?: string
          evento_id?: string
          id?: string
          publicado?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "galeria_albuns_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: true
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      galeria_fotos: {
        Row: {
          album_id: string
          created_at: string
          id: string
          ordem: number
          updated_at: string
          url: string
        }
        Insert: {
          album_id: string
          created_at?: string
          id?: string
          ordem?: number
          updated_at?: string
          url: string
        }
        Update: {
          album_id?: string
          created_at?: string
          id?: string
          ordem?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "galeria_fotos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "galeria_albuns"
            referencedColumns: ["id"]
          },
        ]
      }
      lideres: {
        Row: {
          biografia: string | null
          cargo: string
          created_at: string
          foto_url: string | null
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          biografia?: string | null
          cargo: string
          created_at?: string
          foto_url?: string | null
          id?: string
          nome: string
          ordem?: number
        }
        Update: {
          biografia?: string | null
          cargo?: string
          created_at?: string
          foto_url?: string | null
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      obra_cards: {
        Row: {
          created_at: string
          detalhe: string
          icone: string
          id: string
          ordem: number
          texto: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          detalhe?: string
          icone?: string
          id?: string
          ordem?: number
          texto?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          detalhe?: string
          icone?: string
          id?: string
          ordem?: number
          texto?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      pagina_textos: {
        Row: {
          chave: string
          created_at: string
          id: string
          updated_at: string
          valor: string
        }
        Insert: {
          chave: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: string
        }
        Update: {
          chave?: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      igreja_tipo: "sede" | "filial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      igreja_tipo: ["sede", "filial"],
    },
  },
} as const
