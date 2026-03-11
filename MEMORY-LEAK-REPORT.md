# Memory Leak Analysis Report

## Summary

Three issues were found: **1 critical** (ThemeContext), **1 moderate** (useScrollProgress in WritingPage), and **1 minor** (stale closure in useScrollProgress).

---

## Critical: ThemeContext – Timeouts Not Cleared on Unmount

**File:** `src/ThemeContext.tsx`

**Issue:** The `useEffect(() => clearThemeTimers, [clearThemeTimers])` does **not** return a cleanup function. It only invokes `clearThemeTimers` on mount. When `ThemeProvider` unmounts, React has no cleanup to run, so the timeouts are never cleared.

If the user switches themes and the app (or `ThemeProvider`) unmounts before the 300ms/600ms timeouts fire, those callbacks will run and call `setThemeRaw(t)` / `setWiping(false)` on an unmounted component. That triggers React’s “state update on unmounted component” warning and can cause leaks and odd behavior.

**Fix:** Return a cleanup function that clears the timers on unmount:

```tsx
useEffect(() => {
  return () => clearThemeTimers()
}, [clearThemeTimers])
```

---

## Moderate: useScrollProgress – Stale Ref When Switching Views (WritingPage)

**Files:** `src/hooks/useScrollProgress.ts`, `src/components/WritingPage.tsx`

**Issue:** In `WritingPage`, `progressRef` is attached to different DOM nodes depending on the view (list vs detail). The effect depends on `[ref]`, and the ref object is stable, so the effect does not re-run when `ref.current` changes.

When switching from list to detail (or between articles), the effect keeps using the **old** `bar` (detached DOM node) in its closures. Result:

1. The visible progress bar is never updated.
2. `scroll`/`resize` listeners remain on the page (which stays mounted), but `update()` mutates a detached node, which is wasteful and can prevent GC.

**Fix:** Add a dependency that changes when the scroll container or view changes. For example, pass a key from `WritingPage`:

```tsx
// In useScrollProgress, add optional key param
export function useScrollProgress(ref: React.RefObject<HTMLDivElement>, key?: string) {
  useEffect(() => {
    // ...
  }, [ref, key])
}

// In WritingPage
useScrollProgress(progressRef, slug ?? 'list')
```

---

## Minor: useScrollProgress – Ref May Be Null on First Run

**File:** `src/hooks/useScrollProgress.ts`

**Issue:** When `ref.current` is null on the first effect run, the effect returns early and never sets up listeners. Because the effect depends only on `[ref]` and the ref object is stable, it will not re-run when `ref.current` becomes available.

In practice this is rare for `ResumePage` and `WritingPage` because the ref is attached to a div rendered in the same component. If `useScrollProgress` is ever used with a ref that’s populated later (e.g. forwarded ref), the bar would never initialize.

**Recommendation:** Consider re-running when the element appears (e.g. via `ResizeObserver`, `MutationObserver`, or a small polling check), or document that the ref must be non-null on first render.

---

## Clean Implementations ✓

These modules are implemented correctly:

- **useTimeOfDay** – `clearTimeout` in cleanup; chain of timeouts is correctly broken on unmount
- **useGlow** – `cancelAnimationFrame` in cleanup and in `handleMouseLeave`
- **Header useAvatarTilt** – RAF canceled on unmount
- **Header typing effect** – `clearTimeout` and `clearInterval` in cleanup
- **App.tsx** – All effects clean up: RAF, keydown listener, tab-title interval, visibility listeners, idle callback/timeout
- **LinkCard/LinkGroup ripple** – `{ once: true }` so the listener is removed after `animationend`
- **ResumePage** – Unmounts correctly and cleans up `useScrollProgress`
