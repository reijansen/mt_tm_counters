import { useEffect, useRef, useState } from "react";

import SimulationForm from "../components/simulator/SimulationForm";
import SimulationSummary from "../components/simulator/SimulationSummary";
import ExecutionTrace from "../components/simulator/ExecutionTrace";
import TracePlayer from "../components/simulator/TracePlayer";
import OperationGuide from "../components/simulator/OperationGuide";
import InfoTooltip from "../components/ui/InfoTooltip";
import { runSimulation } from "../lib/api";

export default function Simulator({ initialExample, operations }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedStepIndex, setFocusedStepIndex] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState("INC");
  const [hasFreshResult, setHasFreshResult] = useState(false);
  const resultRef = useRef(null);

  async function handleSimulationSubmit(payload) {
    setIsSubmitting(true);
    setError("");
    setHasFreshResult(false);
    try {
      const response = await runSimulation(payload);
      setResult(response);
      setFocusedStepIndex(0);
      setHasFreshResult(true);
    } catch (submissionError) {
      setResult(null);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!hasFreshResult || !resultRef.current) {
      return;
    }

    const offsetTop = resultRef.current.getBoundingClientRect().top + window.scrollY - 128;
    window.scrollTo({ top: Math.max(offsetTop, 0), behavior: "smooth" });
  }, [hasFreshResult]);

  return (
    <div className="grid gap-5">
      <section className="surface-panel p-5 sm:p-6">
        <p className="section-label">Controls</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="app-heading">Simulator Controls</h2>
          <InfoTooltip content="Choose an operation, set the register values, and run the simulation to generate a trace you can inspect step by step." />
        </div>
        {isSubmitting ? (
          <div className="mt-5 rounded-[1.2rem] border border-lime-300/12 bg-lime-300/8 px-4 py-3 text-sm font-medium text-lime-100">
            Running the simulation. The result section will update automatically.
          </div>
        ) : null}
        {result && !isSubmitting ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[1.2rem] border border-white/8 bg-black/25 px-4 py-3 text-sm text-zinc-300">
            <span className="app-pill">
              {result.accepted ? "Accepted" : "Rejected"}
            </span>
            <span>
              <strong className="text-zinc-50">{result.operation}</strong> is ready to review.
            </span>
            <span className="text-zinc-500">Step count: {result.step_count}</span>
          </div>
        ) : null}
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <SimulationForm
            initialValues={initialExample}
            operations={operations}
            isSubmitting={isSubmitting}
            onSubmit={handleSimulationSubmit}
            onOperationChange={setSelectedOperation}
          />
          <OperationGuide operationCode={selectedOperation} />
        </div>
        {error ? (
          <p className="mt-4 rounded-[1.3rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
            {error}
          </p>
        ) : null}
      </section>

      <section className="surface-panel p-5 sm:p-6" ref={resultRef}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="section-label">Results</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="app-heading">Simulation Output</h2>
              <InfoTooltip content="Start with the final outcome, then use playback to review how the tapes, registers, and head positions changed during the run." />
            </div>
          </div>
          {result ? (
            <div className="rounded-[1.2rem] border border-lime-300/14 bg-lime-300/8 px-4 py-3 text-sm text-lime-100">
              <div className="font-semibold">Simulation ready</div>
              <div className="mt-1 text-lime-100/80">
                {result.operation} {result.accepted ? "accepted" : "rejected"} after{" "}
                {result.step_count} step{result.step_count === 1 ? "" : "s"}.
              </div>
            </div>
          ) : null}
        </div>

        <div className="section-rule mt-6">
          <SimulationSummary result={result} />
        </div>

        <div className="section-rule mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-label">Playback</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="app-heading">Step Playback</h2>
                <InfoTooltip content="Use these controls to move through the recorded trace one step at a time. The current-step view highlights the active tapes and head positions." />
              </div>
            </div>
            {result?.steps?.length ? (
              <span className="text-sm text-zinc-500">
                {result.steps.length} recorded step{result.steps.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
          <div className="mt-5">
            <TracePlayer
              currentStepIndex={focusedStepIndex}
              onStepChange={setFocusedStepIndex}
              steps={result?.steps ?? []}
            />
          </div>
        </div>
      </section>

      <section className="surface-panel p-5 sm:p-6">
        <details className="group">
          <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-label">Trace</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="app-heading">Detailed Execution Trace</h2>
                <InfoTooltip content="Open this section when you want a complete step list or need to jump directly to a specific transition in the run." />
              </div>
            </div>
            <span className="text-sm text-zinc-500 transition group-open:rotate-180">
              ^
            </span>
          </summary>
          <div className="mt-5">
            <ExecutionTrace
              currentStepIndex={focusedStepIndex}
              onSelectStep={setFocusedStepIndex}
              steps={result?.steps}
            />
          </div>
        </details>
      </section>
    </div>
  );
}
