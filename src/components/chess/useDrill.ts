import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Flash } from './Board'

const strip = (san: string) => san.replace(/[+#!?]/g, '')

export interface DrillConfig {
  fen?: string
  setup?: string[]
  moves: string[]
  /** Side the student plays. Defaults to the side to move after setup. */
  side?: 'w' | 'b'
  /** Accept any checkmating move on the final ply (puzzles). */
  acceptAnyMate?: boolean
  onComplete?: (mistakes: number) => void
}

export function buildStart(fen?: string, setup: string[] = []) {
  const c = new Chess(fen)
  let last: [string, string] | null = null
  for (const san of setup) {
    const mv = c.move(san)
    last = [mv.from, mv.to]
  }
  return { fen: c.fen(), last }
}

export function useDrill({ fen: startFen, setup, moves, side, acceptAnyMate, onComplete }: DrillConfig) {
  const base = useMemo(() => buildStart(startFen, setup), [startFen, setup])
  const userSide = side ?? (new Chess(base.fen).turn() as 'w' | 'b')

  const [fen, setFen] = useState(base.fen)
  const [ply, setPly] = useState(0)
  const [played, setPlayed] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<[string, string] | null>(base.last)
  const [flash, setFlash] = useState<Flash>(null)
  const [mistakes, setMistakes] = useState(0)
  const [hintLevel, setHintLevel] = useState(0)
  const [lastNotePly, setLastNotePly] = useState<number | null>(null)
  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  const done = ply >= moves.length
  const turn = new Chess(fen).turn()
  const userToMove = !done && turn === userSide

  const expected = useMemo(() => {
    if (done) return null
    try {
      const mv = new Chess(fen).move(moves[ply])
      return { from: mv.from, to: mv.to, san: mv.san }
    } catch {
      return null
    }
  }, [fen, ply, moves, done])

  const advance = useCallback(
    (nextFen: string, san: string, from: string, to: string) => {
      setFen(nextFen)
      setPlayed((p) => [...p, san])
      setLastMove([from, to])
      setLastNotePly(ply)
      setPly((n) => n + 1)
      setHintLevel(0)
    },
    [ply],
  )

  // Opponent replies automatically.
  useEffect(() => {
    if (done || turn === userSide || !expected) return
    const t = setTimeout(() => {
      const c = new Chess(fen)
      const mv = c.move(moves[ply])
      advance(c.fen(), mv.san, mv.from, mv.to)
    }, 550)
    return () => clearTimeout(t)
  }, [done, turn, userSide, expected, fen, moves, ply, advance])

  useEffect(() => {
    if (done && !completed.current && moves.length > 0) {
      completed.current = true
      onCompleteRef.current?.(mistakes)
    }
  }, [done, mistakes, moves.length])

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 650)
    return () => clearTimeout(t)
  }, [flash])

  const onMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!userToMove || !expected) return
      const c = new Chess(fen)
      let mv
      try {
        mv = c.move({ from, to, promotion: promotion ?? 'q' })
      } catch {
        return
      }
      const isLast = ply === moves.length - 1
      const ok = strip(mv.san) === strip(expected.san) || (acceptAnyMate && isLast && c.isCheckmate())
      if (ok) {
        setFlash('good')
        advance(c.fen(), mv.san, mv.from, mv.to)
      } else {
        setFlash('bad')
        setMistakes((n) => n + 1)
        setHintLevel((h) => Math.min(h + 1, 2))
      }
    },
    [userToMove, expected, fen, ply, moves.length, acceptAnyMate, advance],
  )

  const hint = useCallback(() => {
    if (hintLevel >= 2) return
    setHintLevel(hintLevel + 1)
    setMistakes((n) => n + 1)
  }, [hintLevel])

  const restart = useCallback(() => {
    completed.current = false
    setFen(base.fen)
    setPly(0)
    setPlayed([])
    setLastMove(base.last)
    setMistakes(0)
    setHintLevel(0)
    setLastNotePly(null)
    setFlash(null)
  }, [base])

  return {
    fen,
    ply,
    played,
    lastMove,
    flash,
    mistakes,
    done,
    userSide,
    userToMove,
    lastNotePly,
    hintSquare: hintLevel >= 1 && userToMove ? (expected?.from ?? null) : null,
    answer: hintLevel >= 2 && userToMove && expected ? ([expected.from, expected.to] as [string, string]) : null,
    answerSan: hintLevel >= 2 && userToMove ? (expected?.san ?? null) : null,
    hint,
    onMove,
    restart,
    startFen: base.fen,
  }
}
