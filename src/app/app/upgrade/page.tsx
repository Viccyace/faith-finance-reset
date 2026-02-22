"use client";
import { CheckCircle2, Crown, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, Badge } from "@/components/ui/index";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Basic budget tracking",
      "Log up to 50 transactions/month",
      "Giving tracker",
      "90-day reset program",
      "Prayer goals",
    ],
    cta: "Current Plan",
    isFree: true,
  },
  {
    name: "Pro",
    price: "$5",
    period: "per month",
    features: [
      "Unlimited transactions",
      "Full 90-day reset",
      "CSV export",
      "Reports & analytics",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    isFree: false,
  },
];

export default function UpgradePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isPro = user?.plan === "pro";

  const handleUpgrade = async () => {
    // Stripe integration: create checkout session
    // const res = await fetch("/api/payments/create-checkout", { method: "POST" });
    // const { url } = await res.json();
    // window.location.href = url;
    alert("Stripe integration: connect STRIPE_PRICE_ID and STRIPE_SECRET_KEY in .env to enable payments.");
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Upgrade" subtitle="Choose your plan" />

      <div className="page-container pt-5 space-y-5">
        <div className="text-center py-4">
          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Crown className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Faith & Finance Reset</h2>
          <p className="text-sm text-text-muted mt-1">Invest in your financial and spiritual journey</p>
        </div>

        <div className="space-y-3">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={!plan.isFree ? "border-primary ring-1 ring-primary/30" : ""}>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-text-primary">{plan.name}</p>
                      {!plan.isFree && <Badge variant="default">Popular</Badge>}
                    </div>
                    <p className="text-sm text-text-muted mt-0.5">
                      <span className="text-2xl font-bold text-text-primary">{plan.price}</span> / {plan.period}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-text-muted">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.isFree ? (
                  <Button variant="outline" className="w-full" disabled={!isPro}>
                    {isPro ? "Downgrade" : "Current Plan"}
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2"
                    disabled={isPro}
                    onClick={handleUpgrade}
                  >
                    <Zap className="h-4 w-4" />
                    {isPro ? "Current Plan" : plan.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-text-muted">
          Payments powered by Stripe · Cancel anytime · Secure checkout
        </p>
      </div>
    </div>
  );
}
