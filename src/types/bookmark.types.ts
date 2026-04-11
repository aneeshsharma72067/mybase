export type BookmarkCategory = string

export interface Bookmark {
  id: string
  title: string
  url: string
  favicon?: string
  coverImageUrl?: string
  category: BookmarkCategory
  notes?: string
  createdAt: string
}

export interface BookmarkStoreState {
  bookmarks: Bookmark[]
  categories: string[]
}