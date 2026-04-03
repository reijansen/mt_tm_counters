const LEGEND_ITEMS = [
  {
    title: "Binary Tape Representation",
    description:
      "Each register is encoded as binary digits on tape. Blank cells are shown as B and represent empty tape space.",
  },
  {
    title: "Register Values",
    description:
      "Registers show the decimal interpretation of the binary tape contents at the selected step or at the end of execution.",
  },
  {
    title: "Accepted vs Rejected",
    description:
      "Accepted means the machine halted in a valid accept state for the chosen operation. Rejected means the operation condition failed.",
  },
  {
    title: "Head Positions",
    description:
      "The highlighted tape cell is the current head location. Active tapes are visually emphasized during playback.",
  },
  {
    title: "Trace Playback",
    description:
      "Playback reuses the full trace returned by the backend. It does not request step-by-step execution from the server.",
  },
];

export default function SimulatorLegend() {
  return (
    <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
          Quick Guide
        </p>
        <h3 className="mt-1 text-xl font-bold text-ink">How To Read The Simulator</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LEGEND_ITEMS.map((item) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            key={item.title}
          >
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-ocean">
              {item.title}
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-700">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
