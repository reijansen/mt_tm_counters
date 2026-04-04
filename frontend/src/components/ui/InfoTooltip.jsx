import {
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { useEffect, useId, useRef, useState } from "react";

let closeActiveTooltip = null;

export default function InfoTooltip({ content, label = "More information" }) {
  const [open, setOpen] = useState(false);
  const [isTouchLike, setIsTouchLike] = useState(false);
  const arrowRef = useRef(null);
  const tooltipId = useId();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const updateMode = () => setIsTouchLike(mediaQuery.matches);

    updateMode();
    mediaQuery.addEventListener("change", updateMode);

    return () => mediaQuery.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    if (!open) {
      if (closeActiveTooltip === setOpen) {
        closeActiveTooltip = null;
      }
      return undefined;
    }

    if (closeActiveTooltip && closeActiveTooltip !== setOpen) {
      closeActiveTooltip(false);
    }

    closeActiveTooltip = setOpen;

    function handleScroll() {
      setOpen(false);
    }

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      if (closeActiveTooltip === setOpen) {
        closeActiveTooltip = null;
      }
    };
  }, [open]);

  const { refs, floatingStyles, context, middlewareData, placement } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        fallbackPlacements: ["bottom"],
        padding: 12,
      }),
      shift({
        padding: 12,
      }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const hover = useHover(context, {
    enabled: !isTouchLike,
    move: false,
  });
  const focus = useFocus(context, {
    enabled: !isTouchLike,
  });
  const click = useClick(context, {
    enabled: isTouchLike,
    event: "click",
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: "tooltip",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 180,
    initial: {
      opacity: 0,
      transform: placement.startsWith("top")
        ? "translateY(4px)"
        : "translateY(-4px)",
    },
    open: {
      opacity: 1,
      transform: "translateY(0)",
    },
  });

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[placement.split("-")[0]];

  return (
    <>
      <button
        aria-describedby={open ? tooltipId : undefined}
        aria-label={label}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-semibold text-zinc-300 transition hover:border-lime-300/30 hover:text-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/45"
        ref={refs.setReference}
        type="button"
        {...getReferenceProps()}
      >
        i
      </button>

      <FloatingPortal>
        {isMounted ? (
          <div
            className="z-30 min-w-[120px] max-w-[90vw] break-words rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
            id={tooltipId}
            ref={refs.setFloating}
            role="tooltip"
            style={{
              ...floatingStyles,
              ...transitionStyles,
            }}
            {...getFloatingProps()}
          >
            <div
              aria-hidden="true"
              className="absolute h-3 w-3 rotate-45 rounded-[2px] bg-gray-900"
              ref={arrowRef}
              style={{
                left: middlewareData.arrow?.x ?? "",
                top: middlewareData.arrow?.y ?? "",
                [staticSide]: "-6px",
              }}
            />
            <div className="relative">{content}</div>
          </div>
        ) : null}
      </FloatingPortal>
    </>
  );
}
