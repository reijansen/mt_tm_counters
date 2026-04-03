import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Simulator from "./Simulator";
import useBootstrapData from "../hooks/useBootstrapData";

export default function SimulatorPage() {
  const location = useLocation();
  const { health, operations, pageError } = useBootstrapData();
  const [initialExample, setInitialExample] = useState(location.state?.presetExample ?? null);

  useEffect(() => {
    const presetExample = location.state?.presetExample ?? null;
    setInitialExample(presetExample);

    if (presetExample) {
      window.history.replaceState(window.history.state, document.title, location.pathname);
    }
  }, [location.pathname, location.state]);

  return (
    <div className="grid gap-6">
      <header className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-ocean">
          Simulator Workspace
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Run Counter-Machine Operations Through a Multitape TM Model
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          This page stays focused on execution: configure the machine input, run the
          simulation, and inspect the returned trace step by step.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-ink">Backend Status</h2>
          <p className="mt-3 text-slate-700">{health}</p>
          {pageError ? (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {pageError}
            </p>
          ) : null}
        </section>

        <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-ink">Supported Operations</h2>
          <p className="mt-2 text-slate-700">
            The simulator is specialized for six fixed operations rather than
            arbitrary machine authoring.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {operations.map((operation) => (
              <li
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold tracking-wide text-sand"
                key={operation.code}
              >
                {operation.code}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Simulator initialExample={initialExample} operations={operations} />
    </div>
  );
}
