import { useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ArrowUpDown, Lightbulb, RotateCcw } from 'lucide-react'
import { Chess } from 'chess.js'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Board } from '@/components/chess/Board'
import { MoveList, useOrientation } from '@/components/chess/MoveList'
import { useDrill } from '@/components/chess/useDrill'
import { getLesson, lessonsFor, tierFor, TRACK_META, type Lesson } from '@/data/curriculum'
import { INTERVALS, useProgress } from '@/lib/progress'

export const Route = createFileRoute('/lesson/$lessonId')({
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId)
    if (!lesson || lesson.locked) throw notFound()
    return { lesson }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.lesson.title} · RepKnight` }, { name: 'description', content: loaderData.lesson.summary }] : [],
  }),
  component: LessonPage,
})

function LessonPage() {
  const { lesson } = Route.useLoaderData()
  return <Trainer key={lesson.id} lesson={lesson} />
}

function Trainer({ lesson }: { lesson: Lesson }) {
  const { recordLesson } = useProgress()
  const [result, setResult] = useState<{ perfect: boolean; box: number } | null>(null)
  const drill = useDrill({
    fen: lesson.fen,
    setup: lesson.setup,
    moves: lesson.moves,
    side: lesson.side,
    onComplete: (mistakes) => {
      const rec = recordLesson(lesson.id, mistakes === 0)
      setResult({ perfect: mistakes === 0, box: rec.box })
    },
  })
  const [orientation, flip] = useOrientation(lesson.side)
  const tier = tierFor(lesson.rating)
  const track = TRACK_META[lesson.track]
  const siblings = lessonsFor(lesson.track).filter((l) => !l.locked)
  const next = siblings[siblings.findIndex((l) => l.id === lesson.id) + 1]
  const userMoves = lesson.moves.filter((_, i) => {
    const startTurn = new Chess(drill.startFen).turn()
    return (i % 2 === 0 ? startTurn : startTurn === 'w' ? 'b' : 'w') === lesson.side
  }).length
  const note = drill.lastNotePly !== null ? lesson.notes[drill.lastNotePly] : null
  const start = new Chess(drill.startFen)

  const restart = () => {
    setResult(null)
    drill.restart()
  }

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
      <Link to={`/${lesson.track}` as '/openings' | '/endgames' | '/advanced'} className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {track.title}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="mx-auto w-full max-w-[min(100%,78vh)]">
          <Board
            fen={drill.fen}
            orientation={orientation}
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
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground">
                {tier.glyph}
                {'︎'} {tier.name} · {lesson.rating}
              </span>
              {lesson.eco && <span className="font-mono text-xs font-bold text-muted-foreground">{lesson.eco}</span>}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight">{lesson.title}</h1>
            <p className="mt-1 text-muted-foreground">{lesson.subtitle}</p>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-bold text-muted-foreground">
                <span>Progress</span>
                <span>
                  {drill.ply}/{lesson.moves.length} moves
                </span>
              </div>
              <Progress value={(drill.ply / lesson.moves.length) * 100} />
            </div>
          </div>

          <div
            role="status"
            aria-live="polite"
            className={
              'rounded-2xl p-5 ' +
              (drill.done ? 'bg-primary text-primary-foreground' : drill.userToMove ? 'bg-accent/10 ring-2 ring-accent/40' : 'bg-muted')
            }
          >
            {drill.done && result ? (
              <>
                <p className="font-display text-2xl font-extrabold">{result.perfect ? '♛ Perfect rep!' : '♞ Line complete'}</p>
                <p className="mt-1 opacity-90">
                  {result.perfect
                    ? `Moved up to box ${result.box}. See it again in ${INTERVALS[result.box]} day${INTERVALS[result.box] === 1 ? '' : 's'}.`
                    : `You made ${drill.mistakes} mistake${drill.mistakes === 1 ? '' : 's'}. This line stays due today — run it again until it’s clean.`}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={restart} className="rounded-full bg-primary-foreground font-bold text-primary hover:bg-primary-foreground/90">
                    <RotateCcw /> Rep again
                  </Button>
                  {next && (
                    <Button asChild variant="ghost" className="rounded-full font-bold hover:bg-primary-foreground/10 hover:text-primary-foreground">
                      <Link to="/lesson/$lessonId" params={{ lessonId: next.id }}>
                        Next: {next.title} <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  {drill.userToMove ? `Your move · ${lesson.side === 'w' ? 'White' : 'Black'}` : 'Opponent is thinking…'}
                </p>
                <p className="mt-2 font-semibold">
                  {drill.answerSan
                    ? `The move is ${drill.answerSan}. Play it on the board.`
                    : note ?? (drill.ply === 0 ? lesson.summary : 'Keep going — find the next move in the line.')}
                </p>
              </>
            )}
          </div>

          {!drill.done && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full font-bold" onClick={drill.hint} disabled={!drill.userToMove || !!drill.answer}>
                <Lightbulb /> {drill.hintSquare ? 'Show move' : 'Hint'}
              </Button>
              <Button variant="outline" className="rounded-full font-bold" onClick={restart}>
                <RotateCcw /> Restart
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={flip} aria-label="Flip board">
                <ArrowUpDown />
              </Button>
              <span className="ml-auto self-center text-sm font-bold text-muted-foreground">
                {drill.mistakes} mistake{drill.mistakes === 1 ? '' : 's'}
              </span>
            </div>
          )}

          <div className="rounded-2xl border bg-card p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Moves {lesson.setup?.length ? '(after the setup position)' : ''}
            </p>
            {drill.played.length ? (
              <MoveList className="mt-2" moves={drill.played} startsWithBlack={start.turn() === 'b'} startNumber={start.moveNumber()} />
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {userMoves} moves to find as {lesson.side === 'w' ? 'White' : 'Black'}. Start when ready.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {lesson.tags.map((t) => (
              <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                {t}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
