"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getDashboard, toggleTask, clearToken, ApiError } from "@/lib/api";
import type { DashboardData, DashboardTask } from "@/lib/types";
import { StatCard } from "@/components/StatCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { TaskList } from "@/components/TaskList";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { QuizList } from "@/components/QuizList";
import { DoubtsPanel } from "@/components/DoubtsPanel";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTask, setActiveTask] = useState<DashboardTask | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getDashboard();
      setData(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Failed to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  async function handleToggle(taskId: number) {
    if (!data?.today_plan) return;
    // optimistic update
    setData({
      ...data,
      today_plan: {
        ...data.today_plan,
        tasks: data.today_plan.tasks.map((t) =>
          t.id === taskId ? { ...t, is_done: !t.is_done } : t
        ),
      },
    });
    try {
      await toggleTask(taskId);
    } catch {
      load(); // fall back to a full refresh if the toggle didn't actually save
    }
  }

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  if (loading && !data) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-28 bg-logic-border rounded-card" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 bg-logic-border rounded-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-logic-danger rounded-card p-4 text-sm">
          {error}
          <button onClick={load} className="ml-3 font-bold underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const firstName = data.profile.name.split(" ")[0] || data.profile.name;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-logic-greenDark to-logic-green rounded-card p-6 sm:p-7 text-white flex items-center justify-between gap-5 flex-wrap mb-5 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold">Hi, {firstName} 👋</h1>
          <p className="text-sm opacity-90 mt-1">
            {data.profile.batch}
            {data.profile.registration_no ? ` · Reg. No: ${data.profile.registration_no}` : ""}
          </p>
          <button onClick={handleLogout} className="text-xs opacity-75 underline mt-2">
            Log out
          </button>
        </div>
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/40 bg-white/10 flex flex-col items-center justify-center flex-shrink-0">
          <div className="text-xl sm:text-2xl font-extrabold">{Math.round(data.metrics.learning_score)}</div>
          <div className="text-[9px] uppercase tracking-wide opacity-80">Learning Score</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard value={`${data.metrics.overall_completion}%`} label="Overall Completion" accent="info" />
        <StatCard value={data.metrics.weak_topic_count} label="Weak Topics" accent="danger" />
        <StatCard value={data.metrics.mastered_topic_count} label="Mastered Topics" accent="success" />
        <StatCard value={`${data.metrics.attendance}%`} label="Attendance" accent="warning" />
      </div>

      {/* Today's study plan */}
      <Section title="📅 Today's Study Plan">
        <TaskList
          tasks={data.today_plan?.tasks ?? []}
          onToggle={handleToggle}
          onOpenDetail={setActiveTask}
        />
      </Section>

      {/* Weekly progress */}
      <Section title="📈 Weekly Progress (Hours Studied)">
        <WeeklyChart data={data.weekly_hours} />
      </Section>

      {/* Weak / strong topics */}
      <Section title="🎯 Focus Areas">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <div className="text-[11px] font-bold text-logic-danger mb-2">NEEDS ATTENTION</div>
            {data.weak_topics.length === 0 ? (
              <p className="text-sm text-logic-muted">No weak topics right now — great job!</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {data.weak_topics.map((t) => (
                  <span key={t.id} className="text-xs bg-red-50 border border-red-200 text-logic-danger px-2.5 py-1 rounded-full">
                    {t.topic}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-[11px] font-bold text-logic-success mb-2">MASTERED</div>
            {data.strong_topics.length === 0 ? (
              <p className="text-sm text-logic-muted">Keep going — your first mastered topic is coming!</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {data.strong_topics.map((t) => (
                  <span key={t.id} className="text-xs bg-green-50 border border-green-200 text-logic-success px-2.5 py-1 rounded-full">
                    {t.topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Upcoming exams */}
      {data.upcoming_exams.length > 0 && (
        <Section title="🗓️ Upcoming Exams">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {data.upcoming_exams.map((e) => (
              <div key={e.id} className="flex-shrink-0 w-40 bg-logic-background border border-logic-border rounded-lg p-3.5">
                <div className="text-xl font-extrabold text-logic-green">{e.days_left}d</div>
                <div className="text-xs font-bold truncate mt-1">{e.name}</div>
                <div className="text-[11px] text-logic-muted mt-0.5">
                  {new Date(e.exam_date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Quizzes */}
      {data.quizzes.length > 0 && (
        <Section title="📝 Quizzes">
          <QuizList quizzes={data.quizzes} />
        </Section>
      )}

      {/* Doubts */}
      <Section title="❓ My Doubts">
        <DoubtsPanel doubts={data.doubts} onCreated={load} />
      </Section>

      {/* Motivation */}
      <div className="bg-gradient-to-br from-amber-50 to-logic-yellow rounded-card p-5 text-center font-bold text-amber-900 text-sm">
        ✨ {data.quote}
      </div>

      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-logic-border rounded-card p-5 mb-5">
      <h2 className="font-extrabold text-sm mb-3.5 flex items-center gap-2">{title}</h2>
      {children}
    </div>
  );
}
