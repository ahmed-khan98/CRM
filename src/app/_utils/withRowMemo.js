import { memo } from "react";

function getPath(obj, path) {
  return path.split(".").reduce((o, key) => (o == null ? o : o[key]), obj);
}

/**
 * HOC for memoizing list-row / card components (Task cards, Fleet table
 * rows, etc.) whose data prop is a fresh object reference every time the
 * parent list refetches (RTK Query, socket updates), even when the fields
 * that actually affect this row's rendering haven't changed.
 *
 * `fields` is a list of dot-paths (e.g. "task.status", "task._id",
 * "vehicle.plateNumber") that get compared by value instead of reference.
 * Every other prop (callbacks, primitives, etc.) still uses normal
 * reference equality, so parents should still stabilize handlers with
 * `useCallback` — this HOC only fixes the "same data, new object" problem,
 * not unstable function props.
 *
 * Mirrors the hand-rolled `areEqual` comparator already used in
 * MessageBubble.jsx, generalized so Task/Fleet rows don't each redefine it.
 */
export function withRowMemo(Component, fields = []) {
  const trackedTopLevelKeys = new Set(fields.map((f) => f.split(".")[0]));

  function areEqual(prevProps, nextProps) {
    const prevKeys = Object.keys(prevProps);
    if (prevKeys.length !== Object.keys(nextProps).length) return false;

    for (const key of prevKeys) {
      if (trackedTopLevelKeys.has(key)) continue;
      if (prevProps[key] !== nextProps[key]) return false;
    }

    for (const field of fields) {
      if (getPath(prevProps, field) !== getPath(nextProps, field)) return false;
    }

    return true;
  }

  const Memoized = memo(Component, areEqual);
  Memoized.displayName = `withRowMemo(${
    Component.displayName || Component.name || "Component"
  })`;
  return Memoized;
}

export default withRowMemo;
