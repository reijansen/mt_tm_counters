import { useEffect, useState } from "react";

import Simulator from "./Simulator";
import { fetchHealth, fetchOperations, fetchProjectInfo } from "../lib/api";

export default function HomePage() {
  const [health, setHealth] = useState("Loading backend status...");
  const [operations, setOperations] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    async function loadBootstrapData() {
      try {
        const [healthData, operationsData, projectData] = await Promise.all([
          fetchHealth(),
          fetchOperations(),
          fetchProjectInfo(),
        ]);

        setHealth(healthData.message);
        setOperations(operationsData.operations);
        setProjectInfo(projectData);
      } catch (error) {
        setPageError("Backend is unreachable. Start FastAPI on port 8000.");
        setHealth("Backend is unreachable. Start FastAPI on port 8000.");
      }
    }

    loadBootstrapData();
  }, []);

  return (
    <div className="grid gap-6">
      <header className="mb-8 rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-ocean">
          Simulator Workspace
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Multitape Turing Machine Counter Simulator
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          This interface sends simulator requests to the FastAPI backend and renders
          the returned execution trace for browser-based exploration.
        </p>
      </header>

      <main className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
            <h2 className="text-2xl font-bold text-ink">Backend Status</h2>
            <p className="mt-3 text-slate-700">{health}</p>
            {pageError ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {pageError}
              </p>
            ) : null}
          </section>

          <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
            <h2 className="text-2xl font-bold text-ink">Available Operations</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {operations.map((operation) => (
                <li
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold tracking-wide text-sand transition duration-300 hover:scale-105"
                  key={operation.code}
                >
                  {operation.code}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Simulator operations={operations} />
      </main>
    </div>
  );
}
