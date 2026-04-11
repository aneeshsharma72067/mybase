import { ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { decrypt, encrypt } from '../lib/crypto'
import { PasswordEntryCard } from '../components/passwords/PasswordEntryCard'
import { PasswordEntryModal } from '../components/passwords/PasswordEntryModal'
import { PasswordGeneratorCard } from '../components/passwords/PasswordGeneratorCard'
import { PasswordsHeader } from '../components/passwords/PasswordsHeader'
import { SecurityHealthCard } from '../components/passwords/SecurityHealthCard'
import { VaultLockOverlay } from '../components/passwords/VaultLockOverlay'
import {
  generatePassword,
  initialDraftEntry,
  resolvePasswordIcon,
  scorePassword,
  seedVault,
  type DraftPasswordEntry,
} from '../components/passwords/passwords.helpers'
import { usePasswordStore } from '../store/usePasswordStore'

export function PasswordsPage() {
  const entries = usePasswordStore((state) => state.entries)
  const vaultState = usePasswordStore((state) => state.vaultState)
  const unlockVault = usePasswordStore((state) => state.unlockVault)
  const lockVault = usePasswordStore((state) => state.lockVault)
  const addEntry = usePasswordStore((state) => state.addEntry)

  const [searchValue, setSearchValue] = useState('')
  const [masterPasswordInput, setMasterPasswordInput] = useState('')
  const [showMasterPasswordInput, setShowMasterPasswordInput] = useState(false)
  const [unlockError, setUnlockError] = useState('')
  const [sessionKey, setSessionKey] = useState('')
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({})
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [isComposerMounted, setIsComposerMounted] = useState(false)
  const [isComposerVisible, setIsComposerVisible] = useState(false)
  const [statusText, setStatusText] = useState('Vault locked')
  const [draftEntry, setDraftEntry] = useState<DraftPasswordEntry>(initialDraftEntry)
  const hasSeededRef = useRef(false)
  const composerCloseTimerRef = useRef<number | null>(null)
  const composerOpenFrameRef = useRef<number | null>(null)

  useEffect(() => {
    lockVault()
  }, [lockVault])

  useEffect(() => {
    if (hasSeededRef.current || entries.length > 0) {
      return
    }

    hasSeededRef.current = true
    seedVault.forEach((entry) => addEntry(entry))
  }, [addEntry, entries.length])

  useEffect(() => {
    const next = generatePassword({
      length,
      includeUpper,
      includeLower,
      includeNumbers,
      includeSymbols,
    })
    setGeneratedPassword(next)
  }, [length, includeLower, includeNumbers, includeSymbols, includeUpper])

  useEffect(() => {
    return () => {
      if (composerCloseTimerRef.current) {
        window.clearTimeout(composerCloseTimerRef.current)
      }
      if (composerOpenFrameRef.current) {
        window.cancelAnimationFrame(composerOpenFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (vaultState !== 'unlocked' && isComposerMounted) {
      closeComposer()
    }
  }, [isComposerMounted, vaultState])

  const visibleEntries = useMemo(() => {
    const lowered = searchValue.trim().toLowerCase()

    if (!lowered) {
      return entries
    }

    return entries.filter((entry) => {
      return (
        entry.label.toLowerCase().includes(lowered) ||
        entry.username.toLowerCase().includes(lowered) ||
        (entry.url ?? '').toLowerCase().includes(lowered) ||
        (entry.notes ?? '').toLowerCase().includes(lowered)
      )
    })
  }, [entries, searchValue])

  const strengthSummary = useMemo(() => {
    const counts = { strong: 0, fair: 0, weak: 0 }

    entries.forEach((entry) => {
      const resolved = decrypt(entry.encryptedPassword, sessionKey || 'mybase-demo-key')
      const score = scorePassword(resolved)
      counts[score] += 1
    })

    const total = Math.max(entries.length, 1)
    const securePercent = Math.round((counts.strong / total) * 100)

    return {
      ...counts,
      total,
      securePercent,
    }
  }, [entries, sessionKey])

  function handleUnlock() {
    const success = unlockVault(masterPasswordInput)

    if (!success) {
      setUnlockError('Enter a valid master password to unlock.')
      return
    }

    setSessionKey(masterPasswordInput.trim())
    setUnlockError('')
    setMasterPasswordInput('')
    setShowMasterPasswordInput(false)
    setStatusText('Vault unlocked')
  }

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value)
    setStatusText('Copied to clipboard')
  }

  function handleSaveDraft() {
    const label = draftEntry.label.trim()
    const username = draftEntry.username.trim()
    const password = draftEntry.password.trim()

    if (!label || !username || !password) {
      setStatusText('Label, username, and password are required')
      return
    }

    addEntry({
      label,
      username,
      encryptedPassword: encrypt(password, sessionKey || 'mybase-demo-key'),
      url: draftEntry.url.trim() || undefined,
      notes: draftEntry.notes.trim() || undefined,
    })

    setDraftEntry(initialDraftEntry)
    closeComposer()
    setStatusText('Password entry added')
  }

  function handleDraftChange(field: keyof DraftPasswordEntry, value: string) {
    setDraftEntry((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function openComposer(prefillPassword?: string) {
    if (vaultState !== 'unlocked') {
      return
    }

    if (prefillPassword) {
      setDraftEntry((current) => ({ ...current, password: prefillPassword }))
    }

    if (composerCloseTimerRef.current) {
      window.clearTimeout(composerCloseTimerRef.current)
      composerCloseTimerRef.current = null
    }

    setIsComposerMounted(true)
    setIsComposerVisible(false)

    composerOpenFrameRef.current = window.requestAnimationFrame(() => {
      setIsComposerVisible(true)
    })
  }

  function closeComposer() {
    setIsComposerVisible(false)

    if (composerCloseTimerRef.current) {
      window.clearTimeout(composerCloseTimerRef.current)
    }

    composerCloseTimerRef.current = window.setTimeout(() => {
      setIsComposerMounted(false)
      composerCloseTimerRef.current = null
    }, 220)
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <PasswordsHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        statusText={statusText}
        onLockVault={() => {
          lockVault()
          setSessionKey('')
          setStatusText('Vault locked')
        }}
        onAddEntry={() => openComposer(generatedPassword)}
        isUnlocked={vaultState === 'unlocked'}
      />

      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-4 lg:col-span-8">
          {visibleEntries.map((entry) => {
            const Icon = resolvePasswordIcon(entry.label)
            const isRevealed = Boolean(revealedIds[entry.id])
            const decrypted = decrypt(entry.encryptedPassword, sessionKey || 'mybase-demo-key')
            const score = scorePassword(decrypted)

            return (
              <PasswordEntryCard
                key={entry.id}
                entry={entry}
                icon={Icon}
                passwordValue={decrypted}
                isRevealed={isRevealed}
                strength={score}
                onToggleReveal={(id) => {
                  setRevealedIds((current) => ({
                    ...current,
                    [id]: !current[id],
                  }))
                }}
                onCopy={handleCopy}
              />
            )
          })}
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <SecurityHealthCard
            securePercent={strengthSummary.securePercent}
            strong={strengthSummary.strong}
            fair={strengthSummary.fair}
            weak={strengthSummary.weak}
            total={strengthSummary.total}
          />

          <PasswordGeneratorCard
            generatedPassword={generatedPassword}
            length={length}
            includeUpper={includeUpper}
            includeLower={includeLower}
            includeNumbers={includeNumbers}
            includeSymbols={includeSymbols}
            onLengthChange={setLength}
            onToggleUpper={() => setIncludeUpper((value) => !value)}
            onToggleLower={() => setIncludeLower((value) => !value)}
            onToggleNumbers={() => setIncludeNumbers((value) => !value)}
            onToggleSymbols={() => setIncludeSymbols((value) => !value)}
            onRegenerate={() => {
              setGeneratedPassword(
                generatePassword({
                  length,
                  includeUpper,
                  includeLower,
                  includeNumbers,
                  includeSymbols,
                }),
              )
            }}
            onApplyToVault={() => openComposer(generatedPassword)}
            isUnlocked={vaultState === 'unlocked'}
          />

          <section className="relative h-44 overflow-hidden rounded-xl">
            <img
              alt="Forest safety imagery"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRRc43I1KSCBPW9YdrTG1x9y8UWCRetW7ZaljVc35sysUjItvfPDXtCWVtcfAKRxLjR5QB9hZkpbyYFQCjgpTQo7nlTX93ep6B2lBLqz7aTM8OaVsiBrlHkIeBSi0mv5UM6GZgNZrH4CXlEQHCvlJ4yjMY2EsThy40SdUi4VDSZkcYI57Zx8uaqXpNPp5B9bIPTcTQ9ao_oB1vAHhBjeJz93OsSU1vmvamT_jgEJBTmPK4wt77D7EStlGwdv6rGMLYlOV-Btq1quo"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent p-5">
              <p className="mt-auto text-xs italic text-white">Safety is not the absence of threat, but the presence of serenity.</p>
            </div>
          </section>
        </div>
      </section>

      <PasswordEntryModal
        isMounted={isComposerMounted && vaultState === 'unlocked'}
        isVisible={isComposerVisible}
        draftEntry={draftEntry}
        onDraftChange={handleDraftChange}
        onClose={closeComposer}
        onSave={handleSaveDraft}
      />

      <VaultLockOverlay
        isLocked={vaultState === 'locked'}
        showMasterPasswordInput={showMasterPasswordInput}
        masterPasswordInput={masterPasswordInput}
        unlockError={unlockError}
        onMasterPasswordInputChange={setMasterPasswordInput}
        onUnlock={handleUnlock}
        onToggleMasterPasswordInput={() => setShowMasterPasswordInput((value) => !value)}
      />

      {strengthSummary.weak > 0 && vaultState === 'unlocked' && (
        <div className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-error-container px-4 py-2 text-xs font-bold text-error shadow-lg">
          <ShieldAlert size={14} /> {strengthSummary.weak} weak credentials detected
        </div>
      )}
    </div>
  )
}

export default PasswordsPage