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
      <header className="surface-panel overflow-hidden px-5 py-7 sm:px-10 sm:py-10">
        <p className="section-label">Simulator Workspace</p>
        <h1 className="page-title max-w-5xl">
          Run counter operations through a <span className="text-lime-300">multitape</span>{" "}
          execution view.
        </h1>
        <p className="page-copy mt-6 max-w-3xl">
          This page stays focused on execution: configure the machine input, run the
          simulation, and inspect the returned trace step by step.
        </p>
        <div className="mt-8 overflow-x-auto">
          <div className="flex min-w-max gap-2 pr-1">
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
