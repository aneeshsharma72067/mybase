import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useThoughtsStore } from '../../store/useThoughtsStore'
import type { Thought, ThoughtType } from '../../types/thought.types'

interface ThoughtEditorModalProps {
  isOpen: boolean
  thought?: Thought
  onClose: () => void
}

const ANIMATION_MS = 220

function normalizeTags(tags: string[]): string[] {
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)))
}

export function ThoughtEditorModal({ isOpen, thought, onClose }: ThoughtEditorModalProps) {
  const addThought = useThoughtsStore((state) => state.addThought)
  const updateThought = useThoughtsStore((state) => state.updateThought)

  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedType, setSelectedType] = useState<ThoughtType>('braindump')
  const [contentHeight, setContentHeight] = useState(0)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [quoteText, setQuoteText] = useState('')
  const [attribution, setAttribution] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const dialogRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const quoteRef = useRef<HTMLTextAreaElement>(null)

  const isEditMode = Boolean(thought)

  function resetForm() {
    setSelectedType('braindump')
    setTitle('')
    setBody('')
    setQuoteText('')
    setAttribution('')
    setTags([])
    setTagInput('')
  }

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
      resetForm()
    }, ANIMATION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (thought) {
      setSelectedType(thought.type)
      setTitle(thought.title ?? '')
      setBody(thought.body ?? '')
      setQuoteText(thought.quoteText ?? '')
      setAttribution(thought.attribution ?? '')
      setTags(thought.tags)
      setTagInput('')
      return
    }

    resetForm()
  }, [isOpen, thought])

  useEffect(() => {
    const textarea = selectedType === 'quote' ? quoteRef.current : bodyRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [body, quoteText, selectedType])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const contentElement = contentRef.current

    if (!contentElement) {
      return
    }

    const updateHeight = () => {
      setContentHeight(contentElement.scrollHeight)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(contentElement)

    return () => observer.disconnect()
  }, [isOpen, selectedType, title, body, quoteText, attribution, tags, tagInput])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const dialog = dialogRef.current
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    const focusables = Array.from(dialog?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
      (element) => !element.hasAttribute('disabled'),
    )

    focusables[0]?.focus()

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

  const canSaveQuote = useMemo(() => quoteText.trim().length > 0, [quoteText])

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

  function handleSave(asDraft: boolean) {
    if (isEditMode && thought) {
      if (selectedType === 'braindump') {
        updateThought(thought.id, {
          type: 'braindump',
          title: title.trim(),
          body: body.trim(),
          quoteText: undefined,
          attribution: undefined,
          tags,
          isDraft: asDraft,
          isPinned: thought.isPinned,
        })
      } else {
        updateThought(thought.id, {
          type: 'quote',
          title: undefined,
          body: undefined,
          isDraft: undefined,
          quoteText: quoteText.trim(),
          attribution: attribution.trim(),
          tags,
          isPinned: thought.isPinned,
        })
      }

      onClose()
      return
    }

    if (selectedType === 'braindump') {
      addThought({
        type: 'braindump',
        title: title.trim(),
        body: body.trim(),
        isDraft: asDraft,
        tags,
        isPinned: false,
      })
      onClose()
      return
    }

    if (!canSaveQuote) {
      return
    }

    addThought({
      type: 'quote',
      quoteText: quoteText.trim(),
      attribution: attribution.trim(),
      tags,
      isPinned: false,
    })
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
          'absolute inset-0 bg-black/40 transition-opacity duration-220 ease-out',
          isVisible ? 'thoughts-backdrop-enter opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      <div
        ref={dialogRef}
        className={[
          'relative z-10 w-full max-w-3xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-2xl transition-[opacity,transform,scale] duration-220 ease-out md:p-8',
          isVisible ? 'thoughts-modal-enter translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-[0.965] opacity-0',
        ].join(' ')}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-on-surface">{isEditMode ? 'Edit Thought' : 'New Thought'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close editor"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-6 relative flex rounded-full border border-outline-variant/20 bg-surface-container-lowest p-1">
          <span
            aria-hidden="true"
            className={[
              'absolute left-1 top-1 h-10 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-220 ease-out',
              selectedType === 'braindump' ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={() => setSelectedType('braindump')}
            className={[
              'relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors',
              selectedType === 'braindump' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
          >
            Brain Dump
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('quote')}
            className={[
              'relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors',
              selectedType === 'quote' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
          >
            Quote
          </button>
        </div>

        <div
          className="overflow-hidden transition-[height] duration-220 ease-out"
          style={{ height: contentHeight > 0 ? `${contentHeight}px` : '0px' }}
        >
          <div ref={contentRef} className="space-y-4">
            {selectedType === 'braindump' ? (
              <>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give it a title... (optional)"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />

            <textarea
              ref={bodyRef}
              rows={4}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What's on your mind?"
              className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />

            <div className="space-y-2">
              <input
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => addTag(tagInput)}
                placeholder="Add tags (press Enter or comma)"
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

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="rounded-full bg-surface-container-high px-5 py-2 text-sm font-bold text-on-surface hover:bg-surface-container"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim"
              >
                Save
              </button>
            </div>
              </>
            ) : null}

            {selectedType === 'quote' ? (
              <>
            <textarea
              ref={quoteRef}
              rows={3}
              value={quoteText}
              onChange={(event) => setQuoteText(event.target.value)}
              placeholder="Write the quote..."
              className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />

            <input
              type="text"
              value={attribution}
              onChange={(event) => setAttribution(event.target.value)}
              placeholder="Who said this? (optional)"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />

            <div className="space-y-2">
              <input
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => addTag(tagInput)}
                placeholder="Add tags (press Enter or comma)"
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

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={!canSaveQuote}
                className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim disabled:opacity-50"
              >
                Save
              </button>
            </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThoughtEditorModal
