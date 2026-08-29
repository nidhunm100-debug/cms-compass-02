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
      countries: {
        Row: {
          code: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          featured_image_url: string | null
          flag_emoji: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          published: boolean
          training_count: number | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          featured_image_url?: string | null
          flag_emoji?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          published?: boolean
          training_count?: number | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          featured_image_url?: string | null
          flag_emoji?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          published?: boolean
          training_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          country: string | null
          created_at: string
          deleted_at: string | null
          designation: string | null
          email: string
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          organization: string | null
          participants: number | null
          phone: string | null
          preferred_date: string | null
          status: string
          training_requirement: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          designation?: string | null
          email: string
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          organization?: string | null
          participants?: number | null
          phone?: string | null
          preferred_date?: string | null
          status?: string
          training_requirement?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          designation?: string | null
          email?: string
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          organization?: string | null
          participants?: number | null
          phone?: string | null
          preferred_date?: string | null
          status?: string
          training_requirement?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          category: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          id: string
          name: string
          published: boolean
          slug: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          name: string
          published?: boolean
          slug?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          published?: boolean
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          album_id: string | null
          alt_text: string | null
          caption: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          display_order: number
          featured: boolean
          id: string
          image_url: string
          media_id: string | null
          published: boolean
          taken_on: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          alt_text?: string | null
          caption?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          image_url: string
          media_id?: string | null
          published?: boolean
          taken_on?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          alt_text?: string | null
          caption?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          image_url?: string
          media_id?: string | null
          published?: boolean
          taken_on?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_images_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_sections: {
        Row: {
          body: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          display_order: number
          enabled: boolean
          extra: Json
          heading: string | null
          id: string
          image_url: string | null
          label: string
          secondary_cta_link: string | null
          secondary_cta_text: string | null
          section_key: string
          subheading: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          enabled?: boolean
          extra?: Json
          heading?: string | null
          id?: string
          image_url?: string | null
          label: string
          secondary_cta_link?: string | null
          secondary_cta_text?: string | null
          section_key: string
          subheading?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          enabled?: boolean
          extra?: Json
          heading?: string | null
          id?: string
          image_url?: string | null
          label?: string
          secondary_cta_link?: string | null
          secondary_cta_text?: string | null
          section_key?: string
          subheading?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      impact_stats: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          icon: string | null
          id: string
          label: string
          published: boolean
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          label: string
          published?: boolean
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          label?: string
          published?: boolean
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          address: string | null
          city: string | null
          country_id: string | null
          country_name: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          featured: boolean
          gallery_images: Json
          id: string
          institution_type: string
          logo_url: string | null
          name: string
          published: boolean
          state_region: string | null
          training_category: string | null
          training_conducted: string | null
          updated_at: string
          website_url: string | null
          year: number | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country_id?: string | null
          country_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          featured?: boolean
          gallery_images?: Json
          id?: string
          institution_type?: string
          logo_url?: string | null
          name: string
          published?: boolean
          state_region?: string | null
          training_category?: string | null
          training_conducted?: string | null
          updated_at?: string
          website_url?: string | null
          year?: number | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country_id?: string | null
          country_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          featured?: boolean
          gallery_images?: Json
          id?: string
          institution_type?: string
          logo_url?: string | null
          name?: string
          published?: boolean
          state_region?: string | null
          training_category?: string | null
          training_conducted?: string | null
          updated_at?: string
          website_url?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "institutions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          caption: string | null
          category: string
          created_at: string
          deleted_at: string | null
          file_size: number | null
          folder: string | null
          height: number | null
          id: string
          mime_type: string | null
          storage_path: string
          title: string | null
          updated_at: string
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category?: string
          created_at?: string
          deleted_at?: string | null
          file_size?: number | null
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          storage_path: string
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category?: string
          created_at?: string
          deleted_at?: string | null
          file_size?: number | null
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      navigation: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label: string
          location: string
          parent_id: string | null
          updated_at: string
          url: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          label: string
          location?: string
          parent_id?: string | null
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          location?: string
          parent_id?: string | null
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_countries: {
        Row: {
          country_id: string
          program_id: string
        }
        Insert: {
          country_id: string
          program_id: string
        }
        Update: {
          country_id?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_countries_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_countries_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_topics: {
        Row: {
          program_id: string
          topic_id: string
        }
        Insert: {
          program_id: string
          topic_id: string
        }
        Update: {
          program_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_topics_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "training_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      program_trainers: {
        Row: {
          program_id: string
          trainer_id: string
        }
        Insert: {
          program_id: string
          trainer_id: string
        }
        Update: {
          program_id?: string
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_trainers_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_trainers_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          deleted_at: string | null
          display_order: number
          duration: string | null
          featured: boolean
          full_description: string | null
          gallery_images: Json
          id: string
          image_url: string | null
          name: string
          published: boolean
          short_description: string | null
          slug: string | null
          target_audience: string | null
          updated_at: string
          workshop_format: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          deleted_at?: string | null
          display_order?: number
          duration?: string | null
          featured?: boolean
          full_description?: string | null
          gallery_images?: Json
          id?: string
          image_url?: string | null
          name: string
          published?: boolean
          short_description?: string | null
          slug?: string | null
          target_audience?: string | null
          updated_at?: string
          workshop_format?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          deleted_at?: string | null
          display_order?: number
          duration?: string | null
          featured?: boolean
          full_description?: string | null
          gallery_images?: Json
          id?: string
          image_url?: string | null
          name?: string
          published?: boolean
          short_description?: string | null
          slug?: string | null
          target_audience?: string | null
          updated_at?: string
          workshop_format?: string | null
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          canonical_url: string | null
          created_at: string
          focus_keyword: string | null
          id: string
          meta_description: string | null
          og_image_url: string | null
          page_key: string
          page_label: string
          robots_index: boolean
          seo_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          page_key: string
          page_label: string
          robots_index?: boolean
          seo_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          page_key?: string
          page_label?: string
          robots_index?: boolean
          seo_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          country: string | null
          created_at: string
          deleted_at: string | null
          designation: string | null
          display_order: number
          featured: boolean
          id: string
          name: string
          organization: string | null
          photo_url: string | null
          program_id: string | null
          published: boolean
          quote: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          designation?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          name: string
          organization?: string | null
          photo_url?: string | null
          program_id?: string | null
          published?: boolean
          quote: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          designation?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          name?: string
          organization?: string | null
          photo_url?: string | null
          program_id?: string | null
          published?: boolean
          quote?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          additional_photos: Json
          created_at: string
          deleted_at: string | null
          display_order: number
          email: string | null
          featured: boolean
          full_bio: string | null
          id: string
          linkedin_url: string | null
          name: string
          person_type: string
          phone: string | null
          photo_url: string | null
          position: string | null
          professional_title: string | null
          published: boolean
          qualification: string | null
          regions: string[]
          short_bio: string | null
          slug: string | null
          training_areas: string[]
          updated_at: string
        }
        Insert: {
          additional_photos?: Json
          created_at?: string
          deleted_at?: string | null
          display_order?: number
          email?: string | null
          featured?: boolean
          full_bio?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          person_type?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          professional_title?: string | null
          published?: boolean
          qualification?: string | null
          regions?: string[]
          short_bio?: string | null
          slug?: string | null
          training_areas?: string[]
          updated_at?: string
        }
        Update: {
          additional_photos?: Json
          created_at?: string
          deleted_at?: string | null
          display_order?: number
          email?: string | null
          featured?: boolean
          full_bio?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          person_type?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          professional_title?: string | null
          published?: boolean
          qualification?: string | null
          regions?: string[]
          short_bio?: string | null
          slug?: string | null
          training_areas?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      training_topics: {
        Row: {
          category: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          icon: string | null
          id: string
          name: string
          published: boolean
          topic_group: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          published?: boolean
          topic_group?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          published?: boolean
          topic_group?: string | null
          updated_at?: string
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
      workshops: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          end_time: string | null
          event_date: string | null
          gallery_images: Json
          id: string
          image_url: string | null
          institution_id: string | null
          location: string | null
          name: string
          program_id: string | null
          published: boolean
          registration_link: string | null
          start_time: string | null
          status: string
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          end_time?: string | null
          event_date?: string | null
          gallery_images?: Json
          id?: string
          image_url?: string | null
          institution_id?: string | null
          location?: string | null
          name: string
          program_id?: string | null
          published?: boolean
          registration_link?: string | null
          start_time?: string | null
          status?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          end_time?: string | null
          event_date?: string | null
          gallery_images?: Json
          id?: string
          image_url?: string | null
          institution_id?: string | null
          location?: string | null
          name?: string
          program_id?: string | null
          published?: boolean
          registration_link?: string | null
          start_time?: string | null
          status?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshops_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshops_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshops_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
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
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "content_manager"
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
      app_role: ["super_admin", "content_manager"],
    },
  },
} as const
