"use client";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] || "Friend";

  return (
    <header className="sticky top-0 z-30 bg-background/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-border dark:border-dark-border">
      <div className="flex items-center justify-between px-5 h-14">
        <div>
          {title ? (
            <>
              <h1 className="text-base font-semibold text-text-primary dark:text-white">{title}</h1>
              {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
            </>
          ) : (
            <div>
              <p className="text-xs text-text-muted">Good day,</p>
              <p className="text-sm font-semibold text-text-primary dark:text-white">{name} 👋</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-soft flex items-center justify-center">
            <span className="text-primary text-xs font-bold">{name[0]?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
