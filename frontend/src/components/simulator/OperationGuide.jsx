const OPERATION_GUIDES = {
  INC: {
    title: "Increment Register",
    purpose: "Adds one to the selected register by updating its binary encoding on tape.",
    tapeCount: 1,
    explanation:
      "The machine scans the binary value, propagates carry when needed, and halts in an accepting state once the increment is complete.",
  },
  DEC: {
    title: "Decrement Register",
    purpose: "Subtracts one from the selected register when its value is nonzero.",
    tapeCount: 1,
    explanation:
      "The machine walks to the least significant end, borrows as needed, and rejects immediately if the register is already zero.",
  },
  CZ: {
    title: "Compare To Zero",
    purpose: "Checks whether the selected register is zero.",
    tapeCount: 1,
    explanation:
      "A blank tape head at the start means the register is zero and the machine accepts. Any binary digit means it rejects.",
  },
  CMP: {
    title: "Compare Registers",
    purpose: "Checks whether two registers contain the same binary value.",
    tapeCount: 2,
    explanation:
      "The machine reads both tapes in parallel and accepts only if every symbol matches until both tapes reach blank together.",
  },
  CLR: {
    title: "Clear Register",
    purpose: "Resets the selected register to zero by erasing its binary tape contents.",
    tapeCount: 1,
    explanation:
      "The machine overwrites binary digits with blanks, then returns to the start position before halting in an accepting state.",
  },
  CPY: {
    title: "Copy Register",
    purpose: "Copies the binary value of a source register into a destination register.",
    tapeCount: 2,
    explanation:
      "The machine writes source bits onto the destination tape and removes extra destination bits once the source reaches blank.",
  },
};

export default function OperationGuide({ operationCode }) {
  const guide = OPERATION_GUIDES[operationCode] ?? OPERATION_GUIDES.INC;

  return (
    <section className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
          Selected Operation
        </p>
        <h3 className="mt-1 text-xl font-bold text-ink">{guide.title}</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Purpose
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{guide.purpose}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Tapes Used
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {guide.tapeCount} tape{guide.tapeCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
          How To Read It
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{guide.explanation}</p>
      </div>
    </section>
  );
}

