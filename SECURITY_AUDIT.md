# jd.me Security & Bug Audit

## Summary
**Status: Ready to launch** with minor recommendations.

---

## Security (Good)

### ✅ What's secure
- **External links**: All use `rel="noopener noreferrer"` — prevents tab-nabbing and referrer leak
- **No sensitive data**: No API keys, tokens, or secrets in code
- **Dependencies**: `npm audit` reports 0 vulnerabilities
- **Static content**: All text comes from config files, not user input — React auto-escapes, low XSS risk
- **Build**: Production build passes

---

## Potential Improvements

### 1. URL validation (low risk)
Links are from your config, so risk is low. If you ever add a CMS or user-submitted links, validate URLs and block `javascript:` and `data:` schemes.

### 2. Portfolio placeholder
`url: '#'` makes the Portfolio link go to the same page. Consider:
- Removing it until you have a real URL, or
- Adding `aria-disabled` / disabling the link until ready

### 3. Profile handle
`@yourhandle` in profile.ts is still a placeholder — update when you have a real handle.

---

## Bugs / UX Notes

### Keyboard shortcuts with `#` link
Pressing the Portfolio shortcut (currently 5) opens `#` in a new tab (same page). The code already skips `#` for keyboard shortcuts — verified in App.tsx line 26: `if (link && link.url !== '#')`. So keyboard shortcut won't open Portfolio; click still does. Minor: clicking Portfolio does nothing useful.

### LinkGroup key
`key={child.url}` is fine — children have unique URLs. If you add duplicate URLs later, use `key={child.url + child.title}` or similar.

---

## Recommendations Before Launch

1. **Update profile handle** in `src/config/profile.ts` from `@yourhandle` to your real handle (or remove).
2. **Portfolio link**: Either add a real URL or remove/hide the entry until ready.
3. **Optional**: Add security headers via Vercel (`vercel.json`) — see below.

---

## Optional: Vercel security headers

Create `vercel.json` for defense-in-depth:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```
