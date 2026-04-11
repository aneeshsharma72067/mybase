import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ClarityChartCard } from '../components/thoughts/ClarityChartCard'
import { ConsistencyCard } from '../components/thoughts/ConsistencyCard'
import { ThoughtCalendarCard } from '../components/thoughts/ThoughtCalendarCard'
import { ThoughtCloudCard } from '../components/thoughts/ThoughtCloudCard'
import { ThoughtHeroCard } from '../components/thoughts/ThoughtHeroCard'
import { ThoughtInsightCard } from '../components/thoughts/ThoughtInsightCard'
import { ThoughtsHeader } from '../components/thoughts/ThoughtsHeader'
import { ThoughtQuoteCard } from '../components/thoughts/ThoughtQuoteCard'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqUNBoFw54QJIu1Nm7L8S0bllyhsLW62h2PwXPccQMGFVwlR8zbW4m9ERR6NJgLgqcKHYDEf1T8R-0S5wtB5YspFWofvr2NutlQsuXFr0YzoK-KSvrWuV7YEaJWhtTctvt-xlmrT_4XQJB-UhxbqzdAfEqQMfINFB4eNvz3hGnqAisArAFBJyRA_8cVu-MUd8A3VXozAPe0h8j-MB-VFJrL8vY4Aez-yKZ0-zZ0OLP48blzZVq8aiUmU0Q525cZgAKziS-2w81Srs'

const avatarImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9yDzq8cV89BXrSbagNAx2Fl3kdCEk9kTLuDBkAsN9Gs6LQchivcty2zMhDNtOlkdEaNoBjCVb1DUB1-i5y3un0sI5_D2qgxI-RRocZim0JwZCaovcdLU6Zuck7NHs8C6JsQmwT9YImIk0DWtCYUlBZa9nhU1el7BkdhyDM-AbuZ410C-zNlFSLyMlJWyMpiD7MdW47Cxb5zHCWHq8n3blpbccDIMum1D7UWYSFD9Ri0KCUY9OMtnno3r1fjuWNwVB2Jgfy6UqPDg'

const tags = [
  'Meditation',
  'Philosophy',
  'Career',
  'Health',
  'Creative Flow',
  'Minimalism',
  'Future Plans',
  'Reading List',
]

export function ThoughtsPage() {
  const [searchValue, setSearchValue] = useState('')
  const [activeTag, setActiveTag] = useState('Meditation')
  const [mode, setMode] = useState<'month' | 'year'>('month')
  const [statusText, setStatusText] = useState('Ready to capture thoughts')

  const summary = useMemo(() => {
    if (!searchValue.trim()) {
      return `Filtering by ${activeTag}`
    }

    return `Search: ${searchValue}`
  }, [activeTag, searchValue])

  return (
    <div className="mx-auto w-full max-w-400">
      <ThoughtsHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onOpenArchive={() => setStatusText('Archive opened')}
        onOpenSettings={() => setStatusText('Settings requested')}
        onOpenNotifications={() => setStatusText('Notifications checked')}
        statusText={statusText}
      />

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-9 lg:space-y-8">
          <ThoughtHeroCard
            title="The quiet power of a morning walk in the misty pines."
            body="Finding clarity is less about forcing insights and more about allowing space for them to emerge naturally."
            date="October 24, 2023"
            backgroundImage={heroImage}
            onContinue={() => setStatusText('Continue writing opened')}
            onShare={() => setStatusText('Share panel opened')}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ThoughtInsightCard
              title="Digital Minimalism Strategy"
              body="Curating my workspace to include fewer digital interruptions has increased focus depth and reduced daily context switching."
              dateLabel="Yesterday"
              tags={[activeTag, 'Productivity']}
            />
            <ThoughtQuoteCard
              quote="The forest is a social network, but one that actually nourishes the soul."
              authorLabel="Weekly Mantra"
              note={summary}
              imageUrl={avatarImage}
            />
          </div>

          <ClarityChartCard mode={mode} onModeChange={setMode} />
        </div>

        <aside className="col-span-12 space-y-6 lg:col-span-3 lg:space-y-8">
          <ThoughtCalendarCard
            initialDate={new Date(2023, 9, 24)}
            onDateSelect={(date) => setStatusText(`Selected ${format(date, 'MMM d, yyyy')}`)}
          />
          <ThoughtCloudCard tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />
          <ConsistencyCard
            progress={85}
            summary="You recorded 12 thoughts this week and kept a 5-day reflection streak."
          />
        </aside>
      </div>
    </div>
  )
}

export default ThoughtsPage