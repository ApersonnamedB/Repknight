# RepKnight

RepKnight is a chess training site for young players, rated 600 to 3000. Students drill openings move by move with spaced repetition, solve rated puzzles, and play through endgames and advanced techniques on an interactive board.

## What's live
- **Landing page** (`/`): the rating ladder, the four training tracks, and a live mate-in-one demo.
- **Openings** (`/openings`), **Endgames** (`/endgames`), **Advanced** (`/advanced`): lesson libraries you can filter by tier and side.
- **Lesson trainer** (`/lesson/:id`): play the line, get hints, read coach notes, and earn spaced-repetition boxes.
- **Puzzles** (`/puzzles`): rated puzzles that adapt to the student, with streaks and a puzzle ladder.

## Tech
TanStack Start (React 19, Vite), Tailwind CSS 4, shadcn/ui, and chess.js for move rules. The site is deployed on Netlify, and the hero image is served through Netlify Image CDN.

## Run locally
```bash
pnpm install
netlify dev   # or: pnpm dev
```

## Adding content
Lessons and puzzles are defined in `src/data/curriculum.ts`. Write moves in SAN, and before adding a line, check it for legal moves with chess.js.

## Roadmap
The next milestones are PGN import, database-backed content (including thousands of Lichess CC0 puzzles), coach and student accounts, a coach dashboard, and more curriculum. See [PLAN.md](PLAN.md).
