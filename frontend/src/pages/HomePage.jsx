import { Link } from "react-router-dom";

import { PRESET_EXAMPLES } from "../components/simulator/presetExamples";
import useBootstrapData from "../hooks/useBootstrapData";

export default function HomePage() {
  const { health, operations, projectInfo, pageError } = useBootstrapData();
  const featuredExamples = PRESET_EXAMPLES.slice(0, 3);

  return (
    <div className="grid gap-6">
      <header className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-ocean">
          Home
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Multitape Turing Machine Counter Simulator
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          A specialized educational web app for exploring fixed counter-machine
          operations through a multitape Turing machine model, with browser-based
          simulation, guided playback, and presentation-ready examples.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand transition duration-300 hover:-translate-y-0.5 hover:bg-ocean"
            to="/simulator"
          >
            Open Simulator
          </Link>
          <Link
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
            to="/examples"
          >
            Browse Examples
          </Link>
          <Link
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
            to="/about"
          >
            About The Project
          </Link>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">
            Project Snapshot
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Focused, Academic, and Demo-Ready</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            The app supports six fixed operations only: INC, DEC, CZ, CMP, CLR, and
            CPY. It is designed to visualize execution traces and tape behavior
            clearly, not to act as a general-purpose Turing machine editor.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {operations.map((operation) => (
              <span
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold tracking-wide text-sand"
                key={operation.code}
              >
                {operation.code}
              </span>
            ))}
          </div>
          <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong className="text-ink">Backend status:</strong> {health}
          </p>
          {pageError ? (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {pageError}
            </p>
          ) : null}
        </article>

        <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">
            Academic Context
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">
            {projectInfo?.course ?? "CMSC 141 - Automata and Language Theory"}
          </h2>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700 sm:text-base">
            <p>
              <strong className="text-ink">Developer:</strong>{" "}
              {projectInfo?.developer ?? "Rei Jansen Buerom"}
            </p>
            <p>
              <strong className="text-ink">Program:</strong>{" "}
              {projectInfo?.program ?? "Bachelor of Science in Computer Science"}
            </p>
            <p>
              <strong className="text-ink">Division:</strong>{" "}
              {projectInfo?.division ?? "Division of Physical Sciences and Mathematics"}
            </p>
            <p>
              <strong className="text-ink">College:</strong>{" "}
              {projectInfo?.college ?? "College of Arts and Sciences"}
            </p>
            <p>
              <strong className="text-ink">University:</strong>{" "}
              {projectInfo?.university ?? "University of the Philippines Visayas"}
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">
              Featured Demos
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Start With a Strong Example</h2>
          </div>
          <Link
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50"
            to="/examples"
          >
            View All Examples
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {featuredExamples.map((example) => (
            <article
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
              key={example.id}
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean">
                {example.operation}
              </p>
              <h3 className="mt-2 text-lg font-bold text-ink">{example.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{example.description}</p>
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
    </div>
  );
}
