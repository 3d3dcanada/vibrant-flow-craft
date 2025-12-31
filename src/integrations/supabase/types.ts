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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          name: string
          points_reward: number | null
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          name: string
          points_reward?: number | null
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          name?: string
          points_reward?: number | null
          type?: Database["public"]["Enums"]["achievement_type"]
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          id: string
          order_id: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          order_id?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          order_id?: string | null
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase_cad: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_cad?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_cad?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      creator_models: {
        Row: {
          category: string | null
          created_at: string
          creator_id: string
          description: string | null
          download_count: number | null
          file_url: string | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          name: string
          price_credits: number | null
          print_count: number | null
          revenue_share_percent: number | null
          thumbnail_url: string | null
          total_earnings_credits: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          name: string
          price_credits?: number | null
          print_count?: number | null
          revenue_share_percent?: number | null
          thumbnail_url?: string | null
          total_earnings_credits?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          name?: string
          price_credits?: number | null
          print_count?: number | null
          revenue_share_percent?: number | null
          thumbnail_url?: string | null
          total_earnings_credits?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          lifetime_earned: number
          lifetime_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          code: string
          created_at: string
          credits_value: number
          expires_at: string | null
          id: string
          is_redeemed: boolean | null
          price_cad: number
          purchased_by: string | null
          redeemed_at: string | null
          redeemed_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          credits_value: number
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean | null
          price_cad: number
          purchased_by?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          credits_value?: number
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean | null
          price_cad?: number
          purchased_by?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          activity_type: Database["public"]["Enums"]["point_activity_type"]
          balance_after: number
          created_at: string
          description: string | null
          id: string
          points: number
          reference_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["point_activity_type"]
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          points: number
          reference_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["point_activity_type"]
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          reference_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      point_wallets: {
        Row: {
          balance: number
          created_at: string
          current_streak_days: number | null
          id: string
          last_activity_date: string | null
          lifetime_earned: number
          lifetime_redeemed: number
          longest_streak_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          current_streak_days?: number | null
          id?: string
          last_activity_date?: string | null
          lifetime_earned?: number
          lifetime_redeemed?: number
          longest_streak_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          current_streak_days?: number | null
          id?: string
          last_activity_date?: string | null
          lifetime_earned?: number
          lifetime_redeemed?: number
          longest_streak_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          availability_status: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          display_name: string | null
          dry_box_required_ack: boolean | null
          email: string | null
          full_name: string | null
          hardware_inserts_capable: boolean | null
          id: string
          materials_supported: string | null
          nozzle_sizes: string | null
          onboarding_completed: boolean | null
          phone: string | null
          post_processing_capable: boolean | null
          postal_code: string | null
          printer_models: string | null
          profile_completion_percent: number | null
          province: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          availability_status?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          dry_box_required_ack?: boolean | null
          email?: string | null
          full_name?: string | null
          hardware_inserts_capable?: boolean | null
          id: string
          materials_supported?: string | null
          nozzle_sizes?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          post_processing_capable?: boolean | null
          postal_code?: string | null
          printer_models?: string | null
          profile_completion_percent?: number | null
          province?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          availability_status?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          dry_box_required_ack?: boolean | null
          email?: string | null
          full_name?: string | null
          hardware_inserts_capable?: boolean | null
          id?: string
          materials_supported?: string | null
          nozzle_sizes?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          post_processing_capable?: boolean | null
          postal_code?: string | null
          printer_models?: string | null
          profile_completion_percent?: number | null
          province?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recycling_drops: {
        Row: {
          created_at: string
          id: string
          location: string | null
          material_type: string
          points_earned: number
          user_id: string
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
          weight_grams: number
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          material_type: string
          points_earned: number
          user_id: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          weight_grams: number
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          material_type?: string
          points_earned?: number
          user_id?: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          weight_grams?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          points_awarded: number | null
          referral_code: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          points_awarded?: number | null
          referral_code: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          points_awarded?: number | null
          referral_code?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          created_at: string
          id: string
          platform: string
          points_earned: number | null
          reference_id: string | null
          share_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          points_earned?: number | null
          reference_id?: string | null
          share_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          points_earned?: number | null
          reference_id?: string | null
          share_type?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          admin_fee_discount_percent: number | null
          auto_renew: boolean | null
          bed_rental_discount_percent: number | null
          billing_cycle: string | null
          created_at: string
          credits_included: number | null
          expires_at: string | null
          id: string
          price_cad: number | null
          started_at: string
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_fee_discount_percent?: number | null
          auto_renew?: boolean | null
          bed_rental_discount_percent?: number | null
          billing_cycle?: string | null
          created_at?: string
          credits_included?: number | null
          expires_at?: string | null
          id?: string
          price_cad?: number | null
          started_at?: string
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_fee_discount_percent?: number | null
          auto_renew?: boolean | null
          bed_rental_discount_percent?: number | null
          billing_cycle?: string | null
          created_at?: string
          credits_included?: number | null
          expires_at?: string | null
          id?: string
          price_cad?: number | null
          started_at?: string
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          user_id: string
          uses_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          user_id: string
          uses_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          user_id?: string
          uses_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      achievement_type:
        | "first_print"
        | "recycler_bronze"
        | "recycler_silver"
        | "recycler_gold"
        | "referral_champion"
        | "social_butterfly"
        | "model_creator"
        | "loyal_customer"
        | "streak_7_day"
        | "streak_30_day"
        | "big_spender"
      point_activity_type:
        | "signup_bonus"
        | "profile_completion"
        | "referral_sent"
        | "referral_converted"
        | "social_share"
        | "recycling_drop"
        | "model_upload"
        | "purchase"
        | "review"
        | "streak_bonus"
        | "achievement_unlock"
      subscription_tier: "free" | "maker" | "pro"
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
      achievement_type: [
        "first_print",
        "recycler_bronze",
        "recycler_silver",
        "recycler_gold",
        "referral_champion",
        "social_butterfly",
        "model_creator",
        "loyal_customer",
        "streak_7_day",
        "streak_30_day",
        "big_spender",
      ],
      point_activity_type: [
        "signup_bonus",
        "profile_completion",
        "referral_sent",
        "referral_converted",
        "social_share",
        "recycling_drop",
        "model_upload",
        "purchase",
        "review",
        "streak_bonus",
        "achievement_unlock",
      ],
      subscription_tier: ["free", "maker", "pro"],
    },
  },
} as const
