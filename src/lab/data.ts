import { links, isGroup, type LinkItem } from '../config/links'
import { profile } from '../config/profile'

type ProfileFields = { name?: unknown; tagline?: unknown; avatar?: unknown }

const fields: ProfileFields = profile

function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export const identity = {
  name: text(fields.name, 'Jonny D'),
  tagline: text(fields.tagline, ''),
  avatar: text(fields.avatar, '/avatar.jpg'),
}

const groups = links.filter(isGroup)
const standalone = links.filter((entry): entry is LinkItem => !isGroup(entry))

function group(label: string) {
  const match = groups.find((entry) => entry.label === label)
  return { label: match?.label ?? label, items: match?.children ?? [] }
}

export const projects = group('Live Projects')
export const social = group('Social')
export const support = group('Support')
/** Resume, writing, then GitHub: the standalone homepage rows, internal pages first. */
export const work = [...standalone.filter((link) => link.internal), ...standalone.filter((link) => !link.internal)]

export function linkHost(link: LinkItem) {
  if (link.internal) return link.url
  try {
    return new URL(link.url).hostname.replace(/^www\./, '')
  } catch {
    return link.url
  }
}
