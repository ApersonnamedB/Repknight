import { useState } from 'react'
import { cn } from '@/lib/utils'

/** Numbered move list, e.g. "1. e4 e5 2. Nf3 …". */
export function MoveList({ moves, startsWithBlack, startNumber = 1, className }: { moves: string[]; startsWithBlack?: boolean; startNumber?: number; className?: string }) {
  const cells: { n?: number; san: string; key: number }[] = []
  let num = startNumber
  moves.forEach((san, i) => {
    const isWhite = startsWithBlack ? i % 2 === 1 : i % 2 === 0
    if (isWhite || i === 0) cells.push({ n: num, san: isWhite ? san : `…${san}`, key: i })
    else cells.push({ san, key: i })
    if (!isWhite) num++
  })
  return (
    <ol className={cn('flex flex-wrap gap-x-1.5 gap-y-1 font-mono text-sm', className)}>
      {cells.map((c) => (
        <li key={c.key} className={cn('rounded px-1', c.key === moves.length - 1 && 'bg-secondary font-bold text-secondary-foreground')}>
          {c.n !== undefined && <span className="mr-1 text-muted-foreground">{c.n}.</span>}
          {c.san}
        </li>
      ))}
    </ol>
  )
}

/** Hook for a board orientation toggle. */
export function useOrientation(initial: 'w' | 'b') {
  const [o, setO] = useState(initial)
  return [o, () => setO((x) => (x === 'w' ? 'b' : 'w'))] as const
}
