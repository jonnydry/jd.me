import type { ContentBlock, WritingSample } from '../config/writing'

const WORDS_PER_MINUTE = 230

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatWritingDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return dateFormatter.format(new Date(Date.UTC(year, month - 1, day)))
}

function blockText(block: ContentBlock) {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
    case 'quote':
      return block.text
    case 'verse':
      return block.lines.join(' ')
    case 'image':
      return block.caption ?? ''
    case 'citation':
      return ''
  }
}

function countWords(text: string) {
  return text.split(/\s+/).filter((word) => /\w/.test(word)).length
}

export function getReadingMinutes(sample: Pick<WritingSample, 'body'>) {
  const words = sample.body.reduce((total, block) => total + countWords(blockText(block)), 0)
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function formatReadingTime(sample: Pick<WritingSample, 'body'>) {
  return `${getReadingMinutes(sample)} min read`
}
