import type { DashboardData } from "@/lib/types";

export function QuizList({ quizzes }: { quizzes: DashboardData["quizzes"] }) {
  if (!quizzes.length) return null;

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
                <a
                  href={q.moodle_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-logic-greenLight"
                >
                  {q.has_attempted ? "↻ Review" : "▶ Attend Quiz"}
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
