"use client";

import type { DashboardTask } from "@/lib/types";

const ACTIVITY_LABELS: Record<string, string> = {
  read: "Read",
  watch_video: "Watch Video",
  practice_mcq: "Practice MCQs",
  revision: "Revision",
  mock_test: "Mock Test",
  assignment: "Assignment",
};

const ACTIVITY_COLORS: Record<string, string> = {
  read: "bg-blue-50 text-blue-700",
  watch_video: "bg-emerald-50 text-emerald-800",
  practice_mcq: "bg-amber-50 text-amber-800",
  revision: "bg-red-50 text-red-700",
  mock_test: "bg-green-50 text-green-800",
  assignment: "bg-gray-100 text-gray-700",
};

export function TaskList({
  tasks,
  onToggle,
  onOpenDetail,
}: {
  tasks: DashboardTask[];
  onToggle: (taskId: number) => void;
  onOpenDetail: (task: DashboardTask) => void;
}) {
  if (!tasks.length) {
    return (
      <div className="text-sm text-logic-muted text-center py-6">
        Nothing scheduled today — you&apos;re all caught up.
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 py-3 border-b border-logic-border last:border-b-0">
          <button
            onClick={() => onToggle(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs transition-colors ${
              task.is_done
                ? "bg-logic-success border-logic-success text-white"
                : "border-logic-border text-transparent"
            }`}
          >
            ✓
          </button>
          <button className="flex-1 min-w-0 text-left" onClick={() => onOpenDetail(task)}>
            <div className={`font-bold text-sm truncate ${task.is_done ? "line-through text-logic-muted" : ""}`}>
              {task.topic}
            </div>
            <div className="text-xs text-logic-muted mt-0.5">
              {task.subject} · {task.duration.toFixed(1)}h
              {task.notes ? ` · ${task.notes}` : ""}
              <span className="text-logic-greenLight"> · Add remarks →</span>
            </div>
          </button>
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
              ACTIVITY_COLORS[task.activity] || "bg-gray-100 text-gray-700"
            }`}
          >
            {ACTIVITY_LABELS[task.activity] || task.activity}
          </span>
        </div>
      ))}
    </div>
  );
}
