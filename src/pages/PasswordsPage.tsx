import { ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AddEntryModal } from '../components/passwords/AddEntryModal'
import { PasswordEntryCard } from '../components/passwords/PasswordEntryCard'
import { PasswordGeneratorCard } from '../components/passwords/PasswordGeneratorCard'
import { PasswordsHeader } from '../components/passwords/PasswordsHeader'
import { SecurityHealthCard } from '../components/passwords/SecurityHealthCard'
import { VaultLockOverlay } from '../components/passwords/VaultLockOverlay'
import { getSecurityHealth, usePasswordStore } from '../store/usePasswordStore'
import { useThoughtsStore } from '../store/useThoughtsStore'
import type { PasswordEntry } from '../types/password.types'

const FALLBACK_QUOTE = 'Safety is not the absence of threat, but the presence of serenity.'

function getEntryFaviconUrl(entry: PasswordEntry): string {
  if (!entry.url) {
    return ''
  }

  try {
    const hostname = new URL(entry.url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return ''
  }
}

function generatePassword(length: number, upper: boolean, numbers: boolean, symbols: boolean): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const digits = '0123456789'
  const symbolSet = '!@#$%^&*()_+-=[]{}'

  let charset = lowercase

  if (upper) {
    charset += uppercase
  }
  if (numbers) {
    charset += digits
  }
  if (symbols) {
    charset += symbolSet
  }

  const randomValues = window.crypto.getRandomValues(new Uint32Array(length))
  let next = ''

  for (let i = 0; i < length; i += 1) {
    next += charset[randomValues[i] % charset.length]
  }

  return next
}

export function PasswordsPage() {
  const entries = usePasswordStore((state) => state.entries)
  const vaultState = usePasswordStore((state) => state.vaultState)
  const meta = usePasswordStore((state) => state.meta)
  const searchQuery = usePasswordStore((state) => state.searchQuery)
  const setupVault = usePasswordStore((state) => state.setupVault)
  const unlockVault = usePasswordStore((state) => state.unlockVault)
  const lockVault = usePasswordStore((state) => state.lockVault)
  const addEntry = usePasswordStore((state) => state.addEntry)
  const updateEntry = usePasswordStore((state) => state.updateEntry)
  const decryptEntryById = usePasswordStore((state) => state.decryptEntryById)
  const setSearchQuery = usePasswordStore((state) => state.setSearchQuery)
  const thoughts = useThoughtsStore((state) => state.thoughts)

  const [setupMasterPassword, setSetupMasterPassword] = useState('')
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('')
  const [unlockPassword, setUnlockPassword] = useState('')
  const [unlockError, setUnlockError] = useState('')
  const [isSubmittingVault, setIsSubmittingVault] = useState(false)
  const [revealedIds, setRevealedIds] = useState<Record<string, string>>({})
  const [copiedIds, setCopiedIds] = useState<Record<string, boolean>>({})
  const [decryptingIds, setDecryptingIds] = useState<Record<string, boolean>>({})
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null)
  const [prefillPassword, setPrefillPassword] = useState('')
  const [isSavingEntry, setIsSavingEntry] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [genLength, setGenLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const revealTimeoutsRef = useRef<Record<string, number>>({})
  const copiedTimeoutsRef = useRef<Record<string, number>>({})

  const pinnedQuote = useMemo(() => thoughts.find((thought) => thought.type === 'quote' && thought.isPinned), [thoughts])

  useEffect(() => {
    const next = generatePassword(genLength, useUpper, useNumbers, useSymbols)
    setGeneratedPassword(next)
  }, [genLength, useNumbers, useSymbols, useUpper])

  useEffect(() => {
    const revealTimeouts = revealTimeoutsRef.current
    const copiedTimeouts = copiedTimeoutsRef.current

    return () => {
      Object.values(revealTimeouts).forEach((timeoutId) => window.clearTimeout(timeoutId))
      Object.values(copiedTimeouts).forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  useEffect(() => {
    const revealedKeys = Object.keys(revealedIds)

    revealedKeys.forEach((id) => {
      if (revealTimeoutsRef.current[id]) {
        return
      }

      revealTimeoutsRef.current[id] = window.setTimeout(() => {
        setRevealedIds((current) => {
          const next = { ...current }
          delete next[id]
          return next
        })
      }, 15000)
    })

    Object.keys(revealTimeoutsRef.current).forEach((id) => {
      if (!revealedIds[id]) {
        window.clearTimeout(revealTimeoutsRef.current[id])
        delete revealTimeoutsRef.current[id]
      }
    })
  }, [revealedIds])

  useEffect(() => {
    if (vaultState === 'unlocked') {
      setUnlockError('')
      setSetupMasterPassword('')
      setConfirmMasterPassword('')
      setUnlockPassword('')
      return
    }

    setRevealedIds({})
    setCopiedIds({})
    setDecryptingIds({})
    setShowAddEntry(false)
    setEditingEntry(null)
    setPrefillPassword('')
  }, [vaultState])

  const visibleEntries = useMemo(() => {
    if (vaultState !== 'unlocked') {
      return entries
    }

    const lowered = searchQuery.trim().toLowerCase()

    if (!lowered) {
      return entries
    }

    return entries.filter((entry) => {
      return (
        entry.label.toLowerCase().includes(lowered) ||
        entry.username.toLowerCase().includes(lowered) ||
        (entry.url ?? '').toLowerCase().includes(lowered)
      )
    })
  }, [entries, searchQuery, vaultState])

  const health = useMemo(() => getSecurityHealth(entries), [entries])
  const atRisk = useMemo(() => entries.filter((entry) => entry.strength === 'weak').length, [entries])

  async function handleSetupSubmit() {
    const master = setupMasterPassword
    const confirm = confirmMasterPassword

    if (master !== confirm) {
      setUnlockError('Passwords do not match')
      return
    }

    if (master.length < 8) {
      setUnlockError('Password must be at least 8 characters')
      return
    }

    setUnlockError('')
    setIsSubmittingVault(true)

    try {
      await setupVault(master)
    } finally {
      setIsSubmittingVault(false)
    }
  }

  async function handleUnlockSubmit() {
    setUnlockError('')
    setIsSubmittingVault(true)

    try {
      const success = await unlockVault(unlockPassword)

      if (!success) {
        setUnlockError('Incorrect password')
      }
    } finally {
      setIsSubmittingVault(false)
    }
  }

  async function handleToggleReveal(entryId: string) {
    if (revealedIds[entryId]) {
      setRevealedIds((current) => {
        const next = { ...current }
        delete next[entryId]
        return next
      })
      return
    }

    setDecryptingIds((current) => ({ ...current, [entryId]: true }))

    try {
      const plain = await decryptEntryById(entryId)
      setRevealedIds((current) => ({ ...current, [entryId]: plain }))
    } finally {
      setDecryptingIds((current) => {
        const next = { ...current }
        delete next[entryId]
        return next
      })
    }
  }

  async function handleCopy(entryId: string) {
    setDecryptingIds((current) => ({ ...current, [entryId]: true }))

    try {
      const plain = revealedIds[entryId] ?? (await decryptEntryById(entryId))
      await navigator.clipboard.writeText(plain)

      setCopiedIds((current) => ({ ...current, [entryId]: true }))

      if (copiedTimeoutsRef.current[entryId]) {
        window.clearTimeout(copiedTimeoutsRef.current[entryId])
      }

      copiedTimeoutsRef.current[entryId] = window.setTimeout(() => {
        setCopiedIds((current) => {
          const next = { ...current }
          delete next[entryId]
          return next
        })
      }, 1500)
    } finally {
      setDecryptingIds((current) => {
        const next = { ...current }
        delete next[entryId]
        return next
      })
    }
  }

  function openAddEntry(prefill = '') {
    setShowAddEntry(true)
    setEditingEntry(null)
    setPrefillPassword(prefill)
  }

  function openEditEntry(entry: PasswordEntry) {
    setShowAddEntry(true)
    setEditingEntry(entry)
    setPrefillPassword('')
  }

  function handleLockVault() {
    lockVault()
    setRevealedIds({})
    setCopiedIds({})
  }

  async function handleSaveEntry(payload: {
    label: string
    username: string
    plainPassword?: string
    url?: string
    notes?: string
  }) {
    setIsSavingEntry(true)

    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, {
          label: payload.label,
          username: payload.username,
          plainPassword: payload.plainPassword,
          url: payload.url,
          notes: payload.notes,
        })
      } else {
        await addEntry({
          label: payload.label,
          username: payload.username,
          plainPassword: payload.plainPassword ?? '',
          url: payload.url,
          notes: payload.notes,
        })
      }

      setShowAddEntry(false)
      setEditingEntry(null)
      setPrefillPassword('')
    } finally {
      setIsSavingEntry(false)
    }
  }

  function handleToggleOption(option: 'upper' | 'numbers' | 'symbols') {
    const nextState = {
      upper: useUpper,
      numbers: useNumbers,
      symbols: useSymbols,
    }

    nextState[option] = !nextState[option]

    if (!nextState.upper && !nextState.numbers && !nextState.symbols) {
      return
    }

    setUseUpper(nextState.upper)
    setUseNumbers(nextState.numbers)
    setUseSymbols(nextState.symbols)
  }

  const statusText = vaultState === 'unlocked' ? 'Vault unlocked' : meta ? 'Vault locked' : 'Vault not initialized'

  return (
    <div className="mx-auto w-full max-w-400">
      <PasswordsHeader
        searchValue={searchQuery}
        onSearchValueChange={(value) => {
          if (vaultState !== 'unlocked') {
            return
          }
          setSearchQuery(value)
        }}
        statusText={statusText}
        onLockVault={handleLockVault}
        onAddEntry={() => openAddEntry()}
        isUnlocked={vaultState === 'unlocked'}
      />

      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-4 lg:col-span-8">
          {vaultState === 'unlocked'
            ? visibleEntries.map((entry) => (
                <PasswordEntryCard
                  key={entry.id}
                  entry={entry}
                  faviconUrl={getEntryFaviconUrl(entry)}
                  passwordValue={revealedIds[entry.id] ?? '••••••••••••'}
                  isRevealed={Boolean(revealedIds[entry.id])}
                  isCopied={Boolean(copiedIds[entry.id])}
                  isDecrypting={Boolean(decryptingIds[entry.id])}
                  onToggleReveal={handleToggleReveal}
                  onEdit={openEditEntry}
                  onCopy={() => {
                    void handleCopy(entry.id)
                  }}
                />
              ))
            : null}
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <SecurityHealthCard
            status={health.status}
            percentage={health.percentage}
            secure={health.secure}
            fair={health.fair}
            atRisk={health.atRisk}
          />

          <PasswordGeneratorCard
            generatedPassword={generatedPassword}
            length={genLength}
            includeUpper={useUpper}
            includeNumbers={useNumbers}
            includeSymbols={useSymbols}
            onLengthChange={setGenLength}
            onToggleUpper={() => handleToggleOption('upper')}
            onToggleNumbers={() => handleToggleOption('numbers')}
            onToggleSymbols={() => handleToggleOption('symbols')}
            onRegenerate={() => {
              setGeneratedPassword(generatePassword(genLength, useUpper, useNumbers, useSymbols))
            }}
            onApplyToVault={() => {
              if (vaultState !== 'unlocked') {
                return
              }

              openAddEntry(generatedPassword)
            }}
            applyTooltip={vaultState !== 'unlocked' ? 'Unlock vault first' : 'Apply to Vault'}
          />

          <section className="relative h-44 overflow-hidden rounded-xl">
            <img
              alt="Forest safety imagery"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRRc43I1KSCBPW9YdrTG1x9y8UWCRetW7ZaljVc35sysUjItvfPDXtCWVtcfAKRxLjR5QB9hZkpbyYFQCjgpTQo7nlTX93ep6B2lBLqz7aTM8OaVsiBrlHkIeBSi0mv5UM6GZgNZrH4CXlEQHCvlJ4yjMY2EsThy40SdUi4VDSZkcYI57Zx8uaqXpNPp5B9bIPTcTQ9ao_oB1vAHhBjeJz93OsSU1vmvamT_jgEJBTmPK4wt77D7EStlGwdv6rGMLYlOV-Btq1quo"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent p-5">
              <p className="mt-auto text-xs italic text-white">{pinnedQuote?.quoteText ?? FALLBACK_QUOTE}</p>
              {pinnedQuote?.attribution ? <p className="mt-1 text-[10px] text-white/90">{pinnedQuote.attribution}</p> : null}
            </div>
          </section>
        </div>
      </section>

      <AddEntryModal
        isOpen={showAddEntry && vaultState === 'unlocked'}
        editingEntry={editingEntry}
        prefillPassword={prefillPassword}
        isSaving={isSavingEntry}
        onClose={() => {
          setShowAddEntry(false)
          setEditingEntry(null)
          setPrefillPassword('')
        }}
        onSave={handleSaveEntry}
      />

      <VaultLockOverlay
        vaultState={vaultState}
        setupMasterPassword={setupMasterPassword}
        confirmMasterPassword={confirmMasterPassword}
        unlockPassword={unlockPassword}
        errorText={unlockError}
        isSubmitting={isSubmittingVault}
        onSetupMasterPasswordChange={setSetupMasterPassword}
        onConfirmMasterPasswordChange={setConfirmMasterPassword}
        onUnlockPasswordChange={setUnlockPassword}
        onSetupSubmit={() => {
          void handleSetupSubmit()
        }}
        onUnlockSubmit={() => {
          void handleUnlockSubmit()
        }}
      />

      {atRisk > 0 && vaultState === 'unlocked' && (
        <div className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-error-container px-4 py-2 text-xs font-bold text-error shadow-lg">
          <ShieldAlert size={14} /> {atRisk} weak credential{atRisk > 1 ? 's' : ''} detected
        </div>
      )}
    </div>
  )
}

export default PasswordsPage