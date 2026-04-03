import { useState } from "react";

import SimulationForm from "../components/simulator/SimulationForm";
import SimulationSummary from "../components/simulator/SimulationSummary";
import ExecutionTrace from "../components/simulator/ExecutionTrace";
import { runSimulation } from "../lib/api";

export default function Simulator({ operations }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSimulationSubmit(payload) {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await runSimulation(payload);
      setResult(response);
    } catch (submissionError) {
      setResult(null);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
        <h2 className="text-2xl font-bold text-ink">Simulator Controls</h2>
        <p className="mt-2 text-slate-700">
          Select an operation, set the registers, and send the request to the
          FastAPI backend.
        </p>
        <div className="mt-6">
          <SimulationForm
            operations={operations}
            isSubmitting={isSubmitting}
            onSubmit={handleSimulationSubmit}
          />
        </div>
        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        ) : null}
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
        <h2 className="text-2xl font-bold text-ink">Simulation Summary</h2>
        <div className="mt-6">
          <SimulationSummary result={result} />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
        <h2 className="text-2xl font-bold text-ink">Execution Trace</h2>
        <div className="mt-6">
          <ExecutionTrace steps={result?.steps} />
        </div>
      </section>
    </div>
  );
}
