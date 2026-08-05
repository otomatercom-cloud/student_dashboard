export function StatCard({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent: "info" | "danger" | "success" | "warning";
}) {
  const borderColor = {
    info: "border-t-logic-info",
    danger: "border-t-logic-danger",
    success: "border-t-logic-success",
    warning: "border-t-logic-warning",
  }[accent];

  return (
    <div className={`bg-white border border-logic-border ${borderColor} border-t-4 rounded-card p-4`}>
      <div className="text-2xl font-extrabold text-logic-text">{value}</div>
      <div className="text-xs text-logic-muted mt-0.5">{label}</div>
    </div>
  );
}
