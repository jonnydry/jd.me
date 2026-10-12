export const SHORTCUT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const

/** Digit key for a 1-based homepage row position; rows past the tenth get no shortcut. */
export function shortcutKey(position: number): string | undefined {
  return SHORTCUT_KEYS[position - 1]
}
