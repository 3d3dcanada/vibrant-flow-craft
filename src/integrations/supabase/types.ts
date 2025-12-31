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
      credit_packages: {
        Row: {
          active: boolean | null
          bonus_credits: number | null
          credits_amount: number
          id: string
          name: string
          price_cad: number
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          bonus_credits?: number | null
          credits_amount: number
          id?: string
          name: string
          price_cad: number
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          bonus_credits?: number | null
          credits_amount?: number
          id?: string
          name?: string
          price_cad?: number
          tagline?: string | null
          updated_at?: string | null
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
      maker_filament: {
        Row: {
          brand: string | null
          color: string
          created_at: string
          dry_status: Database["public"]["Enums"]["filament_dry_status"] | null
          grams_remaining: number | null
          id: string
          maker_id: string
          material: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          color: string
          created_at?: string
          dry_status?: Database["public"]["Enums"]["filament_dry_status"] | null
          grams_remaining?: number | null
          id?: string
          maker_id: string
          material: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          color?: string
          created_at?: string
          dry_status?: Database["public"]["Enums"]["filament_dry_status"] | null
          grams_remaining?: number | null
          id?: string
          maker_id?: string
          material?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      maker_printers: {
        Row: {
          api_key: string | null
          connection_type:
            | Database["public"]["Enums"]["printer_connection_type"]
            | null
          connection_url: string | null
          created_at: string
          id: string
          job_size: string | null
          last_seen_at: string | null
          last_status: Json | null
          maker_id: string
          materials_supported: string[] | null
          model: string
          notes: string | null
          nozzle_sizes: string[] | null
          status: Database["public"]["Enums"]["printer_status"]
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          connection_type?:
            | Database["public"]["Enums"]["printer_connection_type"]
            | null
          connection_url?: string | null
          created_at?: string
          id?: string
          job_size?: string | null
          last_seen_at?: string | null
          last_status?: Json | null
          maker_id: string
          materials_supported?: string[] | null
          model: string
          notes?: string | null
          nozzle_sizes?: string[] | null
          status?: Database["public"]["Enums"]["printer_status"]
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          connection_type?:
            | Database["public"]["Enums"]["printer_connection_type"]
            | null
          connection_url?: string | null
          created_at?: string
          id?: string
          job_size?: string | null
          last_seen_at?: string | null
          last_status?: Json | null
          maker_id?: string
          materials_supported?: string[] | null
          model?: string
          notes?: string | null
          nozzle_sizes?: string[] | null
          status?: Database["public"]["Enums"]["printer_status"]
          updated_at?: string
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          amount_estimate: number
          created_at: string
          id: string
          maker_id: string
          notes: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["payout_status"]
        }
        Insert: {
          amount_estimate?: number
          created_at?: string
          id?: string
          maker_id: string
          notes?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Update: {
          amount_estimate?: number
          created_at?: string
          id?: string
          maker_id?: string
          notes?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
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
      print_jobs: {
        Row: {
          created_at: string
          id: string
          maker_id: string
          notes: string | null
          photos: Json | null
          quality_checks: Json | null
          request_id: string | null
          sla_target_at: string | null
          status: Database["public"]["Enums"]["print_job_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          maker_id: string
          notes?: string | null
          photos?: Json | null
          quality_checks?: Json | null
          request_id?: string | null
          sla_target_at?: string | null
          status?: Database["public"]["Enums"]["print_job_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          maker_id?: string
          notes?: string | null
          photos?: Json | null
          quality_checks?: Json | null
          request_id?: string | null
          sla_target_at?: string | null
          status?: Database["public"]["Enums"]["print_job_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "print_jobs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "print_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      print_requests: {
        Row: {
          attribution: Json | null
          created_at: string
          id: string
          maker_id: string | null
          notes: string | null
          specs: Json | null
          status: Database["public"]["Enums"]["print_request_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attribution?: Json | null
          created_at?: string
          id?: string
          maker_id?: string | null
          notes?: string | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["print_request_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attribution?: Json | null
          created_at?: string
          id?: string
          maker_id?: string | null
          notes?: string | null
          specs?: Json | null
          status?: Database["public"]["Enums"]["print_request_status"]
          updated_at?: string
          user_id?: string | null
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
          maker_verification_notes: string | null
          maker_verified: boolean | null
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
          maker_verification_notes?: string | null
          maker_verified?: boolean | null
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
          maker_verification_notes?: string | null
          maker_verified?: boolean | null
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
      promo_products: {
        Row: {
          active: boolean | null
          category: string
          default_material: string | null
          description: string | null
          grams_per_unit: number | null
          id: string
          image_url: string | null
          minutes_per_unit: number | null
          month_tag: string | null
          moqs: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string
          default_material?: string | null
          description?: string | null
          grams_per_unit?: number | null
          id?: string
          image_url?: string | null
          minutes_per_unit?: number | null
          month_tag?: string | null
          moqs?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string
          default_material?: string | null
          description?: string | null
          grams_per_unit?: number | null
          id?: string
          image_url?: string | null
          minutes_per_unit?: number | null
          month_tag?: string | null
          moqs?: Json | null
          name?: string
          updated_at?: string | null
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
      site_settings: {
        Row: {
          homepage_banner_cta_text: string | null
          homepage_banner_cta_url: string | null
          homepage_banner_enabled: boolean | null
          homepage_banner_subtitle: string | null
          homepage_banner_title: string | null
          id: string
          promo_pool_cap_cad: number | null
          social_reward_credits: number | null
          updated_at: string | null
        }
        Insert: {
          homepage_banner_cta_text?: string | null
          homepage_banner_cta_url?: string | null
          homepage_banner_enabled?: boolean | null
          homepage_banner_subtitle?: string | null
          homepage_banner_title?: string | null
          id?: string
          promo_pool_cap_cad?: number | null
          social_reward_credits?: number | null
          updated_at?: string | null
        }
        Update: {
          homepage_banner_cta_text?: string | null
          homepage_banner_cta_url?: string | null
          homepage_banner_enabled?: boolean | null
          homepage_banner_subtitle?: string | null
          homepage_banner_title?: string | null
          id?: string
          promo_pool_cap_cad?: number | null
          social_reward_credits?: number | null
          updated_at?: string | null
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
      store_items: {
        Row: {
          active: boolean | null
          base_price_cad: number | null
          credits_price: number | null
          description: string | null
          id: string
          image_url: string | null
          metadata: Json | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_price_cad?: number | null
          credits_price?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          name: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_price_cad?: number | null
          credits_price?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          name?: string
          type?: string
          updated_at?: string | null
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_maker: { Args: { _user_id: string }; Returns: boolean }
      redeem_gift_card: { Args: { p_code: string }; Returns: Json }
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
      filament_dry_status: "dry" | "needs_drying" | "unknown"
      payout_status: "pending" | "processing" | "completed" | "rejected"
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
      print_job_status:
        | "new"
        | "printing"
        | "post_processing"
        | "ready"
        | "shipped"
        | "complete"
        | "cancelled"
      print_request_status:
        | "pending"
        | "claimed"
        | "quoted"
        | "accepted"
        | "declined"
        | "cancelled"
      printer_connection_type: "none" | "octoprint" | "moonraker"
      printer_status: "available" | "printing" | "maintenance" | "offline"
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
      filament_dry_status: ["dry", "needs_drying", "unknown"],
      payout_status: ["pending", "processing", "completed", "rejected"],
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
      print_job_status: [
        "new",
        "printing",
        "post_processing",
        "ready",
        "shipped",
        "complete",
        "cancelled",
      ],
      print_request_status: [
        "pending",
        "claimed",
        "quoted",
        "accepted",
        "declined",
        "cancelled",
      ],
      printer_connection_type: ["none", "octoprint", "moonraker"],
      printer_status: ["available", "printing", "maintenance", "offline"],
      subscription_tier: ["free", "maker", "pro"],
    },
  },
} as const
