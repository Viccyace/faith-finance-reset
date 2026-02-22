"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FormField, Select } from "@/components/ui/index";
import { COUNTRIES, CURRENCIES, COUNTRY_CURRENCIES, RESET_GOALS } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  country: z.string().min(2),
  currency: z.string().min(3),
  timezone: z.string().min(1),
  resetGoal: z.enum(["budget_discipline", "debt_reset", "savings_growth", "giving_consistency"]),
});
type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [selectedGoal, setSelectedGoal] = useState<string>("budget_discipline");
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "US", currency: "USD", timezone: "America/New_York", resetGoal: "budget_discipline" },
  });

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setValue("country", country);
    const currency = COUNTRY_CURRENCIES[country];
    if (currency) setValue("currency", currency);
  };

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, onboarding: true }),
    });
    if (res.ok) {
      await update({ onboardingComplete: true, currency: data.currency });
      router.push("/app");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full px-5 py-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Let's set you up</h1>
          <p className="text-text-muted text-sm">A few quick details to personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField label="Country" required>
            <Select {...register("country")} onChange={handleCountryChange}>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </Select>
          </FormField>

          <FormField label="Currency" required>
            <Select {...register("currency")}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
            </Select>
          </FormField>

          <FormField label="Timezone" required>
            <Select {...register("timezone")}>
              {["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
                "Europe/London", "Europe/Paris", "Africa/Lagos", "Africa/Nairobi",
                "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney", "Pacific/Auckland"].map((tz) => (
                <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
              ))}
            </Select>
          </FormField>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary">Your 90-Day Reset Goal <span className="text-error">*</span></p>
            <div className="grid grid-cols-1 gap-2">
              {RESET_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.value;
                return (
                  <button
                    key={goal.value}
                    type="button"
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-surface hover:border-primary/50"
                    )}
                    onClick={() => {
                      setSelectedGoal(goal.value);
                      setValue("resetGoal", goal.value as any);
                    }}
                  >
                    <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      isSelected ? "border-primary bg-primary" : "border-border"
                    )}>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-text-primary")}>{goal.label}</p>
                      <p className="text-xs text-text-muted">{goal.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? "Setting up..." : "Start My Reset →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
