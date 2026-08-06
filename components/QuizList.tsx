"use client";

import { useState } from "react";
import type { DashboardData } from "@/lib/types";
import { getQuizAttendUrl } from "@/lib/api";

export function QuizList({ quizzes }: { quizzes: DashboardData["quizzes"] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  if (!quizzes.length) return null;

  async function handleAttend(quizId: number) {
    // Open the tab synchronously, in direct response to the click —
    // browsers block window.open() calls made after an await, since
    // it's no longer considered a direct user gesture at that point.
    // Navigate the already-open tab once the real URL comes back.
    const tab = window.open("", "_blank");
    setLoadingId(quizId);
    try {
      const { url } = await getQuizAttendUrl(quizId);
      if (tab) tab.location.href = url;
    } catch {
      if (tab) tab.close();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-logic-muted border-b border-logic-border">
          <th className="pb-2 font-semibold">Quiz</th>
          <th className="pb-2 font-semibold">Status</th>
          <th className="pb-2 font-semibold text-right">Score</th>
          <th className="pb-2"></th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((q) => (
          <tr key={q.id} className="border-b border-logic-border last:border-b-0">
            <td className="py-2">{q.name}</td>
            <td className="py-2">
              {q.has_attempted ? (
                <span className="text-[11px] font-bold bg-green-50 text-logic-success px-2 py-0.5 rounded-full">
                  Completed
                </span>
              ) : (
                <span className="text-[11px] font-bold bg-gray-100 text-logic-muted px-2 py-0.5 rounded-full">
                  Not Attempted
                </span>
              )}
            </td>
            <td className="py-2 text-right">
              {q.has_attempted ? `${q.grade.toFixed(1)}/${q.max_grade.toFixed(0)} (${q.percentage.toFixed(0)}%)` : "—"}
            </td>
            <td className="py-2 text-right">
              {q.moodle_url && (
                <button
                  onClick={() => handleAttend(q.id)}
                  disabled={loadingId === q.id}
                  className="text-xs font-semibold text-logic-greenLight disabled:opacity-50"
                >
                  {loadingId === q.id ? "Opening…" : q.has_attempted ? "↻ Review" : "▶ Attend Quiz"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
