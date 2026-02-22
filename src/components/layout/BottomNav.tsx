"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Heart, RefreshCw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Home", icon: Home, exact: true },
  { href: "/app/budget", label: "Budget", icon: BarChart2, exact: false },
  { href: "/app/giving", label: "Giving", icon: Heart, exact: false },
  { href: "/app/reset", label: "Reset", icon: RefreshCw, exact: false },
  { href: "/app/settings", label: "Settings", icon: Settings, exact: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-sm dark:bg-dark-surface dark:border-dark-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href) && pathname !== "/app";
          const active = pathname === href || (!exact && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]",
                active ? "text-primary" : "text-text-muted"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span className={cn("text-[10px]", active ? "font-semibold" : "font-medium")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
