import { useEffect, useMemo, useRef, useState } from 'react'
import { AllTransactionsModal } from '../components/income/AllTransactionsModal'
import { AddTransactionModal } from '../components/income/AddTransactionModal'
import { ExpenseBreakdownCard } from '../components/income/ExpenseBreakdownCard'
import { IncomeHeader } from '../components/income/IncomeHeader'
import { IncomeSummaryCards } from '../components/income/IncomeSummaryCards'
import { IncomeSustainabilityCard } from '../components/income/IncomeSustainabilityCard'
import { IncomeVsExpensesChart } from '../components/income/IncomeVsExpensesChart'
import { RecentTransactionsTable } from '../components/income/RecentTransactionsTable'
import { SavingsTrendCard } from '../components/income/SavingsTrendCard'
import {
  getExpenseBreakdown,
  getFilteredTransactions,
  getMonthlyChartData,
  getNetSavings,
  getPeakIncomeMonth,
  getProjectedAnnualSavings,
  getRecentTransactions,
  getSavingsRate,
  getSavingsStatus,
  getSavingsTrendData,
  getTopExpenseCategory,
  getTotalExpenses,
  getTotalIncome,
  useIncomeStore,
} from '../store/useIncomeStore'
import type { Transaction, TransactionType } from '../types/income.types'

export function IncomePage() {
  const MODAL_ANIMATION_MS = 220
  const transactions = useIncomeStore((state) => state.transactions)
  const searchQuery = useIncomeStore((state) => state.searchQuery)
  const setSearchQuery = useIncomeStore((state) => state.setSearchQuery)
  const deleteTransaction = useIncomeStore((state) => state.deleteTransaction)

  const [showModal, setShowModal] = useState(false)
  const [prefillType, setPrefillType] = useState<TransactionType | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isAllTransactionsMounted, setIsAllTransactionsMounted] = useState(false)
  const [isAllTransactionsVisible, setIsAllTransactionsVisible] = useState(false)
  const allTransactionsCloseTimeoutRef = useRef<number | undefined>(undefined)

  const totalIncome = useMemo(() => getTotalIncome(transactions), [transactions])
  const totalExpenses = useMemo(() => getTotalExpenses(transactions), [transactions])
  const netSavings = useMemo(() => getNetSavings(transactions), [transactions])
  const savingsRate = useMemo(() => getSavingsRate(transactions), [transactions])
  const savingsStatus = useMemo(() => getSavingsStatus(savingsRate), [savingsRate])
  const chartData = useMemo(() => getMonthlyChartData(transactions), [transactions])
  const peakMonth = useMemo(() => getPeakIncomeMonth(chartData), [chartData])
  const breakdown = useMemo(() => getExpenseBreakdown(transactions), [transactions])
  const topCategory = useMemo(() => getTopExpenseCategory(breakdown), [breakdown])
  const trendData = useMemo(() => getSavingsTrendData(transactions), [transactions])
  const projectedSavings = useMemo(() => getProjectedAnnualSavings(transactions), [transactions])
  const recentTransactions = useMemo(() => getRecentTransactions(transactions, 5), [transactions])
  const filteredTransactions = useMemo(() => getFilteredTransactions(transactions, searchQuery), [searchQuery, transactions])

  useEffect(() => {
    return () => {
      if (allTransactionsCloseTimeoutRef.current !== undefined) {
        window.clearTimeout(allTransactionsCloseTimeoutRef.current)
      }
    }
  }, [])

  function openTransactionModal(type: TransactionType | null, transaction: Transaction | null = null) {
    setPrefillType(type)
    setEditingTransaction(transaction)
    setShowModal(true)
  }

  function closeTransactionModal() {
    setShowModal(false)
    setPrefillType(null)
    setEditingTransaction(null)
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

  function handleEditTransaction(transaction: Transaction) {
    closeAllTransactions()
    openTransactionModal(null, transaction)
  }

  function handleDeleteTransaction(transaction: Transaction) {
    if (!window.confirm('Delete this transaction?')) {
      return
    }

    deleteTransaction(transaction.id)
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <IncomeHeader
        searchValue={searchQuery}
        onSearchValueChange={setSearchQuery}
        onLogIncome={() => openTransactionModal('income')}
        onLogExpense={() => openTransactionModal('expense')}
        onAddTransaction={() => openTransactionModal(null)}
      />

      <div className="space-y-8">
        <IncomeSummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netSavings={netSavings}
          savingsRate={savingsRate}
          savingsStatus={savingsStatus}
        />

        <IncomeVsExpensesChart data={chartData} peakMonth={peakMonth} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8">
            <ExpenseBreakdownCard breakdown={breakdown} topCategory={topCategory} />
            <SavingsTrendCard trendData={trendData} projectedSavings={projectedSavings} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <RecentTransactionsTable
              transactions={recentTransactions}
              onViewAll={openAllTransactions}
              showViewAll={transactions.length > 5}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
            <IncomeSustainabilityCard />
          </div>
        </div>
      </div>

      <AddTransactionModal
        open={showModal}
        onClose={closeTransactionModal}
        prefillType={prefillType}
        editingTransaction={editingTransaction}
      />

      <AllTransactionsModal
        isMounted={isAllTransactionsMounted}
        isVisible={isAllTransactionsVisible}
        transactions={filteredTransactions}
        onClose={closeAllTransactions}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  )
}

export default IncomePage