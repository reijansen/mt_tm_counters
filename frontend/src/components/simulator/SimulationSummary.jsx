function formatOutcome(accepted) {
  return accepted ? "Accepted" : "Rejected";
}

function SummaryCard({ label, value, tone = "default" }) {
  const valueClassName =
    tone === "success"
      ? "text-lime-300"
      : tone === "danger"
        ? "text-red-300"
        : "text-zinc-50";

  return (
    <div className="surface-card-soft p-3.5">
      <span className="section-label">{label}</span>
      <div className={`mt-2 text-base font-bold tracking-[-0.02em] ${valueClassName}`}>{value}</div>
    </div>
  );
}

export default function SimulationSummary({ result }) {
  if (!result) {
    return (
      <div className="app-empty">
        <p>Run a simulation to see the machine result, tapes, and final register values.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Operation" value={result.operation} />
        <SummaryCard
          label="Outcome"
          value={formatOutcome(result.accepted)}
          tone={result.accepted ? "success" : "danger"}
        />
        <SummaryCard label="Halted state" value={result.halted_state} />
        <SummaryCard label="Step count" value={result.step_count} />
      </div>

      {result.message ? (
        <p className="rounded-[1.35rem] border border-lime-300/12 bg-lime-300/8 px-4 py-3 text-sm font-medium text-lime-100">
          {result.message}
        </p>
      ) : null}

      <div className="grid gap-3">
        <h3 className="app-subheading">Final Registers</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
          {result.registers.map((value, index) => (
            <div
              className="rounded-2xl border border-white/8 bg-black/25 px-3 py-3 text-sm text-zinc-200"
              key={`final-register-${index}`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Register {index}
              </div>
              <strong className="mt-2 block text-lg text-zinc-50">{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <h3 className="app-subheading">Head Positions</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
          {result.head_positions.map((value, index) => (
            <div
              className="rounded-2xl border border-white/8 bg-black/25 px-3 py-3 text-sm text-zinc-200"
              key={`head-position-${index}`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Tape {index}
              </div>
              <strong className="mt-2 block text-lg text-zinc-50">{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <h3 className="app-subheading">Tape Snapshots</h3>
        <div className="grid gap-4">
          {result.tapes.map((tape, index) => (
            <div className="surface-card-soft grid gap-3 p-3.5" key={`final-tape-${index}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-zinc-100">Tape {index}</div>
                <div className="text-sm text-zinc-500">
                  Head position: {result.head_positions[index]}
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="flex min-w-max gap-2">
                  {tape.map((symbol, cellIndex) => (
                    <span
                      className={`min-w-8 rounded-xl border px-2.5 py-2 text-center text-sm font-bold transition duration-300 ${
                        cellIndex === result.head_positions[index]
                          ? "border-lime-300/30 bg-lime-300 text-black"
                          : "border-white/8 bg-white/[0.04] text-zinc-100"
                      }`}
                      key={`final-tape-${index}-cell-${cellIndex}`}
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
