import { Link } from "react-router-dom";

import { PRESET_EXAMPLES } from "../components/simulator/presetExamples";

const FEATURED_OPERATIONS = ["INC", "DEC", "CZ", "CMP", "CLR", "CPY"];
const OPERATION_EXPLANATIONS = {
  INC: {
    name: "Increment",
    summary: "Adds one to a selected register.",
  },
  DEC: {
    name: "Decrement",
    summary: "Subtracts one from a selected register if it is not zero.",
  },
  CZ: {
    name: "Compare to Zero",
    summary: "Checks whether a selected register is zero.",
  },
  CMP: {
    name: "Compare Registers",
    summary: "Checks whether two registers contain the same value.",
  },
  CLR: {
    name: "Clear Register",
    summary: "Erases the contents of a selected register so it becomes zero.",
  },
  CPY: {
    name: "Copy Register",
    summary: "Copies the value from one register into another register.",
  },
};

export default function ExamplesPage() {
  return (
    <div className="grid gap-8">
      <header className="surface-panel px-5 py-7 sm:px-10 sm:py-10">
        <p className="section-label">Demo Examples</p>
        <h1 className="page-title max-w-5xl">
          Curated presets for <span className="text-lime-300">teaching</span>, testing,
          and live demos.
        </h1>
        <p className="page-copy mt-6 max-w-3xl">
          Use these prepared runs to study how each operation behaves, compare
          accepted and rejected outcomes, and open a working example with one click.
        </p>
      </header>

      <div className="grid gap-8">
        {FEATURED_OPERATIONS.map((operation) => {
          const examples = PRESET_EXAMPLES.filter((example) => example.operation === operation);
          const explanation = OPERATION_EXPLANATIONS[operation];

          return (
            <section className="section-rule" key={operation}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="section-label">Operation</p>
                  <h2 className="app-heading mt-3">
                    {operation} <span className="text-zinc-400">/ {explanation.name}</span>
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                    {explanation.summary} The examples below highlight common cases that
                    help learners see what the operation is checking or changing.
                  </p>
                </div>
                <span className="text-sm text-zinc-500">
                  {examples.length} preset example{examples.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {examples.map((example) => (
                  <article
                    className="surface-card flex h-full flex-col justify-between gap-4 transition duration-300 hover:-translate-y-1 hover:border-lime-300/15 hover:bg-white/[0.045]"
                    key={example.id}
                  >
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="app-pill">Example</span>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                          {operation}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold tracking-[-0.02em] text-zinc-50">
                        {example.title}
                      </h3>

                      <p className="text-sm leading-7 text-zinc-400">{example.description}</p>

                      <p className="rounded-[1.2rem] border border-white/8 bg-black/20 px-4 py-3 text-sm leading-7 text-zinc-300">
                        <strong className="text-zinc-50">What you will learn:</strong>{" "}
                        {example.learningGoal}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        className="app-button-primary w-full sm:w-auto"
                        state={{ presetExample: example.payload }}
                        to="/simulator"
                      >
                        Load in Simulator
                      </Link>
                    </div>
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
