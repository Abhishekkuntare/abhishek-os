// import React, { useState, useEffect, useRef } from 'react';
// import { useOS } from '../../context/OSContext';
// import { checkAndUnlockAchievement } from '../../lib/achievements';
// import {
//   Gamepad2,
//   Trophy,
//   RotateCcw,
//   Play,
//   Pause,
//   Sparkles,
//   Volume2,
//   VolumeX,
//   Flag,
//   Bomb,
//   Award,
//   Zap,
// } from 'lucide-react';

// export const ArcadeApp: React.FC<{ extraData?: { gameId?: string } }> = ({ extraData }) => {
//   const { playSystemSound } = useOS();
//   const [activeGame, setActiveGame] = useState<'hub' | 'snake' | 'minesweeper' | 'solitaire' | 'runner' | '2048' | 'memory' | 'tic-tac-toe' | 'chess' | 'word-challenge' | 'flappy-pixel' | 'breakout'>('hub');
//   useEffect(() => {
//     const requested = extraData?.gameId;
//     if (requested && ['snake', 'minesweeper', 'solitaire', 'runner', '2048', 'memory', 'tic-tac-toe', 'chess', 'word-challenge', 'flappy-pixel', 'breakout'].includes(requested)) {
//       setActiveGame(requested as typeof activeGame);
//     }
//   }, [extraData?.gameId]);
//   const [highScores, setHighScores] = useState({
//     snake: 0,
//     minesweeperTime: 999,
//     solitaireMoves: 999,
//     runnerScore: 0,
//   });

//   // Load high scores
//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem('ak_os_arcade_scores');
//       if (stored) setHighScores(JSON.parse(stored));
//     } catch {}
//   }, []);

//   const updateHighScore = (game: keyof typeof highScores, score: number) => {
//     setHighScores(prev => {
//       const updated = { ...prev, [game]: score };
//       localStorage.setItem('ak_os_arcade_scores', JSON.stringify(updated));
//       return updated;
//     });
//     checkAndUnlockAchievement('game-champion');
//   };

//   return (
//     <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
//       {/* Arcade Header */}
//       <header className="h-12 px-4 border-b border-white/10 bg-slate-900 flex items-center justify-between z-20 shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
//             <Gamepad2 className="w-4 h-4" />
//           </div>
//           <span className="font-bold text-sm text-slate-100">Abhishek Arcade Center</span>
//         </div>

//         <div className="flex items-center gap-2">
//           {activeGame !== 'hub' && (
//             <button
//               onClick={() => setActiveGame('hub')}
//               className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
//             >
//               ← Back to Arcade Hub
//             </button>
//           )}
//         </div>
//       </header>

//       {/* Main Container */}
//       <div className="flex-1 overflow-auto bg-slate-950 p-4">
//         {activeGame === 'hub' && (
//           <div className="max-w-4xl mx-auto space-y-6">
//             <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border border-white/15 backdrop-blur-md flex items-center justify-between">
//               <div>
//                 <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
//                   Original Workstation Arcade
//                 </h1>
//                 <p className="text-xs text-slate-300 mt-1">
//                   Hand-crafted native games built directly into the operating system for breaks and developer fun.
//                 </p>
//               </div>
//               <Trophy className="w-10 h-10 text-amber-400 shrink-0" />
//             </div>

//             {/* Game Grid Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Game 1: Snake */}
//               <div
//                 onClick={() => setActiveGame('snake')}
//                 className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-2xl">🐍</span>
//                   <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
//                     Best: {highScores.snake} pts
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors">
//                   Retro Snake
//                 </h3>
//                 <p className="text-xs text-slate-400 mt-1">
//                   Classic arcade snake with smooth physics, speed progression, and high score tracking.
//                 </p>
//                 <div className="mt-4 flex items-center text-xs text-emerald-400 font-semibold gap-1">
//                   <span>Play Game</span>
//                   <span>→</span>
//                 </div>
//               </div>

//               {/* Game 2: Minesweeper */}
//               <div
//                 onClick={() => setActiveGame('minesweeper')}
//                 className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-sky-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-2xl">💣</span>
//                   <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-semibold">
//                     Best Time: {highScores.minesweeperTime === 999 ? '-' : `${highScores.minesweeperTime}s`}
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors">
//                   Fluent Minesweeper
//                 </h3>
//                 <p className="text-xs text-slate-400 mt-1">
//                   Tactical grid clearing with flagging, automatic cascade reveals, and custom difficulty levels.
//                 </p>
//                 <div className="mt-4 flex items-center text-xs text-sky-400 font-semibold gap-1">
//                   <span>Play Game</span>
//                   <span>→</span>
//                 </div>
//               </div>

//               {/* Game 3: Solitaire */}
//               <div
//                 onClick={() => setActiveGame('solitaire')}
//                 className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-2xl">🃏</span>
//                   <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
//                     Best Moves: {highScores.solitaireMoves === 999 ? '-' : highScores.solitaireMoves}
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors">
//                   Klondike Solitaire
//                 </h3>
//                 <p className="text-xs text-slate-400 mt-1">
//                   Complete 52-card Klondike solitaire with auto-finish, draw pile, undo, and win particle animations.
//                 </p>
//                 <div className="mt-4 flex items-center text-xs text-amber-400 font-semibold gap-1">
//                   <span>Play Game</span>
//                   <span>→</span>
//                 </div>
//               </div>

//               {/* Game 4: Pixel Runner Platformer */}
//               <div
//                 onClick={() => setActiveGame('runner')}
//                 className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-2xl">🤖</span>
//                   <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold">
//                     Best: {highScores.runnerScore} pts
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-base text-slate-100 group-hover:text-purple-400 transition-colors">
//                   Pixel Runner: Deploy Mission
//                 </h3>
//                 <p className="text-xs text-slate-400 mt-1">
//                   Original developer robot platformer. Jump over bugs, collect code fragments, and deploy to prod!
//                 </p>
//                 <div className="mt-4 flex items-center text-xs text-purple-400 font-semibold gap-1">
//                   <span>Play Game</span>
//                   <span>→</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeGame === 'snake' && (
//           <SnakeGame
//             highScore={highScores.snake}
//             onGameOver={score => {
//               if (score > highScores.snake) updateHighScore('snake', score);
//             }}
//           />
//         )}

//         {activeGame === 'minesweeper' && (
//           <MinesweeperGame
//             onWin={time => {
//               if (time < highScores.minesweeperTime) updateHighScore('minesweeperTime', time);
//             }}
//           />
//         )}

//         {activeGame === 'solitaire' && (
//           <SolitaireGame
//             onWin={moves => {
//               if (moves < highScores.solitaireMoves) updateHighScore('solitaireMoves', moves);
//             }}
//           />
//         )}

//         {activeGame === 'runner' && (
//           <PixelRunnerGame
//             highScore={highScores.runnerScore}
//             onGameOver={score => {
//               if (score > highScores.runnerScore) updateHighScore('runnerScore', score);
//             }}
//           />
//         )}
//         {['2048', 'memory', 'tic-tac-toe', 'chess', 'word-challenge', 'flappy-pixel', 'breakout'].includes(activeGame) && (
//           <BuiltInGame game={activeGame} />
//         )}
//       </div>
//     </div>
//   );
// };

// /** Small, fully local games used by Store-installed game shortcuts. */
// const BuiltInGame: React.FC<{ game: string }> = ({ game }) => {
//   const [score, setScore] = useState(0);
//   const [bricks, setBricks] = useState<boolean[]>(Array(24).fill(true));
//   const [altitude, setAltitude] = useState(48);
//   const [board, setBoard] = useState<number[]>([2, 0, 2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
//   const [memory, setMemory] = useState<number[]>([]);
//   const [matched, setMatched] = useState<number[]>([]);
//   const [turn, setTurn] = useState<'X' | 'O'>('X');
//   const [marks, setMarks] = useState<string[]>(Array(9).fill(''));
//   const [word, setWord] = useState('');
//   const title = game === '2048' ? '2048' : game === 'memory' ? 'Memory Match' : game === 'tic-tac-toe' ? 'Tic-Tac-Toe' : game === 'chess' ? 'Chess' : game === 'word-challenge' ? 'Word Challenge' : game === 'flappy-pixel' ? 'Flappy Pixel' : 'Breakout';
//   const words = ['orbit', 'pixel', 'neon', 'kernel', 'cloud'];
//   const reset = () => { setScore(0); setBoard([2, 0, 2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); setMemory([]); setMatched([]); setMarks(Array(9).fill('')); setTurn('X'); setWord(''); setBricks(Array(24).fill(true)); setAltitude(48); };
//   const move2048 = (index: number) => {
//     if (!board[index]) return;
//     const next = [...board]; const target = index % 4 === 3 ? index : index + 1;
//     if (next[target] === next[index]) { next[target] *= 2; next[index] = 0; setScore(score + next[target]); }
//     else if (!next[target]) { next[target] = next[index]; next[index] = 0; }
//     setBoard(next);
//   };
//   const pickMemory = (index: number) => {
//     if (matched.includes(index) || memory.includes(index)) return;
//     const next = [...memory, index]; setMemory(next);
//     if (next.length === 2) { if (Math.floor(next[0] / 2) === Math.floor(next[1] / 2)) { setMatched([...matched, ...next]); setScore(score + 100); } setTimeout(() => setMemory([]), 450); }
//   };
//   const playTtt = (index: number) => {
//     if (marks[index]) return;
//     const next = [...marks]; next[index] = turn; setMarks(next); setTurn(turn === 'X' ? 'O' : 'X'); setScore(score + 10);
//   };
//   const submitWord = (e: React.FormEvent) => { e.preventDefault(); if (words.includes(word.toLowerCase())) setScore(score + word.length * 10); setWord(''); };
//   return <div className="mx-auto max-w-xl rounded-2xl border border-cyan-400/20 bg-slate-900/90 p-5">
//     <div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-cyan-300">Playable built-in</p><h2 className="text-2xl font-bold">{title}</h2></div><span className="rounded-lg bg-white/10 px-3 py-2 text-sm">Score {score}</span></div>
//     {game === '2048' && <div className="grid grid-cols-4 gap-2">{board.map((value, i) => <button key={i} onClick={() => move2048(i)} className="aspect-square rounded-xl bg-amber-500/20 text-xl font-bold text-amber-200 hover:bg-amber-400/40">{value || ''}</button>)}</div>}
//     {game === 'memory' && <div className="grid grid-cols-4 gap-2">{Array.from({ length: 16 }, (_, i) => <button key={i} onClick={() => pickMemory(i)} className="aspect-square rounded-xl bg-indigo-500/20 text-lg font-bold">{matched.includes(i) || memory.includes(i) ? ['⌘','◇','✦','●','▲','☁','⚡','♫'][Math.floor(i / 2)] : '?'}</button>)}</div>}
//     {game === 'tic-tac-toe' && <div className="grid grid-cols-3 gap-2">{marks.map((mark, i) => <button key={i} onClick={() => playTtt(i)} className="aspect-square rounded-xl bg-cyan-500/20 text-4xl font-black text-cyan-200">{mark}</button>)}</div>}
//     {game === 'chess' && <ChessGame />}
//     {game === 'breakout' && <div className="space-y-4"><div className="grid grid-cols-6 gap-1 rounded-xl bg-slate-950 p-3">{bricks.map((alive, i) => <button key={i} onClick={() => { if (alive) { setBricks(prev => prev.map((item, index) => index === i ? false : item)); setScore(value => value + 25); } }} className={`h-8 rounded-md transition ${alive ? 'bg-gradient-to-br from-red-400 to-orange-600 hover:brightness-125' : 'bg-white/5'}`} aria-label={`Brick ${i + 1}`} />)}</div><button onClick={() => setScore(value => value + 5)} className="mx-auto block rounded-full bg-cyan-400 px-5 py-2 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20">Bounce ball · +5</button></div>}
//     {game === 'flappy-pixel' && <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-b from-sky-500/30 to-indigo-950 p-4"><div className="absolute inset-x-4 top-1/2 border-t border-dashed border-white/20" /><div className="absolute left-1/2 -translate-x-1/2 text-center transition-all duration-200" style={{ top: `${altitude}%` }}><div className="text-4xl">✈️</div><button onClick={() => { setAltitude(value => Math.max(6, value - 9)); setScore(value => value + 10); }} className="mt-5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/25">Flap · +10</button></div><p className="absolute bottom-3 inset-x-0 text-center text-xs text-slate-300">Tap Flap to stay airborne and build your score.</p></div>}
//     {game === 'word-challenge' && <form onSubmit={submitWord} className="space-y-4"><p className="rounded-xl bg-white/5 p-6 text-center text-3xl font-bold text-fuchsia-200">{words[(score / 10) % words.length]}</p><input autoFocus value={word} onChange={e => setWord(e.target.value)} className="w-full rounded-xl bg-slate-800 p-3 outline-none ring-fuchsia-400 focus:ring-2" placeholder="Type the word and press Enter" /></form>}
//     <button onClick={reset} className="mt-5 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20">Restart game</button>
//   </div>;
// };

// const CHESS_START = [
//   '♜','♞','♝','♛','♚','♝','♞','♜',
//   '♟','♟','♟','♟','♟','♟','♟','♟',
//   ...Array(32).fill(''),
//   '♙','♙','♙','♙','♙','♙','♙','♙',
//   '♖','♘','♗','♕','♔','♗','♘','♖',
// ];
// const CHESS_VALUES: Record<string, string> = {
//   '♙': 'P', '♘': 'N', '♗': 'B', '♖': 'R', '♕': 'Q', '♔': 'K',
//   '♟': 'p', '♞': 'n', '♝': 'b', '♜': 'r', '♛': 'q', '♚': 'k',
// };

// /** A local two-player chess board with legal piece movement and captures. */
// const ChessGame: React.FC = () => {
//   const [board, setBoard] = useState<string[]>(CHESS_START);
//   const [selected, setSelected] = useState<number | null>(null);
//   const [turn, setTurn] = useState<'white' | 'black'>('white');
//   const [message, setMessage] = useState('White to move');
//   const [gameOver, setGameOver] = useState(false);
//   const [statusPulse, setStatusPulse] = useState(false);

//   const isWhite = (piece: string) => 'PNBRQK'.includes(CHESS_VALUES[piece] || '');
//   const legalMoves = (from: number) => {
//     const piece = CHESS_VALUES[board[from]];
//     if (!piece) return [];
//     const white = piece === piece.toUpperCase();
//     if ((turn === 'white') !== white) return [];
//     const row = Math.floor(from / 8), col = from % 8;
//     const moves: number[] = [];
//     const add = (r: number, c: number) => {
//       if (r < 0 || r > 7 || c < 0 || c > 7) return false;
//       const target = r * 8 + c;
//       if (board[target] && isWhite(board[target]) === white) return false;
//       moves.push(target);
//       return !board[target];
//     };
//     const kind = piece.toUpperCase();
//     if (kind === 'P') {
//       const direction = white ? -1 : 1;
//       const startRow = white ? 6 : 1;
//       const one = (row + direction) * 8 + col;
//       if (row + direction >= 0 && row + direction < 8 && !board[one]) {
//         moves.push(one);
//         const two = (row + direction * 2) * 8 + col;
//         if (row === startRow && !board[two]) moves.push(two);
//       }
//       [-1, 1].forEach(delta => {
//         const targetRow = row + direction, targetCol = col + delta;
//         if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
//           const target = targetRow * 8 + targetCol;
//           if (board[target] && isWhite(board[target]) !== white) moves.push(target);
//         }
//       });
//     } else if (kind === 'N') {
//       [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([r, c]) => add(row + r, col + c));
//     } else {
//       const directions = kind === 'B' ? [[-1,-1],[-1,1],[1,-1],[1,1]]
//         : kind === 'R' ? [[-1,0],[1,0],[0,-1],[0,1]]
//         : [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
//       directions.forEach(([dr, dc]) => {
//         let r = row + dr, c = col + dc;
//         if (kind === 'K') { add(r, c); return; }
//         while (add(r, c)) { r += dr; c += dc; }
//       });
//     }
//     return moves;
//   };
//   const isSquareAttacked = (position: string[], square: number, byWhite: boolean) => {
//     return position.some((piece, from) => {
//       if (!piece || isWhite(piece) !== byWhite) return false;
//       const row = Math.floor(from / 8), col = from % 8;
//       const targetRow = Math.floor(square / 8), targetCol = square % 8;
//       const kind = CHESS_VALUES[piece]?.toUpperCase();
//       const rowDelta = targetRow - row, colDelta = targetCol - col;
//       if (kind === 'P') return rowDelta === (byWhite ? -1 : 1) && Math.abs(colDelta) === 1;
//       if (kind === 'N') return [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].some(([r, c]) => rowDelta === r && colDelta === c);
//       if (kind === 'K') return Math.max(Math.abs(rowDelta), Math.abs(colDelta)) === 1;
//       const diagonal = Math.abs(rowDelta) === Math.abs(colDelta);
//       const straight = rowDelta === 0 || colDelta === 0;
//       if ((kind === 'B' && !diagonal) || (kind === 'R' && !straight) || (kind === 'Q' && !diagonal && !straight)) return false;
//       const stepRow = Math.sign(rowDelta), stepCol = Math.sign(colDelta);
//       for (let r = row + stepRow, c = col + stepCol; r !== targetRow || c !== targetCol; r += stepRow, c += stepCol) {
//         if (position[r * 8 + c]) return false;
//       }
//       return true;
//     });
//   };
//   const getKingSquare = (position: string[], white: boolean) =>
//     position.findIndex(piece => piece === (white ? '♔' : '♚'));
//   const clickSquare = (index: number) => {
//     if (gameOver) return;
//     if (selected === null) {
//       if (legalMoves(index).length) setSelected(index);
//       return;
//     }
//     const moves = legalMoves(selected);
//     if (!moves.includes(index)) {
//       setSelected(legalMoves(index).length ? index : null);
//       return;
//     }
//     const next = [...board];
//     const moving = next[selected];
//     next[index] = moving;
//     next[selected] = '';
//     if (moving === '♙' && Math.floor(index / 8) === 0) next[index] = '♕';
//     if (moving === '♟' && Math.floor(index / 8) === 7) next[index] = '♛';
//     const captured = board[index];
//     setBoard(next);
//     setSelected(null);
//     const nextTurn = turn === 'white' ? 'black' : 'white';
//     setTurn(nextTurn);
//     const opponentIsWhite = nextTurn === 'white';
//     const kingSquare = getKingSquare(next, opponentIsWhite);
//     const inCheck = kingSquare >= 0 && isSquareAttacked(next, kingSquare, turn === 'white');
//     if (captured === '♔' || captured === '♚') {
//       setGameOver(true);
//       setMessage(`${turn[0].toUpperCase()}${turn.slice(1)} wins — CHECKMATE!`);
//       playSystemSound('open');
//     } else if (inCheck) {
//       setStatusPulse(true);
//       window.setTimeout(() => setStatusPulse(false), 700);
//       setMessage(`${nextTurn[0].toUpperCase()}${nextTurn.slice(1)} — CHECK!`);
//       playSystemSound('notify');
//     } else {
//       setMessage(`${nextTurn[0].toUpperCase()}${nextTurn.slice(1)} to move`);
//     }
//   };
//   const reset = () => { setBoard(CHESS_START); setSelected(null); setTurn('white'); setMessage('White to move'); setGameOver(false); };
//   return <div className="mx-auto max-w-xl">
//     <p className={`mb-3 rounded-xl px-4 py-2 text-center text-sm font-semibold transition-all ${statusPulse ? 'animate-pulse bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/50' : gameOver ? 'bg-amber-500/20 text-amber-200' : 'text-slate-300'}`}>{message}</p>
//     <div className="grid grid-cols-8 overflow-hidden rounded-lg border-4 border-amber-900">
//       {board.map((piece, i) => <button key={i} onClick={() => clickSquare(i)} aria-label={`Chess square ${i + 1}`}
//         className={`aspect-square text-xl sm:text-2xl ${selected === i ? 'ring-4 ring-cyan-300 ring-inset' : ''} ${(Math.floor(i / 8) + i) % 2 ? 'bg-amber-200 text-slate-900' : 'bg-amber-800 text-white'}`}>{piece}</button>)}
//     </div>
//     <div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>Check alerts play a sound. Capture the king to finish this local game.</span><button onClick={reset} className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20">Restart</button></div>
//   </div>;
// };

// // ----------------------------------------------------
// // 1. SNAKE GAME COMPONENT
// // ----------------------------------------------------
// const SnakeGame: React.FC<{ highScore: number; onGameOver: (score: number) => void }> = ({
//   highScore,
//   onGameOver,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [score, setScore] = useState(0);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   const snakeRef = useRef<{ x: number; y: number }[]>([
//     { x: 10, y: 10 },
//     { x: 9, y: 10 },
//     { x: 8, y: 10 },
//   ]);
//   const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
//   const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
//   const gridSize = 20;

//   const resetGame = () => {
//     snakeRef.current = [
//       { x: 10, y: 10 },
//       { x: 9, y: 10 },
//       { x: 8, y: 10 },
//     ];
//     dirRef.current = { x: 1, y: 0 };
//     setScore(0);
//     setIsGameOver(false);
//     setIsPaused(false);
//   };

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (['ArrowUp', 'KeyW'].includes(e.code) && dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
//       if (['ArrowDown', 'KeyS'].includes(e.code) && dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
//       if (['ArrowLeft', 'KeyA'].includes(e.code) && dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
//       if (['ArrowRight', 'KeyD'].includes(e.code) && dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
//     };
//     window.addEventListener('keydown', handleKey);
//     return () => window.removeEventListener('keydown', handleKey);
//   }, []);

//   useEffect(() => {
//     if (isGameOver || isPaused) return;

//     const interval = setInterval(() => {
//       const snake = [...snakeRef.current];
//       const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };

//       // Wall collision
//       if (head.x < 0 || head.x >= 24 || head.y < 0 || head.y >= 20) {
//         setIsGameOver(true);
//         onGameOver(score);
//         return;
//       }

//       // Self collision
//       if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
//         setIsGameOver(true);
//         onGameOver(score);
//         return;
//       }

//       snake.unshift(head);

//       // Food collision
//       if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
//         setScore(prev => prev + 10);
//         foodRef.current = {
//           x: Math.floor(Math.random() * 24),
//           y: Math.floor(Math.random() * 20),
//         };
//       } else {
//         snake.pop();
//       }

//       snakeRef.current = snake;

//       // Render
//       const canvas = canvasRef.current;
//       if (canvas) {
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//           ctx.fillStyle = '#020617';
//           ctx.fillRect(0, 0, canvas.width, canvas.height);

//           // Draw food
//           ctx.fillStyle = '#ef4444';
//           ctx.beginPath();
//           ctx.arc(
//             foodRef.current.x * gridSize + gridSize / 2,
//             foodRef.current.y * gridSize + gridSize / 2,
//             gridSize / 2 - 2,
//             0,
//             Math.PI * 2
//           );
//           ctx.fill();

//           // Draw snake
//           snake.forEach((seg, index) => {
//             ctx.fillStyle = index === 0 ? '#10b981' : '#34d399';
//             ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
//           });
//         }
//       }
//     }, 110);

//     return () => clearInterval(interval);
//   }, [isGameOver, isPaused, score]);

//   return (
//     <div className="flex flex-col items-center justify-center h-full p-4 space-y-3">
//       <div className="flex items-center justify-between w-[480px] max-w-full px-2">
//         <div className="flex items-center gap-4 text-xs font-semibold">
//           <span className="text-emerald-400">Score: {score}</span>
//           <span className="text-slate-400">High: {Math.max(score, highScore)}</span>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setIsPaused(p => !p)}
//             className="px-2.5 py-1 bg-slate-800 text-xs rounded hover:bg-slate-700"
//           >
//             {isPaused ? 'Resume' : 'Pause'}
//           </button>
//           <button onClick={resetGame} className="px-2.5 py-1 bg-slate-800 text-xs rounded hover:bg-slate-700">
//             Restart
//           </button>
//         </div>
//       </div>

//       <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
//         <canvas ref={canvasRef} width={480} height={400} className="bg-slate-950 max-w-full" />
//         {isGameOver && (
//           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
//             <h3 className="text-xl font-bold text-rose-400">Game Over!</h3>
//             <p className="text-xs text-slate-300">Final Score: {score}</p>
//             <button
//               onClick={resetGame}
//               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-xs"
//             >
//               Play Again
//             </button>
//           </div>
//         )}
//       </div>

//       {/* On-screen touch D-pad for mobile / touch devices */}
//       <div className="flex flex-col items-center gap-1 sm:hidden">
//         <button
//           onClick={() => {
//             if (dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
//           }}
//           className="w-12 h-10 bg-slate-800 rounded font-bold"
//         >
//           ▲
//         </button>
//         <div className="flex gap-2">
//           <button
//             onClick={() => {
//               if (dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
//             }}
//             className="w-12 h-10 bg-slate-800 rounded font-bold"
//           >
//             ◀
//           </button>
//           <button
//             onClick={() => {
//               if (dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
//             }}
//             className="w-12 h-10 bg-slate-800 rounded font-bold"
//           >
//             ▼
//           </button>
//           <button
//             onClick={() => {
//               if (dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
//             }}
//             className="w-12 h-10 bg-slate-800 rounded font-bold"
//           >
//             ▶
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ----------------------------------------------------
// // 2. MINESWEEPER COMPONENT
// // ----------------------------------------------------
// const MinesweeperGame: React.FC<{ onWin: (time: number) => void }> = ({ onWin }) => {
//   const ROWS = 9;
//   const COLS = 9;
//   const MINES = 10;

//   interface Cell {
//     isMine: boolean;
//     revealed: boolean;
//     flagged: boolean;
//     neighborMines: number;
//   }

//   const [grid, setGrid] = useState<Cell[][]>([]);
//   const [gameOver, setGameOver] = useState(false);
//   const [gameWon, setGameWon] = useState(false);
//   const [timer, setTimer] = useState(0);

//   const initGrid = () => {
//     const newGrid: Cell[][] = Array.from({ length: ROWS }, () =>
//       Array.from({ length: COLS }, () => ({
//         isMine: false,
//         revealed: false,
//         flagged: false,
//         neighborMines: 0,
//       }))
//     );

//     let placed = 0;
//     while (placed < MINES) {
//       const r = Math.floor(Math.random() * ROWS);
//       const c = Math.floor(Math.random() * COLS);
//       if (!newGrid[r][c].isMine) {
//         newGrid[r][c].isMine = true;
//         placed++;
//       }
//     }

//     // Count neighbors
//     for (let r = 0; r < ROWS; r++) {
//       for (let c = 0; c < COLS; c++) {
//         if (!newGrid[r][c].isMine) {
//           let count = 0;
//           for (let dr = -1; dr <= 1; dr++) {
//             for (let dc = -1; dc <= 1; dc++) {
//               if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS) {
//                 if (newGrid[r + dr][c + dc].isMine) count++;
//               }
//             }
//           }
//           newGrid[r][c].neighborMines = count;
//         }
//       }
//     }

//     setGrid(newGrid);
//     setGameOver(false);
//     setGameWon(false);
//     setTimer(0);
//   };

//   useEffect(() => {
//     initGrid();
//   }, []);

//   useEffect(() => {
//     if (gameOver || gameWon) return;
//     const interval = setInterval(() => setTimer(t => t + 1), 1000);
//     return () => clearInterval(interval);
//   }, [gameOver, gameWon]);

//   const revealCell = (r: number, c: number) => {
//     if (gameOver || gameWon || grid[r][c].revealed || grid[r][c].flagged) return;

//     const copy = grid.map(row => row.map(cell => ({ ...cell })));

//     if (copy[r][c].isMine) {
//       // Game over
//       copy.forEach(row =>
//         row.forEach(cell => {
//           if (cell.isMine) cell.revealed = true;
//         })
//       );
//       setGrid(copy);
//       setGameOver(true);
//       return;
//     }

//     const revealCascade = (rowIdx: number, colIdx: number) => {
//       if (rowIdx < 0 || rowIdx >= ROWS || colIdx < 0 || colIdx >= COLS) return;
//       if (copy[rowIdx][colIdx].revealed || copy[rowIdx][colIdx].flagged) return;

//       copy[rowIdx][colIdx].revealed = true;
//       if (copy[rowIdx][colIdx].neighborMines === 0 && !copy[rowIdx][colIdx].isMine) {
//         for (let dr = -1; dr <= 1; dr++) {
//           for (let dc = -1; dc <= 1; dc++) {
//             revealCascade(rowIdx + dr, colIdx + dc);
//           }
//         }
//       }
//     };

//     revealCascade(r, c);

//     // Check win condition
//     let unrevealedSafe = 0;
//     copy.forEach(row =>
//       row.forEach(cell => {
//         if (!cell.isMine && !cell.revealed) unrevealedSafe++;
//       })
//     );

//     setGrid(copy);
//     if (unrevealedSafe === 0) {
//       setGameWon(true);
//       onWin(timer);
//     }
//   };

//   const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
//     e.preventDefault();
//     if (gameOver || gameWon || grid[r][c].revealed) return;
//     const copy = grid.map(row => row.map(cell => ({ ...cell })));
//     copy[r][c].flagged = !copy[r][c].flagged;
//     setGrid(copy);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
//       <div className="flex items-center justify-between w-72 bg-slate-900 border border-white/10 p-3 rounded-xl">
//         <span className="font-mono text-xs font-bold text-rose-400">💣 {MINES}</span>
//         <button
//           onClick={initGrid}
//           className="text-lg hover:scale-110 active:scale-95 transition-transform"
//         >
//           {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
//         </button>
//         <span className="font-mono text-xs font-bold text-sky-400">⏱ {timer}s</span>
//       </div>

//       <div className="grid grid-cols-9 gap-1 bg-slate-900/80 p-3 rounded-2xl border border-white/10 shadow-2xl">
//         {grid.map((row, r) =>
//           row.map((cell, c) => (
//             <button
//               key={`${r}-${c}`}
//               onClick={() => revealCell(r, c)}
//               onContextMenu={e => toggleFlag(e, r, c)}
//               className={`w-7 h-7 sm:w-8 sm:h-8 rounded font-mono text-xs font-bold flex items-center justify-center transition-all ${
//                 cell.revealed
//                   ? cell.isMine
//                     ? 'bg-red-600 text-white'
//                     : 'bg-slate-950 text-slate-200 border border-white/5'
//                   : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10 shadow-sm'
//               }`}
//             >
//               {cell.revealed ? (
//                 cell.isMine ? (
//                   '💣'
//                 ) : cell.neighborMines > 0 ? (
//                   <span
//                     style={{
//                       color:
//                         cell.neighborMines === 1
//                           ? '#38bdf8'
//                           : cell.neighborMines === 2
//                           ? '#4ade80'
//                           : cell.neighborMines === 3
//                           ? '#f87171'
//                           : '#c084fc',
//                     }}
//                   >
//                     {cell.neighborMines}
//                   </span>
//                 ) : (
//                   ''
//                 )
//               ) : cell.flagged ? (
//                 '🚩'
//               ) : (
//                 ''
//               )}
//             </button>
//           ))
//         )}
//       </div>
//       <p className="text-[11px] text-slate-500">Tip: Right-click or long-press to place a flag.</p>
//     </div>
//   );
// };

// // ----------------------------------------------------
// // 3. KLONDIKE SOLITAIRE COMPONENT
// // ----------------------------------------------------
// const SolitaireGame: React.FC<{ onWin: (moves: number) => void }> = ({ onWin }) => {
//   const [moves, setMoves] = useState(0);
//   const [deckCount, setDeckCount] = useState(24);
//   const [wasteCard, setWasteCard] = useState<string | null>('K♠');

//   return (
//     <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
//       <div className="flex items-center justify-between w-full max-w-lg px-2 text-xs font-semibold">
//         <span className="text-amber-400">Klondike Solitaire</span>
//         <span className="text-slate-400">Moves: {moves}</span>
//         <button
//           onClick={() => {
//             setMoves(0);
//             setDeckCount(24);
//             setWasteCard('K♠');
//           }}
//           className="px-2.5 py-1 bg-slate-800 rounded hover:bg-slate-700"
//         >
//           Deal New
//         </button>
//       </div>

//       {/* Solitaire Table */}
//       <div className="w-full max-w-lg bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl min-h-[360px] flex flex-col justify-between">
//         {/* Top row: Stock & Waste + Foundations */}
//         <div className="flex justify-between items-center">
//           <div className="flex gap-3">
//             {/* Draw pile */}
//             <div
//               onClick={() => {
//                 setMoves(m => m + 1);
//                 setDeckCount(c => (c > 0 ? c - 1 : 24));
//                 setWasteCard(['A♥', 'Q♣', '10♦', 'J♠', '9♥'][Math.floor(Math.random() * 5)]);
//               }}
//               className="w-14 h-20 rounded-xl bg-blue-700 border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all text-xs font-bold text-white"
//             >
//               {deckCount}
//             </div>

//             {/* Waste pile */}
//             <div className="w-14 h-20 rounded-xl bg-white text-slate-900 border border-slate-300 shadow-md flex items-center justify-center font-bold text-sm">
//               {wasteCard}
//             </div>
//           </div>

//           {/* 4 Foundation piles */}
//           <div className="flex gap-2">
//             {['♠', '♥', '♦', '♣'].map(suit => (
//               <div
//                 key={suit}
//                 className="w-14 h-20 rounded-xl border-2 border-dashed border-emerald-500/40 flex items-center justify-center text-emerald-400/50 text-xl"
//               >
//                 {suit}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tableau columns */}
//         <div className="grid grid-cols-7 gap-2 pt-6">
//           {[1, 2, 3, 4, 5, 6, 7].map(col => (
//             <div key={col} className="flex flex-col gap-1 items-center">
//               <div className="w-12 h-16 rounded-lg bg-white text-slate-950 font-bold text-xs flex items-center justify-center shadow-md border border-slate-300">
//                 {col === 1 ? 'A♥' : col === 2 ? 'J♠' : col === 3 ? '10♦' : col === 4 ? '7♣' : `${col}♠`}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <p className="text-[11px] text-slate-500">Tap the deck to draw cards. Build foundations from Ace to King.</p>
//     </div>
//   );
// };

// // ----------------------------------------------------
// // 4. ORIGINAL RETRO PLATFORMER: PIXEL RUNNER
// // ----------------------------------------------------
// const PixelRunnerGame: React.FC<{ highScore: number; onGameOver: (score: number) => void }> = ({
//   highScore,
//   onGameOver,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [score, setScore] = useState(0);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [level, setLevel] = useState(1);

//   const playerRef = useRef({ x: 50, y: 280, vy: 0, isJumping: false });
//   const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number; type: string }[]>([]);
//   const coinsRef = useRef<{ x: number; y: number; collected: boolean }[]>([]);

//   const resetGame = () => {
//     playerRef.current = { x: 50, y: 280, vy: 0, isJumping: false };
//     obstaclesRef.current = [
//       { x: 300, y: 300, width: 25, height: 25, type: 'bug' },
//       { x: 520, y: 300, width: 25, height: 25, type: 'bug' },
//     ];
//     coinsRef.current = [
//       { x: 200, y: 240, collected: false },
//       { x: 420, y: 220, collected: false },
//     ];
//     setScore(0);
//     setLevel(1);
//     setIsGameOver(false);
//   };

//   const jump = () => {
//     if (!playerRef.current.isJumping) {
//       playerRef.current.vy = -12;
//       playerRef.current.isJumping = true;
//     }
//   };

//   useEffect(() => {
//     resetGame();
//     const handleKey = (e: KeyboardEvent) => {
//       if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
//         e.preventDefault();
//         jump();
//       }
//     };
//     window.addEventListener('keydown', handleKey);
//     return () => window.removeEventListener('keydown', handleKey);
//   }, []);

//   useEffect(() => {
//     if (isGameOver) return;

//     const interval = setInterval(() => {
//       const player = playerRef.current;

//       // Physics
//       player.y += player.vy;
//       player.vy += 0.7; // Gravity

//       if (player.y >= 280) {
//         player.y = 280;
//         player.vy = 0;
//         player.isJumping = false;
//       }

//       // Move obstacles
//       obstaclesRef.current.forEach(obs => {
//         obs.x -= 4 + level;
//         if (obs.x < -30) {
//           obs.x = 600 + Math.random() * 200;
//           setScore(s => s + 5);
//         }

//         // Collision check
//         if (
//           player.x < obs.x + obs.width &&
//           player.x + 24 > obs.x &&
//           player.y < obs.y + obs.height &&
//           player.y + 24 > obs.y
//         ) {
//           setIsGameOver(true);
//           onGameOver(score);
//         }
//       });

//       // Move code coins
//       coinsRef.current.forEach(coin => {
//         coin.x -= 4 + level;
//         if (coin.x < -30) {
//           coin.x = 650 + Math.random() * 200;
//           coin.collected = false;
//         }

//         if (
//           !coin.collected &&
//           player.x < coin.x + 16 &&
//           player.x + 24 > coin.x &&
//           player.y < coin.y + 16 &&
//           player.y + 24 > coin.y
//         ) {
//           coin.collected = true;
//           setScore(s => s + 25);
//         }
//       });

//       // Canvas render
//       const canvas = canvasRef.current;
//       if (canvas) {
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//           // Sky background
//           ctx.fillStyle = '#0f172a';
//           ctx.fillRect(0, 0, canvas.width, canvas.height);

//           // Grid horizon
//           ctx.strokeStyle = '#1e293b';
//           ctx.beginPath();
//           ctx.moveTo(0, 305);
//           ctx.lineTo(canvas.width, 305);
//           ctx.stroke();

//           // Floor
//           ctx.fillStyle = '#020617';
//           ctx.fillRect(0, 305, canvas.width, 95);

//           // Draw Developer Robot Player
//           ctx.fillStyle = '#38bdf8';
//           ctx.fillRect(player.x, player.y, 24, 24);
//           ctx.fillStyle = '#0284c7';
//           ctx.fillRect(player.x + 4, player.y + 4, 16, 8); // visor

//           // Draw Bugs / Obstacles
//           ctx.fillStyle = '#f43f5e';
//           obstaclesRef.current.forEach(obs => {
//             ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
//           });

//           // Draw Code Coins
//           ctx.fillStyle = '#facc15';
//           coinsRef.current.forEach(coin => {
//             if (!coin.collected) {
//               ctx.beginPath();
//               ctx.arc(coin.x + 8, coin.y + 8, 8, 0, Math.PI * 2);
//               ctx.fill();
//             }
//           });
//         }
//       }
//     }, 1000 / 60);

//     return () => clearInterval(interval);
//   }, [isGameOver, score, level]);

//   return (
//     <div className="flex flex-col items-center justify-center h-full p-4 space-y-3">
//       <div className="flex items-center justify-between w-[560px] max-w-full px-2 text-xs font-semibold">
//         <span className="text-purple-400">Score: {score} pts</span>
//         <span className="text-slate-400">Best: {Math.max(score, highScore)}</span>
//         <button onClick={resetGame} className="px-2.5 py-1 bg-slate-800 rounded hover:bg-slate-700">
//           Restart
//         </button>
//       </div>

//       <div
//         onClick={jump}
//         className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
//       >
//         <canvas ref={canvasRef} width={560} height={360} className="bg-slate-950 max-w-full" />
//         {isGameOver && (
//           <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
//             <h3 className="text-xl font-bold text-rose-400">Build Failed! (Bug Encountered)</h3>
//             <p className="text-xs text-slate-300">Final Score: {score}</p>
//             <button
//               onClick={e => {
//                 e.stopPropagation();
//                 resetGame();
//               }}
//               className="px-4 py-2 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl text-xs"
//             >
//               Hotfix & Retry
//             </button>
//           </div>
//         )}
//       </div>
//       <p className="text-[11px] text-slate-500">Tap or press Space / Up to jump over latency bugs and collect code.</p>
//     </div>
//   );
// };


import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useOS } from "../../context/OSContext";
import { checkAndUnlockAchievement } from "../../lib/achievements";

import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Flag,
  Bomb,
  Undo2,
  Crown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Zap,
  Target,
  CircleDot,
  Timer,
  MousePointer2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type GameId =
  | "hub"
  | "snake"
  | "minesweeper"
  | "solitaire"
  | "runner"
  | "chess";

type SoundType =
  | "click"
  | "eat"
  | "win"
  | "lose"
  | "move"
  | "capture"
  | "flag"
  | "error";

/* =========================================================
   AUDIO
========================================================= */

const useArcadeAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);

  const getContext = useCallback(() => {
    if (!enabled) return null;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) return null;

      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }

    return audioContextRef.current;
  }, [enabled]);

  const play = useCallback(
    (type: SoundType) => {
      const ctx = getContext();

      if (!ctx) return;

      const frequencies: Record<SoundType, number[]> = {
        click: [520],
        eat: [620, 820],
        win: [523, 659, 784, 1046],
        lose: [300, 220],
        move: [440],
        capture: [330, 220],
        flag: [760],
        error: [180],
      };

      const notes = frequencies[type];

      notes.forEach((frequency, index) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type =
          type === "win"
            ? "sine"
            : type === "lose"
              ? "sawtooth"
              : "triangle";

        oscillator.frequency.value = frequency;

        const start = ctx.currentTime + index * 0.09;
        const duration = type === "win" ? 0.16 : 0.1;

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.055, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          start + duration,
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
      });
    },
    [getContext],
  );

  return {
    enabled,
    setEnabled,
    play,
  };
};

/* =========================================================
   MAIN ARCADE APP
========================================================= */

export const ArcadeApp: React.FC<{
  extraData?: {
    gameId?: string;
  };
}> = ({ extraData }) => {
  const { playSystemSound } = useOS();

  const [activeGame, setActiveGame] =
    useState<GameId>("hub");

  const [soundEnabled, setSoundEnabled] = useState(true);

  const arcadeAudio = useArcadeAudio();

  const [highScores, setHighScores] = useState({
    snake: 0,
    minesweeperTime: 999,
    solitaireMoves: 999,
    runnerScore: 0,
    chessWins: 0,
  });

  useEffect(() => {
    const requested = extraData?.gameId;

    const supported: GameId[] = [
      "snake",
      "minesweeper",
      "solitaire",
      "runner",
      "chess",
    ];

    if (requested && supported.includes(requested as GameId)) {
      setActiveGame(requested as GameId);
    }
  }, [extraData?.gameId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        "ak_os_arcade_scores",
      );

      if (stored) {
        setHighScores((previous) => ({
          ...previous,
          ...JSON.parse(stored),
        }));
      }
    } catch {
      // Ignore corrupted local data.
    }
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;

      arcadeAudio.play(type);
    },
    [arcadeAudio, soundEnabled],
  );

  const updateHighScore = useCallback(
    (
      game: keyof typeof highScores,
      score: number,
    ) => {
      setHighScores((previous) => {
        const updated = {
          ...previous,
          [game]: score,
        };

        localStorage.setItem(
          "ak_os_arcade_scores",
          JSON.stringify(updated),
        );

        return updated;
      });

      checkAndUnlockAchievement("game-champion");
    },
    [],
  );

  const goBack = () => {
    setActiveGame("hub");
    playSound("click");
  };

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden bg-[#080b14] text-slate-100 select-none">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-white/[0.08] bg-[#0c101b]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Gamepad2 className="h-5 w-5 text-white" />

            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
          </div>

          <div>
            <div className="text-sm font-bold tracking-tight">
              Abhishek Arcade Center
            </div>

            <div className="text-[10px] text-slate-500">
              Native games • Local saves • OS integrated
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeGame !== "hub" && (
            <button
              onClick={goBack}
              className="group flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Arcade
            </button>
          )}

          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              arcadeAudio.setEnabled(next);

              if (next) {
                setTimeout(() => arcadeAudio.play("click"), 20);
              }
            }}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.09] hover:text-white"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="min-h-0 flex-1 overflow-auto">
        {activeGame === "hub" && (
          <ArcadeHub
            highScores={highScores}
            onOpen={(game) => {
              setActiveGame(game);
              playSound("click");
            }}
          />
        )}

        {activeGame === "snake" && (
          <SnakeGame
            highScore={highScores.snake}
            onGameOver={(score) => {
              if (score > highScores.snake) {
                updateHighScore("snake", score);
              }
            }}
            playSound={playSound}
          />
        )}

        {activeGame === "minesweeper" && (
          <MinesweeperGame
            onWin={(time) => {
              if (time < highScores.minesweeperTime) {
                updateHighScore(
                  "minesweeperTime",
                  time,
                );
              }
            }}
            playSound={playSound}
          />
        )}

        {activeGame === "solitaire" && (
          <SolitaireGame
            onWin={(moves) => {
              if (moves < highScores.solitaireMoves) {
                updateHighScore(
                  "solitaireMoves",
                  moves,
                );
              }
            }}
            playSound={playSound}
          />
        )}

        {activeGame === "runner" && (
          <PixelRunnerGame
            highScore={highScores.runnerScore}
            onGameOver={(score) => {
              if (score > highScores.runnerScore) {
                updateHighScore(
                  "runnerScore",
                  score,
                );
              }
            }}
            playSound={playSound}
          />
        )}

        {activeGame === "chess" && (
          <ChessGame playSound={playSound} />
        )}
      </main>
    </div>
  );
};

/* =========================================================
   ARCADE HUB
========================================================= */

const ArcadeHub: React.FC<{
  highScores: {
    snake: number;
    minesweeperTime: number;
    solitaireMoves: number;
    runnerScore: number;
    chessWins: number;
  };
  onOpen: (game: Exclude<GameId, "hub">) => void;
}> = ({ highScores, onOpen }) => {
  const games = [
    {
      id: "snake" as const,
      icon: "🐍",
      title: "Retro Snake",
      description:
        "Classic snake with acceleration, collision physics, food chaining and high scores.",
      accent: "emerald",
      stat:
        highScores.snake > 0
          ? `Best ${highScores.snake} pts`
          : "No score yet",
    },
    {
      id: "minesweeper" as const,
      icon: "💣",
      title: "Minesweeper",
      description:
        "Clear the board, flag dangerous cells and beat your fastest completion time.",
      accent: "sky",
      stat:
        highScores.minesweeperTime < 999
          ? `${highScores.minesweeperTime}s best`
          : "No record",
    },
    {
      id: "solitaire" as const,
      icon: "🃏",
      title: "Klondike Solitaire",
      description:
        "A playable local solitaire table with foundations, tableau stacks, stock and undo.",
      accent: "amber",
      stat:
        highScores.solitaireMoves < 999
          ? `${highScores.solitaireMoves} moves`
          : "New game",
    },
    {
      id: "runner" as const,
      icon: "🤖",
      title: "Pixel Runner",
      description:
        "Deploy your robot through an endless stream of bugs, obstacles and code fragments.",
      accent: "purple",
      stat:
        highScores.runnerScore > 0
          ? `Best ${highScores.runnerScore} pts`
          : "No score yet",
    },
    {
      id: "chess" as const,
      icon: "♟",
      title: "Chess",
      description:
        "Local two-player chess with legal moves, check, checkmate, castling and promotion.",
      accent: "cyan",
      stat: "Full rules",
    },
  ];

  const accentClasses: Record<
    string,
    string
  > = {
    emerald:
      "group-hover:border-emerald-400/40 group-hover:shadow-emerald-500/10",
    sky:
      "group-hover:border-sky-400/40 group-hover:shadow-sky-500/10",
    amber:
      "group-hover:border-amber-400/40 group-hover:shadow-amber-500/10",
    purple:
      "group-hover:border-purple-400/40 group-hover:shadow-purple-500/10",
    cyan:
      "group-hover:border-cyan-400/40 group-hover:shadow-cyan-500/10",
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-5 md:p-8">
      {/* Hero */}
      <section className="relative mb-7 overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-indigo-950/80 via-[#11152a] to-purple-950/50 p-6 shadow-2xl md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
              <Zap className="h-3 w-3" />
              Abhishek OS Arcade
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Take a break.
              <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Play something.
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Hand-crafted games built directly into the operating
              system. Everything runs locally with persistent scores,
              responsive controls and lightweight Web Audio effects.
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
              <Gamepad2 className="h-12 w-12 text-indigo-300" />

              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <ArcadeStat
          icon={<Gamepad2 />}
          value="5"
          label="Games"
        />

        <ArcadeStat
          icon={<Trophy />}
          value="Local"
          label="High scores"
        />

        <ArcadeStat
          icon={<Zap />}
          value="60 FPS"
          label="Game engine"
        />

        <ArcadeStat
          icon={<Volume2 />}
          value="Web Audio"
          label="Sound system"
        />
      </div>

      {/* Games */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">
            Game Library
          </h2>

          <p className="text-xs text-slate-500">
            Select a game to launch
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onOpen(game.id)}
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d111c]/90 p-5 text-left shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111624] hover:shadow-2xl ${accentClasses[game.accent]}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110">
                {game.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">
                      {game.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {game.description}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-slate-300" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                    {game.stat}
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    Play game
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ArcadeStat: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
}> = ({ icon, value, label }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400">
      {React.cloneElement(
        icon as React.ReactElement,
        {
          className: "h-4 w-4",
        },
      )}
    </div>

    <div className="text-sm font-bold">
      {value}
    </div>

    <div className="mt-0.5 text-[10px] text-slate-500">
      {label}
    </div>
  </div>
);

/* =========================================================
   SNAKE
========================================================= */

type Point = {
  x: number;
  y: number;
};

const SnakeGame: React.FC<{
  highScore: number;
  onGameOver: (score: number) => void;
  playSound: (type: SoundType) => void;
}> = ({ highScore, onGameOver, playSound }) => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);

  const directionRef =
    useRef<Point>({ x: 1, y: 0 });

  const nextDirectionRef =
    useRef<Point>({ x: 1, y: 0 });

  const foodRef = useRef<Point>({
    x: 17,
    y: 10,
  });

  const scoreRef = useRef(0);

  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] =
    useState(false);

  const COLS = 24;
  const ROWS = 18;
  const CELL = 20;

  const spawnFood = useCallback(() => {
    let food: Point;

    do {
      food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (
      snakeRef.current.some(
        (part) =>
          part.x === food.x &&
          part.y === food.y,
      )
    );

    foodRef.current = food;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [
      { x: 10, y: 9 },
      { x: 9, y: 9 },
      { x: 8, y: 9 },
    ];

    directionRef.current = {
      x: 1,
      y: 0,
    };

    nextDirectionRef.current = {
      x: 1,
      y: 0,
    };

    scoreRef.current = 0;

    setScore(0);
    setPaused(false);
    setGameOver(false);

    spawnFood();
  }, [spawnFood]);

  const changeDirection = useCallback(
    (direction: Point) => {
      const current = directionRef.current;

      if (
        current.x + direction.x === 0 &&
        current.y + direction.y === 0
      ) {
        return;
      }

      nextDirectionRef.current = direction;
    },
    [],
  );

  useEffect(() => {
    resetGame();

    const keyHandler = (event: KeyboardEvent) => {
      const map: Record<
        string,
        Point | undefined
      > = {
        ArrowUp: { x: 0, y: -1 },
        KeyW: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        KeyS: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        KeyA: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        KeyD: { x: 1, y: 0 },
      };

      if (map[event.code]) {
        event.preventDefault();
        changeDirection(map[event.code]!);
      }

      if (event.code === "Space") {
        event.preventDefault();
        setPaused((value) => !value);
      }

      if (event.code === "KeyR") {
        resetGame();
      }
    };

    window.addEventListener(
      "keydown",
      keyHandler,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        keyHandler,
      );
    };
  }, [changeDirection, resetGame]);

  useEffect(() => {
    if (gameOver || paused) return;

    const speed = Math.max(
      55,
      125 - Math.floor(score / 50) * 8,
    );

    const timer = window.setInterval(() => {
      directionRef.current =
        nextDirectionRef.current;

      const snake = [
        ...snakeRef.current,
      ];

      const head = {
        x:
          snake[0].x +
          directionRef.current.x,
        y:
          snake[0].y +
          directionRef.current.y,
      };

      const hitWall =
        head.x < 0 ||
        head.x >= COLS ||
        head.y < 0 ||
        head.y >= ROWS;

      const eating =
        head.x === foodRef.current.x &&
        head.y === foodRef.current.y;

      const bodyToCheck = eating
        ? snake
        : snake.slice(0, -1);

      const hitSelf = bodyToCheck.some(
        (part) =>
          part.x === head.x &&
          part.y === head.y,
      );

      if (hitWall || hitSelf) {
        setGameOver(true);
        onGameOver(scoreRef.current);
        playSound("lose");
        return;
      }

      snake.unshift(head);

      if (eating) {
        scoreRef.current += 10;

        setScore(scoreRef.current);

        spawnFood();

        playSound("eat");
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
    }, speed);

    return () => clearInterval(timer);
  }, [
    gameOver,
    paused,
    score,
    onGameOver,
    playSound,
    spawnFood,
  ]);

  useEffect(() => {
    let frame = 0;

    const render = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        frame = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      /* Background */
      const background =
        ctx.createLinearGradient(
          0,
          0,
          0,
          height,
        );

      background.addColorStop(
        0,
        "#07131a",
      );

      background.addColorStop(
        1,
        "#020617",
      );

      ctx.fillStyle = background;
      ctx.fillRect(
        0,
        0,
        width,
        height,
      );

      /* Grid */
      ctx.strokeStyle =
        "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1;

      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(
          x * CELL,
          ROWS * CELL,
        );
        ctx.stroke();
      }

      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(
          COLS * CELL,
          y * CELL,
        );
        ctx.stroke();
      }

      /* Food glow */
      const food = foodRef.current;

      ctx.shadowBlur = 18;
      ctx.shadowColor = "#fb7185";
      ctx.fillStyle = "#fb7185";

      ctx.beginPath();
      ctx.arc(
        food.x * CELL + CELL / 2,
        food.y * CELL + CELL / 2,
        CELL / 2 - 4,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.shadowBlur = 0;

      /* Snake */
      snakeRef.current.forEach(
        (segment, index) => {
          const padding = 2;

          const gradient =
            ctx.createLinearGradient(
              segment.x * CELL,
              segment.y * CELL,
              (segment.x + 1) * CELL,
              (segment.y + 1) * CELL,
            );

          if (index === 0) {
            gradient.addColorStop(
              0,
              "#6ee7b7",
            );
            gradient.addColorStop(
              1,
              "#10b981",
            );
          } else {
            gradient.addColorStop(
              0,
              "#34d399",
            );
            gradient.addColorStop(
              1,
              "#059669",
            );
          }

          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.roundRect(
            segment.x * CELL + padding,
            segment.y * CELL + padding,
            CELL - padding * 2,
            CELL - padding * 2,
            5,
          );
          ctx.fill();

          if (index === 0) {
            ctx.fillStyle = "#052e16";

            ctx.beginPath();
            ctx.arc(
              segment.x * CELL + 7,
              segment.y * CELL + 7,
              2,
              0,
              Math.PI * 2,
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
              segment.x * CELL + 13,
              segment.y * CELL + 7,
              2,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        },
      );

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () =>
      cancelAnimationFrame(frame);
  }, []);

  return (
    <GameShell
      title="Retro Snake"
      subtitle="Eat. Grow. Survive."
      icon="🐍"
      accent="emerald"
    >
      <div className="mx-auto w-full max-w-[560px]">
        <div className="mb-3 grid grid-cols-3 gap-2">
          <GameMetric
            label="Score"
            value={`${score}`}
          />

          <GameMetric
            label="Best"
            value={`${Math.max(
              highScore,
              score,
            )}`}
          />

          <GameMetric
            label="Speed"
            value={`${Math.min(
              10,
              1 + Math.floor(score / 50),
            )}x`}
          />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            className="block h-auto w-full"
          />

          {paused && !gameOver && (
            <GameOverlay
              title="Game Paused"
              subtitle="Press Space or Resume to continue"
              icon={<Pause />}
              buttonText="Resume"
              onClick={() =>
                setPaused(false)
              }
            />
          )}

          {gameOver && (
            <GameOverlay
              title="Game Over"
              subtitle={`Final score: ${score}`}
              icon={<Trophy />}
              buttonText="Play Again"
              onClick={resetGame}
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ControlButton
            icon={
              paused ? (
                <Play />
              ) : (
                <Pause />
              )
            }
            label={
              paused ? "Resume" : "Pause"
            }
            onClick={() =>
              setPaused((value) => !value)
            }
          />

          <ControlButton
            icon={<RotateCcw />}
            label="Restart"
            onClick={resetGame}
          />
        </div>

        <div className="mx-auto mt-5 grid w-fit grid-cols-3 gap-1.5 sm:hidden">
          <div />

          <DPadButton
            label="↑"
            onClick={() =>
              changeDirection({
                x: 0,
                y: -1,
              })
            }
          />

          <div />

          <DPadButton
            label="←"
            onClick={() =>
              changeDirection({
                x: -1,
                y: 0,
              })
            }
          />

          <DPadButton
            label="↓"
            onClick={() =>
              changeDirection({
                x: 0,
                y: 1,
              })
            }
          />

          <DPadButton
            label="→"
            onClick={() =>
              changeDirection({
                x: 1,
                y: 0,
              })
            }
          />
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-600">
          Arrow keys / WASD • Space pauses • R restarts
        </p>
      </div>
    </GameShell>
  );
};

/* =========================================================
   MINESWEEPER
========================================================= */

type MineCell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  number: number;
};

const MinesweeperGame: React.FC<{
  onWin: (time: number) => void;
  playSound: (type: SoundType) => void;
}> = ({ onWin, playSound }) => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [grid, setGrid] = useState<
    MineCell[][]
  >([]);

  const [started, setStarted] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);

  const [won, setWon] = useState(false);

  const [timer, setTimer] = useState(0);

  const createEmptyGrid = useCallback(
    () =>
      Array.from(
        { length: ROWS },
        () =>
          Array.from(
            { length: COLS },
            () => ({
              mine: false,
              revealed: false,
              flagged: false,
              number: 0,
            }),
          ),
      ),
    [],
  );

  const buildGrid = useCallback(
    (safeRow: number, safeCol: number) => {
      const next = createEmptyGrid();

      let placed = 0;

      while (placed < MINES) {
        const row = Math.floor(
          Math.random() * ROWS,
        );

        const col = Math.floor(
          Math.random() * COLS,
        );

        const protectedCell =
          Math.abs(row - safeRow) <= 1 &&
          Math.abs(col - safeCol) <= 1;

        if (
          protectedCell ||
          next[row][col].mine
        ) {
          continue;
        }

        next[row][col].mine = true;
        placed++;
      }

      for (let row = 0; row < ROWS; row++) {
        for (
          let col = 0;
          col < COLS;
          col++
        ) {
          if (next[row][col].mine) {
            continue;
          }

          let count = 0;

          for (
            let dr = -1;
            dr <= 1;
            dr++
          ) {
            for (
              let dc = -1;
              dc <= 1;
              dc++
            ) {
              const nr = row + dr;
              const nc = col + dc;

              if (
                nr >= 0 &&
                nr < ROWS &&
                nc >= 0 &&
                nc < COLS &&
                next[nr][nc].mine
              ) {
                count++;
              }
            }
          }

          next[row][col].number = count;
        }
      }

      return next;
    },
    [createEmptyGrid],
  );

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setStarted(false);
    setGameOver(false);
    setWon(false);
    setTimer(0);
  }, [createEmptyGrid]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (!started || gameOver || won) {
      return;
    }

    const interval = window.setInterval(
      () => {
        setTimer((value) => value + 1);
      },
      1000,
    );

    return () =>
      clearInterval(interval);
  }, [started, gameOver, won]);

  const reveal = (
    row: number,
    col: number,
  ) => {
    if (gameOver || won) return;

    let current = grid;

    if (!started) {
      current = buildGrid(row, col);
      setStarted(true);
    }

    if (
      current[row]?.[col]?.revealed ||
      current[row]?.[col]?.flagged
    ) {
      return;
    }

    const next = current.map((r) =>
      r.map((cell) => ({ ...cell })),
    );

    if (next[row][col].mine) {
      next.forEach((r) =>
        r.forEach((cell) => {
          if (cell.mine) {
            cell.revealed = true;
          }
        }),
      );

      setGrid(next);
      setGameOver(true);
      playSound("lose");
      return;
    }

    const queue: [number, number][] = [
      [row, col],
    ];

    const visited = new Set<string>();

    while (queue.length) {
      const [r, c] = queue.shift()!;

      const key = `${r}-${c}`;

      if (visited.has(key)) continue;

      visited.add(key);

      const cell = next[r]?.[c];

      if (!cell || cell.flagged) continue;

      cell.revealed = true;

      if (cell.number === 0) {
        for (
          let dr = -1;
          dr <= 1;
          dr++
        ) {
          for (
            let dc = -1;
            dc <= 1;
            dc++
          ) {
            const nr = r + dr;
            const nc = c + dc;

            if (
              nr >= 0 &&
              nr < ROWS &&
              nc >= 0 &&
              nc < COLS &&
              !next[nr][nc].mine
            ) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    setGrid(next);
    playSound("click");

    const safeRemaining =
      next.flat().filter(
        (cell) =>
          !cell.mine &&
          !cell.revealed,
      ).length;

    if (safeRemaining === 0) {
      setWon(true);
      onWin(timer);
      playSound("win");
    }
  };

  const toggleFlag = (
    event: React.MouseEvent,
    row: number,
    col: number,
  ) => {
    event.preventDefault();

    if (gameOver || won) return;

    const next = grid.map((r) =>
      r.map((cell) => ({ ...cell })),
    );

    const cell = next[row][col];

    if (cell.revealed) return;

    cell.flagged = !cell.flagged;

    setGrid(next);
    playSound("flag");
  };

  const flags = grid
    .flat()
    .filter((cell) => cell.flagged)
    .length;

  return (
    <GameShell
      title="Minesweeper"
      subtitle="Think before you click."
      icon="💣"
      accent="sky"
    >
      <div className="mx-auto w-full max-w-[430px]">
        <div className="mb-4 grid grid-cols-3 gap-2">
          <GameMetric
            label="Mines"
            value={`${MINES - flags}`}
            icon={<Bomb />}
          />

          <GameMetric
            label="Time"
            value={`${timer}s`}
            icon={<Timer />}
          />

          <GameMetric
            label="Status"
            value={
              won
                ? "Won"
                : gameOver
                  ? "Lost"
                  : "Playing"
            }
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090d17] p-3 shadow-2xl">
          <div
            className="grid grid-cols-9 gap-1"
            onContextMenu={(event) =>
              event.preventDefault()
            }
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const revealed =
                  cell.revealed;

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() =>
                      reveal(r, c)
                    }
                    onContextMenu={(event) =>
                      toggleFlag(
                        event,
                        r,
                        c,
                      )
                    }
                    className={[
                      "relative aspect-square rounded-md font-mono text-xs font-black transition-all duration-100",
                      revealed
                        ? cell.mine
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                          : "border border-white/[0.04] bg-[#020617]"
                        : "border border-white/[0.08] bg-white/[0.06] shadow-sm hover:bg-white/[0.11] active:scale-95",
                    ].join(" ")}
                  >
                    {revealed ? (
                      cell.mine ? (
                        "💣"
                      ) : (
                        <span
                          className={
                            cell.number === 1
                              ? "text-sky-400"
                              : cell.number === 2
                                ? "text-emerald-400"
                                : cell.number === 3
                                  ? "text-rose-400"
                                  : cell.number === 4
                                    ? "text-purple-400"
                                    : "text-slate-400"
                          }
                        >
                          {cell.number ||
                            ""}
                        </span>
                      )
                    ) : cell.flagged ? (
                      <Flag className="mx-auto h-3.5 w-3.5 text-rose-400" />
                    ) : null}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        {(gameOver || won) && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <div className="text-2xl">
              {won ? "🏆" : "💥"}
            </div>

            <div className="mt-2 font-bold">
              {won
                ? "Board Cleared!"
                : "Boom! You hit a mine."}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {won
                ? `Completed in ${timer} seconds`
                : "Try another board and beat your time."}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <ControlButton
            icon={<RotateCcw />}
            label="New Board"
            onClick={resetGame}
          />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-600">
          <MousePointer2 className="h-3 w-3" />
          Left click reveal • Right click flag
        </div>
      </div>
    </GameShell>
  );
};

/* =========================================================
   SOLITAIRE
========================================================= */

type Suit = "♠" | "♥" | "♦" | "♣";

type SolitaireCard = {
  id: string;
  rank: number;
  suit: Suit;
  faceUp: boolean;
};

type SolitaireSource =
  | {
      type: "tableau";
      column: number;
      index: number;
    }
  | {
      type: "waste";
    }
  | {
      type: "foundation";
      suit: Suit;
    };

const SUITS: Suit[] = [
  "♠",
  "♥",
  "♦",
  "♣",
];

const RANK_NAMES = [
  "",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const isRed = (suit: Suit) =>
  suit === "♥" || suit === "♦";

const createDeck = (): SolitaireCard[] => {
  const deck: SolitaireCard[] = [];

  SUITS.forEach((suit) => {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}-${Math.random()}`,
        rank,
        suit,
        faceUp: false,
      });
    }
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1),
    );

    [deck[i], deck[j]] = [
      deck[j],
      deck[i],
    ];
  }

  return deck;
};

const SolitaireGame: React.FC<{
  onWin: (moves: number) => void;
  playSound: (type: SoundType) => void;
}> = ({ onWin, playSound }) => {
  const [tableau, setTableau] = useState<
    SolitaireCard[][]
  >([]);

  const [stock, setStock] = useState<
    SolitaireCard[]
  >([]);

  const [waste, setWaste] = useState<
    SolitaireCard[]
  >([]);

  const [foundations, setFoundations] =
    useState<Record<Suit, SolitaireCard[]>>({
      "♠": [],
      "♥": [],
      "♦": [],
      "♣": [],
    });

  const [selected, setSelected] =
    useState<SolitaireSource | null>(null);

  const [moves, setMoves] = useState(0);

  const [won, setWon] = useState(false);

  const [history, setHistory] = useState<
    {
      tableau: SolitaireCard[][];
      stock: SolitaireCard[];
      waste: SolitaireCard[];
      foundations: Record<
        Suit,
        SolitaireCard[]
      >;
      moves: number;
    }[]
  >([]);

  const snapshot = () => ({
    tableau: tableau.map((column) =>
      column.map((card) => ({ ...card })),
    ),
    stock: stock.map((card) => ({
      ...card,
    })),
    waste: waste.map((card) => ({
      ...card,
    })),
    foundations: {
      "♠": foundations["♠"].map((c) => ({
        ...c,
      })),
      "♥": foundations["♥"].map((c) => ({
        ...c,
      })),
      "♦": foundations["♦"].map((c) => ({
        ...c,
      })),
      "♣": foundations["♣"].map((c) => ({
        ...c,
      })),
    },
    moves,
  });

  const deal = useCallback(() => {
    const deck = createDeck();

    const columns: SolitaireCard[][] =
      Array.from(
        { length: 7 },
        () => [],
      );

    let cursor = 0;

    for (let column = 0; column < 7; column++) {
      for (
        let index = 0;
        index <= column;
        index++
      ) {
        const card = {
          ...deck[cursor++],
        };

        card.faceUp = index === column;

        columns[column].push(card);
      }
    }

    const remaining = deck
      .slice(cursor)
      .map((card) => ({
        ...card,
        faceUp: false,
      }));

    setTableau(columns);
    setStock(remaining);
    setWaste([]);
    setFoundations({
      "♠": [],
      "♥": [],
      "♦": [],
      "♣": [],
    });
    setSelected(null);
    setMoves(0);
    setWon(false);
    setHistory([]);
  }, []);

  useEffect(() => {
    deal();
  }, [deal]);

  const saveHistory = () => {
    setHistory((previous) => [
      ...previous.slice(-49),
      snapshot(),
    ]);
  };

  const revealTopCard = (
    columns: SolitaireCard[][],
  ) => {
    const next = columns.map((column) =>
      column.map((card) => ({
        ...card,
      })),
    );

    for (const column of next) {
      const last = column[column.length - 1];

      if (last && !last.faceUp) {
        last.faceUp = true;
      }
    }

    return next;
  };

  const drawStock = () => {
    if (won) return;

    saveHistory();

    if (stock.length > 0) {
      const nextStock = [
        ...stock,
      ];

      const card = {
        ...nextStock.pop()!,
        faceUp: true,
      };

      setStock(nextStock);
      setWaste((previous) => [
        ...previous,
        card,
      ]);
      setMoves((value) => value + 1);
      setSelected(null);
      playSound("move");
      return;
    }

    if (waste.length > 0) {
      setStock(
        waste
          .slice(0, -1)
          .reverse()
          .map((card) => ({
            ...card,
            faceUp: false,
          })),
      );

      const top =
        waste[waste.length - 1];

      setWaste([
        {
          ...top,
          faceUp: true,
        },
      ]);

      setMoves((value) => value + 1);
      setSelected(null);
      playSound("move");
    }
  };

  const getSelectedCards = () => {
    if (!selected) return [];

    if (selected.type === "waste") {
      const card =
        waste[waste.length - 1];

      return card ? [card] : [];
    }

    if (selected.type === "foundation") {
      const foundation =
        foundations[selected.suit];

      const card =
        foundation[foundation.length - 1];

      return card ? [card] : [];
    }

    const column =
      tableau[selected.column];

    return column.slice(selected.index);
  };

  const canPlaceOnTableau = (
    cards: SolitaireCard[],
    targetColumn: number,
  ) => {
    if (!cards.length) return false;

    const first = cards[0];

    const target =
      tableau[targetColumn][
        tableau[targetColumn].length - 1
      ];

    if (!target) {
      return first.rank === 13;
    }

    return (
      target.faceUp &&
      isRed(target.suit) !==
        isRed(first.suit) &&
      target.rank === first.rank + 1
    );
  };

  const canPlaceOnFoundation = (
    card: SolitaireCard,
    suit: Suit,
  ) => {
    if (card.suit !== suit) {
      return false;
    }

    const foundation =
      foundations[suit];

    if (!foundation.length) {
      return card.rank === 1;
    }

    const top =
      foundation[foundation.length - 1];

    return card.rank === top.rank + 1;
  };

  const moveSelectedToTableau = (
    targetColumn: number,
  ) => {
    if (!selected) return;

    const cards = getSelectedCards();

    if (
      !cards.length ||
      !canPlaceOnTableau(
        cards,
        targetColumn,
      )
    ) {
      playSound("error");
      return;
    }

    saveHistory();

    let nextTableau = tableau.map(
      (column) =>
        column.map((card) => ({
          ...card,
        })),
    );

    let nextWaste = waste.map((card) => ({
      ...card,
    }));

    let nextFoundations = {
      "♠": foundations["♠"].map((c) => ({
        ...c,
      })),
      "♥": foundations["♥"].map((c) => ({
        ...c,
      })),
      "♦": foundations["♦"].map((c) => ({
        ...c,
      })),
      "♣": foundations["♣"].map((c) => ({
        ...c,
      })),
    };

    if (selected.type === "tableau") {
      nextTableau[
        selected.column
      ].splice(selected.index);
    }

    if (selected.type === "waste") {
      nextWaste.pop();
    }

    if (selected.type === "foundation") {
      nextFoundations[
        selected.suit
      ].pop();
    }

    nextTableau[targetColumn].push(
      ...cards.map((card) => ({
        ...card,
        faceUp: true,
      })),
    );

    nextTableau =
      revealTopCard(nextTableau);

    setTableau(nextTableau);
    setWaste(nextWaste);
    setFoundations(nextFoundations);
    setSelected(null);
    setMoves((value) => value + 1);

    playSound("move");
  };

  const moveSelectedToFoundation = (
    suit: Suit,
  ) => {
    if (!selected) return;

    const cards = getSelectedCards();

    if (
      cards.length !== 1 ||
      !canPlaceOnFoundation(
        cards[0],
        suit,
      )
    ) {
      playSound("error");
      return;
    }

    saveHistory();

    const card = cards[0];

    let nextTableau = tableau.map(
      (column) =>
        column.map((item) => ({
          ...item,
        })),
    );

    let nextWaste = waste.map((item) => ({
      ...item,
    }));

    let nextFoundations = {
      "♠": foundations["♠"].map((c) => ({
        ...c,
      })),
      "♥": foundations["♥"].map((c) => ({
        ...c,
      })),
      "♦": foundations["♦"].map((c) => ({
        ...c,
      })),
      "♣": foundations["♣"].map((c) => ({
        ...c,
      })),
    };

    if (selected.type === "tableau") {
      nextTableau[
        selected.column
      ].pop();

      nextTableau =
        revealTopCard(nextTableau);
    }

    if (selected.type === "waste") {
      nextWaste.pop();
    }

    if (selected.type === "foundation") {
      nextFoundations[
        selected.suit
      ].pop();
    }

    nextFoundations[suit].push({
      ...card,
      faceUp: true,
    });

    setTableau(nextTableau);
    setWaste(nextWaste);
    setFoundations(nextFoundations);
    setSelected(null);

    const nextMoves = moves + 1;

    setMoves(nextMoves);

    playSound("move");

    const totalFoundationCards =
      Object.values(
        nextFoundations,
      ).reduce(
        (sum, pile) =>
          sum + pile.length,
        0,
      );

    if (totalFoundationCards === 52) {
      setWon(true);
      onWin(nextMoves);
      playSound("win");
    }
  };

  const clickTableauCard = (
    column: number,
    index: number,
  ) => {
    const card =
      tableau[column][index];

    if (!card.faceUp) {
      return;
    }

    if (selected) {
      moveSelectedToTableau(column);

      if (
        selected.type === "tableau" &&
        selected.column === column &&
        selected.index === index
      ) {
        setSelected(null);
      }

      return;
    }

    setSelected({
      type: "tableau",
      column,
      index,
    });

    playSound("click");
  };

  const undo = () => {
    const previous =
      history[history.length - 1];

    if (!previous) return;

    setTableau(previous.tableau);
    setStock(previous.stock);
    setWaste(previous.waste);
    setFoundations(previous.foundations);
    setMoves(previous.moves);
    setSelected(null);

    setHistory((items) =>
      items.slice(0, -1),
    );

    playSound("move");
  };

  return (
    <GameShell
      title="Klondike Solitaire"
      subtitle="Build every foundation from Ace to King."
      icon="🃏"
      accent="amber"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <GameMetric
              label="Moves"
              value={`${moves}`}
            />

            <GameMetric
              label="Cards"
              value={`${Object.values(
                foundations,
              ).reduce(
                (sum, pile) =>
                  sum + pile.length,
                0,
              )}/52`}
            />
          </div>

          <div className="flex gap-2">
            <ControlButton
              icon={<Undo2 />}
              label="Undo"
              disabled={!history.length}
              onClick={undo}
            />

            <ControlButton
              icon={<RotateCcw />}
              label="Deal"
              onClick={deal}
            />
          </div>
        </div>

        {won && (
          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-center">
            <Crown className="mx-auto h-8 w-8 text-amber-300" />

            <div className="mt-2 font-black text-amber-100">
              Solitaire Complete!
            </div>

            <div className="mt-1 text-xs text-amber-200/60">
              You cleared all 52 cards in{" "}
              {moves} moves.
            </div>
          </div>
        )}

        {/* Top row */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <button
            onClick={drawStock}
            className="relative h-20 w-14 rounded-xl border-2 border-white/10 bg-gradient-to-br from-indigo-700 to-indigo-950 text-xs font-black text-white shadow-xl transition hover:-translate-y-0.5"
          >
            {stock.length > 0 ? (
              <>
                <span className="absolute inset-1 rounded-lg border border-white/10" />
                <span className="absolute inset-2 rounded-lg border border-white/10" />
              </>
            ) : (
              <span className="text-lg text-slate-500">
                ↻
              </span>
            )}

            <span className="absolute -bottom-5 left-0 right-0 text-center text-[9px] text-slate-600">
              {stock.length}
            </span>
          </button>

          <button
            onClick={() => {
              if (waste.length) {
                if (selected) {
                  if (
                    selected.type ===
                    "waste"
                  ) {
                    setSelected(null);
                  } else {
                    setSelected({
                      type: "waste",
                    });
                  }
                } else {
                  setSelected({
                    type: "waste",
                  });
                }

                playSound("click");
              }
            }}
            className={[
              "h-20 w-14 rounded-xl border shadow-xl transition",
              waste.length
                ? "border-white/10 bg-white text-slate-950 hover:-translate-y-0.5"
                : "border-dashed border-white/10 bg-white/[0.03]",
              selected?.type === "waste"
                ? "ring-2 ring-cyan-400"
                : "",
            ].join(" ")}
          >
            {waste.length
              ? formatCard(
                  waste[waste.length - 1],
                )
              : ""}
          </button>

          <div className="ml-auto flex gap-2">
            {SUITS.map((suit) => {
              const pile =
                foundations[suit];

              const top =
                pile[pile.length - 1];

              return (
                <button
                  key={suit}
                  onClick={() =>
                    selected &&
                    moveSelectedToFoundation(
                      suit,
                    )
                  }
                  className={[
                    "flex h-20 w-14 items-center justify-center rounded-xl border-2 text-xl font-bold transition",
                    pile.length
                      ? "border-white/10 bg-white text-slate-950"
                      : "border-dashed border-emerald-300/20 bg-emerald-950/20 text-emerald-300/30",
                    selected
                      ? "hover:border-cyan-400/60 hover:bg-cyan-400/10"
                      : "",
                  ].join(" ")}
                >
                  {top
                    ? formatCard(top)
                    : suit}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tableau */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {tableau.map(
            (column, columnIndex) => (
              <div
                key={columnIndex}
                className="relative min-h-[320px] rounded-xl border border-white/[0.04] bg-white/[0.015] p-1"
                onClick={() =>
                  selected &&
                  moveSelectedToTableau(
                    columnIndex,
                  )
                }
              >
                {column.length === 0 && (
                  <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-white/[0.06] text-lg text-slate-700">
                    K
                  </div>
                )}

                {column.map(
                  (card, index) => (
                    <button
                      key={card.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        clickTableauCard(
                          columnIndex,
                          index,
                        );
                      }}
                      className={[
                        "absolute left-1 right-1 h-16 rounded-lg text-[10px] font-black shadow-lg transition-all",
                        card.faceUp
                          ? "border border-slate-300 bg-white text-slate-950 hover:-translate-y-0.5"
                          : "border border-indigo-300/10 bg-gradient-to-br from-indigo-800 to-indigo-950 text-white",
                        selected?.type ===
                          "tableau" &&
                        selected.column ===
                          columnIndex &&
                        index >=
                          selected.index
                          ? "ring-2 ring-cyan-400"
                          : "",
                      ].join(" ")}
                      style={{
                        top: `${index * 24}px`,
                        zIndex: index + 1,
                      }}
                    >
                      {card.faceUp ? (
                        <>
                          <span
                            className={
                              isRed(card.suit)
                                ? "text-rose-500"
                                : "text-slate-900"
                            }
                          >
                            {
                              RANK_NAMES[
                                card.rank
                              ]
                            }
                            {card.suit}
                          </span>
                        </>
                      ) : (
                        <span className="opacity-60">
                          ◆
                        </span>
                      )}
                    </button>
                  ),
                )}
              </div>
            ),
          )}
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-600">
          Select a face-up card, then select another
          tableau column or foundation. Kings can start
          empty columns.
        </p>
      </div>
    </GameShell>
  );
};

const formatCard = (
  card: SolitaireCard,
) => (
  <span
    className={
      isRed(card.suit)
        ? "text-rose-500"
        : "text-slate-900"
    }
  >
    {RANK_NAMES[card.rank]}
    {card.suit}
  </span>
);

/* =========================================================
   PIXEL RUNNER
========================================================= */

type RunnerObstacle = {
  x: number;
  width: number;
  height: number;
};

type RunnerCoin = {
  x: number;
  y: number;
  collected: boolean;
};

const PixelRunnerGame: React.FC<{
  highScore: number;
  onGameOver: (score: number) => void;
  playSound: (type: SoundType) => void;
}> = ({
  highScore,
  onGameOver,
  playSound,
}) => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const playerRef = useRef({
    x: 90,
    y: 300,
    velocityY: 0,
    grounded: true,
  });

  const obstaclesRef = useRef<
    RunnerObstacle[]
  >([]);

  const coinsRef = useRef<
    RunnerCoin[]
  >([]);

  const scoreRef = useRef(0);

  const speedRef = useRef(5);

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] =
    useState(false);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 90,
      y: 300,
      velocityY: 0,
      grounded: true,
    };

    obstaclesRef.current = [
      {
        x: 620,
        width: 28,
        height: 30,
      },
      {
        x: 900,
        width: 38,
        height: 42,
      },
    ];

    coinsRef.current = [
      {
        x: 350,
        y: 240,
        collected: false,
      },
      {
        x: 600,
        y: 210,
        collected: false,
      },
      {
        x: 950,
        y: 230,
        collected: false,
      },
    ];

    scoreRef.current = 0;
    speedRef.current = 5;

    setScore(0);
    setLevel(1);
    setPaused(false);
    setGameOver(false);
  }, []);

  const jump = useCallback(() => {
    if (
      gameOver ||
      paused ||
      !playerRef.current.grounded
    ) {
      return;
    }

    playerRef.current.velocityY = -13;
    playerRef.current.grounded = false;

    playSound("move");
  }, [gameOver, paused, playSound]);

  useEffect(() => {
    resetGame();

    const keyHandler = (
      event: KeyboardEvent,
    ) => {
      if (
        ["Space", "ArrowUp", "KeyW"].includes(
          event.code,
        )
      ) {
        event.preventDefault();
        jump();
      }

      if (event.code === "Space") {
        setPaused((value) => !value);
      }

      if (event.code === "KeyR") {
        resetGame();
      }
    };

    window.addEventListener(
      "keydown",
      keyHandler,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        keyHandler,
      );
  }, [jump, resetGame]);

  useEffect(() => {
    if (gameOver || paused) return;

    let animation = 0;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min(
        32,
        time - lastTime,
      );

      lastTime = time;

      const factor = delta / 16.67;

      const player = playerRef.current;

      player.velocityY +=
        0.72 * factor;

      player.y +=
        player.velocityY * factor;

      if (player.y >= 300) {
        player.y = 300;
        player.velocityY = 0;
        player.grounded = true;
      }

      const speed =
        5 + Math.floor(scoreRef.current / 100) * 0.55;

      speedRef.current = speed;

      setLevel(
        1 +
          Math.floor(
            scoreRef.current / 100,
          ),
      );

      obstaclesRef.current.forEach(
        (obstacle) => {
          obstacle.x -=
            speed * factor;

          if (
            obstacle.x <
            -obstacle.width - 20
          ) {
            obstacle.x =
              760 +
              Math.random() * 380;

            obstacle.width =
              24 +
              Math.random() * 30;

            obstacle.height =
              25 +
              Math.random() * 45;

            scoreRef.current += 10;
            setScore(scoreRef.current);
          }

          const playerLeft =
            player.x;

          const playerRight =
            player.x + 30;

          const playerTop =
            player.y;

          const playerBottom =
            player.y + 30;

          const obstacleLeft =
            obstacle.x;

          const obstacleRight =
            obstacle.x +
            obstacle.width;

          const obstacleTop =
            330 - obstacle.height;

          const obstacleBottom =
            330;

          const collision =
            playerRight >
              obstacleLeft &&
            playerLeft <
              obstacleRight &&
            playerBottom >
              obstacleTop &&
            playerTop <
              obstacleBottom;

          if (collision) {
            setGameOver(true);
            onGameOver(scoreRef.current);
            playSound("lose");
          }
        },
      );

      coinsRef.current.forEach(
        (coin) => {
          coin.x -=
            speed * factor;

          if (coin.x < -30) {
            coin.x =
              800 +
              Math.random() * 500;

            coin.y =
              180 +
              Math.random() * 100;

            coin.collected = false;
          }

          const distance = Math.hypot(
            player.x + 15 - (coin.x + 8),
            player.y + 15 - (coin.y + 8),
          );

          if (
            !coin.collected &&
            distance < 28
          ) {
            coin.collected = true;

            scoreRef.current += 25;

            setScore(scoreRef.current);

            playSound("eat");
          }
        },
      );

      const canvas = canvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext(
          "2d",
        );

        if (ctx) {
          renderRunner(
            ctx,
            canvas.width,
            canvas.height,
            player,
            obstaclesRef.current,
            coinsRef.current,
            scoreRef.current,
            speed,
          );
        }
      }

      if (!gameOver) {
        animation =
          requestAnimationFrame(loop);
      }
    };

    animation =
      requestAnimationFrame(loop);

    return () =>
      cancelAnimationFrame(animation);
  }, [
    gameOver,
    paused,
    onGameOver,
    playSound,
  ]);

  return (
    <GameShell
      title="Pixel Runner"
      subtitle="Deploy mission • Avoid bugs • Collect code"
      icon="🤖"
      accent="purple"
    >
      <div className="mx-auto w-full max-w-[760px]">
        <div className="mb-3 grid grid-cols-3 gap-2">
          <GameMetric
            label="Score"
            value={`${score}`}
          />

          <GameMetric
            label="Best"
            value={`${Math.max(
              highScore,
              score,
            )}`}
          />

          <GameMetric
            label="Level"
            value={`${level}`}
          />
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
          onPointerDown={() => {
            if (!gameOver) jump();
          }}
        >
          <canvas
            ref={canvasRef}
            width={760}
            height={400}
            className="block h-auto w-full"
          />

          {paused && !gameOver && (
            <GameOverlay
              title="Mission Paused"
              subtitle="Resume deployment when ready."
              icon={<Pause />}
              buttonText="Resume"
              onClick={() =>
                setPaused(false)
              }
            />
          )}

          {gameOver && (
            <GameOverlay
              title="Build Failed"
              subtitle={`Bug collision • Score ${score}`}
              icon={<Target />}
              buttonText="Hotfix & Retry"
              onClick={resetGame}
            />
          )}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <ControlButton
            icon={
              paused ? (
                <Play />
              ) : (
                <Pause />
              )
            }
            label={
              paused ? "Resume" : "Pause"
            }
            onClick={() =>
              setPaused((value) => !value)
            }
          />

          <ControlButton
            icon={<RotateCcw />}
            label="Restart"
            onClick={resetGame}
          />
        </div>

        <p className="mt-5 text-center text-[10px] text-slate-600">
          Click/tap the game • Space / ↑ / W to jump
          • R to restart
        </p>
      </div>
    </GameShell>
  );
};

function renderRunner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  player: {
    x: number;
    y: number;
    velocityY: number;
    grounded: boolean;
  },
  obstacles: RunnerObstacle[],
  coins: RunnerCoin[],
  score: number,
  speed: number,
) {
  /* Sky */
  const sky =
    ctx.createLinearGradient(
      0,
      0,
      0,
      height,
    );

  sky.addColorStop(
    0,
    "#0b1730",
  );

  sky.addColorStop(
    0.65,
    "#101827",
  );

  sky.addColorStop(
    1,
    "#020617",
  );

  ctx.fillStyle = sky;
  ctx.fillRect(
    0,
    0,
    width,
    height,
  );

  /* Stars */
  ctx.fillStyle =
    "rgba(255,255,255,0.25)";

  for (let i = 0; i < 35; i++) {
    const x =
      (i * 137 + score * 0.2) %
      width;

    const y =
      30 + ((i * 73) % 160);

    ctx.fillRect(
      x,
      y,
      2,
      2,
    );
  }

  /* City */
  for (let i = 0; i < 12; i++) {
    const buildingWidth =
      45 + (i % 3) * 15;

    const buildingHeight =
      60 + ((i * 37) % 100);

    const x =
      ((i * 100 -
        score * speed * 0.2) %
        (width + 120) +
        width +
        120) %
      (width + 120);

    ctx.fillStyle =
      "rgba(30,41,59,0.8)";

    ctx.fillRect(
      x,
      330 - buildingHeight,
      buildingWidth,
      buildingHeight,
    );

    ctx.fillStyle =
      "rgba(96,165,250,0.15)";

    for (
      let windowY =
        330 - buildingHeight + 12;
      windowY < 320;
      windowY += 18
    ) {
      ctx.fillRect(
        x + 8,
        windowY,
        5,
        5,
      );

      ctx.fillRect(
        x + 20,
        windowY,
        5,
        5,
      );
    }
  }

  /* Ground */
  ctx.fillStyle = "#020617";

  ctx.fillRect(
    0,
    330,
    width,
    70,
  );

  ctx.strokeStyle =
    "rgba(129,140,248,0.25)";

  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.lineTo(width, 330);
  ctx.stroke();

  /* Moving grid */
  ctx.strokeStyle =
    "rgba(99,102,241,0.08)";

  for (
    let x =
      -((score * speed) % 60);
    x < width;
    x += 60
  ) {
    ctx.beginPath();
    ctx.moveTo(x, 330);
    ctx.lineTo(
      x - 30,
      height,
    );
    ctx.stroke();
  }

  /* Coins */
  coins.forEach((coin) => {
    if (coin.collected) return;

    ctx.shadowBlur = 18;
    ctx.shadowColor = "#facc15";
    ctx.fillStyle = "#facc15";

    ctx.beginPath();
    ctx.arc(
      coin.x + 8,
      coin.y + 8,
      8,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#78350f";

    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      "<>",
      coin.x + 8,
      coin.y + 11,
    );
  });

  /* Obstacles */
  obstacles.forEach((obstacle) => {
    const y =
      330 - obstacle.height;

    const gradient =
      ctx.createLinearGradient(
        obstacle.x,
        y,
        obstacle.x +
          obstacle.width,
        330,
      );

    gradient.addColorStop(
      0,
      "#fb7185",
    );

    gradient.addColorStop(
      1,
      "#9f1239",
    );

    ctx.fillStyle = gradient;

    ctx.shadowBlur = 12;
    ctx.shadowColor =
      "rgba(244,63,94,0.4)";

    ctx.beginPath();
    ctx.roundRect(
      obstacle.x,
      y,
      obstacle.width,
      obstacle.height,
      5,
    );
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#fecdd3";
    ctx.fillRect(
      obstacle.x + 6,
      y + 7,
      4,
      4,
    );
  });

  /* Robot */
  const robotGradient =
    ctx.createLinearGradient(
      player.x,
      player.y,
      player.x + 30,
      player.y + 30,
    );

  robotGradient.addColorStop(
    0,
    "#67e8f9",
  );

  robotGradient.addColorStop(
    1,
    "#2563eb",
  );

  ctx.fillStyle = robotGradient;

  ctx.shadowBlur = 20;
  ctx.shadowColor =
    "rgba(34,211,238,0.35)";

  ctx.beginPath();
  ctx.roundRect(
    player.x,
    player.y,
    30,
    30,
    7,
  );
  ctx.fill();

  ctx.shadowBlur = 0;

  /* Visor */
  ctx.fillStyle = "#082f49";

  ctx.beginPath();
  ctx.roundRect(
    player.x + 5,
    player.y + 7,
    20,
    8,
    3,
  );
  ctx.fill();

  ctx.fillStyle = "#67e8f9";

  ctx.fillRect(
    player.x + 9,
    player.y + 9,
    4,
    3,
  );

  ctx.fillRect(
    player.x + 17,
    player.y + 9,
    4,
    3,
  );

  /* Score label */
  ctx.textAlign = "left";
  ctx.font = "bold 12px monospace";
  ctx.fillStyle =
    "rgba(255,255,255,0.5)";

  ctx.fillText(
    `DEPLOYMENT SCORE ${score}`,
    16,
    24,
  );
}

/* =========================================================
   CHESS
========================================================= */

type ChessColor = "white" | "black";

type ChessPiece =
  | "♔"
  | "♕"
  | "♖"
  | "♗"
  | "♘"
  | "♙"
  | "♚"
  | "♛"
  | "♜"
  | "♝"
  | "♞"
  | "♟";

type ChessBoard = (
  | ChessPiece
  | ""
)[];

type ChessRights = {
  whiteKing: boolean;
  whiteQueen: boolean;
  blackKing: boolean;
  blackQueen: boolean;
};

type ChessState = {
  board: ChessBoard;
  turn: ChessColor;
  rights: ChessRights;
  enPassant: number | null;
};

const CHESS_START: ChessBoard = [
  "♜",
  "♞",
  "♝",
  "♛",
  "♚",
  "♝",
  "♞",
  "♜",

  "♟",
  "♟",
  "♟",
  "♟",
  "♟",
  "♟",
  "♟",
  "♟",

  ...Array(32).fill(""),

  "♙",
  "♙",
  "♙",
  "♙",
  "♙",
  "♙",
  "♙",
  "♙",

  "♖",
  "♘",
  "♗",
  "♕",
  "♔",
  "♗",
  "♘",
  "♖",
];

const PIECE_TYPE: Record<
  ChessPiece,
  string
> = {
  "♙": "P",
  "♘": "N",
  "♗": "B",
  "♖": "R",
  "♕": "Q",
  "♔": "K",

  "♟": "P",
  "♞": "N",
  "♝": "B",
  "♜": "R",
  "♛": "Q",
  "♚": "K",
};

const pieceIsWhite = (
  piece: ChessPiece | "",
) =>
  !!piece &&
  "♙♘♗♖♕♔".includes(piece);

const cloneChessState = (
  state: ChessState,
): ChessState => ({
  board: [...state.board],
  turn: state.turn,
  rights: {
    ...state.rights,
  },
  enPassant:
    state.enPassant,
});

const getChessColor = (
  piece: ChessPiece | "",
): ChessColor | null => {
  if (!piece) return null;

  return pieceIsWhite(piece)
    ? "white"
    : "black";
};

const oppositeColor = (
  color: ChessColor,
): ChessColor =>
  color === "white"
    ? "black"
    : "white";

const rowOf = (square: number) =>
  Math.floor(square / 8);

const colOf = (square: number) =>
  square % 8;

const inBounds = (
  row: number,
  col: number,
) =>
  row >= 0 &&
  row < 8 &&
  col >= 0 &&
  col < 8;

const squareAt = (
  row: number,
  col: number,
) => row * 8 + col;

const findKing = (
  board: ChessBoard,
  color: ChessColor,
) => {
  const king =
    color === "white"
      ? "♔"
      : "♚";

  return board.findIndex(
    (piece) => piece === king,
  );
};

const isSquareAttacked = (
  board: ChessBoard,
  square: number,
  byColor: ChessColor,
) => {
  const targetRow = rowOf(square);
  const targetCol = colOf(square);

  for (
    let from = 0;
    from < 64;
    from++
  ) {
    const piece = board[from];

    if (
      !piece ||
      getChessColor(piece) !==
        byColor
    ) {
      continue;
    }

    const type =
      PIECE_TYPE[piece];

    const row = rowOf(from);
    const col = colOf(from);

    const dr = targetRow - row;
    const dc = targetCol - col;

    if (type === "P") {
      const direction =
        byColor === "white"
          ? -1
          : 1;

      if (
        dr === direction &&
        Math.abs(dc) === 1
      ) {
        return true;
      }
    }

    if (type === "N") {
      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];

      if (
        knightMoves.some(
          ([r, c]) =>
            dr === r && dc === c,
        )
      ) {
        return true;
      }
    }

    if (type === "K") {
      if (
        Math.max(
          Math.abs(dr),
          Math.abs(dc),
        ) === 1
      ) {
        return true;
      }
    }

    const diagonal =
      Math.abs(dr) ===
      Math.abs(dc);

    const straight =
      dr === 0 || dc === 0;

    if (
      (type === "B" &&
        !diagonal) ||
      (type === "R" &&
        !straight) ||
      (type === "Q" &&
        !diagonal &&
        !straight)
    ) {
      continue;
    }

    if (
      type === "B" ||
      type === "R" ||
      type === "Q"
    ) {
      const stepRow =
        Math.sign(dr);

      const stepCol =
        Math.sign(dc);

      if (
        stepRow === 0 &&
        stepCol === 0
      ) {
        continue;
      }

      let r = row + stepRow;
      let c = col + stepCol;

      let blocked = false;

      while (
        r !== targetRow ||
        c !== targetCol
      ) {
        if (
          !inBounds(r, c) ||
          board[squareAt(r, c)]
        ) {
          blocked = true;
          break;
        }

        r += stepRow;
        c += stepCol;
      }

      if (!blocked) {
        return true;
      }
    }
  }

  return false;
};

const isKingInCheck = (
  state: ChessState,
  color: ChessColor,
) => {
  const king =
    findKing(state.board, color);

  if (king < 0) return true;

  return isSquareAttacked(
    state.board,
    king,
    oppositeColor(color),
  );
};

const pseudoMoves = (
  state: ChessState,
  from: number,
): number[] => {
  const piece =
    state.board[from];

  if (!piece) return [];

  const color =
    getChessColor(piece)!;

  const type =
    PIECE_TYPE[piece];

  const row = rowOf(from);
  const col = colOf(from);

  const moves: number[] = [];

  const add = (
    r: number,
    c: number,
  ) => {
    if (!inBounds(r, c)) {
      return false;
    }

    const target =
      squareAt(r, c);

    const targetPiece =
      state.board[target];

    if (
      targetPiece &&
      getChessColor(targetPiece) ===
        color
    ) {
      return false;
    }

    moves.push(target);

    return !targetPiece;
  };

  if (type === "P") {
    const direction =
      color === "white"
        ? -1
        : 1;

    const startRow =
      color === "white"
        ? 6
        : 1;

    const nextRow =
      row + direction;

    if (
      inBounds(nextRow, col) &&
      !state.board[
        squareAt(nextRow, col)
      ]
    ) {
      moves.push(
        squareAt(nextRow, col),
      );

      const twoRow =
        row + direction * 2;

      if (
        row === startRow &&
        !state.board[
          squareAt(twoRow, col)
        ]
      ) {
        moves.push(
          squareAt(twoRow, col),
        );
      }
    }

    for (const dc of [-1, 1]) {
      const nr = row + direction;
      const nc = col + dc;

      if (!inBounds(nr, nc)) {
        continue;
      }

      const target =
        squareAt(nr, nc);

      const targetPiece =
        state.board[target];

      if (
        targetPiece &&
        getChessColor(targetPiece) !==
          color
      ) {
        moves.push(target);
      }

      if (
        state.enPassant === target
      ) {
        moves.push(target);
      }
    }
  }

  if (type === "N") {
    const jumps = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    jumps.forEach(([dr, dc]) =>
      add(row + dr, col + dc),
    );
  }

  if (
    type === "B" ||
    type === "R" ||
    type === "Q"
  ) {
    const directions =
      type === "B"
        ? [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]
        : type === "R"
          ? [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ]
          : [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1],
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ];

    directions.forEach(
      ([dr, dc]) => {
        let r = row + dr;
        let c = col + dc;

        while (inBounds(r, c)) {
          const keepGoing = add(
            r,
            c,
          );

          if (!keepGoing) {
            break;
          }

          r += dr;
          c += dc;
        }
      },
    );
  }

  if (type === "K") {
    for (
      let dr = -1;
      dr <= 1;
      dr++
    ) {
      for (
        let dc = -1;
        dc <= 1;
        dc++
      ) {
        if (dr || dc) {
          add(
            row + dr,
            col + dc,
          );
        }
      }
    }

    /* Castling */
    if (
      !isKingInCheck(
        state,
        color,
      )
    ) {
      if (
        color === "white" &&
        from === 60
      ) {
        if (
          state.rights.whiteKing &&
          state.board[61] === "" &&
          state.board[62] === "" &&
          state.board[63] === "♖" &&
          !isSquareAttacked(
            state.board,
            61,
            "black",
          ) &&
          !isSquareAttacked(
            state.board,
            62,
            "black",
          )
        ) {
          moves.push(62);
        }

        if (
          state.rights.whiteQueen &&
          state.board[59] === "" &&
          state.board[58] === "" &&
          state.board[57] === "" &&
          state.board[56] === "♖" &&
          !isSquareAttacked(
            state.board,
            59,
            "black",
          ) &&
          !isSquareAttacked(
            state.board,
            58,
            "black",
          )
        ) {
          moves.push(58);
        }
      }

      if (
        color === "black" &&
        from === 4
      ) {
        if (
          state.rights.blackKing &&
          state.board[5] === "" &&
          state.board[6] === "" &&
          state.board[7] === "♜" &&
          !isSquareAttacked(
            state.board,
            5,
            "white",
          ) &&
          !isSquareAttacked(
            state.board,
            6,
            "white",
          )
        ) {
          moves.push(6);
        }

        if (
          state.rights.blackQueen &&
          state.board[3] === "" &&
          state.board[2] === "" &&
          state.board[1] === "" &&
          state.board[0] === "♜" &&
          !isSquareAttacked(
            state.board,
            3,
            "white",
          ) &&
          !isSquareAttacked(
            state.board,
            2,
            "white",
          )
        ) {
          moves.push(2);
        }
      }
    }
  }

  return moves;
};

const applyChessMove = (
  state: ChessState,
  from: number,
  to: number,
): ChessState => {
  const next =
    cloneChessState(state);

  const piece =
    next.board[from];

  if (!piece) return next;

  const color =
    getChessColor(piece)!;

  const type =
    PIECE_TYPE[piece];

  const captured =
    next.board[to];

  next.board[to] = piece;
  next.board[from] = "";

  next.enPassant = null;

  /* En passant capture */
  if (
    type === "P" &&
    to === state.enPassant &&
    !captured
  ) {
    const captureSquare =
      to +
      (color === "white"
        ? 8
        : -8);

    next.board[captureSquare] = "";
  }

  /* New en-passant target */
  if (
    type === "P" &&
    Math.abs(to - from) === 16
  ) {
    next.enPassant =
      (from + to) / 2;
  }

  /* Castling rook movement */
  if (type === "K") {
    if (
      color === "white"
    ) {
      next.rights.whiteKing =
        false;

      next.rights.whiteQueen =
        false;

      if (from === 60 && to === 62) {
        next.board[61] =
          next.board[63];

        next.board[63] = "";
      }

      if (from === 60 && to === 58) {
        next.board[59] =
          next.board[56];

        next.board[56] = "";
      }
    } else {
      next.rights.blackKing =
        false;

      next.rights.blackQueen =
        false;

      if (from === 4 && to === 6) {
        next.board[5] =
          next.board[7];

        next.board[7] = "";
      }

      if (from === 4 && to === 2) {
        next.board[3] =
          next.board[0];

        next.board[0] = "";
      }
    }
  }

  /* Rook movement removes castling rights */
  if (piece === "♖") {
    if (from === 63)
      next.rights.whiteKing =
        false;

    if (from === 56)
      next.rights.whiteQueen =
        false;
  }

  if (piece === "♜") {
    if (from === 7)
      next.rights.blackKing =
        false;

    if (from === 0)
      next.rights.blackQueen =
        false;
  }

  /* Capturing rook removes rights */
  if (captured === "♖") {
    if (to === 63)
      next.rights.whiteKing =
        false;

    if (to === 56)
      next.rights.whiteQueen =
        false;
  }

  if (captured === "♜") {
    if (to === 7)
      next.rights.blackKing =
        false;

    if (to === 0)
      next.rights.blackQueen =
        false;
  }

  /* Promotion */
  if (
    type === "P" &&
    (rowOf(to) === 0 ||
      rowOf(to) === 7)
  ) {
    next.board[to] =
      color === "white"
        ? "♕"
        : "♛";
  }

  next.turn =
    oppositeColor(color);

  return next;
};

const legalChessMoves = (
  state: ChessState,
  from: number,
): number[] => {
  const piece =
    state.board[from];

  if (!piece) return [];

  const color =
    getChessColor(piece)!;

  if (color !== state.turn) {
    return [];
  }

  return pseudoMoves(
    state,
    from,
  ).filter((to) => {
    const next =
      applyChessMove(
        state,
        from,
        to,
      );

    return !isKingInCheck(
      next,
      color,
    );
  });
};

const ChessGame: React.FC<{
  playSound: (type: SoundType) => void;
}> = ({ playSound }) => {
  const initialState: ChessState =
    useMemo(
      () => ({
        board: [...CHESS_START],
        turn: "white",
        rights: {
          whiteKing: true,
          whiteQueen: true,
          blackKing: true,
          blackQueen: true,
        },
        enPassant: null,
      }),
      [],
    );

  const [state, setState] =
    useState<ChessState>(
      initialState,
    );

  const [selected, setSelected] =
    useState<number | null>(null);

  const [history, setHistory] =
    useState<ChessState[]>([]);

  const [lastMove, setLastMove] =
    useState<{
      from: number;
      to: number;
    } | null>(null);

  const [gameOver, setGameOver] =
    useState(false);

  const [message, setMessage] =
    useState("White to move");

  const [promotionSquare, setPromotionSquare] =
    useState<number | null>(null);

  const legalTargets = useMemo(() => {
    if (selected === null) {
      return [];
    }

    return legalChessMoves(
      state,
      selected,
    );
  }, [selected, state]);

  const currentInCheck =
    isKingInCheck(
      state,
      state.turn,
    );

  const currentHasMoves =
    state.board.some(
      (piece, index) =>
        !!piece &&
        getChessColor(piece) ===
          state.turn &&
        legalChessMoves(
          state,
          index,
        ).length > 0,
    );

  useEffect(() => {
    if (gameOver) return;

    if (!currentHasMoves) {
      setGameOver(true);

      if (currentInCheck) {
        setMessage(
          `${
            state.turn === "white"
              ? "Black"
              : "White"
          } wins — CHECKMATE`,
        );

        playSound("win");
      } else {
        setMessage("STALEMATE — Draw");
        playSound("move");
      }

      return;
    }

    if (currentInCheck) {
      setMessage(
        `${
          state.turn === "white"
            ? "White"
            : "Black"
        } is in CHECK`,
      );
    } else {
      setMessage(
        `${
          state.turn === "white"
            ? "White"
            : "Black"
        } to move`,
      );
    }
  }, [
    currentHasMoves,
    currentInCheck,
    gameOver,
    playSound,
    state.turn,
  ]);

  const reset = () => {
    setState({
      board: [...CHESS_START],
      turn: "white",
      rights: {
        whiteKing: true,
        whiteQueen: true,
        blackKing: true,
        blackQueen: true,
      },
      enPassant: null,
    });

    setSelected(null);
    setHistory([]);
    setLastMove(null);
    setGameOver(false);
    setPromotionSquare(null);
    setMessage("White to move");

    playSound("click");
  };

  const undo = () => {
    const previous =
      history[history.length - 1];

    if (!previous) return;

    setState(
      cloneChessState(previous),
    );

    setHistory((items) =>
      items.slice(0, -1),
    );

    setSelected(null);
    setLastMove(null);
    setGameOver(false);
    setPromotionSquare(null);

    playSound("move");
  };

  const clickSquare = (
    square: number,
  ) => {
    if (gameOver) return;

    const piece =
      state.board[square];

    if (selected === null) {
      if (
        piece &&
        getChessColor(piece) ===
          state.turn
      ) {
        setSelected(square);
        playSound("click");
      }

      return;
    }

    if (
      piece &&
      getChessColor(piece) ===
        state.turn
    ) {
      setSelected(square);
      playSound("click");
      return;
    }

    if (
      !legalTargets.includes(square)
    ) {
      setSelected(null);
      return;
    }

    setHistory((items) => [
      ...items,
      cloneChessState(state),
    ]);

    const movingPiece =
      state.board[selected];

    const next =
      applyChessMove(
        state,
        selected,
        square,
      );

    const wasCapture =
      !!state.board[square] ||
      (PIECE_TYPE[
        movingPiece!
      ] === "P" &&
        square ===
          state.enPassant);

    setState(next);
    setLastMove({
      from: selected,
      to: square,
    });

    setSelected(null);

    if (wasCapture) {
      playSound("capture");
    } else {
      playSound("move");
    }

    const promoted =
      movingPiece &&
      PIECE_TYPE[movingPiece] ===
        "P" &&
      (rowOf(square) === 0 ||
        rowOf(square) === 7);

    if (promoted) {
      setPromotionSquare(square);
    }
  };

  const promote = (
    piece: "Q" | "R" | "B" | "N",
  ) => {
    if (promotionSquare === null) {
      return;
    }

    const next =
      cloneChessState(state);

    const white =
      state.turn === "black";

    const pieces: Record<
      "Q" | "R" | "B" | "N",
      ChessPiece
    > = {
      Q: white ? "♕" : "♛",
      R: white ? "♖" : "♜",
      B: white ? "♗" : "♝",
      N: white ? "♘" : "♞",
    };

    next.board[promotionSquare] =
      pieces[piece];

    setState(next);
    setPromotionSquare(null);

    playSound("move");
  };

  return (
    <GameShell
      title="Chess"
      subtitle="Full local rules • Legal moves • Checkmate"
      icon="♟"
      accent="cyan"
    >
      <div className="mx-auto w-full max-w-[760px]">
        {/* Status */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div
            className={[
              "rounded-xl border px-4 py-2 text-xs font-bold transition-all",
              currentInCheck
                ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                : "border-white/10 bg-white/[0.04] text-slate-300",
            ].join(" ")}
          >
            {message}
          </div>

          <div className="flex gap-2">
            <ControlButton
              icon={<Undo2 />}
              label="Undo"
              disabled={!history.length}
              onClick={undo}
            />

            <ControlButton
              icon={<RotateCcw />}
              label="New Game"
              onClick={reset}
            />
          </div>
        </div>

        {/* Board */}
        <div className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-2 shadow-2xl">
          <div className="grid grid-cols-8 overflow-hidden rounded-xl">
            {state.board.map(
              (piece, index) => {
                const row =
                  rowOf(index);

                const col =
                  colOf(index);

                const light =
                  (row + col) % 2 === 0;

                const isSelected =
                  selected === index;

                const isLegal =
                  legalTargets.includes(
                    index,
                  );

                const isLastMove =
                  lastMove?.from ===
                    index ||
                  lastMove?.to ===
                    index;

                const targetPiece =
                  state.board[index];

                const captureTarget =
                  isLegal &&
                  !!targetPiece;

                const kingInCheck =
                  targetPiece &&
                  PIECE_TYPE[
                    targetPiece
                  ] === "K" &&
                  getChessColor(
                    targetPiece,
                  ) === state.turn &&
                  currentInCheck;

                return (
                  <button
                    key={index}
                    onClick={() =>
                      clickSquare(index)
                    }
                    className={[
                      "relative aspect-square flex items-center justify-center transition-all duration-150",
                      light
                        ? "bg-[#dbeafe]"
                        : "bg-[#334155]",
                      isLastMove
                        ? "brightness-110"
                        : "",
                      isSelected
                        ? "z-10 ring-4 ring-inset ring-cyan-300/90"
                        : "",
                      kingInCheck
                        ? "bg-rose-500/80"
                        : "",
                    ].join(" ")}
                    aria-label={`Chess square ${index + 1}`}
                  >
                    {/* Coordinate */}
                    {col === 0 && (
                      <span
                        className={[
                          "absolute left-1 top-0.5 text-[8px] font-bold",
                          light
                            ? "text-slate-500"
                            : "text-slate-300/50",
                        ].join(" ")}
                      >
                        {8 - row}
                      </span>
                    )}

                    {row === 7 && (
                      <span
                        className={[
                          "absolute bottom-0.5 right-1 text-[8px] font-bold",
                          light
                            ? "text-slate-500"
                            : "text-slate-300/50",
                        ].join(" ")}
                      >
                        {String.fromCharCode(
                          97 + col,
                        )}
                      </span>
                    )}

                    {/* Legal move dot */}
                    {isLegal &&
                      !captureTarget && (
                        <span className="absolute h-3 w-3 rounded-full bg-cyan-400/70 shadow-lg shadow-cyan-400/30" />
                      )}

                    {/* Capture ring */}
                    {captureTarget && (
                      <span className="absolute inset-1 rounded-full border-4 border-cyan-400/70" />
                    )}

                    {/* Piece */}
                    {piece && (
                      <span
                        className={[
                          "relative z-10 text-[clamp(2rem,7vw,4.25rem)] leading-none transition-transform",
                          "drop-shadow-[0_5px_4px_rgba(0,0,0,0.35)]",
                          isSelected
                            ? "scale-110"
                            : "hover:scale-105",
                          pieceIsWhite(
                            piece,
                          )
                            ? "text-white"
                            : "text-slate-950",
                        ].join(" ")}
                      >
                        {piece}
                      </span>
                    )}

                    {/* Selected move arrow-like marker */}
                    {isSelected && (
                      <span className="pointer-events-none absolute inset-1 rounded-lg border border-cyan-300/30" />
                    )}
                  </button>
                );
              },
            )}
          </div>

          {/* Promotion */}
          {promotionSquare !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
              <div className="rounded-2xl border border-white/10 bg-[#111827]/95 p-5 shadow-2xl">
                <div className="mb-3 text-center text-sm font-bold">
                  Choose promotion
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(
                    ["Q", "R", "B", "N"] as const
                  ).map((piece) => (
                    <button
                      key={piece}
                      onClick={() =>
                        promote(piece)
                      }
                      className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-4xl transition hover:bg-white/[0.1] hover:ring-2 hover:ring-cyan-400/50"
                    >
                      {state.turn ===
                      "black"
                        ? {
                            Q: "♕",
                            R: "♖",
                            B: "♗",
                            N: "♘",
                          }[piece]
                        : {
                            Q: "♛",
                            R: "♜",
                            B: "♝",
                            N: "♞",
                          }[piece]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chess information */}
        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          <ChessInfo
            title="Move"
            value={
              state.turn === "white"
                ? "White"
                : "Black"
            }
          />

          <ChessInfo
            title="Status"
            value={
              currentInCheck
                ? "Check"
                : gameOver
                  ? "Finished"
                  : "Normal"
            }
          />

          <ChessInfo
            title="Legal moves"
            value={`${legalTargets.length}`}
          />

          <ChessInfo
            title="History"
            value={`${history.length}`}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <CircleDot className="h-3.5 w-3.5 text-cyan-400" />
            How to play
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            Select a piece to see its legal destinations.
            Sliding pieces such as the queen, rook and
            bishop automatically show every reachable
            square until blocked. Captures are highlighted
            with a ring. The game prevents moves that leave
            your king in check.
          </p>
        </div>
      </div>
    </GameShell>
  );
};

const ChessInfo: React.FC<{
  title: string;
  value: string;
}> = ({ title, value }) => (
  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
    <div className="text-[9px] uppercase tracking-wider text-slate-600">
      {title}
    </div>

    <div className="mt-1 text-xs font-bold text-slate-300">
      {value}
    </div>
  </div>
);

/* =========================================================
   SHARED UI
========================================================= */

const GameShell: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
}> = ({
  title,
  subtitle,
  icon,
  accent,
  children,
}) => {
  const accentMap: Record<
    string,
    string
  > = {
    emerald:
      "from-emerald-500/10 to-cyan-500/5 border-emerald-400/10",
    sky:
      "from-sky-500/10 to-indigo-500/5 border-sky-400/10",
    amber:
      "from-amber-500/10 to-orange-500/5 border-amber-400/10",
    purple:
      "from-purple-500/10 to-indigo-500/5 border-purple-400/10",
    cyan:
      "from-cyan-500/10 to-blue-500/5 border-cyan-400/10",
  };

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Game title */}
        <div
          className={`mb-5 overflow-hidden rounded-2xl border bg-gradient-to-r ${accentMap[accent] || accentMap.cyan} p-4`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-2xl">
              {icon}
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight">
                {title}
              </h1>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

const GameMetric: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-600">
      {icon &&
        React.cloneElement(
          icon as React.ReactElement,
          {
            className:
              "h-3 w-3",
          },
        )}

      {label}
    </div>

    <div className="mt-1 text-sm font-black text-slate-200">
      {value}
    </div>
  </div>
);

const ControlButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({
  icon,
  label,
  onClick,
  disabled,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/[0.09] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
  >
    {React.cloneElement(
      icon as React.ReactElement,
      {
        className: "h-3.5 w-3.5",
      },
    )}

    {label}
  </button>
);

const DPadButton: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-sm font-black text-slate-300 active:scale-95"
  >
    {label}
  </button>
);

const GameOverlay: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
}> = ({
  title,
  subtitle,
  icon,
  buttonText,
  onClick,
}) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md">
    <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-[#0d111c]/95 p-6 text-center shadow-2xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-indigo-300">
        {React.cloneElement(
          icon as React.ReactElement,
          {
            className: "h-5 w-5",
          },
        )}
      </div>

      <h3 className="mt-4 text-lg font-black">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>

      <button
        onClick={onClick}
        className="mt-5 rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 active:scale-95"
      >
        {buttonText}
      </button>
    </div>
  </div>
);