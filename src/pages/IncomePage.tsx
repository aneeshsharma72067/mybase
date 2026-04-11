import { useEffect, useMemo, useRef, useState } from 'react'
import { AllTransactionsModal } from '../components/income/AllTransactionsModal'
import { ExpenseBreakdownCard } from '../components/income/ExpenseBreakdownCard'
import { IncomeHeader } from '../components/income/IncomeHeader'
import { IncomeSummaryCards } from '../components/income/IncomeSummaryCards'
import { IncomeSustainabilityCard } from '../components/income/IncomeSustainabilityCard'
import { IncomeVsExpensesChart } from '../components/income/IncomeVsExpensesChart'
import { RecentTransactionsTable } from '../components/income/RecentTransactionsTable'
import { SavingsTrendCard } from '../components/income/SavingsTrendCard'
import { TransactionComposerModal } from '../components/income/TransactionComposerModal'
import {
  calculateSummary,
  createSeedTransactions,
  getExpenseBreakdown,
  getProjectedSavings,
  getRecentMonths,
  initialDraftTransaction,
  type DraftTransaction,
} from '../components/income/income.helpers'
import { useIncomeStore } from '../store/useIncomeStore'

export function IncomePage() {
  const MODAL_ANIMATION_MS = 220
  const transactions = useIncomeStore((state) => state.transactions)
  const categories = useIncomeStore((state) => state.categories)
  const addTransaction = useIncomeStore((state) => state.addTransaction)

  const [searchValue, setSearchValue] = useState('')
  const [isComposerMounted, setIsComposerMounted] = useState(false)
  const [isComposerVisible, setIsComposerVisible] = useState(false)
  const [isAllTransactionsMounted, setIsAllTransactionsMounted] = useState(false)
  const [isAllTransactionsVisible, setIsAllTransactionsVisible] = useState(false)
  const [draft, setDraft] = useState<DraftTransaction>(initialDraftTransaction)
  const hasSeededRef = useRef(false)
  const composerCloseTimeoutRef = useRef<number | undefined>(undefined)
  const allTransactionsCloseTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (hasSeededRef.current || transactions.length > 0) {
      return
    }

    hasSeededRef.current = true
    createSeedTransactions().forEach((tx) => addTransaction(tx))
  }, [addTransaction, transactions.length])

  useEffect(() => {
    return () => {
      if (composerCloseTimeoutRef.current !== undefined) {
        window.clearTimeout(composerCloseTimeoutRef.current)
      }
      if (allTransactionsCloseTimeoutRef.current !== undefined) {
        window.clearTimeout(allTransactionsCloseTimeoutRef.current)
      }
    }
  }, [])

  const filteredTransactions = useMemo(() => {
    const lowered = searchValue.trim().toLowerCase()

    if (!lowered) {
      return transactions
    }

    return transactions.filter((tx) => {
      return (
        tx.label.toLowerCase().includes(lowered) ||
        tx.category.toLowerCase().includes(lowered) ||
        (tx.notes ?? '').toLowerCase().includes(lowered)
      )
    })
  }, [searchValue, transactions])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [filteredTransactions])

  const summary = useMemo(() => calculateSummary(filteredTransactions), [filteredTransactions])
  const recentMonths = useMemo(() => getRecentMonths(transactions), [transactions])
  const expenseBreakdown = useMemo(() => getExpenseBreakdown(filteredTransactions), [filteredTransactions])
  const projectedSavings = useMemo(() => getProjectedSavings(recentMonths), [recentMonths])

  function updateDraft(field: keyof DraftTransaction, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function openComposer(type?: 'income' | 'expense') {
    setDraft((current) => ({
      ...current,
      ...(type ? { type } : {}),
    }))
    if (composerCloseTimeoutRef.current !== undefined) {
      window.clearTimeout(composerCloseTimeoutRef.current)
    }
    setIsComposerMounted(true)
    window.requestAnimationFrame(() => setIsComposerVisible(true))
  }

  function closeComposer() {
    setIsComposerVisible(false)
    composerCloseTimeoutRef.current = window.setTimeout(() => {
      setIsComposerMounted(false)
    }, MODAL_ANIMATION_MS)
  }

  function openAllTransactions() {
    if (allTransactionsCloseTimeoutRef.current !== undefined) {
      window.clearTimeout(allTransactionsCloseTimeoutRef.current)
    }
    setIsAllTransactionsMounted(true)
    window.requestAnimationFrame(() => setIsAllTransactionsVisible(true))
  }

  function closeAllTransactions() {
    setIsAllTransactionsVisible(false)
    allTransactionsCloseTimeoutRef.current = window.setTimeout(() => {
      setIsAllTransactionsMounted(false)
    }, MODAL_ANIMATION_MS)
  }

  function saveTransaction() {
    const amount = Number(draft.amount)

    if (!draft.label.trim() || !draft.category.trim() || !draft.date || Number.isNaN(amount) || amount <= 0) {
      return
    }

    addTransaction({
      type: draft.type,
      amount,
      category: draft.category.trim(),
      label: draft.label.trim(),
      date: draft.date,
      notes: draft.notes.trim() || undefined,
    })

    setDraft(initialDraftTransaction)
    closeComposer()
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <IncomeHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onLogIncome={() => openComposer('income')}
        onLogExpense={() => openComposer('expense')}
        onAddTransaction={() => openComposer()}
      />

      <div className="space-y-8">
        <IncomeSummaryCards
          totalIncome={summary.totalIncome}
          totalExpenses={summary.totalExpenses}
          netSavings={summary.netSavings}
          savingsRate={summary.savingsRate}
        />

        <IncomeVsExpensesChart data={recentMonths} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8">
            <ExpenseBreakdownCard topCategory={expenseBreakdown.topCategory} rows={expenseBreakdown.rows} />
            <SavingsTrendCard projectedSavings={projectedSavings} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <RecentTransactionsTable
              transactions={sortedTransactions.slice(0, 5)}
              onViewAll={openAllTransactions}
              showViewAll={sortedTransactions.length > 5}
            />
            <IncomeSustainabilityCard />
          </div>
        </div>
      </div>

      <TransactionComposerModal
        isMounted={isComposerMounted}
        isVisible={isComposerVisible}
        draft={draft}
        categories={categories}
        onDraftChange={updateDraft}
        onClose={closeComposer}
        onSave={saveTransaction}
      />

      <AllTransactionsModal
        isMounted={isAllTransactionsMounted}
        isVisible={isAllTransactionsVisible}
        transactions={sortedTransactions}
        onClose={closeAllTransactions}
      />
    </div>
  )
}

export default IncomePage