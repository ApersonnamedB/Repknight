/**
 * Student progress — spaced-repetition boxes for lessons and an Elo-style
 * puzzle rating. Stored in localStorage for now; a later milestone moves this
 * to per-student records in the database (see PLAN.md).
 */
import { useCallback, useEffect, useState } from 'react'

const KEY = 'repknight-progress-v1'
const DAY = 24 * 60 * 60 * 1000
/** Leitner intervals in days for boxes 0–5. */
export const INTERVALS = [0, 1, 3, 7, 14, 30]

export interface LessonRecord {
  box: number
  due: number
  reps: number
  lastResult: 'perfect' | 'mistakes'
}

export interface Progress {
  lessons: Record<string, LessonRecord>
  puzzleRating: number
  puzzlesSolved: string[]
  streak: number
  bestStreak: number
}

const empty: Progress = { lessons: {}, puzzleRating: 800, puzzlesSolved: [], streak: 0, bestStreak: 0 }

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return { ...structuredClone(empty), ...(raw ? JSON.parse(raw) : {}) }
  } catch {
    return structuredClone(empty)
  }
}

function write(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p))
  window.dispatchEvent(new Event('repknight-progress'))
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(empty)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => setProgress(read())
    sync()
    setReady(true)
    window.addEventListener('repknight-progress', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('repknight-progress', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const recordLesson = useCallback((id: string, perfect: boolean) => {
    const p = read()
    const prev = p.lessons[id]
    const box = perfect ? Math.min((prev?.box ?? 0) + 1, INTERVALS.length - 1) : 0
    p.lessons[id] = {
      box,
      due: Date.now() + INTERVALS[box] * DAY,
      reps: (prev?.reps ?? 0) + 1,
      lastResult: perfect ? 'perfect' : 'mistakes',
    }
    write(p)
    return p.lessons[id]
  }, [])

  const recordPuzzle = useCallback((id: string, puzzleRating: number, solved: boolean) => {
    const p = read()
    const expected = 1 / (1 + 10 ** ((puzzleRating - p.puzzleRating) / 400))
    const delta = Math.round(32 * ((solved ? 1 : 0) - expected))
    p.puzzleRating = Math.max(400, Math.min(3200, p.puzzleRating + delta))
    if (solved && !p.puzzlesSolved.includes(id)) p.puzzlesSolved.push(id)
    p.streak = solved ? p.streak + 1 : 0
    p.bestStreak = Math.max(p.bestStreak, p.streak)
    write(p)
    return delta
  }, [])

  const reset = useCallback(() => write(structuredClone(empty)), [])

  return { progress, ready, recordLesson, recordPuzzle, reset }
}

export function lessonStatus(rec: LessonRecord | undefined): 'new' | 'due' | 'learning' | 'mastered' {
  if (!rec) return 'new'
  if (rec.due <= Date.now()) return 'due'
  return rec.box >= 4 ? 'mastered' : 'learning'
}

export function dueLabel(rec: LessonRecord | undefined) {
  if (!rec) return 'New'
  const days = Math.ceil((rec.due - Date.now()) / DAY)
  if (days <= 0) return 'Due now'
  return days === 1 ? 'Due tomorrow' : `Due in ${days} days`
}
