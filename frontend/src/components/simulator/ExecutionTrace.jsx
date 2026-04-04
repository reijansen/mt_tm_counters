export default function ExecutionTrace({ steps, currentStepIndex = -1, onSelectStep }) {
  if (!steps?.length) {
    return (
      <div className="app-empty">
        <p>No execution trace is available for this run.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {steps.map((step, index) => (
        <article
          className={`grid gap-4 rounded-[1.35rem] border p-4 transition duration-300 hover:-translate-y-0.5 ${
            currentStepIndex === step.step_number - 1
              ? "border-lime-300/30 bg-lime-300/10 shadow-[0_18px_48px_rgba(184,255,90,0.08)]"
              : "border-white/8 bg-white/[0.03]"
          }`}
          key={`step-${index}-${step.step_number}-${step.state}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <strong className="text-zinc-50">Step {step.step_number}</strong>
            <div className="flex flex-wrap items-center gap-2">
              {typeof onSelectStep === "function" ? (
                <button
                  className="app-button-secondary px-3 py-1.5 text-xs uppercase tracking-[0.14em]"
                  onClick={() => onSelectStep(step.step_number - 1)}
                  type="button"
                >
                  Focus
                </button>
              ) : null}
              <span className="app-pill">{step.state}</span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="surface-card-soft p-3">
              <span className="section-label">Read</span>
              <p className="mt-2 text-zinc-100">
                {step.read_symbols.length ? step.read_symbols.join(", ") : "None"}
              </p>
            </div>
            <div className="surface-card-soft p-3">
              <span className="section-label">Write</span>
              <p className="mt-2 text-zinc-100">
                {step.write_symbols.length ? step.write_symbols.join(", ") : "None"}
              </p>
            </div>
            <div className="surface-card-soft p-3">
              <span className="section-label">Directions</span>
              <p className="mt-2 text-zinc-100">
                {step.directions.length ? step.directions.join(", ") : "None"}
              </p>
            </div>
            <div className="surface-card-soft p-3">
              <span className="section-label">Tapes used</span>
              <p className="mt-2 text-zinc-100">
                {step.tape_indices.length ? step.tape_indices.join(", ") : "None"}
              </p>
            </div>
          </div>

          {step.message ? (
            <p className="rounded-[1.35rem] border border-lime-300/12 bg-lime-300/8 px-4 py-3 text-sm font-medium text-lime-100">
              {step.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {step.registers.map((value, registerIndex) => (
              <span
                className="rounded-full border border-white/8 bg-black/25 px-3 py-2 text-sm font-medium text-zinc-300"
                key={`step-${step.step_number}-register-${registerIndex}`}
              >
                R{registerIndex}: <strong className="text-zinc-50">{value}</strong>
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
