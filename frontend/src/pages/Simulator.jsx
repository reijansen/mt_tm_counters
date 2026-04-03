import { useState } from "react";

import SimulationForm from "../components/simulator/SimulationForm";
import SimulationSummary from "../components/simulator/SimulationSummary";
import ExecutionTrace from "../components/simulator/ExecutionTrace";
import TracePlayer from "../components/simulator/TracePlayer";
import OperationGuide from "../components/simulator/OperationGuide";
import SimulatorLegend from "../components/simulator/SimulatorLegend";
import { runSimulation } from "../lib/api";

export default function Simulator({ operations }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedStepIndex, setFocusedStepIndex] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState("INC");

  async function handleSimulationSubmit(payload) {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await runSimulation(payload);
      setResult(response);
      setFocusedStepIndex(0);
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
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <SimulationForm
            operations={operations}
            isSubmitting={isSubmitting}
            onSubmit={handleSimulationSubmit}
            onOperationChange={setSelectedOperation}
          />
          <OperationGuide operationCode={selectedOperation} />
        </div>
        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        ) : null}
      </section>

      <SimulatorLegend />

      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
        <h2 className="text-2xl font-bold text-ink">Simulation Summary</h2>
        <div className="mt-6">
          <SimulationSummary result={result} />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
        <h2 className="text-2xl font-bold text-ink">Step Playback</h2>
        <p className="mt-2 text-slate-700">
          Navigate the returned trace step by step. Playback is driven entirely by
          backend-returned snapshots, without a live backend stepping session.
        </p>
        <div className="mt-6">
          <TracePlayer
            currentStepIndex={focusedStepIndex}
            onStepChange={setFocusedStepIndex}
            steps={result?.steps ?? []}
          />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
        <h2 className="text-2xl font-bold text-ink">Execution Trace</h2>
        <p className="mt-2 text-slate-700">
          Use the list below to inspect every transition and jump directly to a
          specific trace step.
        </p>
        <div className="mt-6">
          <ExecutionTrace
            currentStepIndex={focusedStepIndex}
            onSelectStep={setFocusedStepIndex}
            steps={result?.steps}
          />
        </div>
      </section>
    </div>
  );
}
