import { GUIDE_ITEMS } from "../../lib/projectData";

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
        {GUIDE_ITEMS.map((item) => (
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
