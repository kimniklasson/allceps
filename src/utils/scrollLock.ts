/**
 * Ref-counted scroll lock.
 * Multiple components can request a lock; body overflow is only restored
 * when ALL locks are released.
 */
let lockCount = 0;

export function acquireScrollLock() {
  lockCount++;
  if (lockCount === 1) {
    document.body.style.overflow = "hidden";
  }
}

export function releaseScrollLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
  }
}
