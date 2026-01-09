# Product Convergence Specification

**Project:** 3D3D.ca  
**Phase:** 3 (Product & UX Convergence)  
**Date:** January 9, 2026  
**Status:** Specification Complete  
**Classification:** Internal — Implementation Reference

---

# Section 1: Core User Flows (End-to-End)

## Flow 1: Visitor → First Quote → Checkout

```
ENTRY: Homepage or direct link to /quote

STEP 1: Land on homepage
├── See hero with "Get Your Free Quote" CTA
├── Optional: Scroll to see "How It Works" section
└── Click primary CTA → Navigate to /quote

STEP 2: Quote configurator
├── Upload STL/3MF file (drag-drop or browse)
├── File validation occurs (size, format, printability)
│   └── If invalid → Show inline error with remediation
├── Select material from available options
├── Select quantity
├── Select finish (if applicable)
└── View real-time quote calculation

STEP 3: Quote display
├── See itemized breakdown:
│   ├── Material cost
│   ├── Print time estimate
│   ├── Labor & QC
│   └── Shipping estimate
├── TRUST MOMENT: "No hidden fees. This is your final price."
└── DECISION: Proceed to checkout OR save quote

STEP 4: Authentication gate
├── If not logged in → Prompt sign-up/sign-in
│   └── Minimal fields: email, password
│   └── CASL consent checkbox (signup only)
└── If logged in → Continue to checkout

STEP 5: Checkout
├── Confirm shipping address
├── Select payment method
│   └── Stripe (cards) or e-Transfer instructions
├── Review order summary
├── Accept Terms of Service checkbox
└── Submit order

EXIT: Order confirmation page
├── Order number displayed
├── Email confirmation sent
├── Link to order tracking in dashboard
└── Clear next-step messaging
```

**Key Decisions:**
- Material selection directly affects price and timeline
- Guest checkout NOT supported (account required for file handling, order history)
- e-Transfer available for users uncomfortable with cards

**Trust Moments:**
- "No hidden fees" messaging on quote display
- Full price breakdown before checkout
- Terms acceptance is explicit, not hidden

---

## Flow 2: Visitor → Learn → Trust → Quote

```
ENTRY: Organic search, blog link, or Learn nav

STEP 1: Discover content
├── Land on /learn or /blog or specific article
├── Read educational content
└── Encounter contextual CTAs (non-intrusive)

STEP 2: Build trust
├── Content demonstrates expertise without selling
├── Honest admissions: "When you shouldn't use 3D printing"
├── TRUST MOMENT: Recommends alternatives when appropriate
└── Footer links to governance docs, policies

STEP 3: Explore platform
├── Navigate via header to Quote, Store, or About
├── Review About/Mission pages
│   └── See governance transparency claims
└── DECISION: Trust established OR needs more info

STEP 4: Engage
├── If ready → Enter quote flow (Flow 1)
└── If not ready → Subscribe to newsletter (CASL-compliant)
    └── Explicit opt-in, clear disclosure

EXIT: Quote flow initiated OR newsletter subscription
```

**Key Decisions:**
- Content consumption without account creation
- CTA placement after value delivered, not before
- Newsletter requires explicit consent with CASL disclosure

**Trust Moments:**
- Content admits platform limitations honestly
- No paywalls or gated content
- Governance documents publicly linked

---

## Flow 3: Buyer → Store → STL vs Printed Decision

```
ENTRY: /store or direct product link

STEP 1: Browse store
├── View product grid (filterable by category)
├── Each product shows:
│   ├── Image (real print, not just render)
│   ├── Price
│   ├── License type badge
│   └── "STL" or "Printed" indicator
└── DECISION: Click into product detail

STEP 2: Product detail page
├── High-quality images (multiple angles)
├── Full description with specifications
├── Print settings (if STL)
├── Material used (if printed product)
├── License terms clearly displayed
└── TRUST MOMENT: "What you're actually buying" explanation

STEP 3: Purchase decision
├── SEE CLEAR COMPARISON:
│   ├── "Buy STL" → Digital file, you print
│   │   └── Requirements: Printer, materials, skills
│   └── "Buy Printed" → Physical item shipped to you
│       └── Requirements: Shipping address, patience
├── Price shown for each option
└── DECISION: Select purchase type

STEP 4: Add to cart / Checkout
├── If STL → Add to cart, checkout, instant download
├── If Printed → Add to cart, checkout, order fulfillment
└── License terms confirmed before purchase

EXIT: 
├── STL: Download available immediately in account
└── Printed: Order confirmation, fulfillment begins
```

**Key Decisions:**
- STL vs Printed clearly distinguished visually and textually
- No confusion about what customer receives
- License implications stated before purchase

**Trust Moments:**
- "What you're actually buying" section on every product
- Real print photos, not just CAD renders
- License terms human-readable, not just legal text

---

## Flow 4: Designer → Evaluate Platform → Join / Decline

```
ENTRY: /about, /mission, or designer-focused content

STEP 1: Discovery
├── Find 3D3D through search, referral, or maker community
├── Navigate to platform information
└── Look for designer/creator section

STEP 2: Evaluate value proposition
├── Read Designer Bill of Rights (linked in footer)
├── Review:
│   ├── Revenue split: 70% designer / 30% platform
│   ├── Non-exclusive listing (sell anywhere)
│   ├── Ownership retained by designer
│   ├── Exit protections
│   └── Payment schedule and methods
├── TRUST MOMENT: Published governance constraints
└── DECISION: Interested OR not right fit

STEP 3: Reality check
├── Read "Designer Onboarding Reality Check" content
├── Understand:
│   ├── Platform is early-stage, small audience
│   ├── Sales may be slow initially
│   ├── No guaranteed income
│   └── Quality standards required
└── DECISION: Accept reality OR decline

STEP 4: Apply
├── Navigate to designer application (via About or dedicated link)
├── Submit:
│   ├── Portfolio/work samples
│   ├── Contact information
│   └── Brief statement of interest
└── Await review (SLA: 5 business days response)

EXIT:
├── Approved → Onboarding flow initiated
├── Declined → Respectful rejection with feedback
└── Self-decline → No action required
```

**Key Decisions:**
- Application required (not open marketplace)
- Quality standards enforced before listing
- Honest expectations prevent disappointment

**Trust Moments:**
- Published Designer Bill of Rights
- Explicit mention of platform limitations
- No overselling of income potential

---

## Flow 5: Repeat User → Faster Quote → History Awareness

```
ENTRY: Homepage or direct /quote (logged in)

STEP 1: Recognition
├── User recognized from session
├── Dashboard shows recent orders/quotes
└── "Start New Quote" and "Reorder" options visible

STEP 2: Streamlined quote
├── Option A: Upload new file (standard flow)
├── Option B: Reorder from history
│   ├── Select previous order
│   ├── Confirm specifications
│   └── Skip file upload (file retained per policy)
└── Option C: Modify previous order
    ├── Load previous file
    ├── Change material/quantity
    └── Generate new quote

STEP 3: Checkout (expedited)
├── Shipping address pre-filled from profile
├── Payment method saved (optional)
├── One-click confirmation available
└── TRUST MOMENT: "Same transparency, less friction"

EXIT: Order confirmed with minimal steps
```

**Key Decisions:**
- File retention policy enables reordering (14 days post-completion)
- Saved preferences reduce friction for repeat customers
- No auto-ordering; explicit confirmation always required

**Trust Moments:**
- Clear indication when previous files are available vs. deleted
- Transparency about file retention timeline
- No dark patterns on "quick reorder"

---

# Section 2: Site Map & Navigation (Final)

## Top-Level Navigation

| Route | Label | Purpose |
|-------|-------|---------|
| `/` | Home | Primary landing, hero, how-it-works, quote CTA |
| `/quote` | Get a Quote | File upload and quote generation |
| `/store` | Store | Product browsing and purchasing |
| `/learn` | Learn | Educational content hub |
| `/blog` | Blog | Articles, thought leadership |
| `/about` | About | Company info, team, mission |

**Rationale:**
- **Home**: Conversion-focused entry point
- **Quote**: Primary service action
- **Store**: Secondary revenue stream (STL/printed products)
- **Learn**: Authority building, SEO, trust
- **Blog**: Content marketing, organic traffic
- **About**: Trust building, company credibility

---

## Footer Navigation

### Platform
| Route | Label | Purpose |
|-------|-------|---------|
| `/#how-it-works` | How It Works | Scroll anchor to process explanation |
| `/#quote` | Get a Quote | Scroll anchor to quote section |
| `/learn` | Learning Guides | Educational resource index |
| `/promo-products` | Promo Products | Branded merchandise/promotional items |
| `/business-subscription` | Business Subscription | B2B subscription offering |

### Company
| Route | Label | Purpose |
|-------|-------|---------|
| `/` | Home | Homepage link |
| `/mission` | Mission | Purpose and values statement |
| `/about` | About Us | Company background and team |
| `/blog` | Blog | Content hub |
| `/brand-games` | Brand-Games | Gamified creative tools |
| `/careers` | Careers | Job opportunities |
| `/schedule` | Schedule a Call | Consultation booking |

### Legal
| Route | Label | Purpose |
|-------|-------|---------|
| `/terms` | Terms of Service | Legal agreement |
| `/privacy` | Privacy Policy | Data handling disclosure |
| `/refunds` | Refunds & Cancellations | Return/refund policy |
| `/print-responsibility` | Print Responsibility | User obligations and safety |

**Rationale:**
- Three-column footer organization allows discovery without overwhelming
- Legal section separate for compliance visibility
- Role-aware links (Maker Dashboard, Admin Panel) appear conditionally for authenticated users

---

## Hidden/Legal Routes (Not in Navigation)

| Route | Purpose | Access |
|-------|---------|--------|
| `/auth` | Authentication (sign-in, sign-up) | Linked from account CTAs |
| `/customer-dashboard` | User order history and account | Post-login redirect |
| `/profile-settings` | User profile management | Account dropdown |
| `/community-policy` | Community guidelines | Legal reference |
| `/recycling` | Recycling program info | Footer or sustainability section |
| `/recycle-buyback` | Material buyback program | Linked from recycling |
| `/gift-cards` | Gift card sales | Store or promotional links |
| `/achievements` | User achievement/gamification | Dashboard feature |
| `/rewards-center` | Rewards/loyalty program | Dashboard feature |
| `/credits-store` | Credit purchase system | Dashboard feature |

**Rationale:**
- These routes serve authenticated users or specific contexts
- Not cluttering main navigation keeps focus on primary actions
- Available through contextual links where relevant

---

## Admin Routes (Non-Public)

| Route | Label | Access Level | Purpose |
|-------|-------|--------------|---------|
| `/dashboard/admin` | Admin Overview | Admin only | High-level metrics, quick actions |
| `/dashboard/admin/overview` | Overview | Admin only | Dashboard summary |
| `/dashboard/admin/operations` | Operations | Admin only | Order management, queue oversight |
| `/dashboard/admin/store` | Store Manager | Admin only | Product catalog management |
| `/dashboard/admin/content-promos` | Content & Promos | Admin only | Blog, promotional content |
| `/dashboard/admin/makers` | Maker Manager | Admin only | Printer network management |
| `/dashboard/admin/credit-packages` | Credit Packages | Admin only | Credit system configuration |
| `/dashboard/admin/buyback-requests` | Buyback Requests | Admin only | Material buyback queue |

**Rationale:**
- Admin panel is a separate concern from public site
- Single overview entry point with specialized sub-sections
- Role-based access control prevents unauthorized access

---

## Maker Routes (Authenticated Makers Only)

| Route | Label | Access Level | Purpose |
|-------|-------|--------------|---------|
| `/dashboard/maker` | Maker Overview | Maker role | Job summary, earnings, quick stats |
| `/dashboard/maker/overview` | Overview | Maker role | Dashboard home |
| `/dashboard/maker/jobs` | Current Jobs | Maker role | Active print assignments |
| `/dashboard/maker/requests` | Job Requests | Maker role | Incoming job opportunities |
| `/dashboard/maker/printers` | Printers | Maker role | Equipment registry |
| `/dashboard/maker/filament` | Filament Inventory | Maker role | Material tracking |
| `/dashboard/maker/profile` | Profile | Maker role | Maker business profile |
| `/dashboard/maker/earnings` | Earnings | Maker role | Payment history, reports |

**Rationale:**
- Makers are contractors, not employees—their dashboard reflects operational needs
- Clear separation from customer dashboard
- Earnings transparency builds trust with maker network

---

# Section 3: Store Readiness Definition

## Minimum Viable Product Categories

### Required at Launch

| Category | Description | Why Required |
|----------|-------------|--------------|
| **Practical Prints** | Hooks, organizers, brackets, clips | Highest demand, low IP risk |
| **Home & Office** | Desk accessories, cable management, holders | Universal appeal |
| **Replacement Parts** | Generic brackets, knobs, handles | Solves real problems |
| **Maker Tools** | Print bed tools, filament guides, spool holders | Meta-category for makers |

### Optional at Launch (Can Wait)

| Category | Description | Why Optional |
|----------|-------------|--------------|
| Art & Decor | Sculptures, vases, decorative items | Lower urgency |
| Toys & Games | Puzzles, figurines, game accessories | IP complexity |
| Custom/Personalized | Name plates, custom gifts | Requires personalization system |

---

## STL Product Metadata Required

Every STL listing must include:

| Field | Description | Validation |
|-------|-------------|------------|
| `title` | Product name | 5-100 characters, no special characters |
| `description` | Full product description | 50-2000 characters |
| `category` | Primary category | From approved list |
| `license_type` | License classification | `personal`, `commercial`, `full_commercial` |
| `license_text` | Human-readable license summary | Required |
| `print_settings` | Recommended settings | Structured data |
| `materials_tested` | Materials confirmed to work | Array of material codes |
| `dimensions_mm` | Bounding box dimensions | { x, y, z } in millimeters |
| `print_time_estimate` | Estimated print time | Minutes (integer) |
| `difficulty` | Print difficulty rating | `beginner`, `intermediate`, `advanced` |
| `images` | Product images | Minimum 1, maximum 10, real prints required |
| `files` | STL/3MF files | At least one file, validated for printability |
| `designer_id` | Creator reference | Valid designer account |
| `price_cad` | Price in CAD | > 0, max 500.00 |
| `created_at` | Listing date | Auto-generated |
| `updated_at` | Last modification | Auto-updated |
| `status` | Listing status | `draft`, `pending_review`, `active`, `archived` |

### Print Settings Structure

```json
{
  "layer_height_mm": 0.2,
  "infill_percent": 20,
  "supports_required": false,
  "support_type": null,
  "bed_adhesion": "brim",
  "notes": "Print with cooling enabled for overhangs"
}
```

---

## Printed Product Metadata Required

Every printed product listing must include:

| Field | Description | Validation |
|-------|-------------|------------|
| `title` | Product name | 5-100 characters |
| `description` | Full product description | 50-2000 characters |
| `category` | Primary category | From approved list |
| `material` | Material used | From material catalog |
| `color` | Color option | From available colors |
| `dimensions_mm` | Finished dimensions | { x, y, z } |
| `weight_g` | Finished weight | Grams (integer) |
| `finish` | Surface finish | `standard`, `sanded`, `coated` |
| `images` | Product images | Real prints, minimum 2 |
| `price_cad` | Price in CAD | > 0 |
| `shipping_class` | Shipping category | `small`, `medium`, `large`, `oversized` |
| `lead_time_days` | Production + shipping estimate | Integer days |
| `stock_status` | Availability | `in_stock`, `made_to_order`, `limited` |
| `quantity_available` | If limited, how many | Integer or null |
| `created_at` | Listing date | Auto-generated |
| `status` | Listing status | `active`, `out_of_stock`, `discontinued` |

---

## What Is Intentionally Excluded

### Not Sold at Launch

| Category | Reason for Exclusion |
|----------|---------------------|
| Fan art / Licensed IP | Legal risk, infringement potential |
| Weapons / Weapon accessories | Policy prohibition |
| Medical devices | Certification requirements |
| Food-contact items | Safety testing requirements |
| Electrical enclosures | Rating requirements |
| Child safety items | Testing requirements |
| Adult content | Brand alignment |
| Political/controversial items | Brand alignment |

### Features Deferred

| Feature | Reason for Deferral |
|---------|-------------------|
| User-generated reviews | Moderation complexity |
| Wishlists | Low priority vs. core flow |
| Product recommendations | Algorithm complexity |
| Bundle pricing | Pricing system complexity |
| Pre-orders | Fulfillment complexity |

---

## Scarcity & Availability Communication

### Honest Signals Only

| State | Display | Communication |
|-------|---------|---------------|
| In Stock | Green indicator | "Ready to ship" |
| Made to Order | Yellow indicator | "Made when you order • Ships in X days" |
| Limited Quantity | Orange indicator | "X remaining" (only if < 10) |
| Out of Stock | Greyed | "Currently unavailable" |
| Discontinued | Removed | Product delisted, not shown |

### Prohibited Practices

- No fake scarcity ("Only 3 left!" when untrue)
- No countdown timers on non-time-limited offers
- No "X people viewing this" notifications
- No "Selling fast!" unless demonstrably true
- No waitlist unless product genuinely backordered

---

# Section 4: Admin Panel Capabilities (Real, Not Fantasy)

## Launch-Essential Admin Functions

### Content Management

| Function | Description | Priority |
|----------|-------------|----------|
| **Blog Post CRUD** | Create, edit, publish, unpublish posts | Required |
| **Learning Guide CRUD** | Manage educational content | Required |
| **Banner/Announcement Management** | Site-wide notices | Required |
| **Static Page Editing** | Update About, Mission, etc. | Required |

### Store Management

| Function | Description | Priority |
|----------|-------------|----------|
| **Product CRUD** | Create, edit, archive products | Required |
| **Category Management** | Add/edit/reorder categories | Required |
| **Price Adjustment** | Modify pricing with audit trail | Required |
| **Inventory Status** | Mark items in/out of stock | Required |
| **Image Upload** | Manage product imagery | Required |
| **Designer Royalty View** | See pending/paid royalties | Required |

### Quote Oversight

| Function | Description | Priority |
|----------|-------------|----------|
| **Quote Queue View** | See pending quotes awaiting response | Required |
| **Manual Quote Override** | Adjust auto-calculated quotes | Required |
| **Quote Expiration Management** | Extend or expire quotes | Required |
| **Quote-to-Order Conversion** | Mark quotes as ordered | Required |

### Order Operations

| Function | Description | Priority |
|----------|-------------|----------|
| **Order Queue View** | All orders by status | Required |
| **Order Status Update** | Progress orders through stages | Required |
| **Order Assignment** | Assign orders to makers | Required |
| **Issue Flagging** | Mark orders with problems | Required |
| **Refund Processing** | Initiate refunds with reason | Required |
| **Order Notes** | Internal notes on orders | Required |

### Legal Escalation Handling

| Function | Description | Priority |
|----------|-------------|----------|
| **IP Complaint Inbox** | View incoming takedown requests | Required |
| **Escalation Tier Assignment** | Route to appropriate review level | Required |
| **Designer Opt-Out Management** | Add/remove from blocklist | Required |
| **Complaint Resolution Logging** | Document outcomes | Required |
| **User Warning System** | Issue warnings for policy violations | Required |
| **Account Suspension** | Suspend/ban users with audit trail | Required |

### File Retention Enforcement

| Function | Description | Priority |
|----------|-------------|----------|
| **Retention Dashboard** | Files approaching deletion | Required |
| **Manual Deletion Trigger** | Force immediate file deletion | Required |
| **Retention Policy Override** | Extend retention for specific files | Required |
| **Deletion Audit Log** | Record of all deletions | Required |

### Designer Relations

| Function | Description | Priority |
|----------|-------------|----------|
| **Designer Application Queue** | Review pending applications | Required |
| **Designer Approval/Rejection** | Process applications with feedback | Required |
| **Designer Performance View** | Sales, ratings, issues per designer | Required |
| **Royalty Payment Initiation** | Trigger designer payments | Required |
| **Designer Communication Log** | Track all designer interactions | Required |

---

## What Is NOT Included at Launch

| Function | Reason | When |
|----------|--------|------|
| Advanced Analytics Dashboard | Complexity | Phase 4+ |
| A/B Testing Tools | Complexity | Phase 4+ |
| Automated Marketing Campaigns | Complexity | Phase 4+ |
| Multi-Admin Role Management | Single admin initially | Phase 4+ |
| API Key Management | No public API yet | Phase 4+ |
| Custom Report Builder | Use direct DB queries | Phase 4+ |

---

# Section 5: Maker / Operator Workshop

## Job Intake Flow

```
STEP 1: Job appears in requests queue
├── Admin assigns order to maker based on:
│   ├── Printer capability
│   ├── Material availability
│   ├── Geographic proximity
│   └── Current workload
└── Maker receives notification (email + dashboard)

STEP 2: Maker reviews job
├── View order details:
│   ├── File preview/thumbnail
│   ├── Material specified
│   ├── Quantity
│   ├── Special instructions
│   └── Deadline
├── DECISION: Accept or Decline
│   └── If decline: Provide reason, job returns to queue
└── If accept: Job moves to "In Progress"

STEP 3: Job acceptance confirmation
├── Customer notified: "Your order is being printed"
├── Maker sees job in active queue
└── Estimated completion deadline set
```

---

## File Access Rules

| Stage | Maker Access | Retention |
|-------|--------------|-----------|
| Job Pending | No access | N/A |
| Job Accepted | Download available | Until job complete + 14 days |
| Job Complete | View-only metadata | File deleted after retention window |
| Job Cancelled | Access revoked immediately | File may remain per customer request |

### Security Requirements

- Files served via signed URLs (time-limited)
- No bulk download capability
- Watermarking on file previews (not actual files)
- Download logged with timestamp and maker ID
- Makers cannot share file URLs (invalidated on access)

---

## Print Notes System

| Note Type | Who Can Add | Visibility |
|-----------|-------------|------------|
| Customer Notes | Customer | Maker + Admin |
| Admin Instructions | Admin | Maker only |
| Maker Production Notes | Maker | Admin only |
| Quality Issue Notes | Maker | Admin only |

### Required Print Documentation

For each completed job, maker must record:

- Actual print time (hours:minutes)
- Material used (grams)
- Print success (first attempt / reprint required)
- Any deviations from specified settings
- Quality grade (self-assessed: A/B/C)

---

## Quality Checks

### Pre-Ship Checklist (Maker Responsibility)

| Check | Required | Notes |
|-------|----------|-------|
| Visual inspection | Yes | No obvious defects, layer issues |
| Dimensional check | For critical parts | Calipers for tolerance-sensitive items |
| Support removal | Yes | No support residue |
| Stringing cleanup | Yes | No visible stringing |
| Surface finish | Yes | Matches order specification |
| Color match | Yes | Correct material/color used |
| Quantity verification | Yes | Correct count |
| Photo documentation | Recommended | Before packaging |

### Failed Print Protocol

1. Document failure (photo + description)
2. Note cause if known
3. Initiate reprint
4. Log additional material/time used
5. If repeated failure: Escalate to Admin

---

## Completion + Archival

```
STEP 1: Mark print complete
├── Upload completion photo (optional but encouraged)
├── Enter actual print time and material used
├── Mark quality grade
└── Confirm ready for shipping

STEP 2: Shipping
├── Package according to standards
├── Generate shipping label (via platform or carrier)
├── Enter tracking number
└── Mark as shipped

STEP 3: Post-ship
├── Customer notified with tracking
├── Job status: "Shipped"
└── Await delivery confirmation

STEP 4: Completion
├── Delivery confirmed (carrier data or customer)
├── Job status: "Completed"
├── Maker earnings credited
└── File retention countdown begins (14 days)

STEP 5: Archival
├── After retention window: File deleted
├── Order metadata retained (7 years for tax)
├── Maker performance metrics updated
└── Job fully archived
```

---

# Section 6: UX Honesty Checklist

## Pre-Ship Review Checklist

Before any page ships to production, verify compliance with the following:

### What Must Be Explicit

| Requirement | Check |
|-------------|-------|
| **All costs shown before checkout** | ☐ No fees appear at payment that weren't shown earlier |
| **Delivery timeline is realistic** | ☐ Estimate based on actual capability, not optimistic marketing |
| **What customer receives is clear** | ☐ STL vs printed, license terms, specifications stated |
| **Account requirements stated upfront** | ☐ If action requires login, say so before user starts |
| **Data handling disclosed** | ☐ File retention, deletion timelines, storage location |
| **Consent is informed** | ☐ CASL checkbox text explains what user is agreeing to |
| **Error states are helpful** | ☐ Errors explain what happened and how to fix |

### What Must Never Be Implied

| Prohibition | Check |
|-------------|-------|
| **False urgency** | ☐ No countdown timers on non-time-limited offers |
| **Fake scarcity** | ☐ No "Only X left!" unless verifiably true |
| **Social proof manipulation** | ☐ No "X people viewing this" notifications |
| **Guaranteed outcomes** | ☐ No promises platform cannot keep |
| **Immediate availability** | ☐ If made-to-order, clearly stated |
| **Endorsements not authorized** | ☐ No fake testimonials or unverified claims |

### What Must Be Disclosed

| Disclosure | Check |
|------------|-------|
| **File retention policy** | ☐ How long files kept, when deleted |
| **Price components** | ☐ Material, labor, shipping, margin (if asked) |
| **Platform limitations** | ☐ What we can't do, when alternatives are better |
| **Designer compensation** | ☐ Revenue split documented publicly |
| **Data usage** | ☐ Privacy policy link accessible, summary available |
| **Change policies** | ☐ Notice periods for material changes |

### What Must Not Be Gamified

| Prohibition | Check |
|-------------|-------|
| **Core functionality** | ☐ Basic features don't require "unlocking" |
| **Pricing** | ☐ No "spin the wheel" for discounts |
| **Account creation** | ☐ No progress bars for signup completion |
| **Order completion** | ☐ No badges for placing orders |
| **Reviews** | ☐ No incentives for positive reviews specifically |
| **Engagement metrics** | ☐ No streaks, no punitive mechanics for inactivity |

---

# Section 7: "Done Enough" Definition

## What "Phase 3 Complete" Means

Phase 3 is complete when:

### Core Flows Operational
- [ ] Visitor → Quote → Checkout flow works end-to-end
- [ ] Store browsing and purchase works
- [ ] User authentication and account management works
- [ ] Order tracking and history visible to users
- [ ] Maker job intake and completion flow works

### Content Sufficient
- [ ] Homepage complete with accurate content
- [ ] About and Mission pages complete
- [ ] Terms of Service legally reviewed
- [ ] Privacy Policy legally reviewed
- [ ] At least 5 learning guides published
- [ ] At least 10 blog posts published

### Store Minimum Viable
- [ ] At least 10 products listed (mix of STL and printed)
- [ ] All products have required metadata
- [ ] Category structure implemented
- [ ] Checkout and payment functional

### Admin Functional
- [ ] Order management works
- [ ] Product management works
- [ ] Basic content management works
- [ ] User/maker management works

### Legal/Compliance
- [ ] CASL consent capture implemented
- [ ] File retention enforcement operational
- [ ] IP escalation process documented and accessible

---

## What Can Safely Wait

### Deferrable Without Risk

| Item | Why It Can Wait |
|------|-----------------|
| User reviews | Moderation complexity, low initial order volume |
| Advanced search | Basic filtering sufficient for launch |
| Personalized recommendations | Insufficient data initially |
| Multi-language (French) | Can add post-launch, notify when available |
| Mobile app | Responsive web sufficient |
| Social sharing features | Not core to service delivery |
| Affiliate/referral system | Growth can wait for product validation |
| Advanced analytics | Basic metrics sufficient initially |
| A/B testing infrastructure | Optimize after baseline established |
| Newsletter automation | Manual sends acceptable initially |

---

## What Should Never Block Launch

| Item | Reason |
|------|--------|
| Perfect SEO | Iterate post-launch with real data |
| 100% test coverage | Core paths tested is sufficient |
| All blog posts written | 10 is enough to launch |
| Designer onboarding complete | Can launch with house designs |
| Every edge case handled | Handle as encountered |
| Performance optimization | Acceptable performance first, optimize second |
| Perfect mobile experience | Functional mobile first, polish later |

---

## What Future Content Can Layer On Later

### Content Additions (No Code Changes)
- Additional blog posts
- Additional learning guides
- Product additions to store
- Designer-created products
- Case studies
- Video content

### Feature Additions (Planned for Phase 4+)
- User reviews and ratings
- Wishlist functionality
- Order notifications (push/SMS)
- Designer portfolio pages
- Community showcase
- Advanced filtering/search
- French language support
- Provincial tax handling beyond NB

### Integration Additions (Phase 4+)
- Shipping carrier API integration
- Inventory management integration
- Accounting software integration
- Analytics platform integration

---

**Document Version:** 1.0  
**Effective Date:** January 9, 2026  
**Last Updated:** January 9, 2026  
**Approval Authority:** Product / Engineering

---

STOP — awaiting next step.
