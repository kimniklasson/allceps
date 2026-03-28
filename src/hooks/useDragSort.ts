import { useState, useRef, useCallback, useEffect } from "react";

interface ActiveDrag {
  id: string;
  pointerId: number;
  fromIndex: number;
  overIndex: number;
}

/**
 * Zero-dependency drag-to-reorder hook using native Pointer Events.
 * - Long press (longPressDelay ms) anywhere on the item activates drag
 * - Touch-friendly: uses touchmove listener to detect scroll vs hold
 * - CSS transform-based reorder preview (no DOM reordering during drag)
 * - Commits new order on pointerup
 */
export function useDragSort<T extends { id: string }>(
  items: T[],
  onReorder: (newIds: string[]) => void,
  longPressDelay = 600
) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef<ActiveDrag | null>(null);
  const preventScrollRef = useRef<((e: TouchEvent) => void) | null>(null);
  const cancelTouchRef = useRef<((e: TouchEvent) => void) | null>(null);
  const startYRef = useRef(0);

  /** Y coordinate when drag activated — used to calculate drag offset. */
  const dragStartYRef = useRef(0);
  /** Original item centers captured when drag starts — used for stable hit-testing. */
  const originalCentersRef = useRef<number[]>([]);
  /** Height of dragged item + gap — the shift amount for displaced items. */
  const shiftAmountRef = useRef(0);

  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      cleanupTouchListeners();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function cleanupTouchListeners() {
    if (preventScrollRef.current) {
      window.removeEventListener("touchmove", preventScrollRef.current);
      preventScrollRef.current = null;
    }
    if (cancelTouchRef.current) {
      window.removeEventListener("touchmove", cancelTouchRef.current);
      cancelTouchRef.current = null;
    }
  }

  /** Find target index using original (pre-drag) item center positions. */
  function findOverIndex(clientY: number): number {
    const centers = originalCentersRef.current;
    if (centers.length === 0 || !activeRef.current) return 0;
    let best = activeRef.current.overIndex;
    let minDist = Infinity;
    centers.forEach((center, i) => {
      const dist = Math.abs(clientY - center);
      if (dist < minDist) {
        minDist = dist;
        best = i;
      }
    });
    return best;
  }

  function cancelPendingTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    cleanupTouchListeners();
  }

  /** Measure and store original item positions + shift amount. */
  function captureOriginalLayout(fromIndex: number) {
    if (!containerRef.current) return;
    const nodes = containerRef.current.querySelectorAll<HTMLElement>("[data-sort-id]");
    const rects = Array.from(nodes).map((el) => el.getBoundingClientRect());
    originalCentersRef.current = rects.map((r) => r.top + r.height / 2);
    const draggedHeight = rects[fromIndex]?.height ?? 0;
    const gap = rects.length >= 2 ? rects[1].top - rects[0].bottom : 0;
    shiftAmountRef.current = draggedHeight + gap;
  }

  // Called from each item's onPointerDown
  const onItemPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    if (activeRef.current) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;

    // Clean up any lingering listeners from a previous interrupted drag
    cleanupTouchListeners();
    if (timerRef.current) clearTimeout(timerRef.current);

    const target = e.currentTarget as Element;
    const pointerId = e.pointerId;
    const fromIndex = items.findIndex((item) => item.id === id);
    startYRef.current = e.clientY;

    // On touch devices, listen for touchmove to cancel if user scrolls.
    const cancelOnScroll = (te: TouchEvent) => {
      const dy = Math.abs(te.touches[0].clientY - startYRef.current);
      if (dy > 8) {
        cancelPendingTimer();
      }
    };
    cancelTouchRef.current = cancelOnScroll;
    window.addEventListener("touchmove", cancelOnScroll, { passive: true });

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (cancelTouchRef.current) {
        window.removeEventListener("touchmove", cancelTouchRef.current);
        cancelTouchRef.current = null;
      }

      // Capture layout before any visual changes
      captureOriginalLayout(fromIndex);

      const drag: ActiveDrag = { id, pointerId, fromIndex, overIndex: fromIndex };
      activeRef.current = drag;

      dragStartYRef.current = startYRef.current;
      setDragOffset(0);

      // Prevent scroll for the rest of this touch gesture
      const preventScroll = (te: TouchEvent) => {
        te.preventDefault();
        if (activeRef.current) {
          const clientY = te.touches[0].clientY;
          setDragOffset(clientY - dragStartYRef.current);
          const newIndex = findOverIndex(clientY);
          if (newIndex !== activeRef.current.overIndex) {
            activeRef.current.overIndex = newIndex;
            setOverIndex(newIndex);
          }
        }
      };
      preventScrollRef.current = preventScroll;
      window.addEventListener("touchmove", preventScroll, { passive: false });

      try {
        target.setPointerCapture(pointerId);
      } catch (_) {
        // setPointerCapture can throw if the pointer is no longer active
      }
      setDraggingId(id);
      setOverIndex(fromIndex);
    }, longPressDelay);
  }, [items, longPressDelay]);

  function onContainerPointerMove(e: React.PointerEvent) {
    if (!activeRef.current) return;
    setDragOffset(e.clientY - dragStartYRef.current);
    const newIndex = findOverIndex(e.clientY);
    if (newIndex !== activeRef.current.overIndex) {
      activeRef.current.overIndex = newIndex;
      setOverIndex(newIndex);
    }
  }

  function onContainerPointerUp() {
    cancelPendingTimer();
    if (!activeRef.current) return;

    const { fromIndex, overIndex: toIndex } = activeRef.current;
    activeRef.current = null;

    if (toIndex !== fromIndex) {
      const reordered = [...items];
      const [removed] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, removed);
      onReorder(reordered.map((i) => i.id));
    }

    setDraggingId(null);
    setOverIndex(null);
    setDragOffset(0);
  }

  // No DOM reordering — items stay in original order. Visual reorder via transforms.
  const displayItems = items;

  /** Calculate translateY offset for a given item during drag. */
  function getTransformOffset(id: string): number {
    if (!draggingId || overIndex === null) return 0;
    if (id === draggingId) return dragOffset;

    const fromIndex = items.findIndex((i) => i.id === draggingId);
    const itemIndex = items.findIndex((i) => i.id === id);
    const shift = shiftAmountRef.current;

    if (fromIndex < overIndex) {
      // Dragging down: items in (fromIndex, overIndex] shift up
      if (itemIndex > fromIndex && itemIndex <= overIndex) return -shift;
    } else if (fromIndex > overIndex) {
      // Dragging up: items in [overIndex, fromIndex) shift down
      if (itemIndex >= overIndex && itemIndex < fromIndex) return shift;
    }
    return 0;
  }

  const containerProps = {
    ref: containerRef,
    onPointerMove: onContainerPointerMove,
    onPointerUp: onContainerPointerUp,
    onPointerCancel: onContainerPointerUp,
  };

  const getItemProps = (id: string) => {
    const offset = getTransformOffset(id);
    const isDraggedItem = id === draggingId;
    return {
      "data-sort-id": id,
      onPointerDown: (e: React.PointerEvent) => onItemPointerDown(e, id),
      style: {
        touchAction: "auto",
        ...(draggingId ? {
          transform: `translateY(${offset}px)`,
          // Dragged item follows pointer instantly; other items animate smoothly
          transition: isDraggedItem ? "none" : "transform 200ms ease-out",
        } : {}),
      } as React.CSSProperties,
    };
  };

  return { draggingId, displayItems, containerProps, getItemProps };
}
