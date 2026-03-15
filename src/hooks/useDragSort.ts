import { useState, useRef } from "react";

interface ActiveDrag {
  id: string;
  pointerId: number;
  fromIndex: number;
  overIndex: number;
}

/**
 * Zero-dependency drag-to-reorder hook using native Pointer Events.
 * - Long press (longPressDelay ms) on the drag handle activates drag
 * - Live reorder preview as the pointer moves
 * - Commits new order on pointerup
 */
export function useDragSort<T extends { id: string }>(
  items: T[],
  onReorder: (newIds: string[]) => void,
  longPressDelay = 200
) {
  // State for rendering: draggingId + live overIndex
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref keeps the latest overIndex for pointerup handler without stale closures
  const activeRef = useRef<ActiveDrag | null>(null);

  // Find the closest item index to a given clientY by querying the container
  function findOverIndex(clientY: number): number {
    if (!containerRef.current || !activeRef.current) return 0;
    const nodes = containerRef.current.querySelectorAll<HTMLElement>("[data-sort-id]");
    let best = activeRef.current.overIndex;
    let minDist = Infinity;
    nodes.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(clientY - center);
      if (dist < minDist) {
        minDist = dist;
        best = i;
      }
    });
    return best;
  }

  // Called from each drag handle's onPointerDown
  function onHandlePointerDown(e: React.PointerEvent, id: string) {
    // Don't start a new drag if one is already active
    if (activeRef.current) return;
    e.preventDefault();
    const target = e.currentTarget as Element;
    const pointerId = e.pointerId;
    const fromIndex = items.findIndex((item) => item.id === id);

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const drag: ActiveDrag = { id, pointerId, fromIndex, overIndex: fromIndex };
      activeRef.current = drag;
      try {
        target.setPointerCapture(pointerId);
      } catch (_) {
        // setPointerCapture can throw if the pointer is no longer active
      }
      setDraggingId(id);
      setOverIndex(fromIndex);
    }, longPressDelay);
  }

  function onContainerPointerMove(e: React.PointerEvent) {
    if (!activeRef.current) return;
    const newIndex = findOverIndex(e.clientY);
    if (newIndex !== activeRef.current.overIndex) {
      activeRef.current.overIndex = newIndex;
      setOverIndex(newIndex);
    }
  }

  function onContainerPointerUp() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!activeRef.current) return;

    const { fromIndex, overIndex: toIndex } = activeRef.current;
    activeRef.current = null;
    setDraggingId(null);
    setOverIndex(null);

    if (toIndex !== fromIndex) {
      const reordered = [...items];
      const [removed] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, removed);
      onReorder(reordered.map((i) => i.id));
    }
  }

  // Compute display order with live reordering during drag
  const displayItems: T[] =
    draggingId !== null && overIndex !== null
      ? (() => {
          const fromIndex = items.findIndex((i) => i.id === draggingId);
          const reordered = [...items];
          const [removed] = reordered.splice(fromIndex, 1);
          reordered.splice(overIndex, 0, removed);
          return reordered;
        })()
      : items;

  const containerProps = {
    ref: containerRef,
    onPointerMove: onContainerPointerMove,
    onPointerUp: onContainerPointerUp,
    onPointerCancel: onContainerPointerUp,
  };

  const getDragHandleProps = (id: string) => ({
    onPointerDown: (e: React.PointerEvent) => onHandlePointerDown(e, id),
    style: { touchAction: "none" } as React.CSSProperties,
  });

  const getItemProps = (id: string) => ({
    "data-sort-id": id,
  });

  return { draggingId, displayItems, containerProps, getDragHandleProps, getItemProps };
}
