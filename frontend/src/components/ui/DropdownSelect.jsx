import { useEffect, useMemo, useRef, useState } from "react";

export default function DropdownSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  helperText = "",
  buttonClassName = "",
  menuAlign = "left",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const alignmentClassName = menuAlign === "right" ? "right-0" : "left-0";

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        className={`app-input flex items-center justify-between gap-3 text-left ${buttonClassName}`}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-50">
            {selectedOption?.label ?? placeholder}
          </div>
          {selectedOption?.description ? (
            <div className="mt-1 truncate text-xs text-zinc-500">
              {selectedOption.description}
            </div>
          ) : null}
        </div>
        <span
          className={`shrink-0 text-xs text-zinc-400 transition ${isOpen ? "rotate-180" : ""}`}
        >
          v
        </span>
      </button>

      {helperText ? <p className="mt-2 text-sm text-zinc-400">{helperText}</p> : null}

      {isOpen ? (
        <div
          className={`absolute ${alignmentClassName} z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-[1.2rem] border border-white/10 bg-[#111318] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl`}
        >
          <div className="grid gap-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  className={`rounded-[1rem] px-3 py-3 text-left transition ${
                    isSelected
                      ? "bg-lime-300/14 text-lime-100"
                      : "text-zinc-200 hover:bg-white/[0.05]"
                  }`}
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  <div className="text-sm font-semibold">{option.label}</div>
                  {option.description ? (
                    <div className="mt-1 text-xs leading-6 text-zinc-500">
                      {option.description}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
