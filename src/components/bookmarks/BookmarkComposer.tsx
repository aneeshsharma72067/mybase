import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Bookmark } from '../../types/bookmark.types'

interface BookmarkComposerProps {
  isOpen: boolean
  editingBookmark: Bookmark | null
  onClose: () => void
  onSave: (input: { title: string; url: string; category: string; notes?: string; favicon?: string; coverImageUrl?: string }) => void
}

const emptyForm = {
  title: '',
  url: '',
  category: 'Reference',
  notes: '',
  favicon: '',
  coverImageUrl: '',
}

export function BookmarkComposer({ isOpen, editingBookmark, onClose, onSave }: BookmarkComposerProps) {
  const [form, setForm] = useState(emptyForm)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (editingBookmark) {
      setForm({
        title: editingBookmark.title,
        url: editingBookmark.url,
        category: editingBookmark.category,
        notes: editingBookmark.notes ?? '',
        favicon: editingBookmark.favicon ?? '',
        coverImageUrl: editingBookmark.coverImageUrl ?? '',
      })
      return
    }

    if (isOpen) {
      setForm(emptyForm)
    }
  }, [editingBookmark, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = form.title.trim()
    const trimmedUrl = form.url.trim()
    const trimmedCategory = form.category.trim()

    if (!trimmedTitle || !trimmedUrl || !trimmedCategory) {
      return
    }

    onSave({
      title: trimmedTitle,
      url: trimmedUrl,
      category: trimmedCategory,
      notes: form.notes.trim() || undefined,
      favicon: form.favicon.trim() || undefined,
      coverImageUrl: form.coverImageUrl.trim() || undefined,
    })
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className={[
      'fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm',
      'bookmarks-backdrop-enter',
    ].join(' ')} onClick={onClose}>
      <div
        className={[
          'w-full max-w-lg rounded-[2.5rem] h-[80vh] overflow-y-scroll bg-surface-container-lowest p-6 shadow-2xl md:p-8',
          'bookmarks-modal-enter',
          isVisible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-black text-[#1b4332]">{editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Save a site, note, or visual reference to your library.</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface" aria-label="Close composer">
            <X size={16} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="bookmark-url">
              URL
            </label>
            <input
              id="bookmark-url"
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              placeholder="https://example.com"
              className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none ring-0 focus:bg-surface-dim focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="bookmark-title">
              Title
            </label>
            <input
              id="bookmark-title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Fetching title automatically..."
              className="w-full rounded-2xl border-2 border-surface-container-high bg-surface-container-lowest px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="bookmark-category">
                Category
              </label>
              <div className="relative">
                <select
                  id="bookmark-category"
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full appearance-none rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Design</option>
                  <option>Tech</option>
                  <option>Research</option>
                  <option>Reference</option>
                  <option>Other</option>
                </select>
                <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                  ▾
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="bookmark-favicon">
                Favicon URL
              </label>
              <input
                id="bookmark-favicon"
                value={form.favicon}
                onChange={(event) => setForm((current) => ({ ...current, favicon: event.target.value }))}
                placeholder="Optional"
                className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <input
            value={form.coverImageUrl}
            onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))}
            placeholder="Cover image URL"
            className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
          />

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="bookmark-notes">
              Notes (Optional)
            </label>
            <textarea
              id="bookmark-notes"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="What’s this about?"
              rows={4}
              className="h-24 w-full resize-none rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={onClose} className="order-2 rounded-full px-8 py-4 font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high sm:order-1 sm:flex-1">
              Cancel
            </button>
            <button type="submit" className="order-1 rounded-full bg-[#1b4332] px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 sm:order-2 sm:flex-1">
              Save bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}