export const SITE_NAME = 'Jonny D'
export const SITE_URL = 'https://jdry.me'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/avatar.jpg`
export const DEFAULT_OG_IMAGE_ALT = 'Portrait of Jonny D'

export const HOME_DESCRIPTION =
  'Personal links, live projects, writing samples, and resume from Jonny D. Featuring Sancho Poetry, Mash, The Harbor, and EmuPhoria.'

type RouteMetadata = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  robots?: string
}

const writingMeta: Record<string, RouteMetadata> = {
  'lyrical-conceptions-of-self-and-nation': {
    title: 'Lyrical Conceptions of Self and Nation | Jonny D',
    description:
      'An essay on Whitman, Hughes, democracy, and the American lyric tradition.',
    path: '/writing/lyrical-conceptions-of-self-and-nation',
    type: 'article',
  },
  'diving-into-the-void': {
    title: 'Diving into the Void | Jonny D',
    description:
      'A reading of Clarice Lispector, existentialism, and the unstable search for selfhood.',
    path: '/writing/diving-into-the-void',
    type: 'article',
  },
}

export function getRouteMetadata(pathname: string): RouteMetadata {
  if (pathname === '/') {
    return {
      title: 'Jonny D | Links, Writing, and Projects',
      description: HOME_DESCRIPTION,
      path: '/',
      type: 'website',
    }
  }

  if (pathname === '/resume') {
    return {
      title: 'Jonny D | Resume',
      description:
        'Resume for Jonathan Drybanski (Jonny D): retail leadership at Whole Foods, teaching, writing, and web projects.',
      path: '/resume',
      type: 'website',
    }
  }

  if (pathname === '/writing') {
    return {
      title: 'Jonny D | Writing',
      description:
        'Essays and literary criticism by Jonny D, including Whitman, Hughes, and Clarice Lispector.',
      path: '/writing',
      type: 'website',
    }
  }

  const match = pathname.match(/^\/writing\/(.+)$/)
  if (match) {
    return writingMeta[match[1]] ?? {
      title: 'Writing Sample Not Found | Jonny D',
      description: 'That writing sample does not exist.',
      path: pathname,
      type: 'website',
      robots: 'noindex,follow',
    }
  }

  return {
    title: 'Page Not Found | Jonny D',
    description: 'That page does not exist on jdry.me.',
    path: pathname,
    type: 'website',
    robots: 'noindex,follow',
  }
}
