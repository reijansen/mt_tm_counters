import { useEffect, useState } from "react";
import DropdownSelect from "../ui/DropdownSelect";
import InfoTooltip from "../ui/InfoTooltip";

const DEFAULT_REGISTER_COUNT = 5;

function buildEmptyRegisterValues(count) {
  return Array.from({ length: count }, () => "0");
}

function getParameterConfig(operationCode) {
  switch (operationCode) {
    case "CMP":
      return [
        { key: "left", label: "Left register", prefix: "R" },
        { key: "right", label: "Right register", prefix: "R" },
      ];
    case "CPY":
      return [
        { key: "destination", label: "Destination register", prefix: "R" },
        { key: "source", label: "Source register", prefix: "R" },
      ];
    default:
      return [{ key: "target", label: "Target register", prefix: "R" }];
  }
}

export default function SimulationForm({
  operations,
  isSubmitting,
  onSubmit,
  onOperationChange,
  initialValues,
}) {
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

  useEffect(() => {
    onOperationChange?.(operation);
  }, [onOperationChange, operation]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setOperation(initialValues.operation ?? "INC");
    setNumRegisters(initialValues.num_registers ?? DEFAULT_REGISTER_COUNT);
    setIncludeSteps(initialValues.include_steps ?? true);
    setRegisterValues(() => {
      const count = initialValues.num_registers ?? DEFAULT_REGISTER_COUNT;
      const resized = buildEmptyRegisterValues(count);
      const values = initialValues.register_values ?? [];
      for (let index = 0; index < Math.min(values.length, count); index += 1) {
        resized[index] = String(values[index]);
      }
      return resized;
    });
    setParameters((current) => ({
      ...current,
      ...initialValues.parameters,
    }));
  }, [initialValues]);

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
    setParameters((current) => ({
      target: Math.min(Number(current.target) || 0, nextCount - 1),
      left: Math.min(Number(current.left) || 0, nextCount - 1),
      right: Math.min(Number(current.right) || 1, nextCount - 1),
      destination: Math.min(Number(current.destination) || 0, nextCount - 1),
      source: Math.min(Number(current.source) || 1, nextCount - 1),
    }));
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
  const registerOptions = Array.from({ length: numRegisters }, (_, index) => ({
    value: String(index),
    label: `R${index}`,
    description: `Register ${index}`,
  }));
  const selectedOperationMeta =
    operations.find((item) => item.code === operation) ??
    operations[0] ?? {
      code: operation,
      label: "Operation",
    };
  const helperText =
    operation === "CMP"
      ? "Choose the two registers you want to compare for equality."
      : operation === "CPY"
        ? "Choose the destination register and the source register to copy from."
        : "Choose the target register for the selected operation.";

  return (
    <form className="grid min-w-0 gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="flex items-center gap-2">
            <span className="section-label">Operation</span>
            <InfoTooltip content="Select the counter-machine operation you want to inspect. The explanation below the dropdown updates with the selected operation." />
          </span>
          <DropdownSelect
            onChange={setOperation}
            options={
              operations.length > 0
                ? operations.map((item) => ({
                    value: item.code,
                    label: item.code,
                    description: item.label,
                  }))
                : [
                    {
                      value: "INC",
                      label: "Loading...",
                    },
                  ]
            }
            value={operation}
          />
          <p className="text-sm text-zinc-400">{selectedOperationMeta.label}</p>
        </label>

        <label className="grid gap-2">
          <span className="flex items-center gap-2">
            <span className="section-label">Number of registers</span>
            <InfoTooltip content="Choose how many register tapes are available in the run. The simulator supports up to 20 registers in the web interface." />
          </span>
          <input
            className="app-input"
            type="number"
            min="1"
            max="20"
            value={numRegisters}
            onChange={(event) => handleNumRegistersChange(event.target.value)}
          />
          <p className="text-sm text-zinc-400">
            Set how many register tapes are available for this run.
          </p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {parameterConfig.map((field) => (
          <label className="grid gap-2" key={field.key}>
            <span className="flex items-center gap-2">
              <span className="section-label">{field.label}</span>
              <InfoTooltip content={helperText} />
            </span>
            <DropdownSelect
              onChange={(value) =>
                setParameters((current) => ({
                  ...current,
                  [field.key]: Number(value),
                }))
              }
              options={registerOptions}
              value={String(Math.min(Number(parameters[field.key]) || 0, numRegisters - 1))}
            />
          </label>
        ))}
      </div>

      <div className="grid gap-3">
        <span className="flex items-center gap-2">
          <span className="section-label">Initial register values</span>
          <InfoTooltip content="These values determine the starting contents of the register tapes before the machine begins its execution." />
        </span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {registerValues.map((value, index) => (
            <label className="grid min-w-0 gap-2" key={`register-${index}`}>
              <span className="text-sm font-semibold text-zinc-200">R{index}</span>
              <input
                className="app-input"
                type="number"
                min="0"
                value={value}
                onChange={(event) => handleRegisterChange(index, event.target.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-[1.35rem] border border-white/8 bg-black/25 px-4 py-3">
        <input
          className="h-4 w-4 rounded border-white/15 bg-transparent text-lime-300 focus:ring-lime-300"
          type="checkbox"
          checked={includeSteps}
          onChange={(event) => setIncludeSteps(event.target.checked)}
        />
        <span className="font-medium text-zinc-300">Include full execution trace</span>
        <InfoTooltip content="Keep this enabled when you want playback controls and the full step-by-step trace after the run." />
      </label>

      <button
        className="app-button-primary w-full sm:w-fit"
        type="submit"
        disabled={isSubmitting || operations.length === 0}
      >
        {isSubmitting ? "Running simulation..." : "Run Simulation"}
      </button>
    </form>
  );
}
