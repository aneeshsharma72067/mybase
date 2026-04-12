export interface Bookmark {
  id: string
  url: string
  title: string
  description?: string
  coverImage?: string
  favicon?: string
  category: string
  tags: string[]
  notes?: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}