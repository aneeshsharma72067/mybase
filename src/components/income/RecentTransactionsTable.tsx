import { ArrowDownCircle, ArrowUpCircle, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { Transaction } from '../../types/income.types'
import { formatCurrency } from '../../store/useIncomeStore'

interface RecentTransactionsTableProps {
  transactions: Transaction[]
  onViewAll?: () => void
  showViewAll?: boolean
  onEditTransaction?: (transaction: Transaction) => void
  onDeleteTransaction?: (transaction: Transaction) => void
}

export function RecentTransactionsTable({
  transactions,
  onViewAll,
  showViewAll = true,
  onEditTransaction,
  onDeleteTransaction,
}: RecentTransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface-container-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant/25 px-8 py-6">
        <h4 className="font-display text-xl font-bold text-on-surface">Recent Transactions</h4>
        {showViewAll ? (
          <button type="button" onClick={onViewAll} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View All <ExternalLink size={14} />
          </button>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-outline">
            <tr>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">Description</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Type</th>
              <th className="px-8 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {transactions.map((tx) => (
              <tr key={tx.id} className="group transition-colors hover:bg-surface-container-lowest">
                <td className="px-8 py-5 text-sm text-on-surface-variant">
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-bold uppercase tracking-wider">{format(parseISO(tx.date), 'MMM')}</span>
                    <span className="text-lg font-black text-on-surface">{format(parseISO(tx.date), 'd')}</span>
                    <span className="text-[11px] font-semibold text-outline">{format(parseISO(tx.date), 'yyyy')}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-on-surface">{tx.description}</span>
                    {onEditTransaction || onDeleteTransaction ? (
                      <div className="flex items-center gap-1 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                        {onEditTransaction ? (
                          <button
                            type="button"
                            onClick={() => onEditTransaction(tx)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-primary"
                            aria-label={`Edit transaction ${tx.description}`}
                          >
                            <Pencil size={13} />
                          </button>
                        ) : null}
                        {onDeleteTransaction ? (
                          <button
                            type="button"
                            onClick={() => onDeleteTransaction(tx)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-error"
                            aria-label={`Delete transaction ${tx.description}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={[
                    'rounded-full px-3 py-1 text-[10px] font-bold',
                    tx.type === 'income' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container',
                  ].join(' ')}>
                    {tx.category}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className={[
                    'inline-flex items-center gap-2 text-xs font-bold',
                    tx.type === 'income' ? 'text-primary' : 'text-secondary',
                  ].join(' ')}>
                    {tx.type === 'income' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                    {tx.type === 'income' ? 'Income' : 'Expense'}
                  </div>
                </td>
                <td className={[
                  'min-w-[100px] px-8 py-5 text-right font-black whitespace-nowrap',
                  tx.type === 'income' ? 'text-primary' : 'text-secondary',
                ].join(' ')}>
                  {tx.type === 'income' ? formatCurrency(tx.amount) : `−${formatCurrency(tx.amount)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}