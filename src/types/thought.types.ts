export type ThoughtTag = 'idea' | 'work' | 'personal' | 'random'

export interface Thought {
  id: string
  body: string
  tags: ThoughtTag[]
  createdAt: string
  pinned: boolean
}

export interface ThoughtStoreState {
  thoughts: Thought[]
}