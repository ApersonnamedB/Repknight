# RepKnight roadmap

RepKnight is a spaced-repetition chess trainer for a youth chess program. It covers openings, puzzles, endgames, and advanced technique for players rated 600 to 3000. The product is being built in small, self-contained milestones.

## Milestone 1: Playable product surface ✅
- Branded landing page with the six-tier rating ladder (Pawn → King, 600–3000) and a live mate-in-one demo.
- Opening, endgame, and advanced-technique libraries with tier and side filters.
- Lesson trainer: the student plays each move on the board, the opponent replies automatically, a wrong move is rejected with a hint, and coach notes explain the idea.
- Leitner spaced repetition (today → 1 → 3 → 7 → 14 → 30 days). A perfect run moves a lesson up a box. A mistake sends it back to today.
- Rated puzzle trainer with Elo-style rating, streaks, and a puzzle ladder.
- All content lives in `src/data/curriculum.ts`. Every line in it has been checked for legal moves. Progress is saved in the browser (`src/lib/progress.ts`).

## Milestone 2: Content import (PGN / FEN)
- Coach-facing importer: paste or upload a PGN (from a Chess.com game, a Chess.com or Lichess study export, or ChessBase) and turn it into a lesson. Main line plus `{comments}` become coach notes.
- Support branching variations so one opening can hold several lines. Each line gets its own repetition schedule.
- Validate every imported line with chess.js before saving.

## Milestone 3: Data model on Netlify Database
- Tables: `lessons`, `lesson_lines`, `puzzles`, `tags`.
- Seed the database from `curriculum.ts`, then serve the library and trainer pages from server loaders.
- Import a rating-balanced slice of the Lichess open puzzle database (CC0) so there are thousands of puzzles from 600 up to 3000.

## Milestone 4: Accounts for coaches and students
- Netlify Identity sign-in. Coach and student roles.
- Kid-friendly student login with a class code and username (no email required).
- Move repetition boxes, puzzle rating, and streaks from localStorage to per-student database rows. Merge any existing browser progress on first sign-in.

## Milestone 5: Coach dashboard
- Create classes and assign lessons or puzzle sets by tier.
- See each student's due reviews, accuracy, puzzle rating trend, and the lines they miss most.

## Milestone 6: Finish the curriculum
- Endgames: Philidor, Vančura, triangulation, opposition drills, minor-piece endings.
- Advanced: prophylaxis, opposite-coloured bishops, the bishop pair, and model games.
- More openings per tier for both colours.

## Milestone 7: Motivation and polish
- Badges for tier promotions and streaks, plus a daily review goal.
- An optional, kid-safe class leaderboard.
- Sound effects, piece themes, and board colour choices.

## Milestone 8 (optional): AI coach
- "Why is this move good?" explanations written at the student's level, using Netlify AI Gateway.
