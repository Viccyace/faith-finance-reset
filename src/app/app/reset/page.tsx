"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Flame, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, Progress, Badge, Separator } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { RESET_PLAN_TASKS } from "@/lib/data";
import { cn } from "@/lib/utils";

const WEEK_THEMES: Record<number, string> = {
  1: "Foundation", 2: "Stewardship", 3: "Debt Awareness", 4: "Generosity",
  5: "Discipline", 6: "Provision", 7: "Protection", 8: "Growth",
  9: "Legacy", 10: "Celebration", 11: "Future", 12: "Completion",
};

export default function ResetPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/reset").then((r) => r.json()).then((d) => { setPlan(d); setLoading(false); });
  }, []);

  const completedIds = plan?.completedTaskIds || [];
  const totalCompleted = completedIds.length;
  const progress = Math.min(100, (totalCompleted / 90) * 100);

  const getWeekTasks = (week: number) => RESET_PLAN_TASKS.filter((t) => t.week === week);
  const isWeekComplete = (week: number) => getWeekTasks(week).every((t) => completedIds.includes(t.id));
  const weekProgress = (week: number) => {
    const tasks = getWeekTasks(week);
    return tasks.filter((t) => completedIds.includes(t.id)).length;
  };

  const TYPE_ICONS: Record<string, string> = {
    reflection: "💭", action: "✅", prayer: "🙏", study: "📖",
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="90-Day Reset" />

      <div className="page-container pt-5 space-y-5">
        {/* Summary */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary-soft flex items-center justify-center">
                  <Flame className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Overall Progress</p>
                  <p className="text-xs text-text-muted">{totalCompleted} of 90 tasks</p>
                </div>
              </div>
              {plan?.streak > 0 && (
                <Badge variant="default" className="gap-1">
                  <Flame className="h-3 w-3" /> {plan.streak}-day streak
                </Badge>
              )}
            </div>
            <Progress value={progress} className="h-3" />
            <Link href="/app/reset/today">
              <Button className="w-full gap-2">
                <ArrowRight className="h-4 w-4" /> Today's Task
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Weekly breakdown */}
        <div>
          <p className="section-title mb-3">12-Week Plan</p>
          <div className="space-y-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => {
              const weekDone = weekProgress(week);
              const weekTotal = getWeekTasks(week).length;
              const complete = isWeekComplete(week);
              const isExpanded = expandedWeek === week;
              const weekPercent = Math.round((weekDone / weekTotal) * 100);

              return (
                <Card key={week} className={complete ? "border-primary/30 bg-primary-soft/30" : ""}>
                  <button
                    className="w-full"
                    onClick={() => setExpandedWeek(isExpanded ? null : week)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                            complete ? "bg-primary text-white" : "bg-primary-soft text-primary"
                          )}>
                            {complete ? "✓" : week}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-text-primary">Week {week}: {WEEK_THEMES[week]}</p>
                            <p className="text-xs text-text-muted">{weekDone}/{weekTotal} tasks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={weekPercent} className="w-16 h-1.5" />
                          <ArrowRight className={cn("h-4 w-4 text-text-muted transition-transform", isExpanded && "rotate-90")} />
                        </div>
                      </div>
                    </CardContent>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-1 border-t border-border pt-3">
                      {getWeekTasks(week).map((task) => {
                        const done = completedIds.includes(task.id);
                        return (
                          <div key={task.id} className="flex items-start gap-2 py-1.5">
                            {done
                              ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              : <Circle className="h-4 w-4 text-border shrink-0 mt-0.5" />
                            }
                            <div>
                              <p className={cn("text-xs font-medium", done ? "line-through text-text-muted" : "text-text-primary")}>
                                {TYPE_ICONS[task.type]} Day {task.day}: {task.title}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
