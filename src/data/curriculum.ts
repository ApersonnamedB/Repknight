/**
 * RepKnight curriculum — all training content lives here.
 *
 * Every move sequence in this file has been checked for legality with chess.js.
 * Later milestones replace this static module with coach-authored content
 * stored in the database (see PLAN.md), so keep the shapes below stable.
 */

export type Side = 'w' | 'b'
export type Track = 'openings' | 'endgames' | 'advanced'

export type TierId = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'

export interface Tier {
  id: TierId
  name: string
  min: number
  max: number
  glyph: string
  blurb: string
}

export const TIERS: Tier[] = [
  { id: 'pawn', name: 'Pawn', min: 600, max: 1000, glyph: '♟', blurb: 'Rules, safe moves, and first checkmates.' },
  { id: 'knight', name: 'Knight', min: 1000, max: 1400, glyph: '♞', blurb: 'Forks, pins, and a real opening repertoire.' },
  { id: 'bishop', name: 'Bishop', min: 1400, max: 1800, glyph: '♝', blurb: 'Plans, pawn structures, and classic endgames.' },
  { id: 'rook', name: 'Rook', min: 1800, max: 2200, glyph: '♜', blurb: 'Attacking patterns and sharp main lines.' },
  { id: 'queen', name: 'Queen', min: 2200, max: 2600, glyph: '♛', blurb: 'Deep theory, sacrifices, and endgame studies.' },
  { id: 'king', name: 'King', min: 2600, max: 3000, glyph: '♚', blurb: 'Grandmaster preparation and composed studies.' },
]

export function tierFor(rating: number): Tier {
  return TIERS.find((t) => rating < t.max) ?? TIERS[TIERS.length - 1]
}

export interface Lesson {
  id: string
  track: Track
  title: string
  eco?: string
  subtitle: string
  rating: number
  side: Side
  /** Starting FEN. Omit to start from the initial position. */
  fen?: string
  /** Moves played automatically before the drill starts (shown as context). */
  setup?: string[]
  /** The moves the student trains, alternating sides from the start position. */
  moves: string[]
  /** Coach comments keyed by index into `moves`, shown after that move is played. */
  notes: Record<number, string>
  summary: string
  tags: string[]
  locked?: boolean
}

const m = (s: string) => s.split(' ')

export const LESSONS: Lesson[] = [
  // ───────────── OPENINGS ─────────────
  {
    id: 'italian-giuoco-piano',
    track: 'openings',
    title: 'Italian Game',
    eco: 'C54',
    subtitle: 'Giuoco Piano, main line with c3 and d4',
    rating: 700,
    side: 'w',
    moves: m('e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5 Qb3'),
    notes: {
      0: 'Grab the center with a pawn and open lines for your queen and bishop.',
      2: 'Develop a knight toward the center and attack e5.',
      4: 'The bishop aims straight at f7 — the weakest square near Black’s king.',
      6: 'c3 prepares d4 so we can build a big pawn center.',
      8: 'Strike in the center now that d4 is supported.',
      10: 'Recapture with the pawn: two center pawns side by side!',
      12: 'Block the check with the bishop and offer a trade.',
      14: 'Recapture with the knight so it comes into the game.',
      18: 'Qb3 hits both d5 and b7. White has an easy, active position.',
    },
    summary: 'The perfect first opening: fast development, central pawns, and pressure on f7.',
    tags: ['1.e4', 'Classical', 'Beginner friendly'],
  },
  {
    id: 'scholars-mate-defense',
    track: 'openings',
    title: 'Stopping Scholar’s Mate',
    subtitle: 'How Black safely meets an early Qh5',
    rating: 600,
    side: 'b',
    moves: m('e4 e5 Qh5 Nc6 Bc4 g6 Qf3 Nf6'),
    notes: {
      1: 'Meet e4 with e5 and claim your share of the center.',
      3: 'Defend e5 with a knight. Never play ...Nf6?? yet — Qxf7 is the trap.',
      5: 'g6! kicks the queen away and blocks its path to f7.',
      7: 'Nf6 blocks the queen’s line to f7 again. Now Black develops with tempo.',
    },
    summary: 'Every young player meets the four-move checkmate. Drill this until the defense is automatic.',
    tags: ['1.e4 e5', 'Traps', 'Must-know'],
  },
  {
    id: 'london-system',
    track: 'openings',
    title: 'London System',
    eco: 'D02',
    subtitle: 'The reliable setup for White against ...d5',
    rating: 1100,
    side: 'w',
    moves: m('d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3'),
    notes: {
      2: 'Bring the dark-squared bishop out before playing e3 so it is not locked in.',
      4: 'Solid pawn chain. Now the light-squared bishop can develop too.',
      8: 'c3 makes a sturdy triangle of pawns supporting d4.',
      12: 'Bg3 keeps the bishop pair and answers the challenge of ...Bd6.',
      14: 'Every piece is developed. Next: castle and push e4 or Ne5.',
    },
    summary: 'A system opening with clear plans — great for building confidence at the board.',
    tags: ['1.d4', 'System', 'Low theory'],
  },
  {
    id: 'caro-kann-advance',
    track: 'openings',
    title: 'Caro-Kann: Advance',
    eco: 'B12',
    subtitle: 'Black’s solid answer to 1.e4, short-castle line',
    rating: 1300,
    side: 'b',
    moves: m('e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 Be3 Nd7 O-O Ne7'),
    notes: {
      1: 'c6 prepares ...d5 with pawn support.',
      5: 'Develop the light-squared bishop BEFORE ...e6 so it doesn’t get trapped behind pawns.',
      9: 'Strike at White’s pawn chain from the side — the key Caro-Kann break.',
      13: 'Ne7 heads to c6 or g6. Black’s position is compact and hard to break.',
    },
    summary: 'Learn the most important rule of the Caro-Kann: bishop out first, then hit the chain with ...c5.',
    tags: ['vs 1.e4', 'Solid', 'Pawn chains'],
  },
  {
    id: 'qgd-orthodox',
    track: 'openings',
    title: 'Queen’s Gambit Declined',
    eco: 'D55',
    subtitle: 'Orthodox Defense with Bg5 and ...b6',
    rating: 1600,
    side: 'w',
    moves: m('d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6'),
    notes: {
      2: 'The Queen’s Gambit: offer a wing pawn to win the center.',
      6: 'Pin the f6-knight to increase pressure on d5.',
      12: 'Keep the pin rather than trading. White keeps central tension.',
      13: 'Black prepares ...Bb7 — the Tartakower setup.',
    },
    summary: 'Classical chess at its finest. Understand pins, tension, and the fight for d5.',
    tags: ['1.d4', 'Classical', 'Positional'],
  },
  {
    id: 'najdorf-english-attack',
    track: 'openings',
    title: 'Sicilian Najdorf',
    eco: 'B90',
    subtitle: 'English Attack with ...e5 and ...Be6',
    rating: 2000,
    side: 'b',
    moves: m('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 O-O O-O-O Nbd7 g4 b5'),
    notes: {
      9: '...a6 — the Najdorf move. It controls b5 and prepares ...e5 or ...b5.',
      11: 'Kick the knight from d4 and grab space, accepting a backward d6 pawn.',
      13: 'Control d5 — the most important square in this structure.',
      21: '...b5! Opposite-side castling means a pawn race. Black’s attack is just as fast.',
    },
    summary: 'The opening of Fischer and Kasparov. Pure race: whoever attacks faster wins.',
    tags: ['vs 1.e4', 'Sharp', 'Opposite castling'],
  },
  {
    id: 'ruy-lopez-marshall',
    track: 'openings',
    title: 'Ruy López: Marshall Attack',
    eco: 'C89',
    subtitle: 'Black sacrifices a pawn for a kingside attack',
    rating: 2300,
    side: 'b',
    moves: m('e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d4 Bd6 Re1 Qh4 g3 Qh3'),
    notes: {
      15: '...d5!! The Marshall Gambit — a pawn for rapid development.',
      21: '...c6 supports the d5-knight. Black’s pieces will swarm the kingside.',
      23: 'The bishop points at h2. Notice how few White pieces defend the king.',
      27: 'Qh3 — the queen lands next to White’s king. Black has huge pressure.',
    },
    summary: 'A world-championship-level gambit. Memorize the sequence; understand the compensation.',
    tags: ['vs 1.e4', 'Gambit', 'Elite theory'],
  },
  {
    id: 'grunfeld-exchange',
    track: 'openings',
    title: 'Grünfeld: Exchange',
    eco: 'D85',
    subtitle: 'Modern main line with Be3 and Rc1',
    rating: 2600,
    side: 'b',
    moves: m('d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3 c5 Be3 Qa5 Qd2 O-O Rc1 cxd4 cxd4 Qxd2+ Kxd2'),
    notes: {
      5: '...d5 invites White to build a big center — so Black can attack it.',
      11: 'The Grünfeld bishop on g7 x-rays d4 through the whole board.',
      13: '...c5 is the thematic strike against the center.',
      22: 'Queens are off. Black aims for ...Rd8 and ...Nc6 with pressure on d4.',
    },
    summary: 'Hypermodern chess: let White build the center, then demolish it.',
    tags: ['vs 1.d4', 'Hypermodern', 'Deep theory'],
  },
  {
    id: 'kings-indian-mar-del-plata',
    track: 'openings',
    title: 'King’s Indian: Mar del Plata',
    eco: 'E99',
    subtitle: 'Classical main line, kingside pawn storm',
    rating: 2800,
    side: 'b',
    moves: m('d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Nd3 f5 Bd2 Nf6 f3 f4'),
    notes: {
      11: '...e5 — the classical King’s Indian break.',
      15: 'The knight reroutes toward the kingside.',
      19: '...f5! The pawn storm begins.',
      23: '...f4 gains space. Next comes ...g5–g4. White attacks on the queenside — race on!',
    },
    summary: 'The most double-edged structure in chess. Grandmasters still debate it today.',
    tags: ['vs 1.d4', 'Attack', 'GM preparation'],
  },

  // ───────────── ENDGAMES ─────────────
  {
    id: 'ladder-mate',
    track: 'endgames',
    title: 'Ladder Mate',
    subtitle: 'Two rooks walk the king to the edge',
    rating: 600,
    side: 'w',
    fen: '8/8/8/4k3/R7/7R/8/6K1 w - - 0 1',
    moves: m('Rh5+ Kd6 Ra6+ Ke7 Rh7+ Kd8 Ra8#'),
    notes: {
      0: 'One rook guards a rank, the other gives check one rank higher.',
      2: 'Take turns! The rooks climb like a ladder.',
      4: 'Keep the rooks far from the king so it can’t attack them.',
      6: 'Checkmate! The king ran out of ranks.',
    },
    summary: 'The very first checkmate every student should master.',
    tags: ['Checkmate', 'Rooks'],
  },
  {
    id: 'queen-mate',
    track: 'endgames',
    title: 'Queen + King Mate',
    subtitle: 'The final squeeze — without stalemate',
    rating: 700,
    side: 'w',
    fen: '6k1/4Q3/8/5K2/8/8/8/8 w - - 0 1',
    moves: m('Kg6 Kh8 Qh7#'),
    notes: {
      0: 'Bring the king closer. The queen alone cannot finish the job.',
      1: 'Black has exactly one move. Always check: does the enemy king have a move? No moves + no check = stalemate!',
      2: 'The king protects the queen. Checkmate!',
    },
    summary: 'Learn to finish with the king’s help and avoid the stalemate trap.',
    tags: ['Checkmate', 'Stalemate'],
  },
  {
    id: 'king-pawn-sixth-rank',
    track: 'endgames',
    title: 'King + Pawn: Key Squares',
    subtitle: 'King on the 6th rank wins',
    rating: 1000,
    side: 'w',
    fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1',
    moves: m('Kf6 Kf8 e6 Ke8 e7 Kd7 Kf7 Kd6 e8=Q'),
    notes: {
      0: 'Step to the side. The king clears the path while keeping control.',
      2: 'Now the pawn advances with the king’s protection.',
      6: 'Kf7 guards e8 — the promotion square.',
      8: 'A new queen! King in front of the pawn is the winning formula.',
    },
    summary: 'The foundation of all endgames: the king leads, the pawn follows.',
    tags: ['Pawn endings', 'Opposition'],
  },
  {
    id: 'lucena-bridge',
    track: 'endgames',
    title: 'Lucena Position',
    subtitle: 'Building a bridge with the rook',
    rating: 1700,
    side: 'w',
    fen: '1K6/1P2k3/8/8/8/8/2r5/3R4 w - - 0 1',
    moves: m('Rd4 Rc1 Ka7 Ra1+ Kb6 Rb1+ Kc6 Rc1+ Kb5 Rb1+ Rb4'),
    notes: {
      0: 'Rook to the 4th rank! This is the "bridge" that will block checks later.',
      2: 'Step out of the corner.',
      6: 'Walk toward the rook to shorten the checking distance.',
      10: 'The bridge is built. No more checks — the pawn promotes.',
    },
    summary: 'The most important rook endgame in chess. Every club player must know it.',
    tags: ['Rook endings', 'Technique'],
  },
  {
    id: 'reti-study',
    track: 'endgames',
    title: 'Réti’s Study',
    subtitle: 'Chasing two goals with one king',
    rating: 2300,
    side: 'w',
    fen: '7K/8/k1P5/7p/8/8/8/8 w - - 0 1',
    moves: m('Kg7 h4 Kf6 Kb6 Ke5 Kxc6 Kf4'),
    notes: {
      0: 'A diagonal king move gets closer to BOTH the h-pawn and the c-pawn.',
      2: 'Still moving toward both targets at once.',
      4: 'If Black takes c6, White catches the pawn. If Black pushes, White supports c6.',
      6: 'The king caught the pawn — a draw from a "lost" position!',
    },
    summary: 'A famous 1921 study showing how geometry on the chessboard can save the game.',
    tags: ['Studies', 'King activity'],
  },
  {
    id: 'saavedra-study',
    track: 'endgames',
    title: 'Saavedra Position',
    subtitle: 'Underpromotion to a rook!',
    rating: 2700,
    side: 'w',
    fen: '8/8/1KP5/3r4/8/8/8/k7 w - - 0 1',
    moves: m('c7 Rd6+ Kb5 Rd5+ Kb4 Rd4+ Kb3 Rd3+ Kc2 Rd4 c8=R Ra4 Kb3'),
    notes: {
      0: 'Push! The pawn is one step from promoting.',
      8: 'The king escapes the checks. But Black has a trick…',
      9: 'If c8=Q?, Rc4+! Qxc4 is stalemate. Find something better.',
      10: 'c8=R!! A rook avoids stalemate and threatens Ra8#.',
      12: 'Black must lose the rook or be mated. White wins.',
    },
    summary: 'The most famous endgame study ever composed (1895).',
    tags: ['Studies', 'Underpromotion'],
  },
  {
    id: 'philidor-defense',
    track: 'endgames',
    title: 'Philidor Position',
    subtitle: 'The third-rank rook defense',
    rating: 1500,
    side: 'b',
    moves: [],
    notes: {},
    summary: 'How to draw a rook endgame a pawn down.',
    tags: ['Rook endings', 'Defense'],
    locked: true,
  },
  {
    id: 'vancura',
    track: 'endgames',
    title: 'Vančura Defense',
    subtitle: 'Drawing against the rook pawn',
    rating: 2400,
    side: 'b',
    moves: [],
    notes: {},
    summary: 'Side checks and the magic of the f-file rook.',
    tags: ['Rook endings', 'Defense'],
    locked: true,
  },

  // ───────────── ADVANCED TECHNIQUES ─────────────
  {
    id: 'greek-gift',
    track: 'advanced',
    title: 'The Greek Gift',
    subtitle: 'Bxh7+ sacrifice against a castled king',
    rating: 1800,
    side: 'w',
    setup: m('e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 Nf3 Be7 Bd3 O-O'),
    moves: m('Bxh7+ Kxh7 Ng5+ Kg8 Qh5'),
    notes: {
      0: 'The checklist: bishop on d3, knight can reach g5, queen can reach h5, no black knight on f6.',
      2: 'The knight jumps in with check.',
      4: 'Qh5 threatens Qh7 checkmate. Black’s king is in serious trouble.',
    },
    summary: 'The classic sacrifice. Learn the preconditions, not just the moves.',
    tags: ['Sacrifice', 'Attack'],
  },
  {
    id: 'minority-attack',
    track: 'advanced',
    title: 'The Minority Attack',
    subtitle: 'Queenside pawn storm in the Carlsbad structure',
    rating: 2100,
    side: 'w',
    setup: m('d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 Be7 e3 c6 Bd3 Nbd7 Qc2 O-O Nf3 Re8 O-O Nf8'),
    moves: m('Rab1 a5 a3 Ng6 b4 axb4 axb4'),
    notes: {
      0: 'The rook goes behind the b-pawn it will support.',
      2: 'a3 prepares b4 so Black can’t stop the advance.',
      4: 'Two pawns attack three. The goal: b5 and create a weak pawn on c6.',
      6: 'White’s plan is clear: b5 next, leaving Black with a target.',
    },
    summary: 'Why attacking with FEWER pawns creates lasting weaknesses.',
    tags: ['Pawn structure', 'Planning'],
  },
  {
    id: 'exchange-sacrifice-dragon',
    track: 'advanced',
    title: 'Exchange Sacrifice …Rxc3',
    subtitle: 'The Dragon’s signature positional sacrifice',
    rating: 2500,
    side: 'b',
    setup: m('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rc8 Bb3 Ne5 h4 Nc4 Bxc4 Rxc4 g4 Qa5 Kb1 Rfc8 Nb3 Qa6 h5'),
    moves: m('Rxc3 Qxc3 Rxc3 bxc3 Qc4'),
    notes: {
      0: 'Give up a rook for a knight to shatter White’s king shelter.',
      2: 'The second rook joins in.',
      4: 'Qc4: White’s queenside pawns are broken and the king is exposed. Material isn’t everything.',
    },
    summary: 'Elite players give up material for structure and initiative. Learn when it works.',
    tags: ['Sacrifice', 'Initiative'],
  },
  {
    id: 'prophylaxis',
    track: 'advanced',
    title: 'Prophylaxis',
    subtitle: 'Stop your opponent’s plan before it starts',
    rating: 2700,
    side: 'w',
    moves: [],
    notes: {},
    summary: 'Karpov-style thinking: ask "what does my opponent want?" every move.',
    tags: ['Strategy', 'Thinking'],
    locked: true,
  },
]

export function lessonsFor(track: Track) {
  return LESSONS.filter((l) => l.track === track).sort((a, b) => a.rating - b.rating)
}

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id)
}

// ───────────── PUZZLES ─────────────

export interface Puzzle {
  id: string
  title: string
  theme: string
  rating: number
  fen?: string
  /** Moves from the starting position that lead to the puzzle. */
  setup?: string[]
  /** Solver moves alternate with forced replies. The solver always moves first. */
  solution: string[]
  hint: string
}

export const PUZZLES: Puzzle[] = [
  { id: 'p-backrank', title: 'The Back Rank', theme: 'Mate in 1', rating: 600, fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', solution: ['Ra8#'], hint: 'Black’s own pawns trap the king.' },
  { id: 'p-fool', title: 'Fastest Mate Ever', theme: 'Mate in 1', rating: 620, setup: m('f3 e5 g4'), solution: ['Qh4#'], hint: 'White weakened the e1–h4 diagonal.' },
  { id: 'p-scholar', title: 'Weak f7', theme: 'Mate in 1', rating: 680, setup: m('e4 e5 Bc4 Nc6 Qh5 Nf6'), solution: ['Qxf7#'], hint: 'Two pieces aim at the same square.' },
  { id: 'p-fork', title: 'Royal Fork', theme: 'Fork', rating: 800, fen: 'r3k3/8/8/1N6/8/8/8/6K1 w - - 0 1', solution: m('Nc7+ Kd7 Nxa8'), hint: 'A knight can attack two pieces at once.' },
  { id: 'p-skewer', title: 'Through the King', theme: 'Skewer', rating: 900, fen: '8/8/2k4q/8/8/8/8/R5K1 w - - 0 1', solution: m('Ra6+ Kd7 Rxh6'), hint: 'Check the king — what is behind it?' },
  { id: 'p-arabian', title: 'Arabian Mate', theme: 'Mate in 1', rating: 1000, fen: '7k/1R6/5N2/8/8/8/8/6K1 w - - 0 1', solution: ['Rh7#'], hint: 'The knight guards the rook and g8.' },
  { id: 'p-legal', title: 'Légal’s Trap', theme: 'Mate in 2', rating: 1150, setup: m('e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5 Bxd1'), solution: m('Bxf7+ Ke7 Nd5#'), hint: 'Your queen is gone — but the minor pieces are deadly.' },
  { id: 'p-blackburne', title: 'Blackburne Shilling Trap', theme: 'Mate in 3', rating: 1250, setup: m('e4 e5 Nf3 Nc6 Bc4 Nd4 Nxe5 Qg5 Nxf7'), solution: m('Qxg2 Rf1 Qxe4+ Be2 Nf3#'), hint: 'Ignore the fork. Go after the king.' },
  { id: 'p-englund', title: 'Englund Gambit Trap', theme: 'Mate in 3', rating: 1350, setup: m('d4 e5 dxe5 Nc6 Nf3 Qe7 Bf4 Qb4+ Bd2 Qxb2 Bc3'), solution: m('Bb4 Qd2 Bxc3 Qxc3 Qc1#'), hint: 'Pin first, then find the back-rank square.' },
  { id: 'p-anastasia', title: 'Anastasia’s Mate', theme: 'Sacrifice', rating: 1600, fen: '7k/4Nppp/8/7Q/8/3R4/5PPP/6K1 w - - 0 1', solution: m('Qxh7+ Kxh7 Rh3#'), hint: 'Open the h-file at any cost.' },
  { id: 'p-philidor', title: 'Philidor’s Legacy', theme: 'Smothered mate', rating: 1800, fen: 'r6k/6pp/8/6N1/2Q5/8/6PP/6K1 w - - 0 1', solution: m('Nf7+ Kg8 Nh6+ Kh8 Qg8+ Rxg8 Nf7#'), hint: 'Double check, then a queen sacrifice.' },
  { id: 'p-reti', title: 'Two Birds, One King', theme: 'Endgame study', rating: 2300, fen: '7K/8/k1P5/7p/8/8/8/8 w - - 0 1', solution: m('Kg7 h4 Kf6 Kb6 Ke5 Kxc6 Kf4'), hint: 'Walk diagonally. Your king can chase two goals.' },
  { id: 'p-saavedra', title: 'Saavedra', theme: 'Underpromotion', rating: 2700, fen: '8/8/1KP5/3r4/8/8/8/k7 w - - 0 1', solution: m('c7 Rd6+ Kb5 Rd5+ Kb4 Rd4+ Kb3 Rd3+ Kc2 Rd4 c8=R Ra4 Kb3'), hint: 'A queen isn’t always the best promotion.' },
]

export const TRACK_META: Record<Track, { title: string; tagline: string; icon: string }> = {
  openings: { title: 'Openings', tagline: 'Drill repertoire lines with spaced repetition until they’re automatic.', icon: '♞' },
  endgames: { title: 'Endgames', tagline: 'From first checkmates to famous studies — play them, don’t just read them.', icon: '♚' },
  advanced: { title: 'Advanced Techniques', tagline: 'Sacrifices, pawn structures, and the ideas that separate masters.', icon: '♛' },
}
