"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, RefreshCw, Flame, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, Badge } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { RESET_PLAN_TASKS, getDailyScripture } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function TodayResetPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const { toast } = useToast();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [scriptureIndex, setScriptureIndex] = useState(0);

  const load = async () => {
    const res = await fetch("/api/reset");
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const dayIndex = plan?.completedTaskIds?.length || 0;
  const task = RESET_PLAN_TASKS[Math.min(dayIndex, RESET_PLAN_TASKS.length - 1)];
  const todayDone = plan?.completedTaskIds?.includes(task?.id);
  const scripture = getDailyScripture(user?.resetGoal || "budget_discipline", dayIndex + scriptureIndex);

  const completeTask = async () => {
    if (!task || todayDone) return;
    setCompleting(true);
    const res = await fetch("/api/reset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completeTask: true, taskId: task.id }),
    });
    if (res.ok) {
      toast("Task complete! Great work 🎉");
      load();
    }
    setCompleting(false);
  };

  const TYPE_LABELS: Record<string, string> = {
    reflection: "Reflection", action: "Action Step", prayer: "Prayer", study: "Bible Study",
  };
  const TYPE_COLORS: Record<string, string> = {
    reflection: "secondary", action: "default", prayer: "accent", study: "success",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg">
        <AppHeader title="Today's Task" />
        <div className="page-container pt-8 text-center text-text-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg">
        <AppHeader title="Today's Task" />
        <div className="page-container pt-8 text-center">
          <p className="text-sm text-text-muted mb-4">Complete onboarding to start your reset</p>
          <Link href="/app/onboarding"><Button>Start Onboarding</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Today's Task" subtitle={`Day ${dayIndex + 1} of 90`} />

      <div className="page-container pt-5 space-y-5">
        {/* Day + Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary-soft flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{dayIndex + 1}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Day {dayIndex + 1}</p>
              <p className="text-xs text-text-muted">Week {task?.week} · {task?.theme}</p>
            </div>
          </div>
          {plan.streak > 0 && (
            <Badge variant="default" className="gap-1">
              <Flame className="h-3 w-3" /> {plan.streak}-day streak
            </Badge>
          )}
        </div>

        {/* Today's Task */}
        {task && (
          <Card className={todayDone ? "border-primary/40 bg-primary-soft/20" : ""}>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Badge variant={TYPE_COLORS[task.type] as any} className="mb-2">
                    {TYPE_LABELS[task.type]}
                  </Badge>
                  <h2 className="text-base font-bold text-text-primary leading-tight">{task.title}</h2>
                </div>
                {todayDone && <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />}
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{task.description}</p>

              {todayDone ? (
                <div className="flex items-center gap-2 text-primary text-sm font-medium bg-primary-soft rounded-xl p-3">
                  <CheckCircle2 className="h-4 w-4" />
                  Task completed for today. See you tomorrow!
                </div>
              ) : (
                <Button onClick={completeTask} className="w-full gap-2" disabled={completing}>
                  <CheckCircle2 className="h-4 w-4" />
                  {completing ? "Marking complete..." : "Mark as Complete"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scripture */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Scripture</p>
              </div>
              <button
                onClick={() => setScriptureIndex((s) => s + 1)}
                className="text-xs text-text-muted hover:text-primary flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Shuffle
              </button>
            </div>
            <blockquote className="border-l-2 border-accent pl-4">
              <p className="text-sm text-text-primary leading-relaxed italic">"{scripture.verse}"</p>
              <footer className="mt-1 text-xs text-accent font-medium">— {scripture.reference}</footer>
            </blockquote>
          </CardContent>
        </Card>

        {dayIndex >= 90 && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="pt-4 text-center space-y-2">
              <p className="text-2xl">🎉</p>
              <p className="text-base font-bold text-text-primary">You completed the 90-Day Reset!</p>
              <p className="text-sm text-text-muted">Your faithfulness has made a difference. Consider starting a new reset.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
