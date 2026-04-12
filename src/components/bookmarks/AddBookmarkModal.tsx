import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { Bookmark } from '../../types/bookmark.types'

interface AddBookmarkModalProps {
  isOpen: boolean
  categories: string[]
  editingBookmark: Bookmark | null
  onClose: () => void
  onCreate: (payload: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdate: (id: string, patch: Partial<Bookmark>) => void
}

interface BookmarkFormState {
  url: string
  title: string
  description: string
  coverImage: string
  favicon: string
  category: string
  notes: string
  isPinned: boolean
}

const ANIMATION_MS = 220

const emptyForm: BookmarkFormState = {
  url: '',
  title: '',
  description: '',
  coverImage: '',
  favicon: '',
  category: '',
  notes: '',
  isPinned: false,
}

function normalizeTags(tags: string[]): string[] {
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)))
}

export function AddBookmarkModal({
  isOpen,
  categories,
  editingBookmark,
  onClose,
  onCreate,
  onUpdate,
}: AddBookmarkModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [form, setForm] = useState<BookmarkFormState>(emptyForm)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [previewValid, setPreviewValid] = useState(true)

  const dialogRef = useRef<HTMLDivElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const isEditMode = Boolean(editingBookmark)

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      setIsVisible(false)
      const id = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(id)
    }

    setIsVisible(false)
    const timeoutId = window.setTimeout(() => {
      setIsMounted(false)
      setForm(emptyForm)
      setTags([])
      setTagInput('')
      setPreviewValid(true)
    }, ANIMATION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (editingBookmark) {
      setForm({
        url: editingBookmark.url,
        title: editingBookmark.title,
        description: editingBookmark.description ?? '',
        coverImage: editingBookmark.coverImage ?? '',
        favicon: editingBookmark.favicon ?? '',
        category: editingBookmark.category,
        notes: editingBookmark.notes ?? '',
        isPinned: editingBookmark.isPinned,
      })
      setTags(editingBookmark.tags)
      setTagInput('')
      setPreviewValid(true)
      return
    }

    setForm({
      ...emptyForm,
      category: categories[0] ?? '',
    })
    setTags([])
    setTagInput('')
    setPreviewValid(true)
  }, [categories, editingBookmark, isOpen])

  useEffect(() => {
    if (isOpen) {
      urlRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const dialog = dialogRef.current
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const items = Array.from(dialog?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
        (element) => !element.hasAttribute('disabled'),
      )

      if (items.length === 0) {
        return
      }

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const canSave = useMemo(() => form.url.trim().length > 0 && form.title.trim().length > 0, [form.title, form.url])

  function addTag(rawTag: string) {
    const normalized = rawTag.replace(/^#+/, '').trim()

    if (!normalized) {
      return
    }

    setTags((current) => normalizeTags([...current, normalized]))
    setTagInput('')
  }

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(tagInput)
    }
  }

  function handleUrlBlur() {
    if (isEditMode) {
      return
    }

    try {
      const domain = new URL(form.url.trim()).hostname
      setForm((current) => ({
        ...current,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      }))
    } catch {
      // Keep favicon untouched for invalid URLs.
    }
  }

  function handleSave() {
    if (!canSave) {
      return
    }

    const payload: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'> = {
      url: form.url.trim(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      coverImage: form.coverImage.trim() || undefined,
      favicon: form.favicon.trim() || undefined,
      category: form.category.trim() || 'reference',
      tags,
      notes: form.notes.trim() || undefined,
      isPinned: form.isPinned,
    }

    if (editingBookmark) {
      onUpdate(editingBookmark.id, payload)
    } else {
      onCreate(payload)
    }

    onClose()
  }

  if (!isMounted) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={[
          'absolute inset-0 bg-black/40 transition-opacity ease-out',
          isVisible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      />

      <div
        ref={dialogRef}
        className={[
          'relative z-10 h-11/12 w-full max-w-3xl overflow-y-scroll rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-2xl transition-[opacity,transform] ease-out md:p-8',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        ].join(' ')}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-on-surface">{isEditMode ? 'Edit Bookmark' : 'Add Bookmark'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close bookmark modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-url-input">
              URL
            </label>
            <input
              ref={urlRef}
              id="bookmark-url-input"
              type="text"
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              onBlur={handleUrlBlur}
              placeholder="https://..."
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-title-input">
              Title
            </label>
            <input
              id="bookmark-title-input"
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Page or article title"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-description-input">
              Description
            </label>
            <textarea
              id="bookmark-description-input"
              rows={2}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="What is this about?"
              className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-cover-input">
              Cover image URL
            </label>
            <input
              id="bookmark-cover-input"
              type="text"
              value={form.coverImage}
              onChange={(event) => {
                setPreviewValid(true)
                setForm((current) => ({ ...current, coverImage: event.target.value }))
              }}
              placeholder="https://... (paste an image URL)"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
            {form.coverImage.trim() ? (
              previewValid ? (
                <div
                  className="mt-2 h-12 w-full rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${form.coverImage})` }}
                  role="img"
                  aria-label="Cover preview"
                >
                  <img
                    src={form.coverImage}
                    alt=""
                    className="hidden"
                    onError={() => setPreviewValid(false)}
                    onLoad={() => setPreviewValid(true)}
                  />
                </div>
              ) : (
                <p className="mt-2 text-xs text-outline">Image URL not valid</p>
              )
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-favicon-input">
              Favicon URL
            </label>
            <input
              id="bookmark-favicon-input"
              type="text"
              value={form.favicon}
              onChange={(event) => setForm((current) => ({ ...current, favicon: event.target.value }))}
              placeholder="Auto-filled from URL, or paste manually"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-category-input">
              Category
            </label>
            <input
              id="bookmark-category-input"
              type="text"
              list="bookmark-category-options"
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              placeholder="design / tech / research..."
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
            <datalist id="bookmark-category-options">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-tag-input">
              Tags
            </label>
            <input
              id="bookmark-tag-input"
              type="text"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => addTag(tagInput)}
              placeholder="Type and press Enter or comma"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                  className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-outline"
                  aria-label={`Remove tag ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-on-surface-variant" htmlFor="bookmark-notes-input">
              Notes
            </label>
            <textarea
              id="bookmark-notes-input"
              rows={2}
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Personal note about why you saved this..."
              className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(event) => setForm((current) => ({ ...current, isPinned: event.target.checked }))}
              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-0"
            />
            <span>Pin as featured bookmark</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-surface-container-high px-5 py-2 text-sm font-bold text-on-surface hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBookmarkModal
