import { GUIDE_ITEMS } from "../lib/projectData";

export default function GuidePage() {
  return (
    <div className="grid gap-6">
      <header className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-ocean">
          Reading Guide
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
          How to Read the Simulator Output
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          This guide explains the core visual language of the interface so first-time
          users can interpret tapes, register values, head positions, and halted
          outcomes without crowding the simulator page itself.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GUIDE_ITEMS.map((item) => (
          <article
            className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(53,96,125,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(53,96,125,0.14)]"
            key={item.title}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean">
              Guide Topic
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
