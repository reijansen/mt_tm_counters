import { useEffect, useState } from "react";

const DEFAULT_REGISTER_COUNT = 5;

function buildEmptyRegisterValues(count) {
  return Array.from({ length: count }, () => "0");
}

function getParameterConfig(operationCode) {
  switch (operationCode) {
    case "CMP":
      return [
        { key: "left", label: "Left register" },
        { key: "right", label: "Right register" },
      ];
    case "CPY":
      return [
        { key: "destination", label: "Destination register" },
        { key: "source", label: "Source register" },
      ];
    default:
      return [{ key: "target", label: "Target register" }];
  }
}

export default function SimulationForm({ operations, isSubmitting, onSubmit }) {
  const defaultOperation = operations[0]?.code ?? "INC";
  const [operation, setOperation] = useState(defaultOperation);
  const [registerValues, setRegisterValues] = useState(() =>
    buildEmptyRegisterValues(DEFAULT_REGISTER_COUNT),
  );
  const [numRegisters, setNumRegisters] = useState(DEFAULT_REGISTER_COUNT);
  const [includeSteps, setIncludeSteps] = useState(true);
  const [parameters, setParameters] = useState({
    target: 0,
    left: 0,
    right: 1,
    destination: 0,
    source: 1,
  });

  useEffect(() => {
    if (operations.length > 0 && !operations.some((item) => item.code === operation)) {
      setOperation(operations[0].code);
    }
  }, [operation, operations]);

  function handleRegisterChange(index, value) {
    setRegisterValues((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  function handleNumRegistersChange(value) {
    const parsedValue = Number(value);
    const nextCount = Number.isNaN(parsedValue)
      ? DEFAULT_REGISTER_COUNT
      : Math.max(1, Math.min(20, parsedValue));

    setNumRegisters(nextCount);
    setRegisterValues((current) => {
      const resized = buildEmptyRegisterValues(nextCount);
      for (let index = 0; index < Math.min(current.length, nextCount); index += 1) {
        resized[index] = current[index];
      }
      return resized;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (operations.length === 0) {
      return;
    }

    const payload = {
      operation,
      register_values: registerValues.map((value) => {
        const parsedValue = Number(value);
        return Number.isNaN(parsedValue) ? 0 : parsedValue;
      }),
      parameters: {},
      num_registers: numRegisters,
      include_steps: includeSteps,
    };

    for (const field of getParameterConfig(operation)) {
      const value = Number(parameters[field.key]);
      payload.parameters[field.key] = Number.isNaN(value) ? 0 : value;
    }

    onSubmit(payload);
  }

  const parameterConfig = getParameterConfig(operation);
  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition duration-200 focus:border-ocean focus:ring-2 focus:ring-ocean/20";

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Operation
          </span>
          <select
            className={inputClassName}
            value={operation}
            onChange={(event) => setOperation(event.target.value)}
          >
            {operations.length > 0 ? (
              operations.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.label}
                </option>
              ))
            ) : (
              <option value="INC">Loading operations...</option>
            )}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Number of registers
          </span>
          <input
            className={inputClassName}
            type="number"
            min="1"
            max="20"
            value={numRegisters}
            onChange={(event) => handleNumRegistersChange(event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {parameterConfig.map((field) => (
          <label className="grid gap-2" key={field.key}>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
              {field.label}
            </span>
            <input
              className={inputClassName}
              type="number"
              min="0"
              value={parameters[field.key]}
              onChange={(event) =>
                setParameters((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
            />
          </label>
        ))}
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
          Initial register values
        </span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {registerValues.map((value, index) => (
            <label className="grid gap-2" key={`register-${index}`}>
              <span className="text-sm font-semibold text-slate-700">R{index}</span>
              <input
                className={inputClassName}
                type="number"
                min="0"
                value={value}
                onChange={(event) => handleRegisterChange(index, event.target.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          className="h-4 w-4 rounded border-slate-300 text-ocean focus:ring-ocean"
          type="checkbox"
          checked={includeSteps}
          onChange={(event) => setIncludeSteps(event.target.checked)}
        />
        <span className="font-medium text-slate-700">Include full execution trace</span>
      </label>

      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold tracking-wide text-sand transition duration-300 hover:-translate-y-0.5 hover:bg-ocean disabled:cursor-progress disabled:opacity-70 sm:w-fit"
        type="submit"
        disabled={isSubmitting || operations.length === 0}
      >
        {isSubmitting ? "Running simulation..." : "Run Simulation"}
      </button>
    </form>
  );
}
