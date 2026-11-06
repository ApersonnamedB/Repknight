import { useMemo, useState } from 'react'
import { Chess, type Square } from 'chess.js'
import { cn } from '@/lib/utils'

const GLYPH: Record<string, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
const FILES = 'abcdefgh'

export type Flash = 'good' | 'bad' | null

interface BoardProps {
  fen: string
  orientation: 'w' | 'b'
  interactive: boolean
  onMove?: (from: string, to: string, promotion?: string) => void
  lastMove?: [string, string] | null
  hintSquare?: string | null
  answer?: [string, string] | null
  flash?: Flash
  className?: string
}

export function Board({ fen, orientation, interactive, onMove, lastMove, hintSquare, answer, flash, className }: BoardProps) {
  const chess = useMemo(() => new Chess(fen), [fen])
  const [selected, setSelected] = useState<string | null>(null)
  const [promo, setPromo] = useState<{ from: string; to: string } | null>(null)

  const [prevFen, setPrevFen] = useState(fen)
  if (prevFen !== fen) {
    setPrevFen(fen)
    setSelected(null)
    setPromo(null)
  }

  const turn = chess.turn()
  const dests = useMemo(() => {
    if (!selected) return new Set<string>()
    return new Set(chess.moves({ square: selected as Square, verbose: true }).map((mv) => mv.to))
  }, [chess, selected])

  const checkSquare = useMemo(() => {
    if (!chess.inCheck()) return null
    for (const row of chess.board()) for (const p of row) if (p && p.type === 'k' && p.color === turn) return p.square
    return null
  }, [chess, turn])

  const ranks = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]
  const files = orientation === 'w' ? FILES.split('') : FILES.split('').reverse()

  function tryMove(from: string, to: string) {
    const piece = chess.get(from as Square)
    if (!piece || piece.color !== turn) return false
    if (!chess.moves({ square: from as Square, verbose: true }).some((mv) => mv.to === to)) return false
    const lastRank = (piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1')
    if (piece.type === 'p' && lastRank) {
      setPromo({ from, to })
      return true
    }
    setSelected(null)
    onMove?.(from, to)
    return true
  }

  function clickSquare(sq: string) {
    if (!interactive || promo) return
    const piece = chess.get(sq as Square)
    if (selected && selected !== sq && tryMove(selected, sq)) return
    if (piece && piece.color === turn) setSelected(sq === selected ? null : sq)
    else setSelected(null)
  }

  return (
    <div
      className={cn(
        '@container relative aspect-square w-full select-none overflow-hidden rounded-xl shadow-[0_20px_50px_-20px_oklch(0.25_0.05_160/0.6)] ring-4 transition-[box-shadow] duration-200 motion-reduce:transition-none',
        flash === 'good' ? 'ring-success' : flash === 'bad' ? 'ring-destructive animate-shake' : 'ring-primary/80',
        className,
      )}
    >
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {ranks.map((rank, ri) =>
          files.map((file, fi) => {
            const sq = `${file}${rank}`
            const piece = chess.get(sq as Square)
            const dark = (FILES.indexOf(file) + rank) % 2 === 1
            const isLast = lastMove?.includes(sq)
            const isAnswer = answer?.includes(sq)
            const canDrag = interactive && piece?.color === turn
            return (
              <button
                key={sq}
                type="button"
                aria-label={`${sq}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
                onClick={() => clickSquare(sq)}
                onDragOver={(e) => interactive && e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const from = e.dataTransfer.getData('text/plain')
                  if (from) tryMove(from, sq)
                }}
                className={cn(
                  'relative flex items-center justify-center outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent',
                  dark ? 'bg-board-dark' : 'bg-board-light',
                  interactive ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                {isLast && <span className="absolute inset-0 bg-[oklch(0.85_0.15_95/0.45)]" />}
                {isAnswer && <span className="absolute inset-0 bg-accent/45" />}
                {hintSquare === sq && <span className="absolute inset-1 animate-pulse rounded-full ring-4 ring-accent motion-reduce:animate-none" />}
                {selected === sq && <span className="absolute inset-0 bg-[oklch(0.75_0.15_200/0.45)]" />}
                {checkSquare === sq && <span className="absolute inset-0 bg-[radial-gradient(circle,oklch(0.6_0.24_27/0.9)_0%,transparent_70%)]" />}
                {dests.has(sq) &&
                  (piece ? (
                    <span className="absolute inset-0.5 rounded-full ring-[5px] ring-inset ring-[oklch(0.25_0.05_160/0.35)]" />
                  ) : (
                    <span className="absolute h-[28%] w-[28%] rounded-full bg-[oklch(0.25_0.05_160/0.3)]" />
                  ))}
                {piece && (
                  <span
                    draggable={canDrag}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', sq)
                      setSelected(sq)
                    }}
                    className={cn('piece relative text-[length:10.5cqw]', piece.color === 'w' ? 'piece-w' : 'piece-b', canDrag && 'cursor-grab active:cursor-grabbing')}
                  >
                    {GLYPH[piece.type]}
                    {'︎'}
                  </span>
                )}
                {fi === 0 && (
                  <span className={cn('absolute left-1 top-0.5 text-[length:2.2cqw] font-bold', dark ? 'text-board-light' : 'text-board-dark')}>{rank}</span>
                )}
                {ri === 7 && (
                  <span className={cn('absolute bottom-0.5 right-1 text-[length:2.2cqw] font-bold', dark ? 'text-board-light' : 'text-board-dark')}>{file}</span>
                )}
              </button>
            )
          }),
        )}
      </div>

      {promo && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/50 backdrop-blur-[2px]">
          <div className="rounded-xl bg-card p-4 shadow-xl">
            <p className="mb-3 text-center text-sm font-bold">Promote to…</p>
            <div className="flex gap-2">
              {(['q', 'r', 'b', 'n'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={`Promote to ${{ q: 'queen', r: 'rook', b: 'bishop', n: 'knight' }[t]}`}
                  onClick={() => {
                    const { from, to } = promo
                    setPromo(null)
                    setSelected(null)
                    onMove?.(from, to, t)
                  }}
                  className={cn('piece flex h-14 w-14 items-center justify-center rounded-lg bg-board-light text-4xl hover:bg-secondary', turn === 'w' ? 'piece-w' : 'piece-b')}
                >
                  {GLYPH[t]}
                  {'︎'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Lightweight, non-interactive board for thumbnails. */
export function MiniBoard({ fen, orientation = 'w', className }: { fen: string; orientation?: 'w' | 'b'; className?: string }) {
  const rows = new Chess(fen).board()
  const ordered = orientation === 'w' ? rows : [...rows].reverse().map((r) => [...r].reverse())
  return (
    <div className={cn('@container grid aspect-square w-full grid-cols-8 overflow-hidden rounded-lg', className)} aria-hidden>
      {ordered.flatMap((row, ri) =>
        row.map((p, fi) => {
          const dark = (ri + fi) % 2 === 1
          return (
            <div key={`${ri}-${fi}`} className={cn('flex items-center justify-center', dark ? 'bg-board-dark' : 'bg-board-light')}>
              {p && (
                <span className={cn('piece text-[length:10.5cqw]', p.color === 'w' ? 'piece-w' : 'piece-b')}>
                  {GLYPH[p.type]}
                  {'︎'}
                </span>
              )}
            </div>
          )
        }),
      )}
    </div>
  )
}
