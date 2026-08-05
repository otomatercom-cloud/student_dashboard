export function WeeklyChart({ data }: { data: { date: string; completed: number }[] }) {
  const maxHours = Math.max(...data.map((d) => d.completed), 1);

  return (
    <div className="flex items-end gap-2 h-32 pt-2">
      {data.map((d) => {
        const heightPct = Math.min(100, (d.completed / maxHours) * 100);
        const label = new Date(d.date).toLocaleDateString(undefined, { weekday: "short" });
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="w-full max-w-[28px] h-full bg-logic-background rounded-t-md flex flex-col justify-end overflow-hidden">
              <div
                className="w-full bg-gradient-to-t from-logic-greenDark to-logic-greenLight rounded-t-md"
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <div className="text-[10px] text-logic-muted mt-1.5">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
