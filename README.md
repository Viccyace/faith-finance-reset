# Faith & Finance Reset 🌿

A Christian financial planner PWA built with Next.js, MongoDB, and NextAuth.
Manage budgets, track tithing, set prayer goals, and follow a 90-day faith + finance reset program.

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI**: Radix/shadcn-style components + lucide-react
- **Forms**: react-hook-form + zod
- **Database**: MongoDB (Mongoose)
- **Auth**: NextAuth (Credentials provider) + bcryptjs
- **Payments**: Stripe (modular — easy to swap Paystack/Flutterwave)
- **Deployment**: Vercel-ready

---

## Run Locally

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 2. Clone and Install

```bash
git clone <repo>
cd faith-finance-reset
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/faith-finance
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Optional: Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_MONTHLY=price_...
```

### 4. Seed Demo Data (optional)

```bash
npm run seed
# Creates: demo@faithfinance.app / demo1234
```

### 5. Start Dev Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── app/
│   │   ├── layout.tsx        # App shell with auth guard
│   │   ├── page.tsx          # Dashboard
│   │   ├── onboarding/       # First-time setup
│   │   ├── budget/           # Monthly budget
│   │   ├── transactions/     # Income/expense list
│   │   ├── giving/           # Tithe/offering tracker
│   │   ├── prayer/           # Goals + journal
│   │   ├── reset/            # 90-day plan overview
│   │   │   └── today/        # Today's task + scripture
│   │   ├── reports/          # Monthly reports + CSV export
│   │   ├── settings/         # Profile, password, theme
│   │   └── upgrade/          # Subscription plans
│   └── api/
│       ├── auth/             # NextAuth + signup
│       ├── user/             # Profile + onboarding
│       ├── budget/
│       ├── transactions/
│       ├── giving/
│       ├── prayer/
│       ├── reset/
│       └── reports/
├── components/
│   ├── ui/                   # Button, Input, Card, Toast, etc.
│   ├── layout/               # BottomNav, AppHeader, QuickAddFAB
│   └── dashboard/            # TransactionModal, GivingModal, PrayerModal
├── lib/
│   ├── auth.ts               # NextAuth options
│   ├── db.ts                 # MongoDB connection
│   ├── utils.ts              # formatCurrency, countries, etc.
│   ├── data.ts               # Scriptures + 90-day task plan
│   └── seed.ts               # Demo data seeder
├── models/
│   ├── User.ts
│   ├── BudgetMonth.ts
│   ├── Transaction.ts
│   ├── GivingEntry.ts
│   ├── Prayer.ts
│   └── ResetPlan.ts
└── types/
    └── next-auth.d.ts
```

---

## Deployment on Vercel + MongoDB Atlas

### MongoDB Atlas Setup
1. Create free cluster at https://cloud.mongodb.com
2. Add database user (username + password)
3. Whitelist all IPs: `0.0.0.0/0` (for Vercel)
4. Get connection string (MongoDB URI)

### Vercel Deployment
1. Push code to GitHub
2. Import repo in https://vercel.com/new
3. Add all environment variables from `.env.example`
4. Set `NEXTAUTH_URL` to your Vercel domain (e.g. `https://yourapp.vercel.app`)
5. Deploy!

### Post-Deploy Checklist
- [ ] MongoDB URI connected and accessible
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `NEXTAUTH_URL` matches your production URL exactly
- [ ] Test signup → onboarding → dashboard flow
- [ ] (Optional) Set up Stripe: add price IDs, connect `/api/payments` routes
- [ ] Enable PWA: add icon-192.png and icon-512.png to `/public`

---

## Stripe Integration (Payments)

The payment layer is modular. To enable Stripe:

1. Add your Stripe keys to `.env.local`
2. Create a product + price in Stripe Dashboard
3. Add the price ID to `STRIPE_PRICE_ID_MONTHLY`
4. Implement `/api/payments/create-checkout/route.ts`:

```ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID_MONTHLY, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/app/settings?upgraded=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/app/upgrade`,
  });
  return Response.json({ url: session.url });
}
```

To swap for **Paystack** or **Flutterwave**, replace only this API route — no other changes needed.

---

## Design System

| Token | Value | Use |
|---|---|---|
| Background | `#FBF7F0` | Page background |
| Surface | `#FFFFFF` | Cards |
| Border | `#ECE7DD` | Card borders |
| Primary | `#2F6B4F` | Sage green — CTAs |
| Primary Soft | `#E6F2EB` | Backgrounds |
| Accent | `#B08D57` | Muted gold — giving |
| Text Primary | `#1F2937` | Main text |
| Text Muted | `#6B7280` | Secondary text |
| Error | `#B42318` | Errors |

Dark mode uses deep charcoal (`#111714`) with the same accent colors.

---

## Scripture Library

30 curated scriptures tagged by theme:
- `stewardship`, `discipline`, `generosity`, `peace`, `wisdom`, `diligence`

Shown daily based on user's reset goal. Shuffleable once per day.

## 90-Day Reset Plan

84 daily tasks across 12 weeks:
- Week 1: Foundation
- Week 2: Stewardship  
- Week 3: Debt Awareness
- Week 4: Generosity
- Week 5: Discipline
- Weeks 6-12: Provision → Growth → Legacy → Completion

Each task is typed: reflection, action, prayer, or study.
