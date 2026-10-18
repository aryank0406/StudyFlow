import React from "react";

import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  ChartNoAxesCombined,
  Sun,
  Moon,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "My Tasks", icon: CheckSquare },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
];

export default function Sidebar({
  page,
  setPage,
  dark,
  toggleTheme,
  collapsed,
  setCollapsed,
}) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={25} />
        </div>

        {!collapsed && (
          <div>
            <h2>StudyFlow</h2>
            <span>STUDENT WORKSPACE</span>
          </div>
        )}
      </div>

      <button
        className="collapse-button"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
        {!collapsed && <span>Collapse menu</span>}
      </button>

      <p className="nav-label">{!collapsed && "WORKSPACE"}</p>

      <nav className="nav-menu">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "active" : ""}`}
            onClick={() => setPage(id)}
            title={collapsed ? label : undefined}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          className="nav-item theme-button"
          onClick={toggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && (
            <span>{dark ? "Light mode" : "Dark mode"}</span>
          )}
        </button>

        {!collapsed && (
          <div className="sidebar-tip">
            <GraduationCap size={22} />
            <strong>Small steps, big results.</strong>
            <p>Your goals are built one study session at a time.</p>
          </div>
        )}
      </div>
    </aside>
  );
}