import { ExternalLink, MoreHorizontal, Pencil, Pin, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getFaviconUrl, getGradientForCategory } from '../../store/useBookmarksStore'
import type { Bookmark } from '../../types/bookmark.types'

interface BookmarkCardProps {
  bookmark: Bookmark
  mode: 'grid' | 'list'
  onEdit: (bookmark: Bookmark) => void
  onDelete: (bookmark: Bookmark) => void
  onPin: (bookmark: Bookmark) => void
}

function isStrongVisualCategory(category: string): boolean {
  const normalized = category.trim().toLowerCase()
  return normalized === 'design' || normalized === 'research'
}

export function BookmarkCard({ bookmark, mode, onEdit, onDelete, onPin }: BookmarkCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showFaviconFallback, setShowFaviconFallback] = useState(false)
  const safeTitle = (bookmark.title ?? '').trim() || 'Untitled'
  const safeCategory = (bookmark.category ?? '').trim() || 'reference'
  const safeUrl = (bookmark.url ?? '').trim() || '#'
  const safeTags = Array.isArray(bookmark.tags) ? bookmark.tags : []
  const faviconUrl = getFaviconUrl(bookmark)
  const isImageCard = Boolean(bookmark.coverImage) || isStrongVisualCategory(safeCategory)

  function openBookmark() {
    if (safeUrl === '#') {
      return
    }

    window.open(safeUrl, '_blank', 'noopener noreferrer')
  }

  function handleDelete() {
    if (window.confirm('Delete this bookmark?')) {
      onDelete(bookmark)
    }
    setIsMenuOpen(false)
  }

  if (mode === 'list') {
    return (
      <article className="rounded-xl bg-surface-container-lowest p-5 transition-colors hover:bg-surface-container">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary">
            {faviconUrl && !showFaviconFallback ? (
              <img
                alt=""
                className="h-6 w-6"
                src={faviconUrl}
                onError={() => setShowFaviconFallback(true)}
              />
            ) : (
              <span className="text-xs font-black text-secondary">{safeTitle.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{safeCategory}</p>
                <h3 className="truncate font-display text-lg font-bold text-on-surface">{safeTitle}</h3>
                <p className="mt-1 text-xs text-outline">{safeUrl.replace(/^https?:\/\//, '')}</p>
              </div>
              <button type="button" onClick={openBookmark} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary" aria-label="Open bookmark">
                <ExternalLink size={14} />
              </button>
            </div>
            {bookmark.description || bookmark.notes ? (
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{bookmark.description ?? bookmark.notes}</p>
            ) : null}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary"
              aria-label="Open bookmark actions"
            >
              <MoreHorizontal size={14} />
            </button>
            {isMenuOpen ? (
              <div className="absolute right-0 top-9 z-20 min-w-40 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onEdit(bookmark)
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPin(bookmark)
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container"
                >
                  <Pin size={13} /> {bookmark.isPinned ? 'Unpin' : 'Pin as featured'}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-error hover:bg-surface-container"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={[
      'group break-inside-avoid overflow-hidden rounded-xl transition-all active:scale-[0.98]',
      isImageCard ? 'cursor-pointer' : 'bg-surface-container-lowest',
    ].join(' ')}>
      {isImageCard ? (
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="h-80 w-full transition-transform duration-700 group-hover:scale-105"
            style={
              bookmark.coverImage
                ? { backgroundImage: `url(${bookmark.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: getGradientForCategory(safeCategory) }
            }
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-white/75 p-4 backdrop-blur">
            <div>
              <p className="text-xs font-bold uppercase tracking-tighter text-primary">{bookmark.category}</p>
              <h4 className="font-display font-bold text-on-surface">{safeTitle}</h4>
            </div>
            <button type="button" onClick={openBookmark} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary-container/60" aria-label="Open bookmark">
              <ExternalLink size={15} />
            </button>
          </div>
          <div className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm"
              aria-label="Bookmark actions"
            >
              <MoreHorizontal size={13} />
            </button>
            {isMenuOpen ? (
              <div className="absolute right-0 top-10 z-20 min-w-40 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onEdit(bookmark)
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPin(bookmark)
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container"
                >
                  <Pin size={13} /> {bookmark.isPinned ? 'Unpin' : 'Pin as featured'}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-error hover:bg-surface-container"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-container-lowest p-8 hover:bg-surface-container">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-secondary">
              {faviconUrl && !showFaviconFallback ? (
                <img
                  alt=""
                  className="h-6 w-6"
                  src={faviconUrl}
                  onError={() => setShowFaviconFallback(true)}
                />
              ) : (
                <span className="text-xs font-black text-secondary">{safeTitle.slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="text-outline hover:text-error"
              aria-label="Bookmark actions"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
          {isMenuOpen ? (
            <div className="mb-4 rounded-lg border border-outline-variant/30 bg-surface-container-low p-1">
              <button
                type="button"
                onClick={() => {
                  onEdit(bookmark)
                  setIsMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  onPin(bookmark)
                  setIsMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container"
              >
                <Pin size={13} /> {bookmark.isPinned ? 'Unpin' : 'Pin as featured'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-error hover:bg-surface-container"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          ) : null}
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">{safeCategory}</p>
          <h4 className="mb-2 font-display text-xl font-bold text-on-surface">{safeTitle}</h4>
          <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
            {bookmark.description ?? bookmark.notes ?? safeUrl.replace(/^https?:\/\//, '')}
          </p>
          <div className="flex items-center gap-2">
            {safeTags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded bg-surface-variant px-2 py-1 text-[10px] font-bold uppercase">
                {tag}
              </span>
            ))}
            <button type="button" onClick={openBookmark} className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary-container/60" aria-label="Open bookmark">
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}