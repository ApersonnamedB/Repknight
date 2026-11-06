import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CircleCheck, Flame, Lightbulb, RotateCcw, SkipForward, Trophy } from 'lucide-react'
import { Chess } from 'chess.js'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Board } from '@/components/chess/Board'
import { buildStart, useDrill } from '@/components/chess/useDrill'
import { PUZZLES, tierFor, type Puzzle } from '@/data/curriculum'
import { useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/puzzles')({
  head: () => ({ meta: [{ title: 'Puzzles · RepKnight' }] }),
  component: PuzzlesPage,
})

function pickPuzzle(rating: number, solved: string[], exclude?: string) {
  const pool = PUZZLES.filter((p) => p.id !== exclude)
  const unsolved = pool.filter((p) => !solved.includes(p.id))
  const list = unsolved.length ? unsolved : pool
  return [...list].sort((a, b) => Math.abs(a.rating - rating) - Math.abs(b.rating - rating))[0]
}

function PuzzlesPage() {
  const { progress, ready } = useProgress()
  const [current, setCurrent] = useState<Puzzle | null>(null)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (ready && !current) setCurrent(pickPuzzle(progress.puzzleRating, progress.puzzlesSolved))
  }, [ready, current, progress])

  const nextPuzzle = () => {
    setCurrent(pickPuzzle(progress.puzzleRating, progress.puzzlesSolved, current?.id))
    setRun((r) => r + 1)
  }

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold uppercase tracking-wider text-accent">Rated puzzles · 600 to 2700</p>
          <h1 className="mt-1 text-5xl font-extrabold">Puzzles</h1>
        </div>
        <dl className="flex gap-3">
          <Stat icon={<Trophy className="size-4" />} label="Your rating" value={ready ? progress.puzzleRating : null} />
          <Stat icon={<Flame className="size-4" />} label="Streak" value={ready ? progress.streak : null} />
          <Stat icon={<CircleCheck className="size-4" />} label="Solved" value={ready ? `${progress.puzzlesSolved.length}/${PUZZLES.length}` : null} />
        </dl>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        {current ? (
          <PuzzleRunner key={`${current.id}-${run}`} puzzle={current} onNext={nextPuzzle} onRetry={() => setRun((r) => r + 1)} />
        ) : (
          <>
            <Skeleton className="aspect-square w-full max-w-[78vh] rounded-xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </>
        )}
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold">Puzzle ladder</h2>
        <p className="text-muted-foreground">Pick any puzzle, or let RepKnight choose one that matches your rating.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PUZZLES.map((p) => {
            const solved = ready && progress.puzzlesSolved.includes(p.id)
            const active = current?.id === p.id
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrent(p)
                    setRun((r) => r + 1)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary motion-reduce:transition-none',
                    active && 'border-primary ring-2 ring-primary/30',
                  )}
                >
                  <span>
                    <span className="block font-bold">{p.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.theme} · {tierFor(p.rating).name}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold">{p.rating}</span>
                    {solved && <CircleCheck className="size-4 text-success" aria-label="Solved" />}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-2.5">
      <dt className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="font-display text-2xl font-extrabold">{value ?? <Skeleton className="mt-1 h-6 w-12" />}</dd>
    </div>
  )
}

function PuzzleRunner({ puzzle, onNext, onRetry }: { puzzle: Puzzle; onNext: () => void; onRetry: () => void }) {
  const { recordPuzzle } = useProgress()
  const [delta, setDelta] = useState<number | null>(null)
  const side = useMemo(() => new Chess(buildStart(puzzle.fen, puzzle.setup).fen).turn() as 'w' | 'b', [puzzle])
  const drill = useDrill({
    fen: puzzle.fen,
    setup: puzzle.setup,
    moves: puzzle.solution,
    side,
    acceptAnyMate: true,
    onComplete: (mistakes) => setDelta(recordPuzzle(puzzle.id, puzzle.rating, mistakes === 0)),
  })
  const solved = drill.done && drill.mistakes === 0

  return (
    <>
      <div className="mx-auto w-full max-w-[min(100%,78vh)]">
        <Board
          fen={drill.fen}
          orientation={side}
          interactive={drill.userToMove}
          onMove={drill.onMove}
          lastMove={drill.lastMove}
          flash={drill.flash}
          hintSquare={drill.hintSquare}
          answer={drill.answer}
        />
      </div>
      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground">{puzzle.theme}</span>
            <span className="font-mono text-sm font-bold">★ {puzzle.rating}</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold">{puzzle.title}</h2>
          <p className="mt-2 flex items-center gap-2 font-bold">
            <span className={cn('inline-block h-4 w-4 rounded-full border-2 border-foreground', side === 'w' ? 'bg-background' : 'bg-foreground')} />
            {side === 'w' ? 'White' : 'Black'} to move
          </p>
        </div>

        <div
          role="status"
          aria-live="polite"
          className={cn('rounded-2xl p-5', drill.done ? (solved ? 'bg-primary text-primary-foreground' : 'bg-muted') : 'bg-accent/10 ring-2 ring-accent/40')}
        >
          {drill.done ? (
            <>
              <p className="font-display text-2xl font-extrabold">{solved ? '♛ Solved!' : '♞ Solved with help'}</p>
              {delta !== null && (
                <p className="mt-1 font-bold">
                  Rating {delta >= 0 ? '+' : ''}
                  {delta}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={onNext} className={cn('rounded-full font-bold', solved && 'bg-primary-foreground text-primary hover:bg-primary-foreground/90')}>
                  Next puzzle <SkipForward />
                </Button>
                <Button variant="ghost" onClick={onRetry} className={cn('rounded-full font-bold', solved && 'hover:bg-primary-foreground/10 hover:text-primary-foreground')}>
                  <RotateCcw /> Try again
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{drill.userToMove ? 'Your move' : 'Opponent replies…'}</p>
              <p className="mt-2 font-semibold">
                {drill.answerSan ? `The move is ${drill.answerSan}.` : drill.mistakes > 0 ? `Not quite. ${puzzle.hint}` : drill.ply > 0 ? 'Good! Keep going.' : 'Find the best move.'}
              </p>
            </>
          )}
        </div>

        {!drill.done && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full font-bold" onClick={drill.hint} disabled={!drill.userToMove || !!drill.answer}>
              <Lightbulb /> {drill.hintSquare ? 'Show move' : 'Hint'}
            </Button>
            <Button variant="ghost" className="rounded-full font-bold" onClick={onNext}>
              Skip <SkipForward />
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">Using a hint or making a mistake still lets you finish, but counts as a miss for your rating.</p>
      </aside>
    </>
  )
}
