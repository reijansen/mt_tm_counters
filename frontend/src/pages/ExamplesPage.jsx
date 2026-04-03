import { Link } from "react-router-dom";

import { PRESET_EXAMPLES } from "../components/simulator/presetExamples";

const FEATURED_OPERATIONS = ["INC", "DEC", "CZ", "CMP", "CLR", "CPY"];

export default function ExamplesPage() {
  return (
    <div className="grid gap-6">
      <header className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-ocean">
          Demo Examples
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Preset Simulations for Classroom and Presentation Use
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          Use these prepared runs to show accepted and rejected behavior quickly,
          compare operations, and jump into the simulator with one click.
        </p>
      </header>

      <div className="grid gap-6">
        {FEATURED_OPERATIONS.map((operation) => {
          const examples = PRESET_EXAMPLES.filter((example) => example.operation === operation);

          return (
            <section
              className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl"
              key={operation}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">
                    Operation
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-ink">{operation}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {examples.length} preset example{examples.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {examples.map((example) => (
                  <article
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                    key={example.id}
                  >
                    <h3 className="text-lg font-bold text-ink">{example.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {example.description}
                    </p>
                    <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <strong className="text-ink">What it demonstrates:</strong>{" "}
                      {example.learningGoal}
                    </p>
                    <Link
                      className="mt-4 inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand transition duration-300 hover:-translate-y-0.5 hover:bg-ocean"
                      state={{ presetExample: example.payload }}
                      to="/simulator"
                    >
                      Load in Simulator
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
