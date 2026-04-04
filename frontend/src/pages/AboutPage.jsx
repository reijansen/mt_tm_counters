import { ACADEMIC_ITEMS, LIMITATION_ITEMS } from "../lib/projectData";

function SectionBlock({ title, children }) {
  return (
    <section className="section-rule first:border-t-0 first:pt-0">
      <h2 className="app-heading">{title}</h2>
      <div className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="grid gap-10">
      <header className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
        <div>
          <p className="section-label">Academic Project Profile</p>
          <h1 className="page-title mt-4 max-w-5xl">
            About this <span className="text-lime-300">specialized simulator</span>
          </h1>
        <p className="page-copy mt-6 max-w-3xl">
          This simulator began as an academic project and is now presented as a
          learning resource for exploring how counter-machine operations can be
          represented and observed through a multitape Turing machine model.
        </p>
        </div>

        <aside className="surface-card">
          <p className="section-label">At A Glance</p>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-zinc-300 sm:text-base">
            <p>
              <strong className="text-zinc-50">Developer:</strong> Rei Jansen Buerom
            </p>
            <p>
              <strong className="text-zinc-50">Course:</strong> CMSC 141 - Automata and
              Language Theory
            </p>
            <p>
              <strong className="text-zinc-50">Program:</strong> Bachelor of Science in
              Computer Science
            </p>
            <p>
              <strong className="text-zinc-50">Institution:</strong> University of the
              Philippines Visayas
            </p>
          </div>
        </aside>
      </header>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        <div className="grid gap-10">
        <SectionBlock title="Project Overview">
          <p>
            The simulator focuses on a fixed set of counter-machine operations and
            shows how each one can be interpreted through a multitape Turing machine.
            Instead of presenting the idea only in theory, it lets learners inspect
            the process through structured traces, register views, tape snapshots, and
            guided playback.
          </p>
        </SectionBlock>

        <SectionBlock title="Purpose">
          <p>
            The project was created to make core ideas in automata and formal
            computation easier to understand. By connecting familiar register
            operations to a multitape Turing machine interpretation, it turns an
            abstract topic into something learners can examine step by step.
          </p>
        </SectionBlock>

        <SectionBlock title="Educational Value">
          <p>
            The simulator is intended to support classroom explanation, self-study,
            and guided review. It helps learners follow transitions, head movement,
            tape contents, and final outcomes in a format that is easier to read than
            static traces alone.
          </p>
        </SectionBlock>

          <SectionBlock title="Scope And Limitations">
            <ul className="grid gap-2 pl-5">
              {LIMITATION_ITEMS.map((item) => (
                <li className="list-disc text-zinc-300 marker:text-lime-300" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </SectionBlock>
        </div>

        <aside className="section-rule xl:border-t-0 xl:pt-0">
          <h2 className="app-heading">Academic Context</h2>
          <div className="mt-4 grid gap-2 text-sm leading-7 text-zinc-400 sm:text-base">
            {ACADEMIC_ITEMS.map((item) => (
              <p key={item.label}>
                <strong className="text-zinc-50">{item.label}:</strong> {item.value}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
