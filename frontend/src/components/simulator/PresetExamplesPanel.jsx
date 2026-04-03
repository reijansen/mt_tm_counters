import { PRESET_EXAMPLES } from "./presetExamples";

function ExampleCard({ example, onLoad }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-sand">
          {example.operation}
        </span>
        <button
          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-ocean hover:text-ocean"
          onClick={() => onLoad(example)}
          type="button"
        >
          Load Example
        </button>
      </div>

      <h4 className="mt-4 text-lg font-bold text-ink">{example.title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-700">{example.description}</p>

      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-900">
          What It Demonstrates
        </p>
        <p className="mt-2 text-sm leading-6 text-sky-900">{example.learningGoal}</p>
      </div>
    </article>
  );
}

export default function PresetExamplesPanel({ onLoadExample }) {
  return (
    <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
          Recommended Demos
        </p>
        <h3 className="mt-1 text-xl font-bold text-ink">Preset Simulation Examples</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Load one-click examples to quickly demonstrate successful runs, rejected
          cases, comparisons, clearing, and copying behavior.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PRESET_EXAMPLES.map((example) => (
          <ExampleCard example={example} key={example.id} onLoad={onLoadExample} />
        ))}
      </div>
    </section>
  );
}
