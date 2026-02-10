export interface LinkItem {
  title: string
  url: string
  desc?: string
  icon?: 'github' | 'twitter' | 'linkedin' | 'globe' | 'quill' | 'mail' | 'file' | 'monitor'
  internal?: boolean
}

export interface LinkGroup {
  label: string
  icon?: 'github' | 'twitter' | 'linkedin' | 'globe' | 'quill' | 'mail' | 'file' | 'monitor'
  children: LinkItem[]
}

export type LinkEntry = LinkItem | LinkGroup

export function isGroup(entry: LinkEntry): entry is LinkGroup {
  return 'children' in entry
}

export const links: LinkEntry[] = [
  {
    label: 'Live Projects',
    icon: 'monitor',
    children: [
      { title: 'Sancho Poetry', url: 'https://sanchopoetry.com', desc: 'Poetic reference and writing tool', icon: 'quill' },
      { title: 'The Harbor', url: 'https://harborpoetry.com', desc: 'Personal poetry', icon: 'quill' },
    ],
  },
  { 
    title: 'GitHub', 
    url: 'https://github.com/jonnydry', 
    desc: 'Code & projects', 
    icon: 'github' 
  },
  { 
    title: '@JonnyD', 
    url: 'https://x.com/JonnyD', 
    desc: 'personal account', 
    icon: 'twitter' 
  },
  { 
    title: '@imag3nigma', 
    url: 'https://x.com/imag3nigma', 
    desc: 'AI art with literary quotes', 
    icon: 'twitter' 
  },
  { 
    title: 'Resume', 
    url: '/resume', 
    desc: 'CV & experience', 
    icon: 'file',
    internal: true 
  },
]
