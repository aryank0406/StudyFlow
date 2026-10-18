import React from "react";

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import TaskList from "./TaskList";

export default function Dashboard({
  tasks,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}) {
  const today = new Date().toLocaleDateString("en-CA");

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  const todayTasks = tasks
    .filter((task) => task.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const chartData = [
    { name: "Completed", value: completed, color: "#16a34a" },
    { name: "Pending", value: pending, color: "#e5e7eb" },
  ];

  const cards = [
    {
      label: "Total tasks",
      value: total,
      icon: ListTodo,
      color: "purple",
      note: "All study tasks",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "green",
      note: "Tasks finished",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      color: "orange",
      note: "Tasks to complete",
    },
    {
      label: "Progress",
      value: `${progress}%`,
      icon: TrendingUp,
      color: "blue",
      note: "Overall completion",
    },
  ];

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">YOUR PERSONAL STUDY SPACE</p>
          <h1>Dashboard</h1>
          <p className="muted">
            Small steps every day lead to big achievements.
          </p>
        </div>

        <button className="button primary" onClick={onAdd}>
          <Plus size={18} />
          Add new task
        </button>
      </div>

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, color, note }) => (
          <div className="stat-card" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <span className={`stat-icon ${color}`}>
                <Icon size={21} />
              </span>
            </div>

            <strong className="stat-value">{value}</strong>
            <span className="stat-note">{note}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel progress-panel">
          <div className="section-heading">
            <div>
              <h2>Task completion</h2>
              <p className="muted">Your overall study progress</p>
            </div>
          </div>

          {total === 0 ? (
            <div className="empty-state compact">
              <p>Add your first task to start tracking progress.</p>
            </div>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {chartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="chart-center">
                <strong>{progress}%</strong>
                <span>Completed</span>
              </div>
            </div>
          )}

          <div className="chart-legend">
            <span>
              <i className="legend-dot green-dot" /> Completed: {completed}
            </span>
            <span>
              <i className="legend-dot gray-dot" /> Pending: {pending}
            </span>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Today's plan</h2>
              <p className="muted">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            <span className="count-pill">{todayTasks.length} tasks</span>
          </div>

          {todayTasks.length === 0 ? (
            <div className="empty-state compact">
              <Clock3 size={30} />
              <p>No study sessions scheduled for today.</p>
              <button
                className="button secondary"
                onClick={onAdd}
              >
                Plan your day
              </button>
            </div>
          ) : (
            <TaskList
              tasks={todayTasks}
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