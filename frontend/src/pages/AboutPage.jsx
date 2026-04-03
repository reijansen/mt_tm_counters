const limitationItems = [
  "The simulator supports only fixed built-in operations: INC, DEC, CZ, CMP, CLR, and CPY.",
  "It is not a general-purpose Turing machine editor or arbitrary state-machine authoring tool.",
  "It uses binary tape encoding to represent register values.",
  "It is designed for instructional and demonstrative use rather than unrestricted machine construction.",
];

const academicItems = [
  { label: "Developer", value: "Rei Jansen Buerom" },
  { label: "Course", value: "CMSC 141 - Automata and Language Theory" },
  { label: "Program", value: "Bachelor of Science in Computer Science" },
  { label: "Division", value: "Division of Physical Sciences and Mathematics" },
  { label: "College", value: "College of Arts and Sciences" },
  { label: "University", value: "University of the Philippines Visayas" },
];

function InfoCard({ title, children }) {
  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="grid gap-6">
      <header className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-ocean">
          Academic Project Profile
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
          About This Simulator
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          This web application presents a specialized educational simulator for a
          multitape Turing machine with counter-machine style operations, designed to
          support academic explanation, demonstration, and guided exploration.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <InfoCard title="Project Overview">
          <p>
            The simulator visualizes how selected counter-machine operations can be
            interpreted through a multitape Turing machine model. It focuses on a
            fixed set of supported operations and presents their execution through
            structured traces, register views, tape snapshots, and guided playback.
          </p>
        </InfoCard>

        <InfoCard title="Academic Context">
          <div className="grid gap-3">
            {academicItems.map((item) => (
              <p key={item.label}>
                <strong className="text-ink">{item.label}:</strong> {item.value}
              </p>
            ))}
          </div>
        </InfoCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard title="Purpose">
          <p>
            The project was created to provide a visual and interactive way to study
            core ideas in automata and formal computation. By connecting register
            operations to a multitape Turing machine interpretation, the simulator
            makes abstract computational processes easier to inspect step by step.
          </p>
        </InfoCard>

        <InfoCard title="Educational Value">
          <p>
            The simulator is intended to support classroom explanation, individual
            practice, and presentation use. It helps learners observe transitions,
            head movement, tape content, and machine outcomes in a format that is more
            accessible than static traces alone.
          </p>
        </InfoCard>
      </div>

      <InfoCard title="Scope And Limitations">
        <ul className="grid gap-3">
          {limitationItems.map((item) => (
            <li
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}
