import { NavLink, Outlet } from "react-router-dom";

// Common route shell used by every frontend page.
const Layout = () => {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p>Workflow Tracker</p>
          <h1>Task Management Dashboard</h1>
        </div>

        <nav className="app-nav" aria-label="Primary navigation">
          <NavLink to="/" end>
            Tasks
          </NavLink>
          <NavLink to="/new">New Task</NavLink>
        </nav>
      </header>

      <Outlet />
    </main>
  );
};

export default Layout;
