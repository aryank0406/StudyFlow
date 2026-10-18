import React from "react";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

function emptyTask(date) {
  return {
    title: "",
    subject: "Programming",
    date: date || new Date().toLocaleDateString("en-CA"),
    time: "09:00",
    duration: 60,
    priority: "Medium",
    notes: "",
    completed: false,
  };
}

export default function TaskForm({
  initialTask,
  selectedDate,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(() =>
    initialTask
      ? { ...initialTask }
      : emptyTask(selectedDate)
  );

  useEffect(() => {
    setForm(
      initialTask
        ? { ...initialTask }
        : emptyTask(selectedDate)
    );
  }, [initialTask, selectedDate]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "duration" ? Number(value) : value,
    }));
  }

  function submitForm(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    onSave({
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
      duration: Math.max(1, Number(form.duration) || 1),
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <h2 id="task-form-title">
              {initialTask ? "Edit task" : "Create a study task"}
            </h2>
            <p>Plan your next study session.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submitForm}>
          <label>
            Task title *
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="e.g. Revise DBMS normalization"
              required
              maxLength={120}
              autoFocus
            />
          </label>

          <div className="form-grid">
            <label>
              Subject
              <select
                name="subject"
                value={form.subject}
                onChange={updateField}
              >
                <option>Programming</option>
                <option>Mathematics</option>
                <option>DBMS</option>
                <option>AI / ML</option>
                <option>Web Development</option>
                <option>Electronics</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Priority
              <select
                name="priority"
                value={form.priority}
                onChange={updateField}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>

            <label>
              Study date *
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Start time
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={updateField}
                required
              />
            </label>

            <label className="full-width">
              Duration (minutes)
              <input
                type="number"
                name="duration"
                min="1"
                max="1440"
                value={form.duration}
                onChange={updateField}
                required
              />
            </label>

            <label className="full-width">
              Notes (optional)
              <textarea
                name="notes"
                value={form.notes}
                onChange={updateField}
                placeholder="Topics to cover, chapters, or reminders..."
                rows={3}
                maxLength={1000}
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="button primary">
              {initialTask ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}