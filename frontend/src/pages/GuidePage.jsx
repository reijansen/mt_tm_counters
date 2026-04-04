import { GUIDE_ITEMS } from "../lib/projectData";

export default function GuidePage() {
  return (
    <div className="grid gap-8">
      <header className="surface-panel px-7 py-8 sm:px-10 sm:py-10">
        <p className="section-label">Reading Guide</p>
        <h1 className="page-title max-w-5xl">
          How to read the <span className="text-lime-300">simulator output</span> with
          confidence.
        </h1>
        <p className="page-copy mt-6 max-w-3xl">
          This guide explains the main visual cues used throughout the app so
          first-time learners can understand tapes, register values, head positions,
          and halted outcomes more easily.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {GUIDE_ITEMS.map((item) => (
          <article
            className="border-b border-white/8 pb-6"
            key={item.title}
          >
            <p className="section-label">Guide Topic</p>
            <h2 className="app-heading mt-3">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
