export const prototypes = [
  {
    slug: 'subtraction',
    label: 'subtraction',
    title: 'Subtraction',
    summary: 'Today’s homepage minus icons, row numbers, and dividers. The control.',
  },
  {
    slug: 'manpage',
    label: 'manpage',
    title: 'Man page',
    summary: 'Typeset like a Unix manual page. Follows the current theme and CRT.',
  },
  {
    slug: 'liner-notes',
    label: 'liner notes',
    title: 'Liner notes',
    summary: 'The back of a record sleeve: Side A, Side B, thanks.',
  },
  {
    slug: 'contents',
    label: 'contents',
    title: 'Contents',
    summary: 'A book’s title page and table of contents, with dotted leaders.',
  },
  {
    slug: 'footnotes',
    label: 'footnotes',
    title: 'Footnotes',
    summary: 'A three-sentence bio whose numbered notes are the links.',
  },
] as const

export type PrototypeSlug = (typeof prototypes)[number]['slug']
