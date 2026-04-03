import { useEffect, useMemo, useState } from "react";

const SPEED_OPTIONS = [
  { label: "0.5x", value: 1600 },
  { label: "1x", value: 1000 },
  { label: "1.5x", value: 700 },
  { label: "2x", value: 450 },
];

function buildStepMetrics(step) {
  return [
    { label: "State", value: step.state },
    { label: "Read", value: step.read_symbols.length ? step.read_symbols.join(", ") : "None" },
    { label: "Write", value: step.write_symbols.length ? step.write_symbols.join(", ") : "None" },
    {
      label: "Directions",
      value: step.directions.length ? step.directions.join(", ") : "None",
    },
    {
      label: "Active tapes",
      value: step.tape_indices.length ? step.tape_indices.join(", ") : "None",
    },
  ];
}

export default function TracePlayer({
  steps = [],
  currentStepIndex = 0,
  onStepChange,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEED_OPTIONS[1].value);

  useEffect(() => {
    setIsPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!isPlaying || steps.length <= 1) {
      return undefined;
    }

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onStepChange?.(Math.min(steps.length - 1, currentStepIndex + 1));
    }, speed);

    return () => window.clearTimeout(timer);
  }, [currentStepIndex, isPlaying, onStepChange, speed, steps.length]);

  const currentStep = steps[currentStepIndex];
  const stepMetrics = useMemo(
    () => (currentStep ? buildStepMetrics(currentStep) : []),
    [currentStep],
  );

  if (!steps.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-700">
        <p>Run a simulation with trace data enabled to use guided playback.</p>
      </div>
    );
  }

  function jumpToFirst() {
    onStepChange?.(0);
    setIsPlaying(false);
  }

  function jumpToLast() {
    onStepChange?.(steps.length - 1);
    setIsPlaying(false);
  }

  function goToPrevious() {
    onStepChange?.(Math.max(0, currentStepIndex - 1));
    setIsPlaying(false);
  }

  function goToNext() {
    onStepChange?.(Math.min(steps.length - 1, currentStepIndex + 1));
    setIsPlaying(false);
  }

  function togglePlayback() {
    if (currentStepIndex >= steps.length - 1) {
      onStepChange?.(0);
    }
    setIsPlaying((current) => !current);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Guided Playback
          </p>
          <h3 className="mt-1 text-xl font-bold text-ink">
            Step {currentStep.step_number} of {steps[steps.length - 1].step_number}
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            Trace index {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-ocean hover:text-ocean"
            onClick={jumpToFirst}
            type="button"
          >
            First
          </button>
          <button
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-ocean hover:text-ocean"
            onClick={goToPrevious}
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded-full bg-ink px-5 py-2 text-sm font-bold text-sand transition hover:bg-ocean"
            onClick={togglePlayback}
            type="button"
          >
            {isPlaying ? "Pause" : "Autoplay"}
          </button>
          <button
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-ocean hover:text-ocean"
            onClick={goToNext}
            type="button"
          >
            Next
          </button>
          <button
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-ocean hover:text-ocean"
            onClick={jumpToLast}
            type="button"
          >
            Last
          </button>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>Speed</span>
            <select
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ocean"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            >
              {SPEED_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stepMetrics.map((metric) => (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={metric.label}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink">{metric.value}</p>
              </div>
            ))}
          </div>

          {currentStep.message ? (
            <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
              {currentStep.message}
            </p>
          ) : null}

          <div className="grid gap-3">
            <h4 className="text-lg font-bold text-ink">Register Values At This Step</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {currentStep.registers.map((value, index) => (
                <div
                  className={`flex items-center justify-between rounded-full px-4 py-3 text-sm shadow-sm transition ${
                    currentStep.tape_indices.includes(index)
                      ? "bg-ocean text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  key={`trace-player-register-${index}`}
                >
                  <span className="font-semibold">R{index}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-bold text-ink">Tape Viewer</h4>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              Active heads highlighted
            </span>
          </div>

          <div className="grid gap-4">
            {currentStep.tapes.map((tape, tapeIndex) => {
              const isActiveTape = currentStep.tape_indices.includes(tapeIndex);
              const headPosition = currentStep.head_positions[tapeIndex];

              return (
                <div
                  className={`rounded-3xl border p-4 transition ${
                    isActiveTape
                      ? "border-ocean bg-sky-50 shadow-md"
                      : "border-slate-200 bg-slate-50"
                  }`}
                  key={`trace-player-tape-${tapeIndex}`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-700">Tape {tapeIndex}</div>
                    <div className="text-sm text-slate-600">Head position: {headPosition}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tape.map((symbol, cellIndex) => {
                      const isHead = cellIndex === headPosition;
                      return (
                        <span
                          className={`min-w-10 rounded-xl px-3 py-2 text-center text-sm font-bold shadow-sm transition ${
                            isHead
                              ? "animate-pulse bg-ink text-sand ring-2 ring-ocean/50"
                              : isActiveTape
                                ? "bg-white text-ink"
                                : "bg-slate-100 text-ink"
                          }`}
                          key={`trace-player-tape-${tapeIndex}-${cellIndex}`}
                        >
                          {symbol}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
