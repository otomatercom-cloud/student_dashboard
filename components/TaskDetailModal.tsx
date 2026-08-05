"use client";

import { useState } from "react";
import type { DashboardTask } from "@/lib/types";
import { updateTask, ApiError } from "@/lib/api";

const CONFIDENCE_OPTIONS = [
  { value: "very_low", label: "Very Low" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "very_high", label: "Very High" },
];

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function TaskDetailModal({
  task,
  onClose,
  onSaved,
}: {
  task: DashboardTask;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [remarks, setRemarks] = useState(task.student_remarks);
  const [confidence, setConfidence] = useState(task.confidence_level);
  const [difficulty, setDifficulty] = useState(task.difficulty_level);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await updateTask(task.id, {
        student_remarks: remarks,
        confidence_level: confidence,
        difficulty_level: difficulty,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-extrabold text-lg mb-1">{task.topic}</h2>
        <p className="text-xs text-logic-muted mb-4">{task.subject}</p>

        {error && (
          <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-logic-danger text-sm px-3 py-2">
            {error}
          </div>
        )}

        <label className="block text-xs font-semibold text-logic-muted mb-1">
          How did it go? (remarks)
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-logic-border px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-logic-greenLight"
          placeholder="e.g. I understand the operators but have doubts on modulus."
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-logic-muted mb-1">My Confidence</label>
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="w-full rounded-lg border border-logic-border px-3 py-2 text-sm"
            >
              <option value="">-- Select --</option>
              {CONFIDENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-logic-muted mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-logic-border px-3 py-2 text-sm"
            >
              <option value="">-- Select --</option>
              {DIFFICULTY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-logic-border">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-logic-green text-white font-bold disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
