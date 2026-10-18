import React from "react";

import Calendar from "react-calendar";
import { Plus, CalendarDays } from "lucide-react";
import TaskList from "./TaskList";

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function CalendarView({
  tasks,
  selectedDate,
  setSelectedDate,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}) {
  const dateString = toDateString(selectedDate);

  const dayTasks = tasks
    .filter((task) => task.date === dateString)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">PLAN AHEAD</p>
          <h1>Study Calendar</h1>
          <p className="muted">
            Select a date to view or organize your study sessions.
          </p>
        </div>

        <button
          className="button primary"
          onClick={() => onAdd(dateString)}
        >
          <Plus size={18} />
          Add to date
        </button>
      </div>

      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="section-heading">
            <div>
              <h2>Monthly calendar</h2>
              <p className="muted">Dots indicate dates with tasks.</p>
            </div>
            <CalendarDays size={22} />
          </div>

          <Calendar
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            tileContent={({ date, view }) => {
              if (view !== "month") return null;

              const hasTasks = tasks.some(
                (task) => task.date === toDateString(date)
              );

              return hasTasks ? (
                <span className="calendar-dot" />
              ) : null;
            }}
          />
        </section>

        <section className="panel selected-day-panel">
          <div className="section-heading">
            <div>
              <h2>
                {selectedDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
              <p className="muted">Your scheduled study sessions</p>
            </div>
            <span className="count-pill">{dayTasks.length} tasks</span>
          </div>

          {dayTasks.length === 0 ? (
            <div className="empty-state compact">
              <CalendarDays size={32} />
              <p>No tasks scheduled for this date.</p>
              <button
                className="button secondary"
                onClick={() => onAdd(dateString)}
              >
                Add a study session
              </button>
            </div>
          ) : (
            <TaskList
              tasks={dayTasks}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </section>
      </div>
    </div>
  );
}