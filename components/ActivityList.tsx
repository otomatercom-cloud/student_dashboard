import type { DashboardData } from "@/lib/types";

export function ActivityList({ activities }: { activities: DashboardData["activities"] }) {
  if (!activities.length) return null;

  // Preserve the order the API already returns (section-ordered, same
  // as the model's own _order) — group consecutive items by section
  // rather than re-sorting.
  const groups: { section: string; items: typeof activities }[] = [];
  for (const a of activities) {
    const last = groups[groups.length - 1];
    if (last && last.section === a.section) {
      last.items.push(a);
    } else {
      groups.push({ section: a.section, items: [a] });
    }
  }

  return (
    <div>
      {groups.map((group) => (
        <div key={group.section} className="mb-4 last:mb-0">
          <div className="font-bold text-sm text-logic-green mb-1.5">{group.section}</div>
          <table className="w-full text-sm">
            <tbody>
              {group.items.map((a) => (
                <tr key={a.id} className="border-b border-logic-border last:border-b-0">
                  <td className="py-1.5">{a.name}</td>
                  <td className="py-1.5 w-24">
                    <span className="text-[11px] bg-gray-100 text-logic-muted px-2 py-0.5 rounded-full">
                      {a.type}
                    </span>
                  </td>
                  <td className="py-1.5 w-20 text-logic-muted text-xs">
                    {a.due_date
                      ? new Date(a.due_date).toLocaleDateString(undefined, { day: "numeric", month: "short" })
                      : "—"}
                  </td>
                  <td className="py-1.5 w-20">
                    {a.is_complete ? (
                      <span className="text-[11px] font-bold bg-green-50 text-logic-success px-2 py-0.5 rounded-full">Done</span>
                    ) : a.is_tracked ? (
                      <span className="text-[11px] font-bold bg-amber-50 text-logic-warning px-2 py-0.5 rounded-full">Pending</span>
                    ) : (
                      <span className="text-[11px] text-logic-muted">—</span>
                    )}
                  </td>
                  <td className="py-1.5 w-16 text-right">
                    <a href={a.moodle_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-logic-greenLight">
                      Open →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
