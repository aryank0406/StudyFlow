import React from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Analytics({ tasks }) {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const subjects = [
    ...new Set(tasks.map((task) => task.subject || "Other")),
  ];

  const subjectData = subjects.map((subject) => {
    const subjectTasks = tasks.filter(
      (task) => task.subject === subject
    );

    return {
      subject,
      completed: subjectTasks.filter((task) => task.completed).length,
      pending: subjectTasks.filter((task) => !task.completed).length,
    };
  });

  const priorities = ["High", "Medium", "Low"].map((priority) => ({
    name: priority,
    value: tasks.filter((task) => task.priority === priority).length,
  }));

  const priorityColors = ["#ef4444", "#f59e0b", "#16a34a"];

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">MEASURE YOUR GROWTH</p>
          <h1>Study Analytics</h1>
          <p className="muted">
            Understand your task completion and study priorities.
          </p>
        </div>
      </div>

      <div className="stats-grid analytics-stats">
        <div className="stat-card">
          <span className="stat-note">Total tasks</span>
          <strong className="stat-value">{tasks.length}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-note">Completed</span>
          <strong className="stat-value">{completed}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-note">Pending</span>
          <strong className="stat-value">{pending}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-note">Completion rate</span>
          <strong className="stat-value">{progress}%</strong>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Subject-wise progress</h2>
              <p className="muted">Completed versus pending tasks</p>
            </div>
          </div>

          {subjectData.length === 0 ? (
            <div className="empty-state compact">
              Add tasks to see subject-wise progress.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={subjectData}
                margin={{ top: 10, right: 10, left: 0, bottom: 35 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="subject"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={65}
                  fontSize={11}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  name="Pending"
                  fill="#8b83f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Priority distribution</h2>
              <p className="muted">Tasks by priority level</p>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state compact">
              Add tasks to see priority distribution.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={priorities}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  label
                >
                  {priorities.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={priorityColors[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </div>
  );
}