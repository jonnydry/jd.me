export interface LinkItem {
  title: string
  url: string
  desc?: string
  icon?: 'github' | 'twitter' | 'linkedin' | 'globe' | 'quill' | 'mail' | 'file' | 'monitor' | 'heart' | 'wallet' | 'coffee' | 'gamepad' | 'lighthouse'
  iconSrc?: string
  /** When true, iconSrc is applied as a CSS mask so the icon follows theme colors. */
  iconMask?: boolean
  internal?: boolean
}

export interface LinkGroup {
  label: string
  icon?: 'github' | 'twitter' | 'linkedin' | 'globe' | 'quill' | 'mail' | 'file' | 'monitor' | 'heart' | 'wallet' | 'coffee' | 'gamepad' | 'lighthouse'
  /** When false, children are always shown under a section label instead of a dropdown. */
  collapsible?: boolean
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
    collapsible: false,
    children: [
      { title: 'Sancho Poetry', url: 'https://sanchopoetry.com/', desc: 'Poetic reference and writing tool', iconSrc: '/sanchodarktransVector.svg', iconMask: true },
      { title: 'Mash', url: 'https://mashnotes.me', desc: 'Infinite Sticky Stovetop', iconSrc: '/mashnotes-icon.png', iconMask: true },
      { title: 'The Harbor', url: 'https://harborpoetry.com', desc: 'Personal poetry', icon: 'lighthouse' },
      { title: 'EmuPhoria', url: 'https://emuphoria.com', desc: 'Vintage Game Emulator', icon: 'gamepad' },
    ],
  },
  {
    label: 'Social',
    icon: 'twitter',
    collapsible: false,
    children: [
      {
        title: '@JonnyD',
        url: 'https://x.com/JonnyD',
        desc: 'Personal: hot takes, interests, news',
        icon: 'twitter',
      },
      {
        title: '@imag3nigma',
        url: 'https://x.com/imag3nigma',
        desc: 'AI art with literary quotes',
        icon: 'twitter',
      },
    ],
  },
  { 
    title: 'GitHub', 
    url: 'https://github.com/jonnydry', 
    desc: 'Code, Projects, Experiments', 
    icon: 'github' 
  },
  {
    title: 'Resume',
    url: '/resume',
    desc: 'CV & experience',
    icon: 'file',
    internal: true
  },
  {
    title: 'Writing Samples',
    url: '/writing',
    desc: 'Essays & fiction',
    icon: 'quill',
    internal: true
  },
  {
    label: 'Support',
    icon: 'heart',
    children: [
      { title: 'Base Wallet', url: 'https://basescan.org/address/0x955d0856f646f46b4a6378b9461c85f1bbcf5992', desc: '0x955d...5992', icon: 'wallet' },
      { title: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/jdrybanski', desc: 'One-time support', icon: 'coffee' },
    ],
  },
]
