import { useEffect, useMemo, useRef, useState } from 'react'
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
  const transactions = useIncomeStore((state) => state.transactions)
  const categories = useIncomeStore((state) => state.categories)
  const addTransaction = useIncomeStore((state) => state.addTransaction)

  const [searchValue, setSearchValue] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [draft, setDraft] = useState<DraftTransaction>(initialDraftTransaction)
  const hasSeededRef = useRef(false)

  useEffect(() => {
    if (hasSeededRef.current || transactions.length > 0) {
      return
    }

    hasSeededRef.current = true
    createSeedTransactions().forEach((tx) => addTransaction(tx))
  }, [addTransaction, transactions.length])

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
    setIsComposerOpen(true)
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
    setIsComposerOpen(false)
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
            <RecentTransactionsTable transactions={sortedTransactions.slice(0, 8)} />
            <IncomeSustainabilityCard />
          </div>
        </div>
      </div>

      <TransactionComposerModal
        isOpen={isComposerOpen}
        draft={draft}
        categories={categories}
        onDraftChange={updateDraft}
        onClose={() => setIsComposerOpen(false)}
        onSave={saveTransaction}
      />
    </div>
  )
}

export default IncomePage