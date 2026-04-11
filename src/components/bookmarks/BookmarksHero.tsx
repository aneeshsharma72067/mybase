import { ArrowRight } from 'lucide-react'

interface BookmarksHeroProps {
  totalCount: number
  categoryBreakdown: Array<{ name: string; count: number; color: string }>
}

export function BookmarksHero({ totalCount, categoryBreakdown }: BookmarksHeroProps) {
  const totalForChart = Math.max(totalCount, 1)
  const design = categoryBreakdown[0]?.count ?? 0
  const tech = categoryBreakdown[1]?.count ?? 0
  const other = Math.max(totalForChart - design - tech, 0)
  const designPercent = Math.round((design / totalForChart) * 100)
  const techPercent = Math.round((tech / totalForChart) * 100)
  const otherPercent = Math.max(0, 100 - designPercent - techPercent)

  return (
    <div className="grid grid-cols-12 gap-8 mb-12">
      <div className="col-span-12 lg:col-span-4 rounded-xl bg-surface-container-lowest p-10 text-center">
        <h3 className="mb-8 font-display text-lg font-bold text-on-surface">Category Distribution</h3>
        <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full" style={{ background: `conic-gradient(#2d6a4f 0% ${designPercent}%, #b1f0ce ${designPercent}% ${designPercent + techPercent}%, #dfe4de ${designPercent + techPercent}% 100%)` }}>
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-surface-container-lowest">
            <span className="text-2xl font-black text-primary">{totalCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Total</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />{categoryBreakdown[0]?.name ?? 'Design'}</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary-container" />{categoryBreakdown[1]?.name ?? 'Tech'}</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-surface-variant" />Other</span>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-outline">{designPercent}% / {techPercent}% / {otherPercent}%</p>
        <p className="sr-only">Other count {other}</p>
      </div>

      <div className="col-span-12 overflow-hidden rounded-xl bg-primary-container/30 p-10 relative flex flex-col justify-end lg:col-span-8">
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-20">
          <img
            alt="Close up of lush green tropical fern leaves with soft natural lighting and morning dew"
            className="h-full w-full rounded-l-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw90k2AQCuHth9_iIlX0zwG_tn3berWypDbApfwa0jYQgvtoJ1cys7J1qbQnyWzaANizLGXTSbMrp9zXy-5XaN9iTQluAjSrbnSol29CdqP-6hCy-gClTmPJSljD_z5uPFUqGdzRBn5mLTHX4nHz8yNzw7BLhnTaiJGdPrQ58fUplOyOn34XML4aDRdpST6tVHMeMPc5-uRfk2F4k5I6I1gBqFpUd83giAhKV2Jh_5c7Cdn1cTNCkj2ENp4bRKESAScyDF6Hq_t1w"
          />
        </div>
        <div className="relative z-10 max-w-md">
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-on-primary">Featured Collection</span>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight text-primary">Minimalist Workspace Inspiration</h2>
          <p className="mt-3 text-lg leading-relaxed text-on-surface-variant">A curated set of 24 bookmarks focused on biophilic office design and productive environments.</p>
          <button type="button" className="mt-8 inline-flex items-center gap-2 font-bold text-primary transition-all hover:gap-4">
            View Collection <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}