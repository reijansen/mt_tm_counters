import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Simulator from "./Simulator";
import useBootstrapData from "../hooks/useBootstrapData";

export default function SimulatorPage() {
  const location = useLocation();
  const { operations } = useBootstrapData();
  const [initialExample, setInitialExample] = useState(location.state?.presetExample ?? null);

  useEffect(() => {
    const presetExample = location.state?.presetExample ?? null;
    setInitialExample(presetExample);

    if (presetExample) {
      window.history.replaceState(window.history.state, document.title, location.pathname);
    }
  }, [location.pathname, location.state]);

  return (
    <div className="grid gap-8">
      <header className="surface-panel min-w-0 overflow-hidden px-4 py-6 sm:px-10 sm:py-10">
        <p className="section-label">Simulator Workspace</p>
        <h1 className="max-w-4xl text-[2.05rem] leading-[1.08] font-black tracking-[-0.04em] text-zinc-50 sm:text-5xl sm:leading-[1.02] sm:tracking-[-0.05em] lg:text-7xl">
          Run counter operations through a <span className="text-lime-300">multitape</span>{" "}
          execution view.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-8 text-zinc-400 sm:text-lg sm:leading-8">
          This page stays focused on execution: configure the machine input, run the
          simulation, and inspect the returned trace step by step.
        </p>
        <div className="mt-7">
          <div className="flex flex-wrap gap-2">
            {operations.map((operation) => (
              <span className="app-chip" key={operation.code}>
                {operation.code}
              </span>
            ))}
          </div>
        </div>
      </header>

      <Simulator initialExample={initialExample} operations={operations} />
    </div>
  );
}
