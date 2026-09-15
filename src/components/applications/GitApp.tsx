import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Clock,
  FileCode,
  Plus,
  Minus,
  RefreshCw,
  Terminal as TerminalIcon,
  ChevronRight,
  FolderGit2,
  Info,
  Check,
  Copy,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface CommitItem {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  tags?: string[];
  diff: {
    file: string;
    additions: number;
    deletions: number;
    hunks: { type: 'add' | 'del' | 'ctx'; text: string }[];
  }[];
}

const INITIAL_COMMITS: CommitItem[] = [
  {
    hash: 'a1b2c3d4e5f67890123456789abcdef01234567',
    shortHash: 'a1b2c3d',
    message: 'feat(os): upgrade Abhishek OS to v3.0 unified browser architecture',
    author: 'Abhishek Kuntare <abhishekkuntare02@gmail.com>',
    date: 'Just now',
    branch: 'main',
    tags: ['HEAD -> main', 'tag: v3.0.0'],
    diff: [
      {
        file: 'src/lib/appRegistry.ts',
        additions: 45,
        deletions: 0,
        hunks: [
          { type: 'ctx', text: 'export const APP_REGISTRY: Record<AppId, AppMetadata> = {' },
          { type: 'add', text: '+  browser: { id: "browser", name: "Abhishek Browser", category: "development" },' },
          { type: 'add', text: '+  git: { id: "git", name: "Abhishek Git Studio", category: "development" },' },
          { type: 'add', text: '+  apiTester: { id: "api-tester", name: "Abhishek API Lab", category: "development" },' },
        ],
      },
      {
        file: 'src/components/applications/BrowserApp.tsx',
        additions: 120,
        deletions: 15,
        hunks: [
          { type: 'ctx', text: ' // Integrated search engine & AI synthesis panel' },
          { type: 'del', text: '-  window.open(searchUrl, "_blank");' },
          { type: 'add', text: '+  renderInBrowserSearchResults(searchQuery);' },
          { type: 'add', text: '+  connectToAbhishekNotesStore(aiSummary);' },
        ],
      },
    ],
  },
  {
    hash: '7f8e9d0c1b2a3456789abcdef0123456789abcde',
    shortHash: '7f8e9d0',
    message: 'feat(krishimitra): implement visual plant disease inference pipeline',
    author: 'Abhishek Kuntare <abhishekkuntare02@gmail.com>',
    date: 'Yesterday at 4:15 PM',
    branch: 'main',
    tags: ['feature/krishimitra-ai'],
    diff: [
      {
        file: 'services/inference.py',
        additions: 84,
        deletions: 6,
        hunks: [
          { type: 'ctx', text: 'def analyze_crop_image(image_bytes: bytes) -> DiagnosisResult:' },
          { type: 'add', text: '+    gemini_client = genai.Client()' },
          { type: 'add', text: '+    response = gemini_client.models.generate_content(...)' },
          { type: 'add', text: '+    return parse_pathology_metrics(response.text)' },
        ],
      },
    ],
  },
  {
    hash: '4d5e6f7a8b9c0123456789abcdef0123456789ab',
    shortHash: '4d5e6f7',
    message: 'perf(vfs): migrate virtual filesystem store to reactive IndexedDB',
    author: 'Abhishek Kuntare <abhishekkuntare02@gmail.com>',
    date: '3 days ago',
    branch: 'main',
    diff: [
      {
        file: 'src/lib/vfs.ts',
        additions: 210,
        deletions: 40,
        hunks: [
          { type: 'ctx', text: 'export async function initVFS(): Promise<void> {' },
          { type: 'del', text: '-  localStorage.setItem("vfs_files", JSON.stringify(files));' },
          { type: 'add', text: '+  const db = await openDB();' },
          { type: 'add', text: '+  const tx = db.transaction("files", "readwrite");' },
        ],
      },
    ],
  },
  {
    hash: '1a2b3c4d5e6f7890123456789abcdef012345678',
    shortHash: '1a2b3c4',
    message: 'feat(sheets): build AST mathematical parser for spreadsheet formulas',
    author: 'Abhishek Kuntare <abhishekkuntare02@gmail.com>',
    date: '5 days ago',
    branch: 'main',
    diff: [
      {
        file: 'src/components/applications/SheetsApp.tsx',
        additions: 156,
        deletions: 12,
        hunks: [
          { type: 'ctx', text: 'export function evaluateFormula(formula: string, grid: GridData): string {' },
          { type: 'add', text: '+  if (formula.startsWith("=SUM(")) return computeSum(formula, grid);' },
          { type: 'add', text: '+  if (formula.startsWith("=AVERAGE(")) return computeAverage(formula, grid);' },
        ],
      },
    ],
  },
  {
    hash: '0987654321fedcba0987654321fedcba09876543',
    shortHash: '0987654',
    message: 'chore: initial repository scaffolding and portfolio workstation setup',
    author: 'Abhishek Kuntare <abhishekkuntare02@gmail.com>',
    date: 'Sep 1, 2026',
    branch: 'main',
    diff: [
      {
        file: 'package.json',
        additions: 35,
        deletions: 0,
        hunks: [
          { type: 'add', text: '+  "name": "abhishek-os",' },
          { type: 'add', text: '+  "version": "1.0.0",' },
        ],
      },
    ],
  },
];

export const GitApp: React.FC = () => {
  const { openApp } = useOS();
  const [commits, setCommits] = useState<CommitItem[]>(INITIAL_COMMITS);
  const [activeBranch, setActiveBranch] = useState<string>('main');
  const [selectedCommitHash, setSelectedCommitHash] = useState<string>(INITIAL_COMMITS[0].hash);
  const [activeTab, setActiveTab] = useState<'graph' | 'staging' | 'terminal'>('graph');

  // Staging area state
  const [stagedFiles, setStagedFiles] = useState<string[]>([
    'src/components/applications/AiAssistantApp.tsx',
  ]);
  const [unstagedFiles, setUnstagedFiles] = useState<string[]>([
    'src/locales/en.json',
    'src/locales/hi.json',
    'README.md',
  ]);
  const [commitMessage, setCommitMessage] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Simulated git terminal
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLines, setTerminalLines] = useState<{ id: string; text: string; type: 'cmd' | 'out' | 'err' }[]>([
    { id: '1', text: 'git status', type: 'cmd' },
    { id: '2', text: `On branch ${activeBranch}\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tmodified:   src/components/applications/AiAssistantApp.tsx\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tsrc/locales/en.json\n\tsrc/locales/hi.json\n\tREADME.md`, type: 'out' },
  ]);

  const selectedCommit = commits.find(c => c.hash === selectedCommitHash) || commits[0];

  const handleStage = (file: string) => {
    setUnstagedFiles(prev => prev.filter(f => f !== file));
    setStagedFiles(prev => [...prev, file]);
  };

  const handleUnstage = (file: string) => {
    setStagedFiles(prev => prev.filter(f => f !== file));
    setUnstagedFiles(prev => [...prev, file]);
  };

  const handleCreateCommit = () => {
    if (!commitMessage.trim() || stagedFiles.length === 0) return;

    const newHash = Math.random().toString(16).substring(2, 42);
    const newShort = newHash.substring(0, 7);

    const newCommit: CommitItem = {
      hash: newHash,
      shortHash: newShort,
      message: commitMessage.trim(),
      author: 'Abhishek Kuntare <abhishekkuntare02@gmail.com>',
      date: 'Just now',
      branch: activeBranch,
      tags: [`HEAD -> ${activeBranch}`],
      diff: stagedFiles.map(file => ({
        file,
        additions: Math.floor(Math.random() * 40) + 5,
        deletions: Math.floor(Math.random() * 10),
        hunks: [
          { type: 'add', text: `+ // Committed into virtual branch ${activeBranch}` },
          { type: 'ctx', text: `  // Tracked in Abhishek OS git store` },
        ],
      })),
    };

    setCommits(prev => [newCommit, ...prev]);
    setSelectedCommitHash(newHash);
    setStagedFiles([]);
    setCommitMessage('');
    setActiveTab('graph');
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;

    const newCmd = { id: `cmd-${Date.now()}`, text: raw, type: 'cmd' as const };
    let outputText = '';
    let outputType: 'out' | 'err' = 'out';

    const parts = raw.split(' ');
    if (parts[0] !== 'git') {
      outputText = `Command not recognized: "${raw}". Use git commands (e.g. "git status", "git log", "git commit").`;
      outputType = 'err';
    } else {
      const sub = parts[1]?.toLowerCase();
      switch (sub) {
        case 'status':
          outputText = `On branch ${activeBranch}\nStaged files: ${stagedFiles.length ? stagedFiles.join(', ') : 'none'}\nUnstaged files: ${unstagedFiles.length ? unstagedFiles.join(', ') : 'none'}`;
          break;
        case 'branch':
          outputText = `* ${activeBranch}\n  feature/krishimitra-ai\n  feature/gemini-rag\n  release/v2.0`;
          break;
        case 'log':
          outputText = commits
            .slice(0, 4)
            .map(c => `commit ${c.shortHash} (${c.branch})\nAuthor: ${c.author}\nDate:   ${c.date}\n\n    ${c.message}`)
            .join('\n\n');
          break;
        case 'checkout':
        case 'switch':
          if (parts[2]) {
            setActiveBranch(parts[2]);
            outputText = `Switched to branch '${parts[2]}'`;
          } else {
            outputText = 'Usage: git switch <branch-name>';
            outputType = 'err';
          }
          break;
        case 'add':
          if (parts[2] === '.' || parts[2] === '-A') {
            setStagedFiles(prev => [...prev, ...unstagedFiles]);
            setUnstagedFiles([]);
            outputText = 'Staged all changes.';
          } else {
            outputText = `Staged file: ${parts[2]}`;
          }
          break;
        case 'commit':
          const msgMatch = raw.match(/-m\s+["'](.+?)["']/);
          if (msgMatch && msgMatch[1]) {
            setCommitMessage(msgMatch[1]);
            outputText = `[${activeBranch} abc1234] ${msgMatch[1]}\n Files committed to local git history.`;
          } else {
            outputText = 'Usage: git commit -m "your message"';
            outputType = 'err';
          }
          break;
        case 'diff':
          outputText = selectedCommit.diff
            .map(d => `diff --git a/${d.file} b/${d.file}\nindex 1234..5678 100644\n--- a/${d.file}\n+++ b/${d.file}`)
            .join('\n\n');
          break;
        case 'remote':
          outputText = `origin  https://github.com/abhishekkuntare/portfolio-os.git (fetch)\norigin  https://github.com/abhishekkuntare/portfolio-os.git (push)`;
          break;
        case 'help':
        default:
          outputText = `Git Developer Simulation\nAvailable commands: git status, git log, git branch, git switch <name>, git add ., git commit -m "...", git diff, git remote -v`;
          break;
      }
    }

    setTerminalLines(prev => [...prev, newCmd, { id: `out-${Date.now()}`, text: outputText, type: outputType }]);
    setTerminalInput('');
  };

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 select-none overflow-hidden font-sans">
      {/* Top Header & Workstation Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
            <GitBranch className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Abhishek Git Studio</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400">
                Simulated Repo
              </span>
            </div>
            <p className="text-[11px] text-slate-400">repo: abhishekkuntare/portfolio-os • local master</p>
          </div>
        </div>

        {/* Branch Selector & Tab Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-xs">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={activeBranch}
              onChange={e => setActiveBranch(e.target.value)}
              className="bg-transparent text-slate-200 font-mono text-xs outline-hidden cursor-pointer"
            >
              <option value="main" className="bg-slate-900 text-white">main</option>
              <option value="feature/krishimitra-ai" className="bg-slate-900 text-white">feature/krishimitra-ai</option>
              <option value="feature/gemini-rag" className="bg-slate-900 text-white">feature/gemini-rag</option>
              <option value="release/v2.0" className="bg-slate-900 text-white">release/v2.0</option>
            </select>
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'graph' ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Graph & Log
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('staging')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'staging' ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Changes</span>
              {stagedFiles.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {stagedFiles.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'terminal' ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Git Shell
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport depending on active tab */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'graph' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Commit History Timeline (Left Column) */}
            <div className="w-full md:w-1/2 border-r border-white/10 flex flex-col bg-slate-950 overflow-y-auto">
              <div className="px-3 py-2 bg-slate-900/60 border-b border-white/5 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>COMMIT TIMELINE ({commits.length})</span>
                <span className="font-mono text-slate-500">{activeBranch}</span>
              </div>
              <div className="p-3 space-y-2">
                {commits.map((commit, idx) => {
                  const isSelected = commit.hash === selectedCommitHash;
                  return (
                    <div
                      key={commit.hash}
                      onClick={() => setSelectedCommitHash(commit.hash)}
                      className={`relative flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-sky-500/10 border-sky-500/40 shadow-sm'
                          : 'bg-slate-900/50 border-white/5 hover:bg-slate-900 hover:border-white/15'
                      }`}
                    >
                      {/* Visual git node dot */}
                      <div className="relative flex flex-col items-center shrink-0 pt-1">
                        <div
                          className={`w-3 h-3 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'bg-sky-400 border-sky-200 ring-4 ring-sky-500/20'
                              : 'bg-slate-800 border-amber-400'
                          }`}
                        />
                        {idx !== commits.length - 1 && (
                          <div className="w-0.5 h-12 bg-white/10 my-0.5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-sky-400">
                            {commit.shortHash}
                          </span>
                          {commit.tags?.map(t => (
                            <span
                              key={t}
                              className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            >
                              {t}
                            </span>
                          ))}
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 ml-auto">
                            <Clock className="w-3 h-3" />
                            {commit.date}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-white line-clamp-1 mb-1">
                          {commit.message}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {commit.author}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commit Diff & Details (Right Column) */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-900/30 overflow-y-auto">
              <div className="px-4 py-3 bg-slate-900/80 border-b border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Commit Detail</span>
                  <button
                    type="button"
                    onClick={() => copyHash(selectedCommit.hash)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                  >
                    {copiedHash === selectedCommit.hash ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{selectedCommit.shortHash}</span>
                      </>
                    )}
                  </button>
                </div>
                <h2 className="text-sm font-bold text-slate-100 leading-snug">
                  {selectedCommit.message}
                </h2>
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>Author: {selectedCommit.author}</span>
                  <span>Date: {selectedCommit.date}</span>
                </div>
              </div>

              {/* Diff View */}
              <div className="p-4 space-y-4">
                <div className="text-xs font-semibold text-slate-400">
                  CHANGED FILES ({selectedCommit.diff.length})
                </div>
                {selectedCommit.diff.map(fileDiff => (
                  <div key={fileDiff.file} className="rounded-xl border border-white/10 bg-slate-950 overflow-hidden text-xs font-mono">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-slate-200 font-medium">{fileDiff.file}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-400 font-bold">+{fileDiff.additions}</span>
                        <span className="text-rose-400 font-bold">-{fileDiff.deletions}</span>
                      </div>
                    </div>
                    <div className="p-3 space-y-1 overflow-x-auto text-[11px] leading-relaxed">
                      {fileDiff.hunks.map((hunk, i) => (
                        <div
                          key={i}
                          className={`px-2 py-0.5 rounded ${
                            hunk.type === 'add'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : hunk.type === 'del'
                              ? 'bg-rose-500/15 text-rose-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {hunk.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staging' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
            {/* Staging Lists */}
            <div className="w-full md:w-3/5 flex flex-col gap-4 overflow-y-auto">
              {/* Staged Changes */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-slate-900/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>STAGED CHANGES ({stagedFiles.length})</span>
                  </span>
                  {stagedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setUnstagedFiles(prev => [...prev, ...stagedFiles]);
                        setStagedFiles([]);
                      }}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Unstage All
                    </button>
                  )}
                </div>
                {stagedFiles.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No changes staged for commit.</p>
                ) : (
                  <div className="space-y-1.5">
                    {stagedFiles.map(file => (
                      <div
                        key={file}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-emerald-500/20 text-xs"
                      >
                        <span className="font-mono text-emerald-300">{file}</span>
                        <button
                          type="button"
                          onClick={() => handleUnstage(file)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                        >
                          Unstage -
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unstaged Changes */}
              <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>CHANGES NOT STAGED ({unstagedFiles.length})</span>
                  </span>
                  {unstagedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setStagedFiles(prev => [...prev, ...unstagedFiles]);
                        setUnstagedFiles([]);
                      }}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      Stage All +
                    </button>
                  )}
                </div>
                {unstagedFiles.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">Working tree clean.</p>
                ) : (
                  <div className="space-y-1.5">
                    {unstagedFiles.map(file => (
                      <div
                        key={file}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-white/5 text-xs"
                      >
                        <span className="font-mono text-slate-300">{file}</span>
                        <button
                          type="button"
                          onClick={() => handleStage(file)}
                          className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px]"
                        >
                          Stage +
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Commit Message Box */}
            <div className="w-full md:w-2/5 p-4 rounded-xl border border-white/10 bg-slate-900/80 flex flex-col">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Commit Composer</h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Author: Abhishek Kuntare &lt;abhishekkuntare02@gmail.com&gt;
              </p>
              <textarea
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                placeholder="feat(ui): add new portfolio capability..."
                rows={5}
                className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none mb-4"
              />
              <button
                type="button"
                onClick={handleCreateCommit}
                disabled={!commitMessage.trim() || stagedFiles.length === 0}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <GitCommit className="w-4 h-4" />
                <span>Commit to {activeBranch}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="flex-1 flex flex-col bg-slate-950 font-mono text-xs p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-2 mb-3">
              <div className="text-slate-500 text-[11px] mb-2">
                Abhishek Git Terminal v3.0 • Type "git help" for supported commands
              </div>
              {terminalLines.map(line => (
                <div key={line.id}>
                  {line.type === 'cmd' ? (
                    <div className="text-sky-400 font-bold flex items-center gap-1.5">
                      <span className="text-slate-500">$</span>
                      <span>{line.text}</span>
                    </div>
                  ) : (
                    <div
                      className={`whitespace-pre-wrap pl-3 leading-relaxed ${
                        line.type === 'err' ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      {line.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-sky-400 font-bold">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="git status, git log, git branch, git commit -m '...'"
                className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 outline-none text-xs font-mono"
              />
            </form>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-1.5 bg-slate-900/90 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>branch: {activeBranch}</span>
          </span>
          <span>•</span>
          <span>remote: origin/main (up to date)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span>Git v2.44 Emulation</span>
        </div>
      </div>
    </div>
  );
};
