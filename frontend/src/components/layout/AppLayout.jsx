import { NavLink } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
          isActive
            ? "bg-ink text-sand shadow-md"
            : "bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/60 bg-white/70 px-5 py-4 shadow-[0_16px_40px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">
            MT TM Counters
          </p>
          <p className="text-sm text-slate-600">
            Specialized educational simulator for fixed counter-machine operations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NavItem to="/">Simulator</NavItem>
          <NavItem to="/about">About</NavItem>
        </div>
      </nav>

      {children}
    </div>
  );
}

