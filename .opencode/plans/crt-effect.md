# CRT Scanline Effect Implementation Plan

## Goal
Add a site-wide CRT monitor scanline effect that can be toggled via a checkbox at the end of the theme list.

## Implementation Details

### 1. ThemeContext.tsx Changes
- Add `crtEnabled` and `setCrtEnabled` to the context value type
- Add `applyCrt()` function to set `data-crt` attribute on document element
- Add `getStoredCrt()` function to read CRT state from localStorage
- Update `ThemeProvider` to manage CRT state with `useState`
- Render CRT overlay elements when `crtEnabled` is true:
  - `crt-overlay` - vignette and phosphor glow
  - `crt-scanlines` - horizontal scanline pattern
  - `crt-flicker` - subtle brightness flicker animation

### 2. ThemeToggle.tsx Changes  
- Import `crtEnabled` and `setCrtEnabled` from `useTheme()`
- Add a checkbox button at the end of theme buttons labeled `[CRT]`
- Style it similar to theme buttons but with checkbox-like active state

### 3. index.css Changes
Add CSS for the CRT effect:

```css
/* CRT overlay with subtle vignette */
.crt-overlay {
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 70%,
    rgba(0,0,0,0.15) 100%
  );
}

/* Horizontal scanlines */
.crt-scanlines {
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.08) 0px,
    rgba(0,0,0,0.08) 1px,
    transparent 1px,
    transparent 3px
  );
}

/* Subtle flicker animation */
@keyframes crtFlicker {
  0%, 100% { opacity: 0.02; }
  50% { opacity: 0.05; }
}

.crt-flicker {
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  background: rgba(255,255,255,0.01);
  animation: crtFlicker 0.15s infinite;
}

/* Theme toggle CRT button styles */
.crt-toggle {
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  color: var(--text-muted);
  opacity: 0.45;
  transition: color 0.15s, opacity 0.15s;
  margin-left: 0.5rem;
}

.crt-toggle:hover {
  opacity: 0.8;
}

.crt-toggle--active {
  color: var(--accent);
  opacity: 1;
}

.crt-toggle--active::before {
  content: '[';
  color: var(--border);
  margin-right: 1px;
}

.crt-toggle--active::after {
  content: ']'
  color: var(--border);
  margin-left: 1px;
}
```

## Balance of Readability vs Fun Factor
- Scanlines are subtle (3px apart, 8% opacity) - visible but not distracting
- Vignette is gentle (15% at edges) - creates curvature feel without darkening too much
- Flicker is very subtle (1-5% opacity, fast animation) - adds life without being annoying
- All effects use `pointer-events: none` so they don't interfere with interactions
- z-index of 9997 keeps effects behind modals/toasts but above content

## Files to Modify
1. `/Users/jonnydrybanski/Cursor Projects/jdry.me/jd.me/src/ThemeContext.tsx`
2. `/Users/jonnydrybanski/Cursor Projects/jdry.me/jd.me/src/components/ThemeToggle.tsx`
3. `/Users/jonnydrybanski/Cursor Projects/jdry.me/jd.me/src/index.css`

## Testing Checklist
- [ ] CRT checkbox appears at end of theme list
- [ ] Clicking [CRT] toggles the effect on/off
- [ ] Effect persists across page reloads (localStorage)
- [ ] Effect works with all 8 themes
- [ ] Text remains readable with effect enabled
- [ ] No performance issues (animations use GPU)
- [ ] Reduced motion preference respected
