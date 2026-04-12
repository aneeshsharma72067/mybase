import { getGoalProgress, useGoalsStore } from '../../store/useGoalsStore'
import { formatCurrency } from '../../store/useIncomeStore'

export function IncomeSustainabilityCard() {
  const goals = useGoalsStore((state) => state.goals)
  const savingsGoal = goals.find((goal) => {
    const unit = goal.unit?.toLowerCase() ?? ''
    const category = goal.category?.toLowerCase() ?? ''

    return (
      goal.status === 'active' &&
      goal.type === 'numeric' &&
      (unit.includes('₹') || unit.includes('saving') || category.includes('saving') || category.includes('finance'))
    )
  })

  const progress = savingsGoal ? getGoalProgress(savingsGoal) : 0

  return (
    <div className="group relative h-40 cursor-pointer overflow-hidden rounded-3xl">
      <img
        alt="Forest sanctuary"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKCLv9rVVZip8VkpeettPL0xvygff2K6Khdckq7jR1krojg4UKOdOkX3dM4poBbnITWTEfSP0DFvO1nUHhIkXzp14f_wIgOwQCHoMLCC1K1SZVESIXMww9uO7rIB590CVrgJ2XAhwbm3GD4ijyZBrbuSVGqsa_7Ci-4t58tZS9dT5BezGz9UYyAXdD4s9uT-zcW7xBK5dfgAAddTFq-8WoyX048yiqGn84TYxzl1BnYN08LYWRdneXoa6SiU5lArEfnilIVbQwavg"
      />
      <div className="absolute inset-0 flex flex-col justify-center bg-linear-to-r from-emerald-950/80 to-transparent px-10">
        <h5 className="font-display text-xl font-bold text-on-primary">{savingsGoal ? savingsGoal.title : 'Set a Savings Goal'}</h5>
        <p className="mt-1 text-sm text-on-primary opacity-80">
          {savingsGoal
            ? `${formatCurrency(savingsGoal.current ?? 0)} of ${formatCurrency(savingsGoal.target ?? 0)} ${savingsGoal.unit ?? ''}`.trim()
            : 'Link a numeric goal from your Goals module to track it here.'}
        </p>
        {savingsGoal ? (
          <div className="mt-4 h-1.5 w-full max-w-56 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-on-primary" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
          </div>
        ) : null}
      </div>
    </div>
  )
}