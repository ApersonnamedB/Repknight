# AGENTS.md

RepKnight is a spaced-repetition chess trainer for a youth chess program, covering ratings 600 to 3000. It is built with TanStack Start, React 19, Tailwind 4, shadcn/ui, and chess.js, and deployed on Netlify.

**Continue from [PLAN.md](PLAN.md).** Milestone 1, the playable product surface, is done. Start the next session at Milestone 2.

## Architecture
- `src/data/curriculum.ts`: the single source of all content (tiers, lessons, puzzles, track metadata). Later milestones swap this for database-backed content, so keep the `Lesson` and `Puzzle` shapes stable.
  - `Lesson.moves` holds SAN moves trained from the start position (`fen` + `setup`). `notes` are keyed by index into `moves`. `side` is the side the student plays. `locked: true` marks a "coming soon" card.
  - In a `Puzzle`, the side to move after `fen`/`setup` is the solver. `solution` alternates solver moves with forced replies.
  - **Check every new line for legal moves with chess.js.** One illegal SAN breaks that lesson.
- `src/components/chess/Board.tsx`: a custom board with click-to-move, drag-and-drop, a promotion picker, hint and answer highlights, and a good/bad flash. `MiniBoard` draws static thumbnails. Pieces are Unicode glyphs in Noto Sans Symbols 2 with `︎`, sized with container query units (`cqw`).
- `src/components/chess/useDrill.ts`: the drill state machine shared by lessons, puzzles, and the landing demo. The opponent auto-replies. A wrong move raises the hint level (1 = from-square, 2 = full answer). `acceptAnyMate` accepts any mate on the final ply.
- `src/components/chess/Library.tsx`: the shared library page for the openings, endgames, and advanced tracks.
- `src/lib/progress.ts`: Leitner boxes `[0,1,3,7,14,30]` days and an Elo-style puzzle rating (K=32), stored in localStorage under `repknight-progress-v1`. It is read only in effects because of SSR. Milestone 4 moves this to the database.
- Routes: `/`, `/openings`, `/endgames`, `/advanced`, `/lesson/$lessonId`, `/puzzles`. The shell (header, nav, footer) is `src/components/layout/SiteShell.tsx`, mounted in `__root.tsx`.

## Conventions
- Theme tokens live in `src/styles.css`: forest-green primary, cream background, scarf-red accent, and `board-light`/`board-dark`. Fonts are Fraunces for headings and Nunito for body text. Use token classes, not raw colours.
- Copy is written for kids and their parents: short, encouraging, and specific.
- Use the CDN for images: `/.netlify/images?url=/img/<file>&w=<w>&fm=webp`.
- Only add content you are licensed to use. Chess.com lessons and puzzles are not redistributable. Use the coach's own PGNs or the CC0 Lichess puzzle database instead.
