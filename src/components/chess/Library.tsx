import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CircleCheck, Clock, Lock, Sparkles } from 'lucide-react'
import { Chess } from 'chess.js'
import { MiniBoard } from './Board'
import { buildStart } from './useDrill'
import { cn } from '@/lib/utils'
import { TIERS, TRACK_META, lessonsFor, tierFor, type Lesson, type TierId, type Track } from '@/data/curriculum'
import { dueLabel, INTERVALS, lessonStatus, useProgress } from '@/lib/progress'

function finalFen(l: Lesson) {
  if (l.locked) return new Chess().fen()
  const { fen } = buildStart(l.fen, [...(l.setup ?? []), ...l.moves])
  return fen
}

export function Library({ track }: { track: Track }) {
  const meta = TRACK_META[track]
  const all = useMemo(() => lessonsFor(track), [track])
  const [tier, setTier] = useState<TierId | 'all'>('all')
  const [side, setSide] = useState<'all' | 'w' | 'b'>('all')
  const { progress, ready } = useProgress()

  const shown = all.filter((l) => (tier === 'all' || tierFor(l.rating).id === tier) && (side === 'all' || l.side === side))
  const open = all.filter((l) => !l.locked)
  const due = open.filter((l) => lessonStatus(progress.lessons[l.id]) === 'due').length
  const mastered = open.filter((l) => lessonStatus(progress.lessons[l.id]) === 'mastered').length
  const started = open.filter((l) => progress.lessons[l.id]).length

  return (
    <div>
      <section className="border-b bg-secondary/60">
        <div className="mx-auto flex max-w-content flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-bold uppercase tracking-wider text-accent">Training · {open.length} lessons</p>
            <h1 className="mt-2 text-5xl font-extrabold">{meta.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{meta.tagline}</p>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              ['Started', ready ? started : '–'],
              ['Due now', ready ? due : '–'],
              ['Mastered', ready ? mastered : '–'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border bg-card px-4 py-3">
                <dd className="font-display text-2xl font-extrabold">{v}</dd>
                <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by rating tier">
          <Chip active={tier === 'all'} onClick={() => setTier('all')}>
            All ratings
          </Chip>
          {TIERS.map((t) => (
            <Chip key={t.id} active={tier === t.id} onClick={() => setTier(t.id)}>
              <span className="piece" aria-hidden>
                {t.glyph}
                {'︎'}
              </span>{' '}
              {t.name} <span className="font-mono text-xs opacity-70">{t.min}+</span>
            </Chip>
          ))}
          {track === 'openings' && (
            <div className="ml-auto flex gap-2" role="group" aria-label="Filter by side">
              {(['all', 'w', 'b'] as const).map((s) => (
                <Chip key={s} active={side === s} onClick={() => setSide(s)}>
                  {s === 'all' ? 'Both sides' : s === 'w' ? 'As White' : 'As Black'}
                </Chip>
              ))}
            </div>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed p-12 text-center">
            <p className="font-display text-2xl font-extrabold">Nothing here yet</p>
            <p className="mt-2 text-muted-foreground">No lessons match this filter. New lessons are added regularly — try another tier.</p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((l) => (
              <li key={l.id}>
                <LessonCard lesson={l} rec={ready ? progress.lessons[l.id] : undefined} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-bold transition-colors motion-reduce:transition-none',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}

function LessonCard({ lesson: l, rec }: { lesson: Lesson; rec: ReturnType<typeof useProgress>['progress']['lessons'][string] | undefined }) {
  const tier = tierFor(l.rating)
  const status = lessonStatus(rec)
  const body = (
    <article className={cn('group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow motion-reduce:transition-none', !l.locked && 'hover:shadow-lg')}>
      <div className="relative">
        <MiniBoard fen={finalFen(l)} orientation={l.side} className={cn('rounded-none', l.locked && 'opacity-40 grayscale')} />
        <span className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-extrabold shadow">
          {tier.glyph}
          {'︎'} {tier.name} · {l.rating}
        </span>
        {l.locked && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background">
              <Lock className="size-4" /> Coming soon
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-xl font-extrabold leading-tight">{l.title}</h2>
          {l.eco && <span className="font-mono text-xs font-bold text-muted-foreground">{l.eco}</span>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{l.subtitle}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', l.side === 'w' ? 'border bg-background' : 'bg-foreground text-background')}>
            Play as {l.side === 'w' ? 'White' : 'Black'}
          </span>
          {l.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
              {t}
            </span>
          ))}
        </div>
        {!l.locked && (
          <div className="mt-auto flex items-center justify-between pt-5">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-bold',
                status === 'due' && 'text-accent',
                status === 'mastered' && 'text-success',
                status === 'new' && 'text-primary',
                status === 'learning' && 'text-muted-foreground',
              )}
            >
              {status === 'mastered' ? <CircleCheck className="size-4" /> : status === 'new' ? <Sparkles className="size-4" /> : <Clock className="size-4" />}
              {dueLabel(rec)}
            </span>
            <span className="flex gap-1" aria-label={`Memory box ${rec ? rec.box : 0} of ${INTERVALS.length - 1}`}>
              {INTERVALS.slice(1).map((_, i) => (
                <span key={i} className={cn('h-2 w-4 rounded-full', rec && rec.box > i ? 'bg-success' : 'bg-muted')} />
              ))}
            </span>
          </div>
        )}
      </div>
    </article>
  )
  if (l.locked) return body
  return (
    <Link to="/lesson/$lessonId" params={{ lessonId: l.id }} className="block h-full rounded-2xl">
      {body}
    </Link>
  )
}
