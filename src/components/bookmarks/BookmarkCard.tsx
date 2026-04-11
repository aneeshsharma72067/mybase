import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { Bookmark } from '../../types/bookmark.types'

interface BookmarkCardProps {
  bookmark: Bookmark
  mode: 'grid' | 'list'
  onOpen: (bookmark: Bookmark) => void
  onEdit: (bookmark: Bookmark) => void
  onDelete: (bookmark: Bookmark) => void
}

export function BookmarkCard({ bookmark, mode, onOpen, onEdit, onDelete }: BookmarkCardProps) {
  const isImageCard = Boolean(bookmark.coverImageUrl)

  if (mode === 'list') {
    return (
      <article className="rounded-xl bg-surface-container-lowest p-5 transition-colors hover:bg-surface-container">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container">
            {bookmark.favicon ? <img alt="" className="h-6 w-6" src={bookmark.favicon} /> : <span className="text-xs font-black text-primary">{bookmark.category.slice(0, 2).toUpperCase()}</span>}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{bookmark.category}</p>
                <h3 className="truncate font-display text-lg font-bold text-on-surface">{bookmark.title}</h3>
                <p className="mt-1 text-xs text-outline">{bookmark.url.replace(/^https?:\/\//, '')}</p>
              </div>
              <button type="button" onClick={() => onOpen(bookmark)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary" aria-label="Open bookmark">
                <ExternalLink size={14} />
              </button>
            </div>
            {bookmark.notes ? <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{bookmark.notes}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => onEdit(bookmark)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary" aria-label="Edit bookmark">
              <Pencil size={14} />
            </button>
            <button type="button" onClick={() => onDelete(bookmark)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-error" aria-label="Delete bookmark">
              <Trash2 size={14} />
            </button>
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
          <img alt={bookmark.title} className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" src={bookmark.coverImageUrl} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-white/75 p-4 backdrop-blur">
            <div>
              <p className="text-xs font-bold uppercase tracking-tighter text-primary">{bookmark.category}</p>
              <h4 className="font-display font-bold text-on-surface">{bookmark.title}</h4>
            </div>
            <button type="button" onClick={() => onOpen(bookmark)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary-container/60" aria-label="Open bookmark">
              <ExternalLink size={15} />
            </button>
          </div>
          <div className="absolute right-3 top-3 flex gap-2">
            <button type="button" onClick={() => onEdit(bookmark)} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm" aria-label="Edit bookmark">
              <Pencil size={13} />
            </button>
            <button type="button" onClick={() => onDelete(bookmark)} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm" aria-label="Delete bookmark">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-surface-container-lowest p-8 hover:bg-surface-container">
          <div className="mb-6 flex items-start justify-between">
            <div className="rounded-lg bg-secondary-container p-3 text-secondary">
              <MoreHorizontal size={16} />
            </div>
            <button type="button" onClick={() => onDelete(bookmark)} className="text-outline hover:text-error" aria-label="Delete bookmark">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">{bookmark.category}</p>
          <h4 className="mb-2 font-display text-xl font-bold text-on-surface">{bookmark.title}</h4>
          <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">{bookmark.notes ?? bookmark.url.replace(/^https?:\/\//, '')}</p>
          <div className="flex items-center gap-2">
            <span className="rounded bg-surface-variant px-2 py-1 text-[10px] font-bold uppercase">Saved</span>
            <span className="rounded bg-surface-variant px-2 py-1 text-[10px] font-bold uppercase">{bookmark.category}</span>
            <button type="button" onClick={() => onOpen(bookmark)} className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary-container/60" aria-label="Open bookmark">
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}