import React from "react";

import {
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
  Circle,
  CircleCheck,
  BookOpen,
} from "lucide-react";

function formatDate(dateString) {
  if (!dateString) return "No date";

  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <BookOpen size={35} />
        <h3>No tasks found</h3>
        <p>Add a new task or change your filters.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article
          className={`task-card ${task.completed ? "is-complete" : ""}`}
          key={task.id}
        >
          <button
            className="complete-button"
            onClick={() => onToggle(task.id)}
            aria-label={
              task.completed ? "Mark pending" : "Mark completed"
            }
            title={task.completed ? "Mark pending" : "Complete task"}
          >
            {task.completed ? (
              <CircleCheck size={23} />
            ) : (
              <Circle size={23} />
            )}
          </button>

          <div className="task-main">
            <h3>{task.title}</h3>

            {task.notes && <p className="task-notes">{task.notes}</p>}

            <div className="task-meta">
              <span>
                <BookOpen size={14} />
                {task.subject}
              </span>

              <span>
                <CalendarDays size={14} />
                {formatDate(task.date)}
              </span>

              <span>
                <Clock3 size={14} />
                {task.time} · {task.duration} min
              </span>
            </div>
          </div>

          <div className="task-side">
            <span className={`priority priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>

            <span
              className={`status-label ${
                task.completed ? "status-complete" : "status-pending"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>

            <div className="task-actions">
              <button
                className="icon-button"
                onClick={() => onEdit(task)}
                aria-label={`Edit ${task.title}`}
                title="Edit"
              >
                <Pencil size={16} />
              </button>

              <button
                className="icon-button delete-button"
                onClick={() => {
                  if (
                    window.confirm(`Delete "${task.title}"?`)
                  ) {
                    onDelete(task.id);
                  }
                }}
                aria-label={`Delete ${task.title}`}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}