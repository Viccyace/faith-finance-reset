import Link from "next/link";
import { ArrowRight, BarChart2, Heart, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-background to-accent/10 pointer-events-none" />
        <div className="relative max-w-lg mx-auto px-5 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-soft text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
            90-Day Faith & Finance Reset
          </div>
          <h1 className="text-4xl font-bold text-text-primary leading-tight mb-4">
            Manage money with
            <span className="text-primary block">faith and clarity.</span>
          </h1>
          <p className="text-text-muted text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Budget wisely, give faithfully, and grow spiritually with a 90-day program designed for Christian stewardship.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/auth/signup">
              <Button className="w-full h-12 text-base gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full h-12 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-lg mx-auto px-5 py-10">
        <p className="text-center text-xs text-text-muted uppercase tracking-wider font-medium mb-8">Everything you need</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: BarChart2, title: "Smart Budgeting", desc: "Track income, expenses, and categories with clarity", color: "bg-primary-soft text-primary" },
            { icon: Heart, title: "Giving Tracker", desc: "Log tithes, offerings, and giving goals faithfully", color: "bg-accent/10 text-accent" },
            { icon: RefreshCw, title: "90-Day Reset", desc: "Daily tasks and weekly reflections to transform habits", color: "bg-primary-soft text-primary" },
            { icon: BookOpen, title: "Prayer Goals", desc: "Connect your spiritual and financial intentions", color: "bg-accent/10 text-accent" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-4 space-y-2">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-text-primary">{title}</p>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scripture */}
      <div className="max-w-lg mx-auto px-5 pb-16">
        <div className="scripture-card">
          <p className="text-sm font-medium text-white/70 mb-2">Today's Inspiration</p>
          <p className="text-base font-medium text-white leading-relaxed">
            "The plans of the diligent lead to profit as surely as haste leads to poverty."
          </p>
          <p className="text-xs text-white/60 mt-2">— Proverbs 21:5</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-10 text-xs text-text-muted">
        <p>Faith & Finance Reset — Stewardship for the Faithful</p>
      </div>
    </div>
  );
}
