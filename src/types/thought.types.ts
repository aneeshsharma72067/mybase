export type ThoughtType = 'braindump' | 'quote'

export interface Thought {
  id: string
  type: ThoughtType

  // braindump fields
  title?: string // if empty, default to "Brain Dump on {date}" at save time
  body?: string
  isDraft?: boolean // true if saved with a title but no body

  // quote fields
  quoteText?: string
  attribution?: string // who said it - could be empty

  // shared
  tags: string[]
  createdAt: string // ISO string
  updatedAt: string
  isPinned: boolean
}

export interface ThoughtStoreState {
  thoughts: Thought[]
  activeThoughtId: string | null
}