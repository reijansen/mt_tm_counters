export default function ExecutionTrace({ steps }) {
  if (!steps?.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-700">
        <p>No execution trace is available for this run.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {steps.map((step) => (
        <article
          className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
          key={`step-${step.step_number}-${step.state}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <strong>Step {step.step_number}</strong>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
              {step.state}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                Read
              </span>
              <p className="mt-1 text-slate-800">
                {step.read_symbols.length ? step.read_symbols.join(", ") : "None"}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                Write
              </span>
              <p className="mt-1 text-slate-800">
                {step.write_symbols.length ? step.write_symbols.join(", ") : "None"}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                Directions
              </span>
              <p className="mt-1 text-slate-800">
                {step.directions.length ? step.directions.join(", ") : "None"}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                Tapes used
              </span>
              <p className="mt-1 text-slate-800">
                {step.tape_indices.length ? step.tape_indices.join(", ") : "None"}
              </p>
            </div>
          </div>

          {step.message ? (
            <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
              {step.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {step.registers.map((value, index) => (
              <span
                className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                key={`step-${step.step_number}-register-${index}`}
              >
                R{index}: {value}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
