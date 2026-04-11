import { ArrowDownCircle, ArrowUpCircle, ExternalLink } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import type { Transaction } from '../../types/income.types'
import { formatCurrency } from './income.helpers'

interface RecentTransactionsTableProps {
  transactions: Transaction[]
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface-container-lowest">
      <div className="flex items-center justify-between border-b border-surface-variant px-8 py-6">
        <h4 className="font-display text-xl font-bold text-on-surface">Recent Transactions</h4>
        <button type="button" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          View Statement <ExternalLink size={14} />
        </button>
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
          <tbody className="divide-y divide-surface-variant">
            {transactions.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-surface-container-lowest">
                <td className="px-8 py-5 text-sm text-on-surface-variant">{formatDate(tx.date, 'MMM dd, yyyy')}</td>
                <td className="px-8 py-5 font-bold text-on-surface">{tx.label}</td>
                <td className="px-8 py-5">
                  <span className="rounded-full bg-primary-container px-3 py-1 text-[10px] font-bold text-on-primary-container">{tx.category}</span>
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
                  'px-8 py-5 text-right font-black',
                  tx.type === 'income' ? 'text-primary' : 'text-secondary',
                ].join(' ')}>
                  {tx.type === 'income' ? formatCurrency(tx.amount) : `-${formatCurrency(tx.amount)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}