import { Link } from "react-router-dom";

import { PRESET_EXAMPLES } from "../components/simulator/presetExamples";
import useBootstrapData from "../hooks/useBootstrapData";

export default function HomePage() {
  const { operations, projectInfo } = useBootstrapData();
  const featuredExamples = PRESET_EXAMPLES.slice(0, 3);

  return (
    <div className="grid gap-8">
      <header className="surface-panel overflow-hidden px-5 py-7 sm:px-10 sm:py-10">
        <p className="section-label">
          Home
        </p>
        <div className="mt-6 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div>
            <h1 className="page-title max-w-5xl">
              Explore <span className="text-lime-300">Counter-Machine</span> Operations.
            </h1>
            <p className="page-copy mt-6 max-w-3xl">
              This web app presents a multitape Turing machine with counter-machine
              operations, allowing learners to study the model through structured
              traces, guided playback, and carefully chosen examples.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <p className="section-label">Supported Operations</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {operations.map((operation) => (
                  <span className="app-chip" key={operation.code}>
                    {operation.code}
                  </span>
                ))}
              </div>
            </div>
            <div className="section-rule">
              <p className="text-sm leading-7 text-zinc-400">
                Use the simulator to see how each operation changes register values,
                tape contents, head positions, and final outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            className="app-button-primary w-full sm:w-auto"
            to="/simulator"
          >
            Open Simulator
          </Link>
          <Link
            className="app-button-secondary w-full sm:w-auto"
            to="/examples"
          >
            Browse Examples
          </Link>
          <Link
            className="app-button-secondary w-full sm:w-auto"
            to="/about"
          >
            About The Project
          </Link>
        </div>
      </header>

      <section className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <article>
          <p className="section-label">What You Can Explore</p>
          <h2 className="app-heading mt-3">A focused view of six core operations</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            This resource is centered on understanding how increment, decrement,
            zero-checking, comparison, clearing, and copying behave when represented
            on tapes. It is meant to support conceptual understanding rather than
            unrestricted machine construction.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-300">
            <span>Structured traces</span>
            <span>Step playback</span>
            <span>Preset demonstrations</span>
          </div>
        </article>

        <article className="section-rule xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
          <p className="section-label">
            Academic Context
          </p>
          <h2 className="app-heading mt-3">
            {projectInfo?.course ?? "CMSC 141 - Automata and Language Theory"}
          </h2>
          <div className="mt-5 grid gap-2 text-sm leading-7 text-zinc-400 sm:text-base">
            <p>
              <strong className="text-zinc-50">Developer:</strong>{" "}
              {projectInfo?.developer ?? "Rei Jansen Buerom"}
            </p>
            <p>
              <strong className="text-zinc-50">Program:</strong>{" "}
              {projectInfo?.program ?? "Bachelor of Science in Computer Science"}
            </p>
            <p>
              <strong className="text-zinc-50">University:</strong>{" "}
              {projectInfo?.university ?? "University of the Philippines Visayas"}
            </p>
          </div>
        </article>
      </section>

      <section className="section-rule">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">
              Featured Demos
            </p>
            <h2 className="app-heading mt-3">Start with a strong example</h2>
          </div>
          <Link
            className="app-button-secondary w-full sm:w-auto"
            to="/examples"
          >
            View All Examples
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredExamples.map((example) => (
            <article
              className="border-b border-white/8 pb-6 last:border-b-0 lg:border-b-0 lg:pb-0"
              key={example.id}
            >
              <p className="section-label">
                {example.operation}
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-[-0.02em] text-zinc-50">
                {example.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {example.learningGoal}
              </p>
              <Link
                className="app-button-primary mt-5"
                state={{ presetExample: example.payload }}
                to="/simulator"
              >
                Load in Simulator
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
