import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  SlidersHorizontal,
  CalendarDays,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Dashboard from "./components/Dashboard";
import CalendarView from "./components/CalendarView";
import Analytics from "./components/Analytics";

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function createDemoTasks() {
  const today = localDateString();

  return [
    {
      id: "demo-1",
      title: "Practice C++ programming",
      subject: "Programming",
      date: today,
      time: "09:00",
      duration: 60,
      priority: "High",
      notes: "Solve array and string problems.",
      completed: false,
    },
    {
      id: "demo-2",
      title: "Revise DBMS normalization",
      subject: "DBMS",
      date: today,
      time: "11:00",
      duration: 45,
      priority: "Medium",
      notes: "Review 1NF, 2NF, and 3NF.",
      completed: true,
    },
    {
      id: "demo-3",
      title: "Learn React components",
      subject: "Web Development",
      date: today,
      time: "16:00",
      duration: 90,
      priority: "High",
      notes: "Practice props and state.",
      completed: false,
    },
  ];
}

export default function App() {
  const [tasks, setTasks] = useState(() =>
    readStorage("studyflow-tasks", null) ?? createDemoTasks()
  );

  const [dark, setDark] = useState(() =>
    readStorage("studyflow-dark", false)
  );

  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskDate, setNewTaskDate] = useState(
    localDateString()
  );

  useEffect(() => {
    localStorage.setItem("studyflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("studyflow-dark", JSON.stringify(dark));
  }, [dark]);

  function openNewTask(date = localDateString()) {
    setEditingTask(null);
    setNewTaskDate(date);
    setFormOpen(true);
  }

  function openEditTask(task) {
    setEditingTask(task);
    setNewTaskDate(task.date);
    setFormOpen(true);
  }

  function saveTask(taskData) {
    if (editingTask) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...taskData }
            : task
        )
      );
    } else {
      setTasks((previous) => [
        ...previous,
        { ...taskData, id: crypto.randomUUID() },
      ]);
    }

    setFormOpen(false);
    setEditingTask(null);
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          (task.subject || "").toLowerCase().includes(query) ||
          (task.notes || "").toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Completed" && task.completed) ||
          (statusFilter === "Pending" && !task.completed);

        const matchesPriority =
          priorityFilter === "All" ||
          task.priority === priorityFilter;

        return (
          matchesSearch && matchesStatus && matchesPriority
        );
      })
      .sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);

        if (dateComparison !== 0) return dateComparison;

        return a.time.localeCompare(b.time);
      });
  }, [tasks, search, statusFilter, priorityFilter]);

  const pageTitles = {
    dashboard: "Dashboard",
    tasks: "My Tasks",
    calendar: "Calendar",
    analytics: "Analytics",
  };

  return (
    <div className={`app-shell ${dark ? "dark-theme" : ""}`}>
      <Sidebar
        page={page}
        setPage={setPage}
        dark={dark}
        toggleTheme={() => setDark((value) => !value)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="breadcrumb">StudyFlow / </span>
            <strong>{pageTitles[page]}</strong>
          </div>

          <div className="topbar-right">
            <span className="today-label">
              <CalendarDays size={16} />
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            <button
              className="button primary top-add-button"
              onClick={() => openNewTask()}
            >
              <Plus size={17} />
              <span>New task</span>
            </button>
          </div>
        </header>

        {page === "dashboard" && (
          <Dashboard
            tasks={tasks}
            onAdd={() => openNewTask()}
            onToggle={toggleTask}
            onEdit={openEditTask}
            onDelete={deleteTask}
          />
        )}

        {page === "tasks" && (
          <div className="page-content">
            <div className="welcome-row">
              <div>
                <p className="eyebrow">STAY ORGANIZED</p>
                <h1>My Tasks</h1>
                <p className="muted">
                  Manage your study goals and deadlines.
                </p>
              </div>

              <button
                className="button primary"
                onClick={() => openNewTask()}
              >
                <Plus size={18} />
                Add task
              </button>
            </div>

            <section className="panel">
              <div className="filter-toolbar">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    aria-label="Search tasks"
                    placeholder="Search tasks or subjects..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />
                </div>

                <div className="filter-control">
                  <SlidersHorizontal size={17} />

                  <select
                    aria-label="Filter by status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option>All</option>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="filter-control">
                  <select
                    aria-label="Filter by priority"
                    value={priorityFilter}
                    onChange={(event) =>
                      setPriorityFilter(event.target.value)
                    }
                  >
                    <option>All</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="task-list-heading">
                <h2>All study tasks</h2>
                <span className="count-pill">
                  {filteredTasks.length} tasks
                </span>
              </div>

              <TaskList
                tasks={filteredTasks}
                onToggle={toggleTask}
                onEdit={openEditTask}
                onDelete={deleteTask}
              />
            </section>
          </div>
        )}

        {page === "calendar" && (
          <CalendarView
            tasks={tasks}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onAdd={openNewTask}
            onToggle={toggleTask}
            onEdit={openEditTask}
            onDelete={deleteTask}
          />
        )}

        {page === "analytics" && (
          <Analytics tasks={tasks} />
        )}

        <footer className="app-footer">
          <span>StudyFlow</span>
          <span>Plan better. Study smarter.</span>
        </footer>
      </main>

      {formOpen && (
        <TaskForm
          key={editingTask?.id || `new-${newTaskDate}`}
          initialTask={editingTask}
          selectedDate={newTaskDate}
          onSave={saveTask}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}