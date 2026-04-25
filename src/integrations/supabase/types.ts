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
      bike_images: {
        Row: {
          bike_id: string
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_cover: boolean
        }
        Insert: {
          bike_id: string
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_cover?: boolean
        }
        Update: {
          bike_id?: string
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_cover?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "bike_images_bike_id_fkey"
            columns: ["bike_id"]
            isOneToOne: false
            referencedRelation: "bikes"
            referencedColumns: ["id"]
          },
        ]
      }
      bikes: {
        Row: {
          autonomia: string | null
          badge: Database["public"]["Enums"]["bike_badge"] | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          motor: string | null
          name: string
          parcel: string | null
          price: number
          tag: string
          updated_at: string
          velocidade: string | null
          video_url: string | null
        }
        Insert: {
          autonomia?: string | null
          badge?: Database["public"]["Enums"]["bike_badge"] | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          motor?: string | null
          name: string
          parcel?: string | null
          price: number
          tag: string
          updated_at?: string
          velocidade?: string | null
          video_url?: string | null
        }
        Update: {
          autonomia?: string | null
          badge?: Database["public"]["Enums"]["bike_badge"] | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          motor?: string | null
          name?: string
          parcel?: string | null
          price?: number
          tag?: string
          updated_at?: string
          velocidade?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      nav_links: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_visible: boolean
          label: string
          location: string
          open_in_new_tab: boolean
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          label: string
          location: string
          open_in_new_tab?: boolean
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          label?: string
          location?: string
          open_in_new_tab?: boolean
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_url: string | null
          delay_seconds: number
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          mode: Database["public"]["Enums"]["offer_mode"]
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          delay_seconds?: number
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mode?: Database["public"]["Enums"]["offer_mode"]
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          delay_seconds?: number
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mode?: Database["public"]["Enums"]["offer_mode"]
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          block_key: string
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          label: string | null
          link_url: string | null
          long_text_value: string | null
          page: string
          text_value: string | null
          updated_at: string
        }
        Insert: {
          block_key: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          label?: string | null
          link_url?: string | null
          long_text_value?: string | null
          page: string
          text_value?: string | null
          updated_at?: string
        }
        Update: {
          block_key?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          label?: string | null
          link_url?: string | null
          long_text_value?: string | null
          page?: string
          text_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          og_image_url: string | null
          phone: string | null
          seo_description: string | null
          seo_title: string | null
          tiktok_url: string | null
          updated_at: string
          whatsapp_number: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          og_image_url?: string | null
          phone?: string | null
          seo_description?: string | null
          seo_title?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          og_image_url?: string | null
          phone?: string | null
          seo_description?: string | null
          seo_title?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
          youtube_url?: string | null
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
      app_role: "admin" | "user"
      bike_badge: "lancamento" | "mais_vendida" | "oferta" | "novidade"
      offer_mode: "on_enter" | "on_exit" | "top_banner"
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
      app_role: ["admin", "user"],
      bike_badge: ["lancamento", "mais_vendida", "oferta", "novidade"],
      offer_mode: ["on_enter", "on_exit", "top_banner"],
    },
  },
} as const
