"use client";

import { useState } from "react";
import type { DashboardData } from "@/lib/types";
import { createDoubt, ApiError } from "@/lib/api";

export function DoubtsPanel({
  doubts,
  onCreated,
}: {
  doubts: DashboardData["doubts"];
  onCreated: () => void;
}) {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createDoubt({ description: description.trim() });
      setDescription("");
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const statusStyle: Record<string, string> = {
    open: "bg-gray-100 text-logic-muted",
    in_progress: "bg-amber-50 text-amber-800",
    resolved: "bg-green-50 text-logic-success",
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Ask your mentor anything you're stuck on…"
          className="w-full rounded-lg border border-logic-border px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-logic-greenLight"
        />
        {error && <div className="text-xs text-logic-danger mb-2">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="text-xs font-bold bg-logic-green text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit Doubt"}
        </button>
      </form>

      {doubts.length === 0 ? (
        <div className="text-sm text-logic-muted text-center py-4">No doubts raised yet.</div>
      ) : (
        <div className="space-y-3">
          {doubts.map((d) => (
            <div key={d.id} className="border border-logic-border rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm flex-1">{d.description}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[d.status] || ""}`}>
                  {d.status.replace("_", " ")}
                </span>
              </div>
              {d.mentor_reply && (
                <div className="mt-2 text-xs bg-green-50 rounded-lg px-3 py-2">
                  <strong>Mentor reply:</strong> {d.mentor_reply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
