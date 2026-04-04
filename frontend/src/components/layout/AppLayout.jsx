import { NavLink } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
          isActive
            ? "bg-white/[0.06] text-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
            : "text-zinc-400 hover:-translate-y-0.5 hover:text-zinc-100"
        }`
      }
      to={to}
    >
      {children}
    </NavLink>
  );
}

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <div className="sticky top-3 z-50 pb-5">
        <nav className="nav-shell">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-2xl font-black tracking-[-0.08em] text-zinc-50">
              MT
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-100">
                MT TM Counters
              </p>
              <p className="text-xs text-zinc-500">
                Specialized multitape simulator for fixed counter-machine operations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/6 bg-black/20 p-1.5">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/simulator">Simulator</NavItem>
            <NavItem to="/examples">Examples</NavItem>
            <NavItem to="/guide">Guide</NavItem>
            <NavItem to="/about">About</NavItem>
          </div>
        </nav>
      </div>

      <main>{children}</main>

      <footer className="section-rule mt-16 text-sm text-zinc-500">
        <p>&copy; 2026 Rei Jansen Buerom. All rights reserved.</p>
      </footer>
    </div>
  );
}
