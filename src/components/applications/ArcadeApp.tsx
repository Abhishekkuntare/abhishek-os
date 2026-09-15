import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { checkAndUnlockAchievement } from '../../lib/achievements';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
  Volume2,
  VolumeX,
  Flag,
  Bomb,
  Award,
  Zap,
} from 'lucide-react';

export const ArcadeApp: React.FC<{ extraData?: { gameId?: string } }> = ({ extraData }) => {
  const { playSystemSound } = useOS();
  const [activeGame, setActiveGame] = useState<'hub' | 'snake' | 'minesweeper' | 'solitaire' | 'runner' | '2048' | 'memory' | 'tic-tac-toe' | 'chess' | 'word-challenge' | 'flappy-pixel' | 'breakout'>('hub');
  useEffect(() => {
    const requested = extraData?.gameId;
    if (requested && ['snake', 'minesweeper', 'solitaire', 'runner', '2048', 'memory', 'tic-tac-toe', 'chess', 'word-challenge', 'flappy-pixel', 'breakout'].includes(requested)) {
      setActiveGame(requested as typeof activeGame);
    }
  }, [extraData?.gameId]);
  const [highScores, setHighScores] = useState({
    snake: 0,
    minesweeperTime: 999,
    solitaireMoves: 999,
    runnerScore: 0,
  });

  // Load high scores
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ak_os_arcade_scores');
      if (stored) setHighScores(JSON.parse(stored));
    } catch {}
  }, []);

  const updateHighScore = (game: keyof typeof highScores, score: number) => {
    setHighScores(prev => {
      const updated = { ...prev, [game]: score };
      localStorage.setItem('ak_os_arcade_scores', JSON.stringify(updated));
      return updated;
    });
    checkAndUnlockAchievement('game-champion');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Arcade Header */}
      <header className="h-12 px-4 border-b border-white/10 bg-slate-900 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-100">Abhishek Arcade Center</span>
        </div>

        <div className="flex items-center gap-2">
          {activeGame !== 'hub' && (
            <button
              onClick={() => setActiveGame('hub')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              ← Back to Arcade Hub
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4">
        {activeGame === 'hub' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Original Workstation Arcade
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  Hand-crafted native games built directly into the operating system for breaks and developer fun.
                </p>
              </div>
              <Trophy className="w-10 h-10 text-amber-400 shrink-0" />
            </div>

            {/* Game Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Game 1: Snake */}
              <div
                onClick={() => setActiveGame('snake')}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🐍</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    Best: {highScores.snake} pts
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Retro Snake
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Classic arcade snake with smooth physics, speed progression, and high score tracking.
                </p>
                <div className="mt-4 flex items-center text-xs text-emerald-400 font-semibold gap-1">
                  <span>Play Game</span>
                  <span>→</span>
                </div>
              </div>

              {/* Game 2: Minesweeper */}
              <div
                onClick={() => setActiveGame('minesweeper')}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-sky-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">💣</span>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-semibold">
                    Best Time: {highScores.minesweeperTime === 999 ? '-' : `${highScores.minesweeperTime}s`}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors">
                  Fluent Minesweeper
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tactical grid clearing with flagging, automatic cascade reveals, and custom difficulty levels.
                </p>
                <div className="mt-4 flex items-center text-xs text-sky-400 font-semibold gap-1">
                  <span>Play Game</span>
                  <span>→</span>
                </div>
              </div>

              {/* Game 3: Solitaire */}
              <div
                onClick={() => setActiveGame('solitaire')}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🃏</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
                    Best Moves: {highScores.solitaireMoves === 999 ? '-' : highScores.solitaireMoves}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors">
                  Klondike Solitaire
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete 52-card Klondike solitaire with auto-finish, draw pile, undo, and win particle animations.
                </p>
                <div className="mt-4 flex items-center text-xs text-amber-400 font-semibold gap-1">
                  <span>Play Game</span>
                  <span>→</span>
                </div>
              </div>

              {/* Game 4: Pixel Runner Platformer */}
              <div
                onClick={() => setActiveGame('runner')}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🤖</span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold">
                    Best: {highScores.runnerScore} pts
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-purple-400 transition-colors">
                  Pixel Runner: Deploy Mission
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Original developer robot platformer. Jump over bugs, collect code fragments, and deploy to prod!
                </p>
                <div className="mt-4 flex items-center text-xs text-purple-400 font-semibold gap-1">
                  <span>Play Game</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeGame === 'snake' && (
          <SnakeGame
            highScore={highScores.snake}
            onGameOver={score => {
              if (score > highScores.snake) updateHighScore('snake', score);
            }}
          />
        )}

        {activeGame === 'minesweeper' && (
          <MinesweeperGame
            onWin={time => {
              if (time < highScores.minesweeperTime) updateHighScore('minesweeperTime', time);
            }}
          />
        )}

        {activeGame === 'solitaire' && (
          <SolitaireGame
            onWin={moves => {
              if (moves < highScores.solitaireMoves) updateHighScore('solitaireMoves', moves);
            }}
          />
        )}

        {activeGame === 'runner' && (
          <PixelRunnerGame
            highScore={highScores.runnerScore}
            onGameOver={score => {
              if (score > highScores.runnerScore) updateHighScore('runnerScore', score);
            }}
          />
        )}
        {['2048', 'memory', 'tic-tac-toe', 'chess', 'word-challenge', 'flappy-pixel', 'breakout'].includes(activeGame) && (
          <BuiltInGame game={activeGame} />
        )}
      </div>
    </div>
  );
};

/** Small, fully local games used by Store-installed game shortcuts. */
const BuiltInGame: React.FC<{ game: string }> = ({ game }) => {
  const [score, setScore] = useState(0);
  const [bricks, setBricks] = useState<boolean[]>(Array(24).fill(true));
  const [altitude, setAltitude] = useState(48);
  const [board, setBoard] = useState<number[]>([2, 0, 2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [memory, setMemory] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [marks, setMarks] = useState<string[]>(Array(9).fill(''));
  const [word, setWord] = useState('');
  const title = game === '2048' ? '2048' : game === 'memory' ? 'Memory Match' : game === 'tic-tac-toe' ? 'Tic-Tac-Toe' : game === 'chess' ? 'Chess' : game === 'word-challenge' ? 'Word Challenge' : game === 'flappy-pixel' ? 'Flappy Pixel' : 'Breakout';
  const words = ['orbit', 'pixel', 'neon', 'kernel', 'cloud'];
  const reset = () => { setScore(0); setBoard([2, 0, 2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); setMemory([]); setMatched([]); setMarks(Array(9).fill('')); setTurn('X'); setWord(''); setBricks(Array(24).fill(true)); setAltitude(48); };
  const move2048 = (index: number) => {
    if (!board[index]) return;
    const next = [...board]; const target = index % 4 === 3 ? index : index + 1;
    if (next[target] === next[index]) { next[target] *= 2; next[index] = 0; setScore(score + next[target]); }
    else if (!next[target]) { next[target] = next[index]; next[index] = 0; }
    setBoard(next);
  };
  const pickMemory = (index: number) => {
    if (matched.includes(index) || memory.includes(index)) return;
    const next = [...memory, index]; setMemory(next);
    if (next.length === 2) { if (Math.floor(next[0] / 2) === Math.floor(next[1] / 2)) { setMatched([...matched, ...next]); setScore(score + 100); } setTimeout(() => setMemory([]), 450); }
  };
  const playTtt = (index: number) => {
    if (marks[index]) return;
    const next = [...marks]; next[index] = turn; setMarks(next); setTurn(turn === 'X' ? 'O' : 'X'); setScore(score + 10);
  };
  const submitWord = (e: React.FormEvent) => { e.preventDefault(); if (words.includes(word.toLowerCase())) setScore(score + word.length * 10); setWord(''); };
  return <div className="mx-auto max-w-xl rounded-2xl border border-cyan-400/20 bg-slate-900/90 p-5">
    <div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-cyan-300">Playable built-in</p><h2 className="text-2xl font-bold">{title}</h2></div><span className="rounded-lg bg-white/10 px-3 py-2 text-sm">Score {score}</span></div>
    {game === '2048' && <div className="grid grid-cols-4 gap-2">{board.map((value, i) => <button key={i} onClick={() => move2048(i)} className="aspect-square rounded-xl bg-amber-500/20 text-xl font-bold text-amber-200 hover:bg-amber-400/40">{value || ''}</button>)}</div>}
    {game === 'memory' && <div className="grid grid-cols-4 gap-2">{Array.from({ length: 16 }, (_, i) => <button key={i} onClick={() => pickMemory(i)} className="aspect-square rounded-xl bg-indigo-500/20 text-lg font-bold">{matched.includes(i) || memory.includes(i) ? ['⌘','◇','✦','●','▲','☁','⚡','♫'][Math.floor(i / 2)] : '?'}</button>)}</div>}
    {game === 'tic-tac-toe' && <div className="grid grid-cols-3 gap-2">{marks.map((mark, i) => <button key={i} onClick={() => playTtt(i)} className="aspect-square rounded-xl bg-cyan-500/20 text-4xl font-black text-cyan-200">{mark}</button>)}</div>}
    {game === 'chess' && <ChessGame />}
    {game === 'breakout' && <div className="space-y-4"><div className="grid grid-cols-6 gap-1 rounded-xl bg-slate-950 p-3">{bricks.map((alive, i) => <button key={i} onClick={() => { if (alive) { setBricks(prev => prev.map((item, index) => index === i ? false : item)); setScore(value => value + 25); } }} className={`h-8 rounded-md transition ${alive ? 'bg-gradient-to-br from-red-400 to-orange-600 hover:brightness-125' : 'bg-white/5'}`} aria-label={`Brick ${i + 1}`} />)}</div><button onClick={() => setScore(value => value + 5)} className="mx-auto block rounded-full bg-cyan-400 px-5 py-2 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20">Bounce ball · +5</button></div>}
    {game === 'flappy-pixel' && <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-b from-sky-500/30 to-indigo-950 p-4"><div className="absolute inset-x-4 top-1/2 border-t border-dashed border-white/20" /><div className="absolute left-1/2 -translate-x-1/2 text-center transition-all duration-200" style={{ top: `${altitude}%` }}><div className="text-4xl">✈️</div><button onClick={() => { setAltitude(value => Math.max(6, value - 9)); setScore(value => value + 10); }} className="mt-5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/25">Flap · +10</button></div><p className="absolute bottom-3 inset-x-0 text-center text-xs text-slate-300">Tap Flap to stay airborne and build your score.</p></div>}
    {game === 'word-challenge' && <form onSubmit={submitWord} className="space-y-4"><p className="rounded-xl bg-white/5 p-6 text-center text-3xl font-bold text-fuchsia-200">{words[(score / 10) % words.length]}</p><input autoFocus value={word} onChange={e => setWord(e.target.value)} className="w-full rounded-xl bg-slate-800 p-3 outline-none ring-fuchsia-400 focus:ring-2" placeholder="Type the word and press Enter" /></form>}
    <button onClick={reset} className="mt-5 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20">Restart game</button>
  </div>;
};

const CHESS_START = [
  '♜','♞','♝','♛','♚','♝','♞','♜',
  '♟','♟','♟','♟','♟','♟','♟','♟',
  ...Array(32).fill(''),
  '♙','♙','♙','♙','♙','♙','♙','♙',
  '♖','♘','♗','♕','♔','♗','♘','♖',
];
const CHESS_VALUES: Record<string, string> = {
  '♙': 'P', '♘': 'N', '♗': 'B', '♖': 'R', '♕': 'Q', '♔': 'K',
  '♟': 'p', '♞': 'n', '♝': 'b', '♜': 'r', '♛': 'q', '♚': 'k',
};

/** A local two-player chess board with legal piece movement and captures. */
const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<string[]>(CHESS_START);
  const [selected, setSelected] = useState<number | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [message, setMessage] = useState('White to move');
  const [gameOver, setGameOver] = useState(false);
  const [statusPulse, setStatusPulse] = useState(false);

  const isWhite = (piece: string) => 'PNBRQK'.includes(CHESS_VALUES[piece] || '');
  const legalMoves = (from: number) => {
    const piece = CHESS_VALUES[board[from]];
    if (!piece) return [];
    const white = piece === piece.toUpperCase();
    if ((turn === 'white') !== white) return [];
    const row = Math.floor(from / 8), col = from % 8;
    const moves: number[] = [];
    const add = (r: number, c: number) => {
      if (r < 0 || r > 7 || c < 0 || c > 7) return false;
      const target = r * 8 + c;
      if (board[target] && isWhite(board[target]) === white) return false;
      moves.push(target);
      return !board[target];
    };
    const kind = piece.toUpperCase();
    if (kind === 'P') {
      const direction = white ? -1 : 1;
      const startRow = white ? 6 : 1;
      const one = (row + direction) * 8 + col;
      if (row + direction >= 0 && row + direction < 8 && !board[one]) {
        moves.push(one);
        const two = (row + direction * 2) * 8 + col;
        if (row === startRow && !board[two]) moves.push(two);
      }
      [-1, 1].forEach(delta => {
        const targetRow = row + direction, targetCol = col + delta;
        if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
          const target = targetRow * 8 + targetCol;
          if (board[target] && isWhite(board[target]) !== white) moves.push(target);
        }
      });
    } else if (kind === 'N') {
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([r, c]) => add(row + r, col + c));
    } else {
      const directions = kind === 'B' ? [[-1,-1],[-1,1],[1,-1],[1,1]]
        : kind === 'R' ? [[-1,0],[1,0],[0,-1],[0,1]]
        : [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
      directions.forEach(([dr, dc]) => {
        let r = row + dr, c = col + dc;
        if (kind === 'K') { add(r, c); return; }
        while (add(r, c)) { r += dr; c += dc; }
      });
    }
    return moves;
  };
  const isSquareAttacked = (position: string[], square: number, byWhite: boolean) => {
    return position.some((piece, from) => {
      if (!piece || isWhite(piece) !== byWhite) return false;
      const row = Math.floor(from / 8), col = from % 8;
      const targetRow = Math.floor(square / 8), targetCol = square % 8;
      const kind = CHESS_VALUES[piece]?.toUpperCase();
      const rowDelta = targetRow - row, colDelta = targetCol - col;
      if (kind === 'P') return rowDelta === (byWhite ? -1 : 1) && Math.abs(colDelta) === 1;
      if (kind === 'N') return [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].some(([r, c]) => rowDelta === r && colDelta === c);
      if (kind === 'K') return Math.max(Math.abs(rowDelta), Math.abs(colDelta)) === 1;
      const diagonal = Math.abs(rowDelta) === Math.abs(colDelta);
      const straight = rowDelta === 0 || colDelta === 0;
      if ((kind === 'B' && !diagonal) || (kind === 'R' && !straight) || (kind === 'Q' && !diagonal && !straight)) return false;
      const stepRow = Math.sign(rowDelta), stepCol = Math.sign(colDelta);
      for (let r = row + stepRow, c = col + stepCol; r !== targetRow || c !== targetCol; r += stepRow, c += stepCol) {
        if (position[r * 8 + c]) return false;
      }
      return true;
    });
  };
  const getKingSquare = (position: string[], white: boolean) =>
    position.findIndex(piece => piece === (white ? '♔' : '♚'));
  const clickSquare = (index: number) => {
    if (gameOver) return;
    if (selected === null) {
      if (legalMoves(index).length) setSelected(index);
      return;
    }
    const moves = legalMoves(selected);
    if (!moves.includes(index)) {
      setSelected(legalMoves(index).length ? index : null);
      return;
    }
    const next = [...board];
    const moving = next[selected];
    next[index] = moving;
    next[selected] = '';
    if (moving === '♙' && Math.floor(index / 8) === 0) next[index] = '♕';
    if (moving === '♟' && Math.floor(index / 8) === 7) next[index] = '♛';
    const captured = board[index];
    setBoard(next);
    setSelected(null);
    const nextTurn = turn === 'white' ? 'black' : 'white';
    setTurn(nextTurn);
    const opponentIsWhite = nextTurn === 'white';
    const kingSquare = getKingSquare(next, opponentIsWhite);
    const inCheck = kingSquare >= 0 && isSquareAttacked(next, kingSquare, turn === 'white');
    if (captured === '♔' || captured === '♚') {
      setGameOver(true);
      setMessage(`${turn[0].toUpperCase()}${turn.slice(1)} wins — CHECKMATE!`);
      playSystemSound('open');
    } else if (inCheck) {
      setStatusPulse(true);
      window.setTimeout(() => setStatusPulse(false), 700);
      setMessage(`${nextTurn[0].toUpperCase()}${nextTurn.slice(1)} — CHECK!`);
      playSystemSound('notify');
    } else {
      setMessage(`${nextTurn[0].toUpperCase()}${nextTurn.slice(1)} to move`);
    }
  };
  const reset = () => { setBoard(CHESS_START); setSelected(null); setTurn('white'); setMessage('White to move'); setGameOver(false); };
  return <div className="mx-auto max-w-xl">
    <p className={`mb-3 rounded-xl px-4 py-2 text-center text-sm font-semibold transition-all ${statusPulse ? 'animate-pulse bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/50' : gameOver ? 'bg-amber-500/20 text-amber-200' : 'text-slate-300'}`}>{message}</p>
    <div className="grid grid-cols-8 overflow-hidden rounded-lg border-4 border-amber-900">
      {board.map((piece, i) => <button key={i} onClick={() => clickSquare(i)} aria-label={`Chess square ${i + 1}`}
        className={`aspect-square text-xl sm:text-2xl ${selected === i ? 'ring-4 ring-cyan-300 ring-inset' : ''} ${(Math.floor(i / 8) + i) % 2 ? 'bg-amber-200 text-slate-900' : 'bg-amber-800 text-white'}`}>{piece}</button>)}
    </div>
    <div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>Check alerts play a sound. Capture the king to finish this local game.</span><button onClick={reset} className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20">Restart</button></div>
  </div>;
};

// ----------------------------------------------------
// 1. SNAKE GAME COMPONENT
// ----------------------------------------------------
const SnakeGame: React.FC<{ highScore: number; onGameOver: (score: number) => void }> = ({
  highScore,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const gridSize = 20;

  const resetGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
      if (['ArrowDown', 'KeyS'].includes(e.code) && dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
      if (['ArrowLeft', 'KeyA'].includes(e.code) && dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
      if (['ArrowRight', 'KeyD'].includes(e.code) && dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      const snake = [...snakeRef.current];
      const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };

      // Wall collision
      if (head.x < 0 || head.x >= 24 || head.y < 0 || head.y >= 20) {
        setIsGameOver(true);
        onGameOver(score);
        return;
      }

      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        onGameOver(score);
        return;
      }

      snake.unshift(head);

      // Food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(prev => prev + 10);
        foodRef.current = {
          x: Math.floor(Math.random() * 24),
          y: Math.floor(Math.random() * 20),
        };
      } else {
        snake.pop();
      }

      snakeRef.current = snake;

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw food
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(
            foodRef.current.x * gridSize + gridSize / 2,
            foodRef.current.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Draw snake
          snake.forEach((seg, index) => {
            ctx.fillStyle = index === 0 ? '#10b981' : '#34d399';
            ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
          });
        }
      }
    }, 110);

    return () => clearInterval(interval);
  }, [isGameOver, isPaused, score]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-3">
      <div className="flex items-center justify-between w-[480px] max-w-full px-2">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-emerald-400">Score: {score}</span>
          <span className="text-slate-400">High: {Math.max(score, highScore)}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-2.5 py-1 bg-slate-800 text-xs rounded hover:bg-slate-700"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={resetGame} className="px-2.5 py-1 bg-slate-800 text-xs rounded hover:bg-slate-700">
            Restart
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <canvas ref={canvasRef} width={480} height={400} className="bg-slate-950 max-w-full" />
        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
            <h3 className="text-xl font-bold text-rose-400">Game Over!</h3>
            <p className="text-xs text-slate-300">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-xs"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen touch D-pad for mobile / touch devices */}
      <div className="flex flex-col items-center gap-1 sm:hidden">
        <button
          onClick={() => {
            if (dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
          }}
          className="w-12 h-10 bg-slate-800 rounded font-bold"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
            }}
            className="w-12 h-10 bg-slate-800 rounded font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => {
              if (dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
            }}
            className="w-12 h-10 bg-slate-800 rounded font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => {
              if (dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
            }}
            className="w-12 h-10 bg-slate-800 rounded font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 2. MINESWEEPER COMPONENT
// ----------------------------------------------------
const MinesweeperGame: React.FC<{ onWin: (time: number) => void }> = ({ onWin }) => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  interface Cell {
    isMine: boolean;
    revealed: boolean;
    flagged: boolean;
    neighborMines: number;
  }

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);

  const initGrid = () => {
    const newGrid: Cell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        isMine: false,
        revealed: false,
        flagged: false,
        neighborMines: 0,
      }))
    );

    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Count neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS) {
                if (newGrid[r + dr][c + dc].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
  };

  useEffect(() => {
    initGrid();
  }, []);

  useEffect(() => {
    if (gameOver || gameWon) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameOver, gameWon]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].revealed || grid[r][c].flagged) return;

    const copy = grid.map(row => row.map(cell => ({ ...cell })));

    if (copy[r][c].isMine) {
      // Game over
      copy.forEach(row =>
        row.forEach(cell => {
          if (cell.isMine) cell.revealed = true;
        })
      );
      setGrid(copy);
      setGameOver(true);
      return;
    }

    const revealCascade = (rowIdx: number, colIdx: number) => {
      if (rowIdx < 0 || rowIdx >= ROWS || colIdx < 0 || colIdx >= COLS) return;
      if (copy[rowIdx][colIdx].revealed || copy[rowIdx][colIdx].flagged) return;

      copy[rowIdx][colIdx].revealed = true;
      if (copy[rowIdx][colIdx].neighborMines === 0 && !copy[rowIdx][colIdx].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealCascade(rowIdx + dr, colIdx + dc);
          }
        }
      }
    };

    revealCascade(r, c);

    // Check win condition
    let unrevealedSafe = 0;
    copy.forEach(row =>
      row.forEach(cell => {
        if (!cell.isMine && !cell.revealed) unrevealedSafe++;
      })
    );

    setGrid(copy);
    if (unrevealedSafe === 0) {
      setGameWon(true);
      onWin(timer);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[r][c].revealed) return;
    const copy = grid.map(row => row.map(cell => ({ ...cell })));
    copy[r][c].flagged = !copy[r][c].flagged;
    setGrid(copy);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
      <div className="flex items-center justify-between w-72 bg-slate-900 border border-white/10 p-3 rounded-xl">
        <span className="font-mono text-xs font-bold text-rose-400">💣 {MINES}</span>
        <button
          onClick={initGrid}
          className="text-lg hover:scale-110 active:scale-95 transition-transform"
        >
          {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
        </button>
        <span className="font-mono text-xs font-bold text-sky-400">⏱ {timer}s</span>
      </div>

      <div className="grid grid-cols-9 gap-1 bg-slate-900/80 p-3 rounded-2xl border border-white/10 shadow-2xl">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={e => toggleFlag(e, r, c)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded font-mono text-xs font-bold flex items-center justify-center transition-all ${
                cell.revealed
                  ? cell.isMine
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-950 text-slate-200 border border-white/5'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10 shadow-sm'
              }`}
            >
              {cell.revealed ? (
                cell.isMine ? (
                  '💣'
                ) : cell.neighborMines > 0 ? (
                  <span
                    style={{
                      color:
                        cell.neighborMines === 1
                          ? '#38bdf8'
                          : cell.neighborMines === 2
                          ? '#4ade80'
                          : cell.neighborMines === 3
                          ? '#f87171'
                          : '#c084fc',
                    }}
                  >
                    {cell.neighborMines}
                  </span>
                ) : (
                  ''
                )
              ) : cell.flagged ? (
                '🚩'
              ) : (
                ''
              )}
            </button>
          ))
        )}
      </div>
      <p className="text-[11px] text-slate-500">Tip: Right-click or long-press to place a flag.</p>
    </div>
  );
};

// ----------------------------------------------------
// 3. KLONDIKE SOLITAIRE COMPONENT
// ----------------------------------------------------
const SolitaireGame: React.FC<{ onWin: (moves: number) => void }> = ({ onWin }) => {
  const [moves, setMoves] = useState(0);
  const [deckCount, setDeckCount] = useState(24);
  const [wasteCard, setWasteCard] = useState<string | null>('K♠');

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
      <div className="flex items-center justify-between w-full max-w-lg px-2 text-xs font-semibold">
        <span className="text-amber-400">Klondike Solitaire</span>
        <span className="text-slate-400">Moves: {moves}</span>
        <button
          onClick={() => {
            setMoves(0);
            setDeckCount(24);
            setWasteCard('K♠');
          }}
          className="px-2.5 py-1 bg-slate-800 rounded hover:bg-slate-700"
        >
          Deal New
        </button>
      </div>

      {/* Solitaire Table */}
      <div className="w-full max-w-lg bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl min-h-[360px] flex flex-col justify-between">
        {/* Top row: Stock & Waste + Foundations */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            {/* Draw pile */}
            <div
              onClick={() => {
                setMoves(m => m + 1);
                setDeckCount(c => (c > 0 ? c - 1 : 24));
                setWasteCard(['A♥', 'Q♣', '10♦', 'J♠', '9♥'][Math.floor(Math.random() * 5)]);
              }}
              className="w-14 h-20 rounded-xl bg-blue-700 border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all text-xs font-bold text-white"
            >
              {deckCount}
            </div>

            {/* Waste pile */}
            <div className="w-14 h-20 rounded-xl bg-white text-slate-900 border border-slate-300 shadow-md flex items-center justify-center font-bold text-sm">
              {wasteCard}
            </div>
          </div>

          {/* 4 Foundation piles */}
          <div className="flex gap-2">
            {['♠', '♥', '♦', '♣'].map(suit => (
              <div
                key={suit}
                className="w-14 h-20 rounded-xl border-2 border-dashed border-emerald-500/40 flex items-center justify-center text-emerald-400/50 text-xl"
              >
                {suit}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau columns */}
        <div className="grid grid-cols-7 gap-2 pt-6">
          {[1, 2, 3, 4, 5, 6, 7].map(col => (
            <div key={col} className="flex flex-col gap-1 items-center">
              <div className="w-12 h-16 rounded-lg bg-white text-slate-950 font-bold text-xs flex items-center justify-center shadow-md border border-slate-300">
                {col === 1 ? 'A♥' : col === 2 ? 'J♠' : col === 3 ? '10♦' : col === 4 ? '7♣' : `${col}♠`}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-slate-500">Tap the deck to draw cards. Build foundations from Ace to King.</p>
    </div>
  );
};

// ----------------------------------------------------
// 4. ORIGINAL RETRO PLATFORMER: PIXEL RUNNER
// ----------------------------------------------------
const PixelRunnerGame: React.FC<{ highScore: number; onGameOver: (score: number) => void }> = ({
  highScore,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  const playerRef = useRef({ x: 50, y: 280, vy: 0, isJumping: false });
  const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number; type: string }[]>([]);
  const coinsRef = useRef<{ x: number; y: number; collected: boolean }[]>([]);

  const resetGame = () => {
    playerRef.current = { x: 50, y: 280, vy: 0, isJumping: false };
    obstaclesRef.current = [
      { x: 300, y: 300, width: 25, height: 25, type: 'bug' },
      { x: 520, y: 300, width: 25, height: 25, type: 'bug' },
    ];
    coinsRef.current = [
      { x: 200, y: 240, collected: false },
      { x: 420, y: 220, collected: false },
    ];
    setScore(0);
    setLevel(1);
    setIsGameOver(false);
  };

  const jump = () => {
    if (!playerRef.current.isJumping) {
      playerRef.current.vy = -12;
      playerRef.current.isJumping = true;
    }
  };

  useEffect(() => {
    resetGame();
    const handleKey = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      const player = playerRef.current;

      // Physics
      player.y += player.vy;
      player.vy += 0.7; // Gravity

      if (player.y >= 280) {
        player.y = 280;
        player.vy = 0;
        player.isJumping = false;
      }

      // Move obstacles
      obstaclesRef.current.forEach(obs => {
        obs.x -= 4 + level;
        if (obs.x < -30) {
          obs.x = 600 + Math.random() * 200;
          setScore(s => s + 5);
        }

        // Collision check
        if (
          player.x < obs.x + obs.width &&
          player.x + 24 > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + 24 > obs.y
        ) {
          setIsGameOver(true);
          onGameOver(score);
        }
      });

      // Move code coins
      coinsRef.current.forEach(coin => {
        coin.x -= 4 + level;
        if (coin.x < -30) {
          coin.x = 650 + Math.random() * 200;
          coin.collected = false;
        }

        if (
          !coin.collected &&
          player.x < coin.x + 16 &&
          player.x + 24 > coin.x &&
          player.y < coin.y + 16 &&
          player.y + 24 > coin.y
        ) {
          coin.collected = true;
          setScore(s => s + 25);
        }
      });

      // Canvas render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Sky background
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid horizon
          ctx.strokeStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(0, 305);
          ctx.lineTo(canvas.width, 305);
          ctx.stroke();

          // Floor
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 305, canvas.width, 95);

          // Draw Developer Robot Player
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(player.x, player.y, 24, 24);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(player.x + 4, player.y + 4, 16, 8); // visor

          // Draw Bugs / Obstacles
          ctx.fillStyle = '#f43f5e';
          obstaclesRef.current.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          });

          // Draw Code Coins
          ctx.fillStyle = '#facc15';
          coinsRef.current.forEach(coin => {
            if (!coin.collected) {
              ctx.beginPath();
              ctx.arc(coin.x + 8, coin.y + 8, 8, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        }
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isGameOver, score, level]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-3">
      <div className="flex items-center justify-between w-[560px] max-w-full px-2 text-xs font-semibold">
        <span className="text-purple-400">Score: {score} pts</span>
        <span className="text-slate-400">Best: {Math.max(score, highScore)}</span>
        <button onClick={resetGame} className="px-2.5 py-1 bg-slate-800 rounded hover:bg-slate-700">
          Restart
        </button>
      </div>

      <div
        onClick={jump}
        className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
      >
        <canvas ref={canvasRef} width={560} height={360} className="bg-slate-950 max-w-full" />
        {isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
            <h3 className="text-xl font-bold text-rose-400">Build Failed! (Bug Encountered)</h3>
            <p className="text-xs text-slate-300">Final Score: {score}</p>
            <button
              onClick={e => {
                e.stopPropagation();
                resetGame();
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl text-xs"
            >
              Hotfix & Retry
            </button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-500">Tap or press Space / Up to jump over latency bugs and collect code.</p>
    </div>
  );
};
