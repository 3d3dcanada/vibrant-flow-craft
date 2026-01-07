---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Agent A (UX/Frontend)
artifact: UX/Frontend Implementation Brief
---

# Agent A: UX/Frontend Implementation

## DO / DO NOT

### DO
- Use CSS animations only (NO framer-motion)
- Enforce design tokens (NO hardcoded colors/spacing)
- Test with keyboard navigation
- Test with screen reader (NVDA/VoiceOver)
- Optimize images (WebP, lazy loading)
- Code split routes (React.lazy)
- Measure performance on every PR (Lighthouse CI)
- Use existing components from shadcn/ui where applicable
- Follow mobile-first approach

### DO NOT
- Import framer-motion (it's being removed)
- Hardcode colors or spacing values
- Create inaccessible components
- Skip responsive testing
- Use placeholder images in production
- Create fake/dead UI elements
- Skip loading states
- Ignore performance budgets

## Information Architecture

### Site Map
```
/ (Landing Page)
├── /quote (Quote Configurator)
│   ├── Step 1: Upload
│   ├── Step 2: Material
│   ├── Step 3: Quantity
│   ├── Step 4: Breakdown
│   └── Step 5: Checkout
├── /dashboard (Customer Dashboard)
│   ├── /orders
│   ├── /quotes
│   ├── /rewards
│   └── /profile
├── /maker (Maker Studio)
│   ├── /jobs
│   ├── /printers
│   ├── /filament
│   ├── /earnings
│   └── /profile
└── /admin (Admin Panel)
    ├── /overview
    ├── /users
    ├── /requests
    ├── /payouts
    └── /settings
```

### User Journeys

**Journey 1: Guest Quote Request**
1. Land on homepage
2. See value prop + trust indicators
3. Click "Get Instant Quote"
4. Upload STL file (drag-drop or click)
5. Select material, color, quantity
6. See price breakdown
7. Enter email
8. Submit request
9. See confirmation

**Journey 2: Customer Order**
1. Login
2. Navigate to /quote
3. Upload file
4. Configure options
5. See member discount
6. Pay with credits
7. View order in dashboard

**Journey 3: Maker Job Claim**
1. Login as maker
2. Navigate to /maker/jobs
3. See available requests
4. Claim request
5. Update status
6. Upload completion photos
7. Receive payout

## Design System

### Tokens (CSS Variables)

**Colors (Dark Mode)**:
```css
--background: 233 75% 3%;
--background-card: 235 40% 6%;
--background-elevated: 235 35% 9%;
--foreground: 215 25% 90%;
--primary: 300 100% 50%;        /* Neon magenta */
--primary-glow: 300 100% 60%;
--secondary: 177 100% 50%;       /* Neon teal */
--secondary-glow: 177 100% 65%;
--accent: 217 91% 60%;           /* Electric blue */
--border: 220 20% 18%;
--radius: 0.75rem;
```

**Colors (Light Mode)**:
```css
--background: 0 0% 100%;
--background-card: 0 0% 98%;
--foreground: 233 75% 10%;
--primary: 300 100% 45%;
--secondary: 177 80% 40%;
--border: 220 20% 85%;
```

**Typography**:
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-tech: 'Rajdhani', sans-serif;
--font-display: 'Space Grotesk', sans-serif;
```

**Spacing** (use Tailwind defaults):
- 0.25rem (1), 0.5rem (2), 0.75rem (3), 1rem (4), 1.5rem (6), 2rem (8), 3rem (12), 4rem (16)

**Breakpoints**:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Component Library Specifications

#### GlassPanel
**File**: `src/components/ui/GlassPanel.tsx`

**Props**:
```typescript
interface GlassPanelProps {
  variant?: 'default' | 'elevated' | 'interactive';
  glowColor?: 'teal' | 'magenta' | 'none';
  className?: string;
  children: React.ReactNode;
}
```

**Styling**:
- Background: `bg-card/75 backdrop-blur-xl`
- Border: `border border-border/50`
- Shadow: `shadow-glass`
- Transition: `transition-all duration-400`
- Hover (interactive): `bg-card/90 border-secondary/40 shadow-glow-sm`

**Accessibility**:
- No specific ARIA needed (presentational)
- Ensure sufficient contrast for child content

---

#### NeonButton
**File**: `src/components/ui/NeonButton.tsx`

**Props**:
```typescript
interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
}
```

**Variants**:
- `primary`: Magenta background, white text, magenta glow
- `secondary`: Teal background, dark text, teal glow
- `ghost`: Transparent background, teal border, no fill

**States**:
- Default: Base styling
- Hover: Glow intensifies, scale 1.02
- Active: Scale 0.95
- Loading: Shimmer animation, disabled
- Disabled: Opacity 0.5, no pointer events

**Accessibility**:
- `aria-busy="true"` when loading
- `aria-disabled="true"` when disabled
- Focus: 2px teal outline

---

#### ProgressIndicator
**File**: `src/components/ui/ProgressIndicator.tsx`

**Props**:
```typescript
interface ProgressIndicatorProps {
  type: 'linear' | 'circular' | 'stepped';
  value?: number; // 0-100 for linear/circular
  steps?: Array<{ label: string; completed: boolean }>; // for stepped
  color?: 'primary' | 'secondary' | 'accent';
  showPercentage?: boolean;
}
```

**Linear**:
- Track: Gray background
- Fill: Gradient (primary/secondary), animated
- Text: Percentage (optional)

**Circular**:
- SVG circle with stroke animation
- Rotating arc with glow

**Stepped**:
- Horizontal dots connected by lines
- Completed: Checkmark, teal glow
- Current: Pulsing dot
- Incomplete: Gray dot

**Accessibility**:
- `role="progressbar"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-label` describing progress

---

#### FileUpload
**File**: `src/components/ui/FileUpload.tsx`

**Props**:
```typescript
interface FileUploadProps {
  accept: string; // '.stl,.3mf'
  maxSize: number; // bytes
  onUpload: (file: File) => Promise<void>;
  onAnalysis?: (analysis: FileAnalysis) => void;
}
```

**States**:
- `idle`: Dashed border, "Drop file here or click to browse"
- `dragover`: Solid teal border, scale 1.02
- `uploading`: Progress bar, file name, cancel button
- `success`: Green checkmark, file details
- `error`: Red border, shake animation, error message

**Validation**:
- Check file extension
- Check file size
- Parse STL client-side (if <50MB)

**Accessibility**:
- `<input type="file">` with `aria-label`
- Keyboard: Tab to focus, Enter/Space to open file picker
- Screen reader: Announce upload status

---

#### Toast
**File**: `src/components/ui/Toast.tsx` (customize sonner)

**Variants**:
- `success`: Green, checkmark icon
- `error`: Red, X icon
- `info`: Blue, info icon
- `points`: Magenta, star icon (for rewards)

**Styling**:
```css
.toast-success {
  background: hsl(var(--success) / 0.9);
  border-left: 4px solid hsl(var(--success));
  box-shadow: 0 0 20px hsl(var(--success) / 0.3);
}
```

**Accessibility**:
- `role="status"` for success/info
- `role="alert"` for errors
- Auto-dismiss after 5s (except errors)

## Page Implementations

### Landing Page (`src/pages/Index.tsx`)

#### Hero Section
**Layout**: Full viewport height, split 60/40 (content/visual)

**Content**:
- Headline: "Local Makers. Instant Quotes. Zero Hassle."
  - `font-display text-6xl gradient-text`
- Subheadline: "Canada's peer-to-peer 3D printing network..."
  - `font-sans text-lg text-muted-foreground`
- CTAs:
  - Primary: "Get Instant Quote" → `/quote`
  - Secondary: "Become a Maker" → `/maker/signup`

**Visual**:
- Animated 3D printer (CSS only, SVG shapes)
- Floating animation (6s ease-in-out)
- Ambient glow orbs (magenta + teal, blur 120px)

**Micro-interactions**:
- Scroll indicator: Animated chevron (bounce)
- CTA hover: Glow intensifies, scale 1.02
- Parallax: Background orbs move slower on scroll

**Performance**:
- Hero image: WebP, <100KB
- Above-the-fold content: No lazy loading
- LCP target: <1.5s

---

#### Trust Indicators
**Layout**: 3 columns (stack on mobile)

**Metrics**:
- "100+ Makers in Fredericton"
- "24-48hr Turnaround"
- "Transparent Pricing"

**Styling**:
- GlassPanel (interactive variant)
- Icon: Teal glow
- Number: `font-tech text-3xl`
- Hover: Lift 4px

---

#### How It Works
**Layout**: 3 steps, horizontal (vertical on mobile)

**Steps**:
1. Upload File → icon: upload-cloud
2. Get Quote → icon: calculator
3. Receive Print → icon: package

**Styling**:
- Connected by dashed teal line
- Step number: Circle with glow
- Hover: Card lifts, line pulses

---

#### Quote Preview Widget
**Layout**: Centered, max-width 800px

**Inputs**:
- Material dropdown (PLA, PETG, TPU)
- Weight slider (10g - 500g)
- Quantity buttons (1, 2, 5, 10)

**Output**:
- Live price display (gradient text, animated)
- "Get Full Quote" button → `/quote`

**Performance**:
- Price updates: <100ms (client-side calculation)
- Debounce slider: 300ms

---

#### Testimonials
**Layout**: 2-column grid (1 column mobile)

**Content**:
- 4 testimonials (maker name, quote, avatar, earnings badge)

**Styling**:
- GlassPanel with magenta accent border
- Avatar: Teal glow
- Hover: Lift 4px

---

### Quote Configurator (`src/pages/QuoteConfigurator.tsx`)

**Layout**: Stepped progress indicator at top, single-column form

#### Step 1: File Upload
**Components**:
- FileUpload component
- File type indicator (STL, 3MF)
- File size limit (50MB)

**Flow**:
1. User drops/selects file
2. Validate extension + size
3. Parse STL (client-side, Web Worker)
4. Extract weight, dimensions, estimated time
5. Show file details
6. Enable "Next" button

**Performance**:
- Parsing: <5s for <10MB files
- Web Worker: Prevent UI blocking
- Fallback: Server-side for >50MB

**Error Handling**:
- Invalid file type: Shake animation, error toast
- File too large: Error message, suggest compression
- Parse failure: Fallback to server-side

---

#### Step 2: Material & Options
**Layout**: 2-column (1 column mobile)

**Left Column**:
- Material selector (radio buttons with swatches)
- Color picker (predefined + custom)
- Post-processing toggle + tier selector

**Right Column**:
- File preview (2D silhouette or 3D if possible)
- File details (weight, time, dimensions)

**Micro-interactions**:
- Material change: Swatch highlights, price updates (200ms)
- Color change: Preview updates (fade transition)
- Post-processing toggle: Expand/collapse (300ms)

---

#### Step 3: Quantity & Delivery
**Components**:
- Quantity quick buttons (1, 2, 5, 10, 25, 50, 100)
- Custom input field
- Delivery speed radio buttons (Standard, Emergency)

**Micro-interactions**:
- Quantity ≥10: Discount badge animates in (scale-in)
- Delivery change: Timeline updates (slide)

---

#### Step 4: Price Breakdown
**Layout**: Line items table, max-width 700px

**Line Items**:
- Platform Fee: $5.00
- Bed Rental: $X.XX
- Filament Total: $X.XX (Xg × $X.XX/g)
- Post-Processing: $X.XX (if selected)
- Quantity Discount: -$X.XX (if applicable)
- Rush Surcharge: +$X.XX (if emergency)
- **Total**: $XX.XX

**Additional Info**:
- Credit conversion: "XXX credits"
- Member savings: "Save $X.XX" (if logged in)
- Maker payout: "Your maker earns $XX.XX"

**Micro-interactions**:
- Price updates: Animated number transitions (count-up)
- Discount applied: Green checkmark, subtle confetti

---

#### Step 5: Checkout or Save
**Options**:
- Guest: Email input + "Submit Request"
- Login: "Pay with Credits" or "Save Quote"

**Flow**:
- Guest: Submit → Create print_request → Confirmation page
- Login: Pay → Deduct credits → Create print_request → Confirmation
- Save: Store quote → Redirect to /dashboard/quotes

---

### Role-Aware Navigation (`src/components/layouts/DashboardLayout.tsx`)

#### Header
**Layout**: Sticky, full-width, glass panel

**Components**:
- Logo (left)
- Nav menu (center): Role-specific links
- User menu (right): Wallet, notifications, avatar

**Customer Nav**:
- Dashboard, Orders, Quotes, Rewards

**Maker Nav**:
- Studio, Jobs, Printers, Filament, Earnings

**Admin Nav**:
- Overview, Users, Requests, Payouts, Settings

**Styling**:
- Active link: Teal underline (animated)
- Hover: Glow effect

---

#### Mobile Navigation
**Layout**: Bottom tab bar (fixed)

**Tabs** (Customer):
- Home, Orders, Rewards, Profile

**Tabs** (Maker):
- Studio, Jobs, Printers, Profile

**Styling**:
- Glass panel with blur
- Active: Teal glow, icon scale 1.1
- Tap: Ripple effect (CSS)

---

#### Breadcrumbs
**Layout**: Below header, left-aligned

**Format**: Home > Dashboard > Orders > #12345

**Styling**:
- Muted text
- Separator: Chevron (teal)
- Hover: Underline animation

## Micro-Interaction Rules

### Hover States
**Buttons**: Glow intensifies (0.3s), scale 1.02 (0.2s)
**Cards**: Lift 4px (0.3s), border → teal, shadow increases
**Links**: Underline animation (scaleX 0→1, 0.3s)

### Loading States
**Buttons**: Shimmer effect, text → "Loading...", disabled
**Data**: Skeleton loaders (pulsing gray boxes)
**File Upload**: Progress bar, percentage text

### Success Confirmations
**Forms**: Green checkmark (scale-in), success toast
**Points**: "+X points" pop-up (scale + fade), toast

### Error Handling
**Forms**: Red border, shake (0.3s), error message (fade-in)
**API**: Error toast, retry button

### Progress Feedback
**File Upload**: Progress bar (0-100%), percentage
**Quote Calc**: Stepped indicator, current step highlighted

## Performance Budgets

### Page Load Time
- **Target**: <2s on mobile (4G)
- **Maximum**: <3s

**Optimization**:
- Code splitting: `React.lazy()` for routes
- Image optimization: WebP, `loading="lazy"`
- Font preload: Inter, Rajdhani, Space Grotesk
- Minimize JS: Tree shaking, no unused deps

### Lighthouse Scores
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥90

### Core Web Vitals
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1

### Bundle Size
- Initial JS: <200KB (gzipped)
- Initial CSS: <50KB (gzipped)
- Route chunks: <100KB each

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Color Contrast**:
- Text: ≥4.5:1
- Large text (18pt+): ≥3:1
- Interactive elements: ≥3:1

**Keyboard Navigation**:
- All interactive elements: Tab accessible
- Focus indicators: 2px teal outline
- Skip to main content link
- Escape closes modals/dropdowns

**Screen Reader Support**:
- ARIA labels on all icons
- Form inputs: Associated `<label>`
- Buttons: Descriptive text (not just icons)
- Loading states: `aria-busy="true"`
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`

**Motion Preferences**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Build Order (Ticket Sequence)

### Week 1
- A1: Design system audit
- A2: Component library setup (Storybook)

### Week 2
- A3: GlassPanel component
- A4: NeonButton component
- A5: ProgressIndicator component
- A6: FileUpload component
- A7: Toast system

### Week 3
- A8: Landing - Hero
- A9: Landing - Trust indicators
- A10: Landing - How it works
- A11: Landing - Quote preview
- A12: Landing - Testimonials

### Week 4
- A13: Quote - Step 1 (upload)
- A14: Quote - Step 2 (material)
- A15: Quote - Step 3 (quantity)
- A16: Quote - Step 4 (breakdown)
- A17: Quote - Step 5 (checkout)

### Week 5
- A18: Navigation (header, mobile, breadcrumbs)

## Definition of Done

A ticket is complete when:
- [ ] Component/page implemented
- [ ] Storybook documentation (for components)
- [ ] Dark/light mode tested
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Responsive tested (320px, 768px, 1024px, 1920px)
- [ ] Lighthouse score ≥90
- [ ] No accessibility violations (axe-core)
- [ ] PR approved and merged

## Verification

**How this is verified**:
- Storybook: Visual regression testing
- Lighthouse CI: Automated on every PR
- axe-core: Automated accessibility tests
- Manual testing: Keyboard navigation, screen reader
- Cross-browser: Chrome, Firefox, Safari, Edge
- Responsive: DevTools device emulation

**What would block production**:
- Lighthouse Performance <85
- Any WCAG AA violations
- Broken keyboard navigation
- CLS >0.1
- LCP >3s on mobile
- Any framer-motion imports found
