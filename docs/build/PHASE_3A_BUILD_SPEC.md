# Phase 3A Build Specification

**Project:** 3D3D.ca  
**Phase:** 3A — Core User Experience  
**Date:** January 9, 2026  
**Status:** Locked for Implementation  
**Classification:** Internal — Engineering Reference

---

# Section 1: Phase 3A Page Inventory (Final)

## Included Pages

### `/` — Homepage

| Field | Value |
|-------|-------|
| Route | `/` |
| Purpose | Convert visitors to quote requests or store exploration |
| Primary Intent | Understand what 3D3D does and take first action |
| Secondary Intent | Build trust, learn more about the platform |
| Exit Action | Click "Get a Quote" CTA or navigate to Store/Learn |

---

### `/quote` — Quote Entry (Entry Only)

| Field | Value |
|-------|-------|
| Route | `/quote` |
| Purpose | Begin quote flow (file upload visible, full flow in Phase 3B) |
| Primary Intent | Upload a file to get a quote |
| Secondary Intent | Understand pricing structure before committing |
| Exit Action | File upload initiated (Phase 3B continues from here) |

**Phase 3A Scope:** Page structure, file upload zone visible, material selector placeholder, "Coming Soon" or "Under Construction" messaging for calculation.

---

### `/learn` — Learning Hub Overview

| Field | Value |
|-------|-------|
| Route | `/learn` |
| Purpose | Display educational content index |
| Primary Intent | Find learning resources about 3D printing |
| Secondary Intent | Establish 3D3D as knowledgeable authority |
| Exit Action | Navigate to specific guide OR return to main site |

---

### `/learn/:slug` — Learning Article

| Field | Value |
|-------|-------|
| Route | `/learn/:slug` |
| Purpose | Display single learning guide |
| Primary Intent | Read and learn |
| Secondary Intent | Navigate to related content or quote |
| Exit Action | Navigate to another guide, home, or quote |

---

### `/blog` — Blog Index

| Field | Value |
|-------|-------|
| Route | `/blog` |
| Purpose | Display blog post index |
| Primary Intent | Browse articles |
| Secondary Intent | Build trust through thought leadership |
| Exit Action | Navigate to specific post OR return to main site |

---

### `/blog/:slug` — Blog Post

| Field | Value |
|-------|-------|
| Route | `/blog/:slug` |
| Purpose | Display single blog post |
| Primary Intent | Read article |
| Secondary Intent | Share, navigate to related content |
| Exit Action | Navigate to another post, home, or quote |

---

### `/about` — About Page

| Field | Value |
|-------|-------|
| Route | `/about` |
| Purpose | Explain the company, team, and mission |
| Primary Intent | Learn who 3D3D is |
| Secondary Intent | Build trust, understand values |
| Exit Action | Navigate to Mission, Quote, or Contact |

---

### `/mission` — Mission Page

| Field | Value |
|-------|-------|
| Route | `/mission` |
| Purpose | Explain platform purpose and principles |
| Primary Intent | Understand why 3D3D exists |
| Secondary Intent | Evaluate alignment with personal values |
| Exit Action | Navigate to About, Quote, or governance docs |

---

### `/terms` — Terms of Service

| Field | Value |
|-------|-------|
| Route | `/terms` |
| Purpose | Legal terms of service |
| Primary Intent | Review legal agreement |
| Secondary Intent | None |
| Exit Action | Return to previous page or home |

---

### `/privacy` — Privacy Policy

| Field | Value |
|-------|-------|
| Route | `/privacy` |
| Purpose | Privacy policy disclosure |
| Primary Intent | Understand data handling |
| Secondary Intent | None |
| Exit Action | Return to previous page or home |

---

### `/refunds` — Refunds & Cancellations

| Field | Value |
|-------|-------|
| Route | `/refunds` |
| Purpose | Refund and cancellation policy |
| Primary Intent | Understand return policy |
| Secondary Intent | None |
| Exit Action | Return to previous page or home |

---

### `/print-responsibility` — Print Responsibility

| Field | Value |
|-------|-------|
| Route | `/print-responsibility` |
| Purpose | User obligations and safety information |
| Primary Intent | Understand what 3D3D does and doesn't cover |
| Secondary Intent | None |
| Exit Action | Return to previous page or home |

---

### `/auth` — Authentication

| Field | Value |
|-------|-------|
| Route | `/auth` |
| Purpose | Sign in, sign up, password reset |
| Primary Intent | Authenticate to access protected features |
| Secondary Intent | Create new account |
| Exit Action | Redirect to intended destination or home |

---

### `/schedule` — Schedule a Call

| Field | Value |
|-------|-------|
| Route | `/schedule` |
| Purpose | Book consultation |
| Primary Intent | Schedule time with 3D3D team |
| Secondary Intent | None |
| Exit Action | Booking complete or return to home |

---

### `/careers` — Careers

| Field | Value |
|-------|-------|
| Route | `/careers` |
| Purpose | Job opportunities |
| Primary Intent | Explore employment |
| Secondary Intent | None |
| Exit Action | Apply or return to home |

---

### `/brand-games` — Brand-Games Hub

| Field | Value |
|-------|-------|
| Route | `/brand-games` |
| Purpose | Interactive creative tools |
| Primary Intent | Use creative challenge generator |
| Secondary Intent | Learn about upcoming games |
| Exit Action | Generate challenge, navigate to home or quote |

---

## Explicitly NOT in Phase 3A

| Route | Reason |
|-------|--------|
| `/store` | Phase 3D |
| `/store/*` | Phase 3D |
| `/checkout` | Phase 3C |
| `/customer-dashboard` | Phase 3C |
| `/dashboard/admin/*` | Phase 3E |
| `/dashboard/maker/*` | Phase 3F |
| `/profile-settings` | Phase 3C |

---

# Section 2: Homepage Final Content Map

## Section Order (Top to Bottom)

### 1. Hero Section

| Field | Value |
|-------|-------|
| Section Name | Hero |
| Purpose | Immediate value proposition and primary CTA |
| Problem Solved | Visitor doesn't know what 3D3D does |
| CTA | "Get Your Free Quote" → `/quote` |
| Content Source | Static (hardcoded) |

**Content Required:**
- Headline: "Custom 3D Prints. Made in Canada."
- Subheadline: "Upload your file. Get a quote in seconds. We handle the rest."
- CTA Button: "Get Your Free Quote"
- Secondary CTA: "Learn How It Works" (scroll anchor)
- Background: Subtle gradient or abstract 3D pattern

---

### 2. How It Works Section

| Field | Value |
|-------|-------|
| Section Name | HowItWorks |
| Purpose | Explain the process in 3 simple steps |
| Problem Solved | Visitor doesn't understand the service model |
| CTA | "Start Your Quote" → `/quote` |
| Content Source | Static (hardcoded) |

**Content Required:**
- Step 1: "Upload Your File" — "Drop your STL or 3MF file. We analyze it instantly."
- Step 2: "Get Your Quote" — "See exactly what it costs. No hidden fees. No surprises."
- Step 3: "We Print & Ship" — "Our Canadian makers produce your part and ship it to you."
- Bottom CTA: "Start Your Quote"

---

### 3. Trust Indicators Section

| Field | Value |
|-------|-------|
| Section Name | TrustIndicators |
| Purpose | Build credibility before asking for commitment |
| Problem Solved | Visitor doesn't trust unknown platform |
| CTA | None |
| Content Source | Static (hardcoded) |

**Content Required:**
- "100% Canadian Production"
- "No Hidden Fees — Ever"
- "Quality Guaranteed"
- "Fast Turnaround"
- Optional: Location badges (Fredericton, Moncton, Saint John, Halifax, Charlottetown)

---

### 4. Materials Preview Section

| Field | Value |
|-------|-------|
| Section Name | MaterialsPreview |
| Purpose | Show available materials at a glance |
| Problem Solved | Visitor wonders if their material needs are covered |
| CTA | "See All Materials" → `/learn/materials-guide` |
| Content Source | Static (can be dynamic in future) |

**Content Required:**
- 4-6 material cards (PLA, PETG, ABS, TPU, Resin, Nylon)
- Each card: Name, brief description, use case
- Link to full materials guide

---

### 5. Education Teaser Section

| Field | Value |
|-------|-------|
| Section Name | LearnTeaser |
| Purpose | Show educational content depth |
| Problem Solved | Visitor wants to learn before buying |
| CTA | "Explore Learning Guides" → `/learn` |
| Content Source | Static (links to existing guides) |

**Content Required:**
- 3 featured learning guide cards
- Each: Title, brief description, link
- Bottom CTA: "Explore All Guides"

---

### 6. Quote CTA Section

| Field | Value |
|-------|-------|
| Section Name | QuoteCTA |
| Purpose | Final conversion push before footer |
| Problem Solved | Visitor scrolled but hasn't acted |
| CTA | "Get Your Free Quote" → `/quote` |
| Content Source | Static (hardcoded) |

**Content Required:**
- Headline: "Ready to bring your idea to life?"
- Subheadline: "Upload your file and get a quote in under a minute."
- CTA Button: "Get Your Free Quote"

---

### 7. Footer

| Field | Value |
|-------|-------|
| Section Name | Footer |
| Purpose | Navigation, legal links, contact info |
| Problem Solved | Visitor needs secondary navigation |
| CTA | Various links |
| Content Source | Static (already implemented) |

**Content Required:**
- Brand/logo
- Platform links
- Company links
- Legal links
- Social links
- Location badges
- Contact email
- Operational status indicator

---

# Section 3: Component Breakdown

## Layout Components

### `Header`
- **Used On:** All pages
- **Props:** None
- **Data Source:** None
- **State:** Mobile menu open/closed, user auth state

### `Footer`
- **Used On:** All pages
- **Props:** None
- **Data Source:** None
- **State:** None

### `PageLayout`
- **Used On:** All content pages (not homepage)
- **Props:** `title: string`, `children: ReactNode`
- **Data Source:** None
- **State:** None

---

## Homepage Components

### `Hero`
- **Used On:** `/`
- **Props:** None
- **Data Source:** None (static)
- **State:** None

### `HowItWorks`
- **Used On:** `/`
- **Props:** None
- **Data Source:** None (static)
- **State:** None

### `TrustIndicators`
- **Used On:** `/`
- **Props:** None
- **Data Source:** None (static)
- **State:** None

### `MaterialsPreview`
- **Used On:** `/`
- **Props:** None
- **Data Source:** None (static, can read from config)
- **State:** None

### `LearnTeaser`
- **Used On:** `/`
- **Props:** `guides: Array<{title, slug, description}>`
- **Data Source:** Static array of featured guides
- **State:** None

### `QuoteCTA`
- **Used On:** `/`
- **Props:** None
- **Data Source:** None (static)
- **State:** None

---

## Quote Page Components (Phase 3A Scope Only)

### `FileUploadZone`
- **Used On:** `/quote`
- **Props:** `onFileSelect: (file: File) => void`, `disabled?: boolean`
- **Data Source:** None
- **State:** Drag state, selected file preview

### `MaterialSelector`
- **Used On:** `/quote`
- **Props:** `materials: Material[]`, `selected: string`, `onSelect: (id: string) => void`, `disabled?: boolean`
- **Data Source:** Static material list (Phase 3B: from DB)
- **State:** Selected material

### `QuotePlaceholder`
- **Used On:** `/quote` (Phase 3A only)
- **Props:** None
- **Data Source:** None
- **State:** None
- **Note:** Shows "Quote calculation coming soon" messaging

---

## Auth Components

### `AuthForm`
- **Used On:** `/auth`
- **Props:** `mode: 'signin' | 'signup' | 'reset'`
- **Data Source:** Supabase Auth
- **State:** Form fields, loading, error

### `CASLConsentCheckbox`
- **Used On:** `/auth` (signup mode only)
- **Props:** `checked: boolean`, `onChange: (checked: boolean) => void`
- **Data Source:** None
- **State:** Checked state

---

## Content Components

### `ArticleCard`
- **Used On:** `/learn`, `/blog`
- **Props:** `title: string`, `slug: string`, `description: string`, `category?: string`
- **Data Source:** None (receives props)
- **State:** None

### `ArticleContent`
- **Used On:** `/learn/:slug`, `/blog/:slug`
- **Props:** `content: string` (HTML or markdown)
- **Data Source:** None (receives props)
- **State:** None

### `LegalPageContent`
- **Used On:** `/terms`, `/privacy`, `/refunds`, `/print-responsibility`
- **Props:** `title: string`, `lastUpdated: string`, `content: string`
- **Data Source:** None (receives props)
- **State:** None

---

## Shared UI Components

### `Button`
- **Used On:** All pages
- **Props:** `variant: 'primary' | 'secondary' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `disabled?: boolean`, `loading?: boolean`
- **Data Source:** None
- **State:** None

### `Card`
- **Used On:** Multiple pages
- **Props:** `children: ReactNode`, `className?: string`
- **Data Source:** None
- **State:** None

### `Badge`
- **Used On:** Multiple pages
- **Props:** `variant: 'default' | 'success' | 'warning' | 'error'`, `children: ReactNode`
- **Data Source:** None
- **State:** None

### `LoadingSpinner`
- **Used On:** Any loading state
- **Props:** `size?: 'sm' | 'md' | 'lg'`
- **Data Source:** None
- **State:** None

### `ErrorMessage`
- **Used On:** Any error state
- **Props:** `title: string`, `message: string`, `action?: { label: string, onClick: () => void }`
- **Data Source:** None
- **State:** None

### `EmptyState`
- **Used On:** Any empty state
- **Props:** `title: string`, `message: string`, `action?: { label: string, onClick: () => void }`
- **Data Source:** None
- **State:** None

---

# Section 4: Copy Ownership Rules

## Hard-Coded Text (Never Dynamic)

| Location | Content Type |
|----------|--------------|
| Hero headline | "Custom 3D Prints. Made in Canada." |
| Hero subheadline | Fixed tagline |
| How It Works steps | Step titles and descriptions |
| Trust indicators | All four trust points |
| CTA button labels | "Get Your Free Quote", "Start Your Quote" |
| Header navigation labels | Home, Get a Quote, Store, Learn, About |
| Footer section headers | Platform, Company, Legal |
| Footer copyright | © 2026 3D3D.ca. All rights reserved. |
| Error message templates | Standard error text patterns |

## Content File Text (Static Files, Not DB)

| Location | Content Type | File Location |
|----------|--------------|---------------|
| Learning guides | Full article content | Component-internal or `/content/` |
| Blog posts | Full article content | Component-internal or `/content/` |
| Materials data | Material names, descriptions | `/data/materials.json` or config |
| Legal pages | Terms, Privacy, Refunds, Print Responsibility | Component-internal |

## Admin-Editable Later (Phase 3E+)

| Location | Content Type |
|----------|--------------|
| Blog posts | Full content (if CMS implemented) |
| Announcement banners | Banner text |
| Featured products | Product selection for homepage |

## Never Dynamic

| Location | Content Type | Reason |
|----------|--------------|--------|
| Legal page content | Terms, Privacy, Refunds | Must be legally reviewed, not editable on-the-fly |
| Pricing structure explanation | "No hidden fees" claims | Legal commitment |
| Ethics/governance references | Links to published docs | Must match actual published docs |

---

# Section 5: Auth & Gating Rules (Phase 3A Only)

## Pages That Require Auth

| Route | Auth Required | Reason |
|-------|---------------|--------|
| `/customer-dashboard` | Yes | User-specific data |
| `/profile-settings` | Yes | User-specific data |
| `/dashboard/admin/*` | Yes + Admin role | Admin only |
| `/dashboard/maker/*` | Yes + Maker role | Maker only |

**Note:** None of these pages are in Phase 3A scope.

## Pages That Must Never Require Auth

| Route | Reason |
|-------|--------|
| `/` | First impression, conversion |
| `/quote` | Must allow browsing before commitment |
| `/store` | Must allow browsing before commitment |
| `/store/*` | Must allow browsing before commitment |
| `/learn` | Educational content is public |
| `/learn/*` | Educational content is public |
| `/blog` | Content marketing is public |
| `/blog/*` | Content marketing is public |
| `/about` | Company info is public |
| `/mission` | Company info is public |
| `/terms` | Legal docs are public |
| `/privacy` | Legal docs are public |
| `/refunds` | Legal docs are public |
| `/print-responsibility` | Legal docs is public |
| `/brand-games` | Entertainment is public |
| `/schedule` | Contact is public |
| `/careers` | Job postings are public |

## Auth Redirect Behavior

| Scenario | Behavior |
|----------|----------|
| Unauthenticated user visits protected route | Redirect to `/auth` with `?redirect={intended_route}` |
| User completes auth with redirect param | Redirect to original intended route |
| User completes auth without redirect param | Redirect to `/` (homepage) |
| User signs out | Redirect to `/` (homepage) |
| User auth session expires | Show "Session expired" message, redirect to `/auth` |

## Intent Preservation

| Scenario | How Intent Is Preserved |
|----------|------------------------|
| User on quote page, needs to auth for checkout | Store quote in localStorage, redirect param to `/quote` |
| User browsing store, needs to auth for purchase | Store cart in localStorage, redirect param to `/store` |
| Deep link to protected page | Redirect param captures original URL |

---

# Section 6: Error & Empty States (Mandatory)

## Error States

### Network Error

| Field | Value |
|-------|-------|
| Trigger | Fetch/API call fails due to network |
| User Message | "Unable to connect. Please check your internet connection." |
| Recovery Action | "Try Again" button that retries the request |

### Server Error (500)

| Field | Value |
|-------|-------|
| Trigger | Server returns 5xx status |
| User Message | "Something went wrong on our end. We're looking into it." |
| Recovery Action | "Try Again" button, link to contact support |

### Not Found (404)

| Field | Value |
|-------|-------|
| Trigger | Page or resource not found |
| User Message | "We couldn't find what you're looking for." |
| Recovery Action | "Go Home" button, search suggestion (if applicable) |

### Unauthorized (401)

| Field | Value |
|-------|-------|
| Trigger | Auth required but user not authenticated |
| User Message | "Please sign in to continue." |
| Recovery Action | Redirect to `/auth` with return URL |

### Forbidden (403)

| Field | Value |
|-------|-------|
| Trigger | User authenticated but lacks permission |
| User Message | "You don't have permission to view this page." |
| Recovery Action | "Go Home" button, contact support link |

### Validation Error

| Field | Value |
|-------|-------|
| Trigger | Form submission with invalid data |
| User Message | Specific field-level error messages |
| Recovery Action | Highlight invalid fields, allow correction |

---

## Empty States

### No Learning Guides (should never happen)

| Field | Value |
|-------|-------|
| Trigger | Learn page with 0 guides |
| User Message | "Learning guides coming soon." |
| Recovery Action | "Go Home" button |

### No Blog Posts (should never happen)

| Field | Value |
|-------|-------|
| Trigger | Blog page with 0 posts |
| User Message | "Blog posts coming soon." |
| Recovery Action | "Go Home" button |

### No Search Results

| Field | Value |
|-------|-------|
| Trigger | Search returns 0 results |
| User Message | "No results found for '{query}'." |
| Recovery Action | "Clear search" button, suggestions |

### No Orders (Dashboard - Phase 3C)

| Field | Value |
|-------|-------|
| Trigger | User has no orders yet |
| User Message | "You haven't placed any orders yet." |
| Recovery Action | "Get a Quote" CTA |

---

## Loading States

### Page Loading

| Field | Value |
|-------|-------|
| Trigger | Initial page load or navigation |
| Display | Full-page loading spinner or skeleton |
| Duration | Until content ready or error |

### Component Loading

| Field | Value |
|-------|-------|
| Trigger | Data fetch for specific component |
| Display | Inline spinner or skeleton for component |
| Duration | Until data ready or error |

### Button Loading

| Field | Value |
|-------|-------|
| Trigger | Form submission or action in progress |
| Display | Button disabled with spinner, text changes to "Loading..." |
| Duration | Until action complete or error |

---

# Section 7: Phase 3A "Done" Criteria (Non-Negotiable)

## Checklist

### Homepage

- [ ] Hero section renders with correct content
- [ ] Hero CTA navigates to `/quote`
- [ ] How It Works section renders with 3 steps
- [ ] How It Works scroll anchor (`/#how-it-works`) works
- [ ] Trust Indicators section renders
- [ ] Materials Preview section renders with material cards
- [ ] Learn Teaser section renders with 3 guide cards
- [ ] Quote CTA section renders with CTA button
- [ ] Footer renders with all links
- [ ] All footer links resolve without 404
- [ ] Page loads in < 3 seconds
- [ ] No console errors

### Quote Entry Page

- [ ] Page renders at `/quote`
- [ ] File upload zone visible
- [ ] Material selector visible (can be placeholder data)
- [ ] Clear messaging that full quote coming soon (if calculation not ready)
- [ ] Page loads in < 3 seconds
- [ ] No console errors

### Learn Pages

- [ ] `/learn` renders with guide index
- [ ] At least 5 guides listed
- [ ] Each guide card links to correct `/learn/:slug`
- [ ] Each guide page renders full content
- [ ] Navigation between guides works
- [ ] Back to Learn link works
- [ ] No console errors

### Blog Pages

- [ ] `/blog` renders with post index
- [ ] At least 5 posts listed
- [ ] Each post card links to correct `/blog/:slug`
- [ ] Each post page renders full content
- [ ] Navigation between posts works
- [ ] Back to Blog link works
- [ ] No console errors

### About/Mission Pages

- [ ] `/about` renders with company content
- [ ] `/mission` renders with mission content
- [ ] Cross-links between About and Mission work
- [ ] No console errors

### Legal Pages

- [ ] `/terms` renders full Terms of Service
- [ ] `/privacy` renders full Privacy Policy
- [ ] `/refunds` renders full Refunds policy
- [ ] `/print-responsibility` renders full policy
- [ ] All legal pages show last updated date
- [ ] No console errors

### Auth Pages

- [ ] `/auth` renders sign in form by default
- [ ] Sign in form submits successfully
- [ ] Sign up tab/mode available
- [ ] Sign up form submits successfully
- [ ] CASL consent checkbox on signup
- [ ] Password reset link works
- [ ] Error states display on failed auth
- [ ] Successful auth redirects correctly
- [ ] Redirect param preserved through auth flow
- [ ] No console errors

### Other Pages

- [ ] `/schedule` renders (Calendly or placeholder)
- [ ] `/careers` renders job listings or placeholder
- [ ] `/brand-games` renders with Creative Challenge Generator functional
- [ ] Challenge Generator produces random prompts
- [ ] No console errors

### Mobile Responsiveness

- [ ] Homepage renders correctly on mobile (375px width)
- [ ] Header collapses to mobile menu
- [ ] All pages scrollable without horizontal overflow
- [ ] Touch targets minimum 44px
- [ ] CTA buttons easily tappable

### Error Handling

- [ ] 404 page renders for unknown routes
- [ ] 404 page has "Go Home" button
- [ ] Network errors show user-friendly message
- [ ] Auth errors show user-friendly message

### Performance

- [ ] Lighthouse performance score > 70
- [ ] No render-blocking resources
- [ ] Images optimized (WebP or compressed)
- [ ] No unused CSS/JS in critical path

---

## Exit Gate

**Phase 3A is complete when ALL items above are checked.**

If any item is unchecked → Phase 3A is NOT done. Do not proceed to Phase 3B.

---

**Document Version:** 1.0  
**Effective Date:** January 9, 2026  
**Last Updated:** January 9, 2026  
**Approval Authority:** Engineering

---

STOP — awaiting next step.
