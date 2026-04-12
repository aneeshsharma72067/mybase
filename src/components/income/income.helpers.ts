import { format } from 'date-fns'
import type { TransactionType } from '../../types/income.types'

export interface DraftTransaction {
  type: TransactionType
  amount: string
  category: string
  label: string
  date: string
  notes: string
}

export const initialDraftTransaction: DraftTransaction = {
  type: 'income',
  amount: '',
  category: '',
  label: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  notes: '',
}
