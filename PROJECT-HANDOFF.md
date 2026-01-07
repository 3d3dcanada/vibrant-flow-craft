# 3D3D Canada — Complete Project Handoff Document
## Prepared for Google Antigravity Team
### Date: January 7, 2026

---

## 🎯 Executive Summary

**3D3D Canada** is a distributed 3D printing manufacturing network platform connecting customers who need prints with verified "Makers" who own 3D printers. The platform features a credit-based economy, reward points system, filament recycling program, and a futuristic cyberpunk aesthetic.

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite
- UI: Tailwind CSS + shadcn/ui + Custom Design System
- Backend: Supabase (Lovable Cloud) — PostgreSQL + Auth + Edge Functions + RLS
- State: TanStack React Query v5
- Routing: React Router DOM v6

**Live Repository:** https://github.com/3d3dcanada/vibrant-flow-craft

---

## 🏗️ Architecture Overview

### User Roles
The platform supports three distinct user roles, stored in a **separate `user_roles` table** (security best practice):

| Role | Description | Access Areas |
|------|-------------|--------------|
| `customer` | Default role for all signups | Dashboard, Quote System, Orders, Rewards, Profile |
| `maker` | Verified 3D printer owners | Maker Studio, Jobs Queue, Printers, Filament, Earnings |
| `admin` | Platform administrators | All customer/maker areas + Admin Panel |

### Role System Implementation (CRITICAL)

**Why roles are in a separate table:**
- Prevents privilege escalation attacks
- RLS policies use `SECURITY DEFINER` functions that bypass recursion
- Roles cannot be self-modified by users

**Database Functions (PostgreSQL):**
```sql
-- Check if user has a specific role
public.has_role(_user_id uuid, _role app_role) → boolean
-- SECURITY DEFINER - bypasses RLS

-- Convenience wrappers
public.is_admin(_user_id uuid) → boolean
public.is_maker(_user_id uuid) → boolean
```

**Frontend Hooks:**
```typescript
// src/hooks/useUserRoles.ts
useUserRoles()     // Fetch all roles for current user
useHasRole(role)   // Check specific role
useIsAdmin()       // Convenience hook
useIsMaker()       // Convenience hook
usePrimaryRole()   // Get highest-priority role (admin > maker > customer)
```

---

## 📊 Database Schema

### 27 Tables in Production

#### Core User Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (name, address, avatar, maker capabilities) |
| `user_roles` | Role assignments (admin/maker/customer) |
| `subscriptions` | Subscription tiers (free/maker/pro) |

#### Economy Tables
| Table | Purpose |
|-------|---------|
| `credit_wallets` | Credit balance per user |
| `credit_transactions` | Credit transaction history |
| `credit_packages` | Purchasable credit bundles |
| `point_wallets` | Reward points balance |
| `point_transactions` | Points transaction history |
| `coupons` | Discount codes |
| `coupon_usage` | Coupon redemption tracking |
| `gift_cards` | Gift card codes and values |

#### Print Workflow Tables
| Table | Purpose |
|-------|---------|
| `print_requests` | Customer print requests |
| `print_jobs` | Maker job assignments and tracking |
| `promo_products` | Pre-configured promotional products |
| `store_items` | Store inventory items |

#### Maker Tables
| Table | Purpose |
|-------|---------|
| `maker_printers` | Maker's printer fleet with specs |
| `maker_filament` | Maker's filament inventory |
| `payout_requests` | Maker payout requests |

#### Engagement Tables
| Table | Purpose |
|-------|---------|
| `achievements` | Gamification achievements |
| `user_achievements` | User unlocked achievements |
| `referrals` | Referral tracking |
| `user_referral_codes` | Unique referral codes per user |
| `social_shares` | Social sharing activity |
| `recycling_drops` | Filament recycling submissions |

#### Commerce Tables
| Table | Purpose |
|-------|---------|
| `buyback_requests` | Equipment buyback submissions |
| `creator_models` | Community-uploaded 3D models |
| `site_settings` | Global platform configuration |

---

## 🔐 Security Architecture

### Row-Level Security (RLS)

**All tables have RLS enabled.** Policies use the secure `has_role()` function to prevent recursion.

**Pattern Examples:**
```sql
-- Users can only see their own data
USING (auth.uid() = user_id)

-- Admins can see everything
USING (is_admin(auth.uid()))

-- Anyone can view public data
USING (true) -- SELECT only

-- Makers can claim unassigned requests
USING (is_maker(auth.uid()) AND maker_id IS NULL AND status = 'pending')
```

### Current Security Warnings (from linter)
1. **2x "RLS Policy Always True"** — Intentional for public INSERT on `buyback_requests` and `print_requests` (guest checkout flow)
2. **Leaked Password Protection Disabled** — Should be enabled in production

### Authentication Trigger
On user signup, a database trigger (`on_auth_user_created`) automatically:
1. Creates `profiles` row with email/name
2. Inserts `customer` role in `user_roles`
3. Creates `subscriptions` row (free tier)
4. Creates `credit_wallets` row (balance: 0)
5. Creates `point_wallets` row (100 signup bonus)
6. Records signup bonus transaction
7. Generates unique referral code

---

## 💰 Pricing Model

### Core Pricing (Non-Negotiable)
```
Minimum Order = $18 CAD
├── Platform Fee (3D3D): $5.00 (includes $0.25 designer royalty)
├── Bed Rental (Maker): $10.00 minimum
└── Filament Minimum: $3.00
```

### Credit Economy
```
10 credits = $1 CAD
1 credit = $0.10 CAD
```

### Material Pricing (per gram)
| Material | Customer Rate | Maker Rate |
|----------|---------------|------------|
| PLA Standard | $0.09 | $0.06 |
| PLA Specialty | $0.14 | $0.09 |
| PETG | $0.11 | $0.07 |
| PETG-CF | $0.35 | $0.25 |
| TPU | $0.18 | $0.12 |
| ABS/ASA | $0.13 | $0.08 |

### Bed Rental Tiers (Maker Payment)
| Print Time | Rate |
|------------|------|
| 0-6 hours | $10.00 |
| 6-24 hours | $14.00 |
| 24+ hours | $18.00 + $1/hr extra |

### Quantity Discounts
| Quantity | Discount |
|----------|----------|
| 10+ units | 10% off |
| 25+ units | 15% off |
| 50+ units | 20% off |

### Rush Pricing
- Standard: No surcharge
- Emergency: 15-25% on eligible charges

---

## 🎮 Reward System

### Points Earning
| Activity | Points |
|----------|--------|
| Signup Bonus | 100 |
| Social Share | 25 per share (max 3/day) |
| Recycling | 1 point per gram |
| Referral Conversion | 500 |

### Daily Limits
- Max points per day: 2,000
- Max recycling submissions: 3
- Max social shares: 3
- Max grams per submission: 50,000 (50kg)

---

## 🎨 Design System

### Visual Identity: "Cyberpunk Manufacturing"

**Color Palette (HSL):**
```css
/* Backgrounds */
--background: 233 75% 3%;        /* Deep space black */
--background-card: 235 40% 6%;   /* Card surfaces */
--background-elevated: 235 35% 9%;

/* Primary: Cyber Magenta */
--primary: 300 100% 50%;
--primary-glow: 300 100% 60%;

/* Secondary: Cyber Teal */
--secondary: 177 100% 50%;
--secondary-glow: 177 100% 65%;

/* Accent: Electric Blue */
--accent: 217 91% 60%;
```

**Typography:**
- Body: `Inter` (clean, readable)
- Tech/Headers: `Rajdhani` (futuristic)
- Display: `Space Grotesk` (modern)

**Effects:**
- Glass panels: `backdrop-blur-xl` with semi-transparent backgrounds
- Neon glows: Custom box-shadows with color bleeding
- Scanner lines: Animated horizontal lines
- Gradient text: Primary-to-secondary gradients

**Key CSS Classes:**
```css
.glass-panel    /* Glassmorphism cards */
.neon-glow-teal /* Teal neon effect */
.neon-glow-magenta /* Magenta neon effect */
.gradient-text  /* Gradient text effect */
.font-tech      /* Rajdhani font */
.font-display   /* Space Grotesk font */
.hover-lift     /* Lift animation on hover */
.shimmer        /* Shimmer effect on hover */
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── guards/           # Route guards (AdminGuard, MakerGuard)
│   ├── layouts/          # DashboardLayout with role-based navigation
│   ├── repositories/     # Print request components
│   ├── sections/         # Landing page sections
│   └── ui/               # shadcn/ui + custom components
├── config/
│   ├── credits.ts        # Credit economy config
│   ├── pricing.ts        # Full pricing model
│   └── rewards.ts        # Reward system config
├── contexts/
│   └── AuthContext.tsx   # Authentication state
├── hooks/
│   ├── useUserRoles.ts   # Role management hooks
│   ├── useUserData.ts    # User profile/wallet hooks
│   ├── useAdminData.ts   # Admin-only data hooks
│   ├── useMakerData.ts   # Maker-only data hooks
│   └── ...
├── pages/
│   ├── admin/            # Admin panel pages (7)
│   ├── maker/            # Maker studio pages (7)
│   └── ...               # Customer pages (20+)
└── integrations/
    └── supabase/
        ├── client.ts     # Auto-generated client
        └── types.ts      # Auto-generated types

supabase/
├── functions/
│   ├── claim-social-reward/
│   ├── printer-status/
│   └── submit-recycling-drop/
└── config.toml
```

---

## 🔄 Current State

### ✅ Working Features
- [x] User authentication (signup, login, password reset)
- [x] Role-based access control (admin/maker/customer)
- [x] Profile management
- [x] Quote calculator with full pricing model
- [x] Credit economy (wallets, packages, transactions)
- [x] Point rewards system
- [x] Referral code generation
- [x] Recycling submission (edge function)
- [x] Social share rewards (edge function)
- [x] Achievement system
- [x] Maker printer/filament management
- [x] Print request submission
- [x] Admin dashboard with stats
- [x] Buyback request system
- [x] Dark cyberpunk design system

### ⚠️ Known Issues
1. **framer-motion removal in progress** — Some pages may still have broken imports
2. **Enable leaked password protection** — Security setting in Supabase
3. **Maker onboarding flow** — Needs verification workflow

### 🚧 Incomplete/Needs Work
- [ ] Payment integration (Stripe/PayPal)
- [ ] File upload for print requests (STL/3MF)
- [ ] Email notifications
- [ ] Real-time job status updates
- [ ] Maker verification workflow
- [ ] Model marketplace
- [ ] Mobile responsiveness polish
- [ ] Print job photo uploads
- [ ] Shipping integration

---

## 🔑 Key Users in Database

| Email | Role | Notes |
|-------|------|-------|
| admin@3d3d.ca | admin | Primary admin account |
| donspencer727@gmail.com | customer | Founder account (needs admin role if desired) |

---

## 🚀 Edge Functions

### 1. `submit-recycling-drop`
- Validates material type and weight
- Enforces daily submission limits
- Awards points to user
- Records transaction

### 2. `claim-social-reward`
- Validates platform and share type
- Enforces daily share limits
- Awards points

### 3. `printer-status`
- Fetches printer status via OctoPrint/Moonraker API
- Updates `maker_printers.last_status`

---

## 📝 Next Steps for Development

### Priority 1: Stabilization
1. Complete framer-motion removal (replace with CSS animations)
2. Enable leaked password protection in Supabase
3. Test full authentication flow end-to-end
4. Verify all RLS policies work correctly

### Priority 2: Core Features
1. Implement file upload for STL/3MF files
2. Add Stripe integration for credit purchases
3. Build maker verification workflow
4. Add email notifications (Resend/SendGrid)

### Priority 3: Polish
1. Mobile responsiveness audit
2. Performance optimization
3. Loading states and error handling
4. SEO optimization

### Priority 4: Advanced Features
1. Real-time job updates (Supabase Realtime)
2. Model marketplace
3. Shipping calculator
4. Analytics dashboard

---

## 🎯 Vision Statement

3D3D Canada aims to democratize 3D printing by creating a peer-to-peer manufacturing network that:

1. **Empowers Makers** — Turn idle 3D printers into income sources
2. **Serves Customers** — Get custom prints without owning a printer
3. **Promotes Sustainability** — Reward filament recycling
4. **Builds Community** — Gamification, achievements, and social sharing
5. **Scales Locally** — Start in Canada, expand to other regions

The cyberpunk aesthetic isn't just visual — it represents the fusion of grassroots manufacturing with cutting-edge technology.

---

## 📞 Handoff Contacts

| Role | Email |
|------|-------|
| Founder | donspencer727@gmail.com |
| Platform | admin@3d3d.ca |

---

*Document generated by Lovable AI — January 7, 2026*
