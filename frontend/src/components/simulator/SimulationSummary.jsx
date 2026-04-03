function formatOutcome(accepted) {
  return accepted ? "Accepted" : "Rejected";
}

export default function SimulationSummary({ result }) {
  if (!result) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-700">
        <p>Run a simulation to see the machine result, tapes, and final register values.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Operation
          </span>
          <div className="mt-1 font-bold text-ink">{result.operation}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Outcome
          </span>
          <div className={`mt-1 font-bold ${result.accepted ? "text-green-700" : "text-red-700"}`}>
            {formatOutcome(result.accepted)}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Halted state
          </span>
          <div className="mt-1 font-bold text-ink">{result.halted_state}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Step count
          </span>
          <div className="mt-1 font-bold text-ink">{result.step_count}</div>
        </div>
      </div>

      {result.message ? (
        <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
          {result.message}
        </p>
      ) : null}

      <div className="grid gap-3">
        <h3 className="text-lg font-bold text-ink">Final Registers</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {result.registers.map((value, index) => (
            <div
              className="flex items-center justify-between rounded-full bg-slate-100 px-4 py-3 text-sm shadow-sm"
              key={`final-register-${index}`}
            >
              <span className="font-semibold text-slate-700">R{index}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <h3 className="text-lg font-bold text-ink">Head Positions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {result.head_positions.map((value, index) => (
            <div
              className="flex items-center justify-between rounded-full bg-slate-100 px-4 py-3 text-sm shadow-sm"
              key={`head-position-${index}`}
            >
              <span className="font-semibold text-slate-700">Tape {index}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <h3 className="text-lg font-bold text-ink">Tape Snapshots</h3>
        <div className="grid gap-4">
          {result.tapes.map((tape, index) => (
            <div className="grid gap-2" key={`final-tape-${index}`}>
              <div className="font-semibold text-slate-700">Tape {index}</div>
              <div className="flex flex-wrap gap-2">
                {tape.map((symbol, cellIndex) => (
                  <span
                    className={`min-w-9 rounded-xl px-3 py-2 text-center text-sm font-bold shadow-sm transition duration-300 ${
                      cellIndex === result.head_positions[index]
                        ? "bg-ink text-sand animate-pulse"
                        : "bg-slate-100 text-ink"
                    }`}
                    key={`final-tape-${index}-cell-${cellIndex}`}
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
