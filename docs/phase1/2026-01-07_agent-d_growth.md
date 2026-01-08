---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Agent D (Growth/SEO/Content)
artifact: Growth, SEO & Local Store Strategy
---

# Agent D: Growth, SEO & Local Store

## DO / DO NOT

### DO
- Write clear, honest copy (no hype, no lies)
- Use local keywords (Fredericton, New Brunswick, Canada)
- Optimize meta tags for all pages
- Create helpful content (not just SEO bait)
- Track privacy-first analytics (Plausible/Fathom)
- Build trust through transparency
- Focus on local-first growth
- Document all messaging decisions

### DO NOT
- Make false claims (e.g., "fastest in Canada" without proof)
- Use clickbait headlines
- Stuff keywords unnaturally
- Copy competitor messaging
- Track users without consent
- Use dark patterns
- Overpromise delivery times
- Hide pricing or fees

## Messaging System

### Core Value Proposition
**Primary**: "Local Makers. Instant Quotes. Zero Hassle."

**Supporting Points**:
1. **Local**: "100+ makers in Fredericton, supporting your community"
2. **Fast**: "24-48 hour turnaround, emergency rush available"
3. **Transparent**: "See exactly what you pay and what your maker earns"
4. **Easy**: "Upload, configure, order. Done in 60 seconds."

### Tone & Voice
- **Friendly**: Like talking to a helpful neighbor
- **Clear**: No jargon unless explained
- **Honest**: Admit limitations, don't overpromise
- **Local**: Emphasize community, not corporate

**Examples**:
- ✅ "Most prints ready in 24-48 hours"
- ❌ "Fastest 3D printing in Canada" (unverified claim)
- ✅ "Your maker earns $12 from this order"
- ❌ "Support local businesses" (vague)

### Messaging by Audience

**Customer (First-Time)**:
- Headline: "Need a 3D print? Get a quote in 60 seconds."
- Pain point: "No printer? No problem."
- Benefit: "Local makers deliver in 24-48 hours"

**Customer (Returning)**:
- Headline: "Welcome back! Re-order in one click."
- Pain point: "Tired of slow turnarounds?"
- Benefit: "Your trusted makers, ready to print"

**Maker (Prospective)**:
- Headline: "Turn your idle printer into income"
- Pain point: "Printer sitting unused?"
- Benefit: "Earn $10-50 per print, set your own hours"

**Maker (Active)**:
- Headline: "5 new print requests in your area"
- Pain point: "Need more jobs?"
- Benefit: "Claim jobs, earn payouts weekly"

## SEO Page Map

### Core Pages

**1. Homepage** (`/`)
- Title: "3D3D Canada | Local 3D Printing in Fredericton, NB"
- Meta Description: "Get instant quotes from 100+ local 3D printing makers in Fredericton. Upload your file, choose options, receive your print in 24-48 hours. Transparent pricing, community-driven."
- Keywords: 3D printing Fredericton, local 3D printing, peer-to-peer 3D printing, New Brunswick 3D printing
- H1: "Local Makers. Instant Quotes. Zero Hassle."
- Schema: LocalBusiness, Service

**2. Quote Configurator** (`/quote`)
- Title: "Get Instant 3D Printing Quote | 3D3D Canada"
- Meta Description: "Upload your STL file and get an instant quote in 60 seconds. Choose material, quantity, delivery speed. Transparent pricing breakdown. No account required."
- Keywords: 3D printing quote, instant quote, STL upload, 3D printing cost
- H1: "Get Your Instant Quote"
- Schema: Product, Offer

**3. How It Works** (`/how-it-works`)
- Title: "How 3D3D Works | Peer-to-Peer 3D Printing"
- Meta Description: "Learn how 3D3D connects you with local makers. Upload file → Get quote → Receive print. Simple, transparent, community-driven."
- Keywords: how 3D printing works, peer-to-peer printing, local makers
- H1: "How 3D3D Works"
- Schema: HowTo

**4. Become a Maker** (`/maker/signup`)
- Title: "Become a Maker | Earn Money with Your 3D Printer"
- Meta Description: "Turn your 3D printer into income. Join 100+ makers in Fredericton. Set your hours, claim jobs, earn $10-50 per print. No fees, transparent payouts."
- Keywords: 3D printing side hustle, earn with 3D printer, maker network
- H1: "Turn Your Printer Into Income"
- Schema: JobPosting

**5. Pricing** (`/pricing`)
- Title: "Transparent 3D Printing Pricing | 3D3D Canada"
- Meta Description: "See our full pricing breakdown. $18 minimum order: $5 platform fee, $10 maker rental, $3 filament. No hidden fees. Quantity discounts available."
- Keywords: 3D printing cost, transparent pricing, maker payout
- H1: "Transparent Pricing"
- Schema: PriceSpecification

**6. FAQ** (`/faq`)
- Title: "3D Printing FAQ | 3D3D Canada"
- Meta Description: "Common questions about 3D3D: turnaround times, materials, file formats, shipping, payments. Get answers before you order."
- Keywords: 3D printing questions, STL file, print time, materials
- H1: "Frequently Asked Questions"
- Schema: FAQPage

### SEO Metadata Templates

**Template** (`src/components/SEO.tsx`):
```typescript
interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
}

export function SEO({ title, description, keywords, canonical, ogImage, schema }: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Schema.org */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
```

**Usage**:
```typescript
<SEO
  title="3D3D Canada | Local 3D Printing in Fredericton, NB"
  description="Get instant quotes from 100+ local makers..."
  keywords="3D printing Fredericton, local 3D printing"
  canonical="https://3d3d.ca/"
  ogImage="https://3d3d.ca/og-image.jpg"
  schema={{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "3D3D Canada",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Fredericton",
      "addressRegion": "NB",
      "addressCountry": "CA"
    }
  }}
/>
```

## Knowledge Hub (Phase 1 Structure)

### FAQ Categories

**1. Getting Started**
- What is 3D3D?
- How does peer-to-peer printing work?
- Do I need an account to get a quote?
- What file formats do you accept?
- How accurate is the instant quote?

**2. Ordering**
- How long does printing take?
- Can I rush my order?
- What materials are available?
- What's the minimum order?
- Can I order multiple items?

**3. Pricing**
- How is pricing calculated?
- What's included in the platform fee?
- How much does my maker earn?
- Are there quantity discounts?
- Can I use credits?

**4. For Makers**
- How do I become a maker?
- What equipment do I need?
- How do I get paid?
- Can I set my own hours?
- What if I can't complete a job?

**5. Technical**
- What's the maximum file size?
- What's the largest print size?
- Do you support multi-color prints?
- Can I request specific infill/layer height?
- What if my file has errors?

### Content Structure

**File**: `src/data/faq.ts`
```typescript
export const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'What is 3D3D?',
        answer: '3D3D is a peer-to-peer 3D printing network connecting customers with local makers in Fredericton, NB. Upload your file, get an instant quote, and receive your print from a community maker in 24-48 hours.',
      },
      {
        question: 'Do I need an account to get a quote?',
        answer: 'No! You can get an instant quote as a guest. An account is only required if you want to pay with credits or save quotes for later.',
      },
      // ... more questions
    ],
  },
  // ... more categories
];
```

## Fredericton Local Landing Strategy

### Local SEO Tactics

**1. Google Business Profile**
- Claim/create listing for "3D3D Canada"
- Category: 3D Printing Service
- Location: Fredericton, NB
- Hours: 24/7 (online platform)
- Photos: Maker photos, print examples
- Posts: Weekly updates on new makers, features

**2. Local Keywords**
- Primary: "3D printing Fredericton"
- Secondary: "3D printing New Brunswick", "3D printing NB"
- Long-tail: "where to get 3D prints in Fredericton", "local 3D printing service Fredericton"

**3. Local Content**
- Blog post: "100+ 3D Printing Makers in Fredericton"
- Case study: "How [Local Business] Used 3D3D for Prototyping"
- Maker spotlight: "Meet Sarah, Fredericton Maker Earning $500/month"

**4. Local Backlinks**
- Fredericton Chamber of Commerce
- UNB/STU maker spaces
- Local tech blogs (e.g., Huddle)
- New Brunswick tech directories

**5. Local Partnerships**
- UNB Engineering (student discounts)
- Fredericton Makerspace (cross-promotion)
- Local businesses (bulk order discounts)

### Landing Page Localization

**Hero Section**:
- Headline: "Fredericton's 3D Printing Network"
- Subheadline: "100+ local makers ready to print your designs"
- CTA: "Get Instant Quote" + "Find Makers Near You"

**Trust Section**:
- "Proudly serving Fredericton since 2024"
- "100+ makers in your community"
- "24-48 hour local delivery"

**Maker Map** (Phase 2):
- Interactive map showing maker locations (anonymized)
- Filter by material, printer type, availability

## Trust & Proof System

### Trust Indicators (No Lying)

**Verified Claims Only**:
- ✅ "100+ makers in Fredericton" (if true, update number)
- ✅ "24-48 hour turnaround" (based on actual data)
- ✅ "Transparent pricing" (show full breakdown)
- ❌ "Best 3D printing in Canada" (subjective, unverified)
- ❌ "Fastest delivery" (unverified)

**Social Proof**:
- Real maker testimonials (with photos, names, earnings)
- Real customer reviews (from actual orders)
- Recent print gallery (actual prints, not stock photos)
- Maker count (updated monthly)

**Transparency**:
- Show maker payout on every quote
- Explain platform fee breakdown
- Admit limitations (e.g., "Emergency rush not always available")
- Link to full pricing page

### Proof Elements

**1. Recent Prints Carousel**
- Real photos from completed orders
- Material, maker name, print time
- "Printed by Sarah in Fredericton"

**2. Maker Testimonials**
- Photo, name, earnings
- "I've earned $1,200 in 3 months with my Prusa MK4"
- Link to "Become a Maker"

**3. Customer Reviews**
- Star rating, name, order details
- "Fast turnaround, great quality. Highly recommend!"
- Verified purchase badge

**4. Live Activity Feed** (Phase 1)
- "John just ordered a phone stand (PLA, 50g)"
- "Sarah claimed a print job (PETG, 200g)"
- "Mike earned $15 from a completed print"
- Real-time updates (every 5 minutes)

**Implementation** (`src/components/ActivityFeed.tsx`):
```typescript
export function ActivityFeed() {
  const { data: activities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data } = await supabase
        .from('print_requests')
        .select('id, created_at, user:profiles(name), material_type, grams')
        .order('created_at', { ascending: false })
        .limit(10);
      return data;
    },
    refetchInterval: 300000, // 5 minutes
  });
  
  return (
    <div className="space-y-2">
      {activities?.map(activity => (
        <div key={activity.id} className="text-sm text-muted-foreground">
          <span className="font-medium">{activity.user.name}</span> ordered a print
          <span className="text-secondary"> ({activity.material_type}, {activity.grams}g)</span>
        </div>
      ))}
    </div>
  );
}
```

## Privacy-First Analytics

### Analytics Strategy

**Tool**: Plausible or Fathom (GDPR-compliant, no cookies)

**Metrics to Track**:
- Page views (all pages)
- Quote starts (Step 1 reached)
- Quote completions (Step 5 submitted)
- Conversion rate (quote → order)
- Bounce rate (landing page)
- Time on site
- Traffic sources (organic, direct, referral)

**Events to Track**:
- File upload (quote configurator)
- Material selection
- Quantity change
- Quote submitted
- Account created
- Points redeemed

**Implementation** (`src/lib/analytics.ts`):
```typescript
export function trackEvent(eventName: string, props?: Record<string, any>) {
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
}

// Usage
trackEvent('Quote Started', { material: 'PLA', grams: 100 });
trackEvent('Quote Submitted', { total: 25.50, credits: 255 });
```

**Privacy Policy**:
- No personal data collected
- No cookies used
- No tracking across sites
- Data stored in EU (GDPR-compliant)
- Aggregate data only

## Public Launch Checklist

### Pre-Launch (Week 5)

**Content**:
- [ ] All page copy written and approved
- [ ] FAQ content complete (30+ questions)
- [ ] Maker testimonials collected (5+)
- [ ] Customer reviews collected (10+)
- [ ] Recent prints gallery (20+ photos)

**SEO**:
- [ ] Meta tags on all pages
- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] Robots.txt configured
- [ ] Google Search Console verified
- [ ] Google Business Profile claimed
- [ ] Schema.org markup added

**Analytics**:
- [ ] Plausible/Fathom installed
- [ ] Events configured
- [ ] Privacy policy updated
- [ ] Cookie banner (if needed)

**Social**:
- [ ] Twitter account created (@3d3dcanada)
- [ ] Facebook page created
- [ ] Instagram account created
- [ ] LinkedIn company page created
- [ ] Social share images created (OG images)

### Launch Day (Week 6)

**Announcements**:
- [ ] Email to existing users (if any)
- [ ] Post on Twitter, Facebook, Instagram, LinkedIn
- [ ] Submit to Product Hunt
- [ ] Post on Hacker News (Show HN)
- [ ] Post on r/3Dprinting, r/fredericton
- [ ] Contact local tech blogs (Huddle, etc.)

**Monitoring**:
- [ ] Monitor analytics (traffic, conversions)
- [ ] Monitor social mentions
- [ ] Respond to comments/questions
- [ ] Track bugs/issues (Sentry)
- [ ] Monitor server performance

**Follow-Up**:
- [ ] Thank early users (email, social)
- [ ] Share success stories (first orders, maker earnings)
- [ ] Collect feedback (surveys, interviews)
- [ ] Plan Phase 2 features based on feedback

### Post-Launch (Week 7+)

**Content Marketing**:
- Blog post: "How We Built 3D3D"
- Case study: "First 100 Orders"
- Maker spotlight series (weekly)
- Customer success stories

**Local Outreach**:
- Contact UNB/STU maker spaces
- Attend Fredericton tech meetups
- Partner with local businesses
- Sponsor local events

**SEO**:
- Build local backlinks
- Create local content
- Optimize based on search data
- Monitor rankings (Ahrefs, SEMrush)

## Definition of Done

Agent D deliverables complete when:
- [ ] All page copy written and approved
- [ ] SEO meta tags on all pages
- [ ] FAQ content complete (30+ questions)
- [ ] Privacy-first analytics installed
- [ ] Social accounts created
- [ ] Launch checklist complete

## Verification

**How this is verified**:
- Copy review: Stakeholder approval
- SEO: Google Search Console verification
- Analytics: Plausible dashboard showing data
- Social: Accounts live and branded
- Launch: All checklist items checked

**What would block production**:
- Missing meta tags on any page
- Analytics not installed
- Privacy policy not updated
- Social share images missing
- Launch announcement not ready
