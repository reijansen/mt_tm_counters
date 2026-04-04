import { useState } from "react";
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  function closeMobileNav() {
    setIsMobileNavOpen(false);
  }

  return (
    <div className="app-shell">
      <div className="sticky top-2 z-50 pb-4 sm:top-3 sm:pb-5">
        <nav className="nav-shell relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-2xl font-black tracking-[-0.08em] text-zinc-50 sm:h-12 sm:w-12">
                MT
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.16em] text-zinc-100 sm:tracking-[0.18em]">
                  MT TM Counters
                </p>
                <p className="hidden text-xs text-zinc-500 sm:block">
                  Specialized multitape simulator for fixed counter-machine operations
                </p>
              </div>
            </div>

            <button
              aria-expanded={isMobileNavOpen}
              aria-label="Toggle navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-black/20 text-zinc-100 transition hover:border-lime-300/35 hover:text-lime-200 sm:hidden"
              onClick={() => setIsMobileNavOpen((current) => !current)}
              type="button"
            >
              <span className="text-lg">{isMobileNavOpen ? "x" : "="}</span>
            </button>
          </div>

          <div className="hidden overflow-x-auto sm:block sm:w-auto">
            <div className="flex min-w-max items-center gap-2 rounded-full border border-white/6 bg-black/20 p-1.5">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/simulator">Simulator</NavItem>
              <NavItem to="/examples">Examples</NavItem>
              <NavItem to="/guide">Guide</NavItem>
              <NavItem to="/about">About</NavItem>
            </div>
          </div>

          {isMobileNavOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] grid min-w-[15rem] gap-2 rounded-[1.35rem] border border-white/8 bg-[#101217]/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:hidden">
              <NavLink className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.05]" onClick={closeMobileNav} to="/">
                Home
              </NavLink>
              <NavLink className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.05]" onClick={closeMobileNav} to="/simulator">
                Simulator
              </NavLink>
              <NavLink className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.05]" onClick={closeMobileNav} to="/examples">
                Examples
              </NavLink>
              <NavLink className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.05]" onClick={closeMobileNav} to="/guide">
                Guide
              </NavLink>
              <NavLink className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.05]" onClick={closeMobileNav} to="/about">
                About
              </NavLink>
            </div>
          ) : null}
        </nav>
      </div>

      <main>{children}</main>

      <footer className="section-rule mt-16 text-sm text-zinc-500">
        <p>&copy; 2026 Rei Jansen Buerom. All rights reserved.</p>
      </footer>
    </div>
  );
}
