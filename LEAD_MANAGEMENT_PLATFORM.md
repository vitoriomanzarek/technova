# LEAD MANAGEMENT PLATFORM (Lead HUB)

**Status**: Phase C Planning | **Owner**: Vic (TechNova PM) | **Start Date**: June 1, 2026 | **Target Launch**: June 28, 2026

---

## 1. VISIÓN GENERAL

Construir una plataforma propietaria de gestión de leads (Lead HUB) integrada en el ecosystem TechNova. Sistema end-to-end que captura, califica, nutre y convierte leads en clientes pagos.

**Por qué propietario vs SaaS:**
- Control total del algoritmo de scoring (NOVA AI específico)
- Costo: $0/mes vs $50-300/mes (HubSpot, Pipedrive)
- Data es tuya, no locked-in
- API moderna, integración nativa con Supabase + Next.js
- Time to market: 2 semanas (vs 4 semanas setup SaaS + entrenamiento)

---

## 2. FLUJO DE LEADS (End-to-End)

```
┌─────────────────────────────────────────────────────────────┐
│                   LEAD JOURNEY                              │
└─────────────────────────────────────────────────────────────┘

STAGE 1: CAPTURA
├─ Website form (hero section + sidebar)
├─ NOVA AI chat (conversational)
├─ Blog CTA (end-of-article + pop-up)
├─ Google Ads (landing page)
├─ LinkedIn Ads (webhook capture)
└─ Email referral (trackable link)

           ↓

STAGE 2: QUALIFICATION (NOVA AI Score)
├─ Budget × 0.25
├─ Clarity × 0.25
├─ Timeline × 0.20
├─ Viability × 0.20
├─ Intent × 0.10
└─ Total Score: 0-100

           ↓ ROUTING

STAGE 3A: HIGH SCORE (80-100)
├─ Auto-send proposal (Claude-generated)
├─ Stripe checkout link
├─ Auto-respond email
└─ Path: Direct → Conversion

STAGE 3B: MEDIUM SCORE (60-79)
├─ Assign to sales
├─ Email nurture sequence (7 emails, 14 days)
├─ Resend via Resend API
└─ Path: Qualification → Proposal → Conversion

STAGE 3C: LOW SCORE (<60)
├─ Email nurture (lighter version)
├─ Re-score after 30 days
├─ Path: Nurture → Re-qualification OR drop

           ↓

STAGE 4: CONVERSION
├─ Proposal signed (Stripe)
├─ Payment received
├─ Create project in Supabase
├─ Auto-onboard (email + calendar invite)
└─ Move to CRM: "Won"

           ↓

STAGE 5: LOYALTY
├─ Project tracking dashboard
├─ Support tickets
├─ Upsell opportunities
├─ Referral incentive
└─ Long-term relationship
```

---

## 3. ARCHITECTURE TÉCNICA

### 3.1 Database Schema (Supabase)

```sql
-- LEADS TABLE
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Info
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  company VARCHAR,
  
  -- Lead Source
  source ENUM ('website_form', 'nova_ai_chat', 'blog', 'google_ads', 'linkedin', 'referral') NOT NULL,
  source_utm_campaign VARCHAR,
  source_utm_source VARCHAR,
  
  -- NOVA AI Qualification
  budget_score FLOAT, -- 0-100
  clarity_score FLOAT, -- 0-100
  timeline_score FLOAT, -- 0-100
  viability_score FLOAT, -- 0-100
  intent_score FLOAT, -- 0-100
  total_score FLOAT GENERATED ALWAYS AS (
    (budget_score * 0.25) + 
    (clarity_score * 0.25) + 
    (timeline_score * 0.20) + 
    (viability_score * 0.20) + 
    (intent_score * 0.10)
  ) STORED,
  
  -- Lead Status
  status ENUM ('new', 'qualified', 'proposal_sent', 'proposal_accepted', 'won', 'lost', 'nurturing') DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  qualified_at TIMESTAMPTZ,
  proposal_sent_at TIMESTAMPTZ,
  won_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PROPOSALS TABLE
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  
  service_type VARCHAR, -- 'web_dev', 'app_dev', 'marketing', 'product', 'legal'
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  
  -- Proposal Status
  status ENUM ('draft', 'sent', 'viewed', 'signed', 'payment_received') DEFAULT 'draft',
  
  -- Stripe Integration
  stripe_payment_intent_id VARCHAR,
  stripe_checkout_url VARCHAR,
  payment_received_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CONVERSIONS TABLE (Analytics)
CREATE TABLE conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  proposal_id UUID REFERENCES proposals(id),
  
  conversion_type ENUM ('proposal_view', 'proposal_signed', 'payment_received') NOT NULL,
  amount DECIMAL(10, 2),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- EMAIL EVENTS (Webhook from Resend)
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  
  email_type ENUM ('welcome', 'proposal', 'nurture_1', 'nurture_2', 'nurture_3', 'nurture_4', 'nurture_5', 'follow_up') NOT NULL,
  event_type ENUM ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained') NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- LEAD ANALYTICS (Daily Snapshot)
CREATE TABLE lead_analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  date DATE NOT NULL,
  total_leads_count INT,
  new_leads_count INT,
  qualified_leads_count INT,
  proposals_sent_count INT,
  proposals_signed_count INT,
  revenue_realized DECIMAL(12, 2),
  
  -- By Source
  leads_by_source JSONB, -- { "website_form": 5, "blog": 3, ... }
  
  -- By Score Bucket
  score_80_plus_count INT,
  score_60_79_count INT,
  score_under_60_count INT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_leads_score ON leads(total_score DESC);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_proposals_lead ON proposals(lead_id);
CREATE INDEX idx_email_events_lead ON email_events(lead_id);
```

### 3.2 API Endpoints (Next.js)

```typescript
// /app/api/leads/capture
POST /api/leads/capture
├─ Input: { email, name, phone, company, source, ...nova_ai_scores }
├─ Process:
│  ├─ Validate email
│  ├─ Check if exists (update or create)
│  ├─ Calculate NOVA AI score
│  ├─ Route based on score
│  └─ Trigger appropriate email sequence
└─ Response: { lead_id, score, routed_to, next_action }

// /app/api/leads/[id]
GET /api/leads/[id]
├─ Return: Lead detail + proposals + email events
PATCH /api/leads/[id]
├─ Update: status, assigned_to, scores, notes

// /app/api/proposals/generate
POST /api/proposals/generate
├─ Input: { lead_id, service_type, budget }
├─ Process:
│  ├─ Fetch lead data
│  ├─ Call Claude API (generate proposal)
│  ├─ Create proposal in DB
│  ├─ Generate Stripe checkout
│  └─ Send via Resend
└─ Response: { proposal_id, stripe_checkout_url }

// /app/api/proposals/[id]/sign
POST /api/proposals/[id]/sign
├─ Input: { signature_data }
├─ Process:
│  ├─ Update proposal status
│  ├─ Send confirmation email
│  ├─ Create project in system
│  └─ Update lead status to "won"
└─ Response: { success, project_id }

// /app/api/webhooks/resend
POST /app/api/webhooks/resend
├─ Handle: Email events (delivered, opened, clicked, bounced)
├─ Update: email_events table
└─ Trigger: Re-score if needed

// /app/api/analytics/leads
GET /api/analytics/leads
├─ Query params: date_range, source, score_bucket
└─ Return: Daily snapshot + trends
```

### 3.3 Frontend Components

```
/app/admin/leads
├─ /dashboard (overview)
│  ├─ KPI cards (total leads, qualified %, win rate, revenue)
│  ├─ Conversion funnel chart
│  └─ Recent activity feed
├─ /pipeline (kanban)
│  ├─ Columns: New → Qualified → Proposal Sent → Won/Lost
│  ├─ Drag-drop to update status
│  └─ Lead card (name, score, source, assigned_to)
├─ /[id] (detail view)
│  ├─ Lead info (contact, company, scores)
│  ├─ Proposals (sent, status, amount)
│  ├─ Email history (all events)
│  ├─ Activity timeline
│  └─ Actions (send proposal, nurture sequence, mark as lost)
├─ /analytics
│  ├─ By source (web, blog, ads, referral)
│  ├─ By score bucket (80+, 60-79, <60)
│  ├─ Conversion rate by source
│  └─ Revenue attribution
└─ /settings
   ├─ Team management
   ├─ Scoring weights
   ├─ Email sequences
   └─ Stripe settings
```

---

## 4. INTEGRATIONS

### 4.1 NOVA AI Chat Integration
- Lead submits form via NOVA AI chat
- Chat answers questions while collecting qualification data
- Scores calculated in real-time
- If score 80+, offer instant proposal
- If score <60, offer nurture sequence

**Endpoint**: POST `/api/leads/capture` with source=`nova_ai_chat`

### 4.2 Resend Email Integration
- Email provider: Resend (when demand exceeds, migrate to Loops)
- Events: sent, delivered, opened, clicked, bounced
- Webhook: POST `/api/webhooks/resend`

**Email Sequences:**

```
HIGH SCORE (80-100):
├─ Email 1 (immediate): "We created your proposal"
│  └─ CTA: View proposal + Stripe checkout
├─ Email 2 (24h later): "Your proposal is ready"
└─ Email 3 (48h later): "Last chance to review"

MEDIUM SCORE (60-79):
├─ Email 1 (immediate): "Thanks for your interest"
├─ Email 2 (Day 3): "How we can help"
├─ Email 3 (Day 5): Case study
├─ Email 4 (Day 7): Social proof
├─ Email 5 (Day 10): "Let's talk"
├─ Email 6 (Day 14): Final follow-up
└─ Email 7 (Day 21): Win-back (if not responded)

LOW SCORE (<60):
├─ Email 1 (immediate): "Let's explore your needs"
├─ Email 2 (Day 7): "Resources for your situation"
└─ Email 3 (Day 30): Re-score + offer re-engagement
```

### 4.3 Stripe Integration
- Payment processor for proposals
- Flow: Proposal sent → Stripe checkout link → Payment received
- Webhook: Update proposal status + lead status

### 4.4 Claude API Integration
- Auto-generate proposals based on lead profile
- Prompt: "Generate a proposal for [lead name] with budget $[X], timeline [Y], services [Z]"

---

## 5. SCORING FORMULA (NOVA AI)

Each score is 0-100. User provides answers via NOVA AI chat or form.

```
BUDGET SCORE (0-100)
├─ $50k+: 100
├─ $30k-50k: 80
├─ $15k-30k: 60
├─ $5k-15k: 40
└─ <$5k: 20

CLARITY SCORE (0-100)
├─ Clear scope + requirements: 100
├─ Mostly clear: 80
├─ Somewhat clear: 60
├─ Vague: 40
└─ Very unclear: 20

TIMELINE SCORE (0-100)
├─ Start next week: 100
├─ Start this month: 80
├─ Start next month: 60
├─ Start Q3+: 40
└─ Undefined: 20

VIABILITY SCORE (0-100)
├─ Technically feasible, no blockers: 100
├─ Feasible with minor challenges: 80
├─ Feasible with some challenges: 60
├─ Feasible but complex: 40
└─ Not feasible: 20

INTENT SCORE (0-100)
├─ Actively looking, decision imminent: 100
├─ Seriously considering: 80
├─ Exploring options: 60
├─ Just researching: 40
└─ Not ready: 20

TOTAL SCORE = (Budget × 0.25) + (Clarity × 0.25) + (Timeline × 0.20) + (Viability × 0.20) + (Intent × 0.10)
```

---

## 6. ROUTING LOGIC

```
Score 80-100:
├─ Auto-send Claude-generated proposal
├─ Include Stripe checkout link
├─ 3-email sequence (immediate, 24h, 48h)
├─ Auto-routed to "proposal_sent" status
└─ ROI: High conversion, minimal sales touch

Score 60-79:
├─ Assign to sales team
├─ Send welcome email
├─ 7-email nurture sequence (21 days)
├─ Follow-up calendar reminders
└─ ROI: Medium conversion, sales engagement needed

Score <60:
├─ Auto-email with resources
├─ Light nurture (2-3 emails, 30 days)
├─ Auto re-score after 30 days
├─ If still <60, pause and mark as "lost"
└─ ROI: Low conversion, defer resources
```

---

## 7. ANALYTICS & KPIs

**Dashboard Metrics:**

```
CONVERSION FUNNEL:
├─ Total Leads: [count]
├─ Qualified (score 60+): [%]
├─ Proposals Sent: [count]
├─ Proposals Signed: [count]
├─ Conversion Rate: [%]
└─ Revenue: [$]

BY SOURCE:
├─ Website Form: [leads] → [%] conversion → [$] revenue
├─ NOVA AI Chat: [leads] → [%] conversion → [$] revenue
├─ Blog: [leads] → [%] conversion → [$] revenue
├─ Google Ads: [leads] → [%] conversion → [$] CAC
├─ LinkedIn: [leads] → [%] conversion → [$] CAC
└─ Referral: [leads] → [%] conversion → [%] LTV

EMAIL ENGAGEMENT:
├─ Open rate: [%]
├─ Click rate: [%]
├─ Bounce rate: [%]
└─ Unsubscribe rate: [%]

SALES METRICS:
├─ Lead value (avg): [$]
├─ Deal cycle: [days]
├─ Close rate: [%]
└─ LTV: [$] (lifetime value)
```

**Dashboards:**
- `/admin/leads/dashboard` (executive overview)
- `/admin/leads/analytics` (deep dive by source/score)
- `/admin/leads/pipeline` (sales team view)

---

## 8. IMPLEMENTATION TIMELINE

### Week 1 (June 1-7): Database & API
- [ ] Create Supabase schema (leads, proposals, email_events, analytics)
- [ ] Build API endpoints (capture, detail, generate proposal)
- [ ] Setup RLS policies (auth)
- [ ] Integration testing

### Week 2 (June 8-14): Frontend & Dashboard
- [ ] Build /admin/leads dashboard
- [ ] Build /admin/leads/pipeline (kanban)
- [ ] Build /admin/leads/[id] (detail view)
- [ ] Add analytics views

### Week 3 (June 15-21): Integrations
- [ ] Resend integration (email sending)
- [ ] Resend webhooks (event tracking)
- [ ] Stripe integration (checkout links)
- [ ] Claude API (proposal generation)

### Week 4 (June 22-28): Testing & Launch
- [ ] End-to-end testing
- [ ] Load testing
- [ ] Deploy to production
- [ ] Train team
- [ ] Launch (soft launch with blog first)

---

## 9. SUCCESS METRICS (Phase C End)

- [ ] System captures 100+ leads in first month
- [ ] 60%+ qualification rate (score 60+)
- [ ] 3+ proposals generated and sent
- [ ] 1+ deal closed (revenue)
- [ ] Email open rate >30%
- [ ] Click rate >5%
- [ ] System uptime 99.9%
- [ ] Support queue <5 tickets/week

---

## 10. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low lead quality | Poor conversion | Improve NOVA AI scoring questions, validate with sales |
| Email deliverability | Leads don't see emails | Use Resend (high reputation), monitor bounce rate |
| Stripe integration bugs | Payment failures | Test thoroughly, have manual backup |
| Claude API rate limits | Proposals delayed | Implement queue, use batch generation |
| Complexity overload | Team can't manage | Start with MVP (capture + basic routing), iterate |

---

## 11. FUTURE ENHANCEMENTS (Phase D+)

- [ ] ML predictive scoring (historical data → better predictions)
- [ ] CRM integrations (Salesforce, Pipedrive)
- [ ] Phone call tracking (caller ID matching leads)
- [ ] Calendar integration (auto-schedule demos)
- [ ] Community hub (Slack/Discord for clients)
- [ ] Affiliate/partnership program (referral tracking)
- [ ] Multi-language support (Spanish, Portuguese)
