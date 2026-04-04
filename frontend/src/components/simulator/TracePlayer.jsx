import { useEffect, useMemo, useState } from "react";
import DropdownSelect from "../ui/DropdownSelect";
import InfoTooltip from "../ui/InfoTooltip";

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

export default function TracePlayer({ steps = [], currentStepIndex = 0, onStepChange }) {
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
      <div className="app-empty">
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
    <div className="grid gap-5">
      <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-3.5 sm:p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-label">Guided Playback</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h3 className="app-subheading">
                Step {currentStep.step_number} of {steps[steps.length - 1].step_number}
              </h3>
              <InfoTooltip content="Use playback to move forward or backward through the recorded trace. The current step is synchronized with the tape viewer and register values below." />
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Trace index {currentStepIndex + 1} of {steps.length}
            </p>
          </div>

          <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <button className="app-button-secondary w-full sm:w-auto" onClick={jumpToFirst} type="button">
              First
            </button>
            <button className="app-button-secondary w-full sm:w-auto" onClick={goToPrevious} type="button">
              Previous
            </button>
            <button className="app-button-primary col-span-2 w-full sm:col-auto sm:w-auto" onClick={togglePlayback} type="button">
              {isPlaying ? "Pause Playback" : "Start Autoplay"}
            </button>
            <button className="app-button-secondary w-full sm:w-auto" onClick={goToNext} type="button">
              Next
            </button>
            <button className="app-button-secondary w-full sm:w-auto" onClick={jumpToLast} type="button">
              Last
            </button>
            </div>
            <div className="grid gap-2 text-sm font-medium text-zinc-300 sm:min-w-[12rem]">
              <span>Playback speed</span>
              <DropdownSelect
                buttonClassName="rounded-full px-3 py-2"
                menuAlign="right"
                onChange={(selectedValue) => setSpeed(Number(selectedValue))}
                options={SPEED_OPTIONS.map((option) => ({
                  value: String(option.value),
                  label: option.label,
                }))}
                value={String(speed)}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-4 rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-3.5 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-5">
          {stepMetrics.map((metric) => (
            <div className="surface-card-soft p-3" key={metric.label}>
              <p className="section-label">{metric.label}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-50">{metric.value}</p>
            </div>
          ))}
        </div>

        {currentStep.message ? (
          <p className="rounded-[1.2rem] border border-lime-300/12 bg-lime-300/8 px-4 py-3 text-sm font-medium text-lime-100">
            {currentStep.message}
          </p>
        ) : null}

        <div className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="app-subheading">Register Values At This Step</h4>
              <InfoTooltip content="These values reflect the machine state at the currently selected step, not only the final result." />
            </div>
            <span className="text-sm text-zinc-500">
              Active tapes are highlighted in lime.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
            {currentStep.registers.map((value, index) => (
              <div
                className={`rounded-2xl border px-3 py-3 text-sm transition ${
                  currentStep.tape_indices.includes(index)
                    ? "border-lime-300/25 bg-lime-300/12 text-lime-100"
                    : "border-white/8 bg-black/25 text-zinc-300"
                }`}
                key={`trace-player-register-${index}`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  R{index}
                </div>
                <div className="mt-1.5 text-base font-semibold text-zinc-50 sm:text-lg">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-rule pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="app-subheading">Tape Viewer</h4>
              <InfoTooltip content="The highlighted cell marks the current head position. Tapes involved in the current transition are emphasized with the lime-accented surface." />
            </div>
            <span className="app-pill">Current heads highlighted</span>
          </div>

          <div className="mt-4 grid gap-3">
            {currentStep.tapes.map((tape, tapeIndex) => {
              const isActiveTape = currentStep.tape_indices.includes(tapeIndex);
              const headPosition = currentStep.head_positions[tapeIndex];

              return (
                <div
                  className={`rounded-[1.15rem] border p-3 transition ${
                    isActiveTape
                      ? "border-lime-300/20 bg-lime-300/8"
                      : "border-white/8 bg-black/25"
                  }`}
                  key={`trace-player-tape-${tapeIndex}`}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-zinc-100">Tape {tapeIndex}</div>
                    <div className="text-sm text-zinc-500">Head position: {headPosition}</div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="flex min-w-max gap-2">
                      {tape.map((symbol, cellIndex) => {
                        const isHead = cellIndex === headPosition;
                        return (
                          <span
                            className={`min-w-8 rounded-xl border px-2.5 py-2 text-center text-sm font-bold transition ${
                              isHead
                                ? "border-lime-300/35 bg-lime-300 text-black"
                                : isActiveTape
                                  ? "border-white/8 bg-white/[0.06] text-zinc-100"
                                  : "border-white/8 bg-white/[0.04] text-zinc-100"
                            }`}
                            key={`trace-player-tape-${tapeIndex}-${cellIndex}`}
                          >
                            {symbol}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
