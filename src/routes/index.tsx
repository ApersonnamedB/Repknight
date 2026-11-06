import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Brain, Repeat2, Sparkles, Target, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Board } from '@/components/chess/Board'
import { useDrill } from '@/components/chess/useDrill'
import { LESSONS, PUZZLES, TIERS, TRACK_META } from '@/data/curriculum'
import { lessonStatus, useProgress } from '@/lib/progress'

export const Route = createFileRoute('/')({
  component: Home,
})

const demo = PUZZLES[0]

function Home() {
  return (
    <>
      <Hero />
      <Ladder />
      <Tracks />
      <HowItWorks />
      <TryIt />
      <Coach />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'repeating-conic-gradient(currentColor 0 25%, transparent 0 50%)', backgroundSize: '64px 64px' }}
      />
      <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-bold">
            <Sparkles className="size-4 text-accent" /> Chess training for young players · 600 → 3000
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            RepKnight. Every rep makes you <span className="italic text-[oklch(0.82_0.12_80)]">stronger.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg opacity-85">
            Drill openings move by move, solve puzzles that match your rating, and play through endgames and master
            techniques on a real board. Mistakes come back sooner. Lines you know get spaced out. That’s how good
            habits stick.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full bg-accent px-7 text-base font-extrabold text-accent-foreground hover:bg-accent/90">
              <Link to="/puzzles">
                Solve a puzzle <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-primary-foreground/30 bg-transparent px-7 text-base font-bold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/openings">Browse openings</Link>
            </Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              [LESSONS.filter((l) => !l.locked).length, 'lessons'],
              [PUZZLES.length, 'puzzles'],
              [TIERS.length, 'rating tiers'],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl font-extrabold">{n}</dd>
                <dd className="text-sm opacity-70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <img
            src="/.netlify/images?url=/img/hero-knight.png&w=720&fm=webp"
            alt="RepKnight mascot: a smiling cream-colored knight wearing a red scarf"
            width={720}
            height={720}
            className="aspect-square w-full rounded-[2rem] object-cover shadow-2xl ring-8 ring-primary-foreground/10"
          />
          <div className="absolute -bottom-5 -left-4 rounded-2xl bg-card px-5 py-3 text-card-foreground shadow-xl sm:-left-8">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pawn to King</p>
            <p className="font-display text-2xl font-extrabold">600 → 3000</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Ladder() {
  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="font-bold uppercase tracking-wider text-accent">The RepKnight ladder</p>
        <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Six tiers, from first checkmate to grandmaster prep.</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Every lesson and puzzle is tagged with a rating. Students start where they are and climb one piece at a time.
        </p>
      </div>
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {TIERS.map((t, i) => {
          const count = LESSONS.filter((l) => !l.locked && l.rating >= t.min && l.rating < t.max).length + PUZZLES.filter((p) => p.rating >= t.min && p.rating < t.max).length
          return (
            <li
              key={t.id}
              className="group relative flex flex-col rounded-2xl border bg-card p-5 transition-transform hover:-translate-y-1 motion-reduce:transition-none"
            >
              <span className="piece piece-b text-5xl" aria-hidden>
                {t.glyph}
                {'︎'}
              </span>
              <h3 className="mt-3 text-xl font-extrabold">{t.name}</h3>
              <p className="font-mono text-sm font-bold text-primary">
                {t.min}–{t.max}
              </p>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.blurb}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">{count} drills</p>
              <div className="absolute inset-x-5 bottom-0 h-1 rounded-t-full bg-primary" style={{ opacity: 0.25 + i * 0.15 }} />
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Tracks() {
  const cards = [
    { to: '/openings', icon: TRACK_META.openings.icon, title: TRACK_META.openings.title, body: TRACK_META.openings.tagline, cta: 'Drill a line' },
    { to: '/puzzles', icon: '♜', title: 'Puzzles', body: 'Rated tactics that adapt to you — forks, pins, mates, and famous studies.', cta: 'Start solving' },
    { to: '/endgames', icon: TRACK_META.endgames.icon, title: TRACK_META.endgames.title, body: TRACK_META.endgames.tagline, cta: 'Play an endgame' },
    { to: '/advanced', icon: TRACK_META.advanced.icon, title: TRACK_META.advanced.title, body: TRACK_META.advanced.tagline, cta: 'Level up' },
  ] as const
  return (
    <section className="bg-secondary/60">
      <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <h2 className="text-4xl font-extrabold sm:text-5xl">Four ways to train</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex gap-5 rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg motion-reduce:transition-none"
            >
              <span className="piece piece-w flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary text-4xl" aria-hidden>
                {c.icon}
                {'︎'}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-2xl font-extrabold">{c.title}</span>
                <span className="mt-1 text-muted-foreground">{c.body}</span>
                <span className="mt-3 inline-flex items-center gap-1 font-bold text-accent">
                  {c.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: Target, title: 'Play the move', body: 'No reading walls of notation. Students find each move on the board, and the opponent answers instantly.' },
    { icon: Brain, title: 'Learn from mistakes', body: 'A wrong move shakes the board. A hint lights up the right piece, and the coach note explains why.' },
    { icon: Repeat2, title: 'Repeat at the right time', body: 'Perfect runs move a line up a box: tomorrow, 3 days, a week, a month. Mistakes reset it to today.' },
    { icon: Trophy, title: 'Climb the rating', body: 'Puzzles adjust to each student’s rating, so every session is challenging but never hopeless.' },
  ]
  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <p className="font-bold uppercase tracking-wider text-accent">How reps work</p>
      <h2 className="mt-2 max-w-2xl text-4xl font-extrabold sm:text-5xl">Built on spaced repetition, the way memory actually works.</h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <s.icon className="size-5" />
              </span>
              <span className="font-mono text-sm font-bold text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-xl font-extrabold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function TryIt() {
  const drill = useDrill({ fen: demo.fen, moves: demo.solution, acceptAnyMate: true })
  const { progress, ready } = useProgress()
  const due = LESSONS.filter((l) => lessonStatus(progress.lessons[l.id]) === 'due').length
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          <Board fen={drill.fen} orientation="w" interactive={drill.userToMove} onMove={drill.onMove} lastMove={drill.lastMove} flash={drill.flash} hintSquare={drill.hintSquare} answer={drill.answer} />
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider text-[oklch(0.82_0.12_80)]">Try it now · {demo.rating}</p>
          <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">White to move. Find checkmate in one.</h2>
          <p className="mt-4 text-lg opacity-85">Click a piece, then click where it should go — or drag it.</p>
          {drill.done ? (
            <div className="mt-6 rounded-2xl bg-primary-foreground/10 p-5">
              <p className="font-display text-2xl font-extrabold">♛ Checkmate! Nicely done.</p>
              <p className="mt-1 opacity-85">That’s the back-rank mate — one of the most common ways games end at every level.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                  <Link to="/puzzles">Keep solving</Link>
                </Button>
                <Button variant="ghost" className="rounded-full font-bold hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={drill.restart}>
                  Reset
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button variant="ghost" className="rounded-full border border-primary-foreground/30 font-bold hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={drill.hint}>
                Need a hint?
              </Button>
              {drill.mistakes > 0 && <span className="text-sm opacity-80">{demo.hint}</span>}
            </div>
          )}
          {ready && due > 0 && (
            <p className="mt-6 text-sm opacity-80">
              You have <strong>{due}</strong> {due === 1 ? 'line' : 'lines'} due for review.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function Coach() {
  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <div className="grid items-center gap-10 rounded-[2rem] border bg-card p-8 sm:p-12 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-bold uppercase tracking-wider text-accent">From the coach</p>
          <blockquote className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">
            “I learned chess by drilling the same ideas until they were second nature. RepKnight gives my students that same
            path — with a board that answers back.”
          </blockquote>
          <p className="mt-4 text-muted-foreground">Created by a top-200 USCF player in Tennessee for a youth chess program.</p>
        </div>
        <Button asChild size="lg" className="h-12 rounded-full px-7 text-base font-extrabold">
          <Link to="/openings">
            Start with openings <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}
