import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useOS } from '../../context/OSContext';
import { PROFILE_INFO } from '../../data/initialData';
import { getAllVFSFiles } from '../../lib/vfs';

import {
  Terminal as TerminalIcon,
  ChevronDown,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Circle,
  Trash2,
  Command,
  Monitor,
  FolderOpen,
  Github,
  ExternalLink,
} from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  text: string;
}

type ShellType = 'powershell' | 'cmd' | 'bash' | 'zsh';

interface ShellFile {
  path: string;
  name: string;
  content: string;
  size: number;
  extension?: string;
}

const SHELL_PROMPTS: Record<ShellType, string> = {
  powershell: 'PS C:\\Users\\Abhishek>',
  cmd: 'C:\\Users\\Abhishek>',
  bash: 'abhishek@portfolio:~$',
  zsh: 'abhishek@portfolio ~ %',
};

const SHELL_LABELS: Record<ShellType, string> = {
  powershell: 'PowerShell',
  cmd: 'Command Prompt',
  bash: 'Bash',
  zsh: 'zsh',
};

const INITIAL_PATHS = [
  'C:\\Users\\Abhishek',
  'C:\\Users\\Abhishek\\Desktop',
  'C:\\Users\\Abhishek\\Documents',
  'C:\\Users\\Abhishek\\Downloads',
  'C:\\Users\\Abhishek\\Projects',
  'C:\\Users\\Abhishek\\Portfolio',
];

const COMMON_COMMANDS = [
  'help',
  'neofetch',
  'ls',
  'dir',
  'pwd',
  'cd',
  'cat',
  'type',
  'echo',
  'clear',
  'history',
  'whoami',
  'systeminfo',
  'ipconfig',
  'ping',
  'tasklist',
  'git status',
  'npm --version',
  'projects',
  'skills',
  'experience',
  'resume',
  'contact',
];

const normalizePath = (path: string) => {
  return path
    .replace(/\//g, '\\')
    .replace(/\\+/g, '\\')
    .replace(/\\$/, '');
};

const splitCommand = (command: string): string[] => {
  const matches = command.match(/"[^"]*"|'[^']*'|\S+/g);
  return matches ? matches.map(item => item.replace(/^["']|["']$/g, '')) : [];
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const TerminalApp: React.FC = () => {
  const {
    projects,
    skills,
    experiences,
    education,
    openApp,
  } = useOS();

  const [shell, setShell] = useState<ShellType>('powershell');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [currentPath, setCurrentPath] = useState(
    'C:\\Users\\Abhishek\\Portfolio'
  );

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'welcome',
      type: 'info',
      text:
        'Microsoft Windows [Version 11.0.22621]\n' +
        '(c) Abhishek Kuntare Developer Workstation. All rights reserved.\n\n' +
        'Abhishek OS Terminal initialized successfully.\n' +
        'Type "help" to see available commands.',
    },
  ]);

  const [vfsFiles, setVfsFiles] = useState<ShellFile[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [copied, setCopied] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  /*
   * ---------------------------------------------------------
   * Load Virtual File System
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const files = await getAllVFSFiles();

        const mapped: ShellFile[] = files
          .filter(file => !file.deletedAt)
          .map(file => ({
            path: file.path,
            name: file.name,
            content:
              typeof file.content === 'string'
                ? file.content
                : '[Binary file]',
            size: file.size || 0,
            extension: file.extension,
          }));

        setVfsFiles(mapped);
      } catch (error) {
        console.warn('Unable to load VFS:', error);
      }
    };

    loadFiles();
  }, []);

  /*
   * ---------------------------------------------------------
   * Auto scroll
   * ---------------------------------------------------------
   */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [lines]);

  /*
   * ---------------------------------------------------------
   * Focus terminal
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const focus = () => inputRef.current?.focus();

    window.addEventListener('click', focus);

    return () => {
      window.removeEventListener('click', focus);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Add terminal line
   * ---------------------------------------------------------
   */

  const addLine = useCallback(
    (
      type: TerminalLine['type'],
      text: string
    ) => {
      setLines(prev => [
        ...prev,
        {
          id: `${type}-${Date.now()}-${Math.random()}`,
          type,
          text,
        },
      ]);
    },
    []
  );

  /*
   * ---------------------------------------------------------
   * File system helpers
   * ---------------------------------------------------------
   */

  const currentUnixPath = useMemo(() => {
    return currentPath
      .replace(/^C:\\Users\\Abhishek/, '~')
      .replace(/\\/g, '/');
  }, [currentPath]);

  const getDirectoryFiles = (path: string) => {
    const normalized = normalizePath(path).toLowerCase();

    return vfsFiles.filter(file => {
      const filePath = normalizePath(file.path).toLowerCase();

      return (
        filePath.startsWith(normalized) ||
        filePath.includes(normalized)
      );
    });
  };

  /*
   * ---------------------------------------------------------
   * Help
   * ---------------------------------------------------------
   */

  const showHelp = () => {
    return `
ABHISHEK OS TERMINAL
=====================

FILE & DIRECTORY COMMANDS
-------------------------
ls                  List files
dir                 Windows directory listing
pwd                 Print working directory
cd <dir>            Change directory
cd ..               Go to parent directory
cd ~                Go to home directory
tree                Display directory tree
cat <file>          Display file contents
type <file>         Windows equivalent of cat
more <file>         Display file contents
head <file>         Display first lines
tail <file>         Display last lines
touch <file>        Create virtual file
mkdir <dir>         Create virtual directory
cp <src> <dest>     Copy file
copy <src> <dest>   Windows copy
mv <src> <dest>     Move file
move <src> <dest>   Windows move
rm <file>           Remove virtual file
del <file>          Windows delete
erase <file>        Windows delete

TEXT COMMANDS
-------------
echo <text>         Print text
printf <text>       Print formatted text
grep <text>         Search text
find <text>         Search text
findstr <text>      Windows text search
wc                  Count lines/words
history             Command history
clear               Clear terminal
cls                 Clear terminal

SYSTEM COMMANDS
---------------
whoami              Current user
hostname            Computer hostname
ver                 Windows version
uname -a            Unix system information
systeminfo          System information
neofetch            Developer system dashboard
env                 Environment variables
set                 Windows environment variables
which <command>     Find command
where <command>     Windows command locator
date                Current date
time                Current time

NETWORK COMMANDS
----------------
ipconfig            Windows network configuration
ipconfig /all       Detailed network configuration
ifconfig            Unix network configuration
ping <host>         Simulated network ping
nslookup <host>     DNS lookup
tracert <host>      Windows traceroute
traceroute <host>   Unix traceroute
netstat             Network connections

PROCESS COMMANDS
----------------
tasklist            Windows processes
taskmgr             Task Manager
ps                  Unix processes
top                 Process monitor
kill <pid>          Simulated process termination

DEVELOPMENT
-----------
git status
git log
git branch
git diff
git remote -v

node --version
npm --version
npm run portfolio
python --version
pip --version

PORTFOLIO COMMANDS
------------------
about               About Abhishek
projects            List projects
skills              Technical skills
experience          Work experience
education           Education
certifications      Certifications
contact             Contact information
resume              Open resume
browser             Open browser
youtube             Open YouTube
spotify             Open Spotify
github              Open GitHub

PORTFOLIO EASTER EGGS
---------------------
sudo hire abhishek
42
coffee

KEYBOARD SHORTCUTS
------------------
↑ / ↓               Command history
Tab                 Autocomplete
Ctrl + L            Clear terminal
Ctrl + C            Cancel command
Ctrl + U            Clear input
`;
  };

  /*
   * ---------------------------------------------------------
   * Neofetch
   * ---------------------------------------------------------
   */

  const showNeofetch = () => {
    return `
       ███████████
     ███████████████
   ██████       ██████
  █████   █████   █████
  █████   █████   █████
  █████   █████   █████
   ██████       ██████
     ███████████████
       ███████████

  ABHISHEK OS
  ------------------------------
  OS:           Windows 11 Web
  Shell:        ${SHELL_LABELS[shell]}
  Host:         Abhishek-Workstation
  User:         Abhishek
  Architecture: x86_64
  Runtime:      Browser Sandbox
  Framework:    React + TypeScript
  Build Tool:   Vite
  UI:           Tailwind CSS
  Animation:    Motion
  Projects:     ${projects.length}
  Experience:   2+ Years
  Status:       Open to Opportunities
  Storage:      Virtual File System
  Location:     ${PROFILE_INFO.location}
  Uptime:       Active Session
`;
  };

  /*
   * ---------------------------------------------------------
   * Command execution
   * ---------------------------------------------------------
   */

  const executeCommand = async (rawCommand: string) => {
    const trimmed = rawCommand.trim();

    if (!trimmed) return;

    setIsRunning(true);

    const commandId = `command-${Date.now()}`;

    setLines(prev => [
      ...prev,
      {
        id: commandId,
        type: 'command',
        text: `${SHELL_PROMPTS[shell]} ${trimmed}`,
      },
    ]);

    setHistory(prev => {
      const next = [trimmed, ...prev.filter(item => item !== trimmed)];
      return next.slice(0, 100);
    });

    setHistoryIndex(-1);

    await sleep(80);

    const args = splitCommand(trimmed);
    const command = (args[0] || '').toLowerCase();
    const rest = args.slice(1);
    const subCommand = rest.join(' ');

    /*
     * aliases
     */

    const aliases: Record<string, string> = {
      cls: 'clear',
      dir: 'ls',
      type: 'cat',
      copy: 'cp',
      move: 'mv',
      erase: 'rm',
      del: 'rm',
      ifconfig: 'ipconfig',
      python3: 'python',
      py: 'python',
      grep: 'grep',
      findstr: 'grep',
      open: 'explorer',
    };

    const resolvedCommand = aliases[command] || command;

    /*
     * clear
     */

    if (resolvedCommand === 'clear') {
      setLines([]);
      setIsRunning(false);
      return;
    }

    /*
     * help
     */

    if (
      resolvedCommand === 'help' ||
      resolvedCommand === 'man'
    ) {
      addLine('output', showHelp());
      setIsRunning(false);
      return;
    }

    /*
     * neofetch
     */

    if (
      resolvedCommand === 'neofetch' ||
      resolvedCommand === 'fastfetch'
    ) {
      addLine('success', showNeofetch());
      setIsRunning(false);
      return;
    }

    /*
     * pwd
     */

    if (resolvedCommand === 'pwd') {
      addLine('output', shell === 'cmd' ? currentPath : currentUnixPath);
      setIsRunning(false);
      return;
    }

    /*
     * cd
     */

    if (resolvedCommand === 'cd') {
      const target = rest.join(' ') || '~';

      if (
        target === '~' ||
        target === '/' ||
        target.toLowerCase() === 'home'
      ) {
        setCurrentPath('C:\\Users\\Abhishek');
        addLine('output', 'C:\\Users\\Abhishek');
        setIsRunning(false);
        return;
      }

      if (target === '..') {
        const parts = currentPath.split('\\');

        if (parts.length > 1) {
          parts.pop();
        }

        const next = parts.join('\\');

        setCurrentPath(next);
        addLine('output', next);
        setIsRunning(false);
        return;
      }

      const cleanTarget = target.replace(/^["']|["']$/g, '');

      const nextPath = normalizePath(
        cleanTarget.includes(':')
          ? cleanTarget
          : `${currentPath}\\${cleanTarget}`
      );

      setCurrentPath(nextPath);

      addLine('output', nextPath);

      if (
        cleanTarget.toLowerCase().includes('project')
      ) {
        openApp('projects');
      }

      setIsRunning(false);
      return;
    }

    /*
     * ls / dir
     */

    if (resolvedCommand === 'ls') {
      const files = getDirectoryFiles(currentPath);

      if (files.length === 0) {
        addLine(
          'output',
          `Directory of ${currentPath}\n\nNo virtual files found.`
        );
      } else {
        const output = files
          .slice(0, 50)
          .map(file => {
            return `${file.name.padEnd(32)} ${formatBytes(file.size).padStart(10)}`;
          })
          .join('\n');

        addLine(
          'output',
          `Directory of ${currentPath}\n\n${output}`
        );
      }

      setIsRunning(false);
      return;
    }

    /*
     * tree
     */

    if (resolvedCommand === 'tree') {
      addLine(
        'output',
        `
C:\\Users\\Abhishek\\Portfolio
├── Projects
├── Experience
├── Skills
├── Education
├── Resume
├── Certificates
├── public
└── src
    ├── components
    ├── apps
    ├── context
    ├── data
    └── lib
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * cat / type / more
     */

    if (
      resolvedCommand === 'cat' ||
      resolvedCommand === 'more'
    ) {
      const filename = rest.join(' ').toLowerCase();

      if (!filename) {
        addLine(
          'error',
          'cat: missing file operand'
        );

        setIsRunning(false);
        return;
      }

      const file = vfsFiles.find(item => {
        return (
          item.name.toLowerCase() === filename ||
          item.path.toLowerCase().endsWith(filename)
        );
      });

      if (file) {
        addLine('output', file.content);
      } else if (filename.includes('resume')) {
        addLine(
          'output',
          `
ABHISHEK KUNTARE
Software Developer

React.js • Next.js • TypeScript • Node.js • AI

Status: Open to opportunities.
`
        );

        openApp('resume');
      } else if (filename.includes('package.json')) {
        addLine(
          'output',
          `{
  "name": "abhishek-os",
  "version": "2.0.0",
  "private": true,
  "framework": "React + Vite",
  "language": "TypeScript"
}`
        );
      } else {
        addLine(
          'error',
          `${command}: ${rest[0]}: No such file or directory`
        );
      }

      setIsRunning(false);
      return;
    }

    /*
     * head / tail
     */

    if (
      resolvedCommand === 'head' ||
      resolvedCommand === 'tail'
    ) {
      const filename = rest[0]?.toLowerCase();

      const file = vfsFiles.find(item =>
        item.name.toLowerCase() === filename
      );

      if (!file) {
        addLine(
          'error',
          `${resolvedCommand}: ${filename || ''}: No such file`
        );
      } else {
        const contentLines = file.content.split('\n');

        const result =
          resolvedCommand === 'head'
            ? contentLines.slice(0, 10)
            : contentLines.slice(-10);

        addLine('output', result.join('\n'));
      }

      setIsRunning(false);
      return;
    }

    /*
     * echo
     */

    if (
      resolvedCommand === 'echo' ||
      resolvedCommand === 'printf'
    ) {
      addLine('output', subCommand);
      setIsRunning(false);
      return;
    }

    /*
     * history
     */

    if (resolvedCommand === 'history') {
      if (history.length === 0) {
        addLine('output', 'No commands in history.');
      } else {
        addLine(
          'output',
          history
            .slice()
            .reverse()
            .map((item, index) => `${index + 1}  ${item}`)
            .join('\n')
        );
      }

      setIsRunning(false);
      return;
    }

    /*
     * whoami
     */

    if (resolvedCommand === 'whoami') {
      addLine(
        'success',
        'abhishek\\portfolio (Software Developer)'
      );

      setIsRunning(false);
      return;
    }

    /*
     * hostname
     */

    if (resolvedCommand === 'hostname') {
      addLine(
        'output',
        'ABHISHEK-WORKSTATION'
      );

      setIsRunning(false);
      return;
    }

    /*
     * ver
     */

    if (resolvedCommand === 'ver') {
      addLine(
        'output',
        'Microsoft Windows [Version 11.0.22621]'
      );

      setIsRunning(false);
      return;
    }

    /*
     * uname
     */

    if (resolvedCommand === 'uname') {
      addLine(
        'output',
        'AbhishekOS 11.0.22621 x86_64 React-Web'
      );

      setIsRunning(false);
      return;
    }

    /*
     * systeminfo
     */

    if (resolvedCommand === 'systeminfo') {
      addLine(
        'output',
        `
Host Name:                 ABHISHEK-WORKSTATION
OS Name:                   Microsoft Windows 11
OS Version:                11.0.22621
System Manufacturer:       Abhishek Developer Workstation
System Type:               x64-based system
Processor:                 Web Runtime CPU
Memory:                    Browser Managed
Network:                   Connected
Terminal:                  ${SHELL_LABELS[shell]}
React Version:             19
Build Tool:                Vite
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * ipconfig
     */

    if (resolvedCommand === 'ipconfig') {
      addLine(
        'output',
        `
Windows IP Configuration

Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . :
   IPv4 Address. . . . . . . . . . . : 192.168.1.24
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Virtual adapter Portfolio Network:

   IPv4 Address. . . . . . . . . . . : 127.0.0.1
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * ping
     */

    if (resolvedCommand === 'ping') {
      const host = rest[0] || 'google.com';

      addLine(
        'output',
        `
Pinging ${host} with 32 bytes of data:

Reply from ${host}: bytes=32 time=18ms TTL=117
Reply from ${host}: bytes=32 time=21ms TTL=117
Reply from ${host}: bytes=32 time=17ms TTL=117
Reply from ${host}: bytes=32 time=19ms TTL=117

Ping statistics for ${host}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * nslookup
     */

    if (resolvedCommand === 'nslookup') {
      const host = rest[0] || 'google.com';

      addLine(
        'output',
        `
Server:  resolver.portfolio
Address:  192.168.1.1

Non-authoritative answer:
Name:    ${host}
Address: 142.250.72.14
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * tracert / traceroute
     */

    if (
      resolvedCommand === 'tracert' ||
      resolvedCommand === 'traceroute'
    ) {
      const host = rest[0] || 'google.com';

      addLine(
        'output',
        `
Tracing route to ${host}

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     8 ms     9 ms     8 ms  gateway
  3    15 ms    16 ms    15 ms  isp-network
  4    21 ms    19 ms    20 ms  ${host}

Trace complete.
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * netstat
     */

    if (resolvedCommand === 'netstat') {
      addLine(
        'output',
        `
Active Connections

Proto  Local Address          Foreign Address        State
TCP    127.0.0.1:5173         127.0.0.1:443         ESTABLISHED
TCP    192.168.1.24:5173      remote:https          ESTABLISHED
TCP    192.168.1.24:443       remote:https          ESTABLISHED
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * processes
     */

    if (
      resolvedCommand === 'tasklist' ||
      resolvedCommand === 'ps' ||
      resolvedCommand === 'top'
    ) {
      addLine(
        'output',
        `
Image Name              PID       CPU
---------------------------------------
AbhishekOS.exe          1024      0.4%
explorer.exe            1328      0.8%
terminal.exe            2216      0.6%
chrome.exe              3020      4.2%
code.exe                4128      2.1%
vite.exe                5144      1.3%
node.exe                5260      0.9%
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * taskmgr
     */

    if (resolvedCommand === 'taskmgr') {
      addLine(
        'info',
        'Opening Task Manager...'
      );

      setIsRunning(false);
      return;
    }

    /*
     * kill
     */

    if (resolvedCommand === 'kill') {
      addLine(
        'success',
        `Process ${rest[0] || 'unknown'} terminated in virtual environment.`
      );

      setIsRunning(false);
      return;
    }

    /*
     * date
     */

    if (resolvedCommand === 'date') {
      addLine(
        'output',
        new Date().toString()
      );

      setIsRunning(false);
      return;
    }

    /*
     * time
     */

    if (resolvedCommand === 'time') {
      addLine(
        'output',
        new Date().toLocaleTimeString()
      );

      setIsRunning(false);
      return;
    }

    /*
     * env / set
     */

    if (
      resolvedCommand === 'env' ||
      resolvedCommand === 'set'
    ) {
      addLine(
        'output',
        `
USER=Abhishek
HOME=C:\\Users\\Abhishek
SHELL=${SHELL_LABELS[shell]}
TERM=abhishek-terminal
NODE_ENV=production
PORTFOLIO_ENV=cloud
VITE=true
REACT=true
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * which / where
     */

    if (
      resolvedCommand === 'which' ||
      resolvedCommand === 'where'
    ) {
      const target = rest[0] || 'node';

      addLine(
        'output',
        `C:\\Program Files\\${target}\\${target}.exe`
      );

      setIsRunning(false);
      return;
    }

    /*
     * mkdir
     */

    if (resolvedCommand === 'mkdir') {
      addLine(
        'success',
        `Directory created: ${rest[0] || 'NewFolder'}`
      );

      setIsRunning(false);
      return;
    }

    /*
     * touch
     */

    if (resolvedCommand === 'touch') {
      addLine(
        'success',
        `Created virtual file: ${rest[0] || 'newfile.txt'}`
      );

      setIsRunning(false);
      return;
    }

    /*
     * rm
     */

    if (resolvedCommand === 'rm') {
      addLine(
        'success',
        `Removed virtual file: ${rest[0] || 'file'}`
      );

      setIsRunning(false);
      return;
    }

    /*
     * cp
     */

    if (resolvedCommand === 'cp') {
      addLine(
        'success',
        `Copied ${rest[0] || 'source'} → ${rest[1] || 'destination'}`
      );

      setIsRunning(false);
      return;
    }

    /*
     * mv
     */

    if (resolvedCommand === 'mv') {
      addLine(
        'success',
        `Moved ${rest[0] || 'source'} → ${rest[1] || 'destination'}`
      );

      setIsRunning(false);
      return;
    }

    /*
     * grep / findstr
     */

    if (resolvedCommand === 'grep') {
      addLine(
        'output',
        `Searching virtual filesystem for "${subCommand}"...\n\nNo additional matches found.`
      );

      setIsRunning(false);
      return;
    }

    /*
     * wc
     */

    if (resolvedCommand === 'wc') {
      addLine(
        'output',
        'Virtual filesystem: 0 lines, 0 words'
      );

      setIsRunning(false);
      return;
    }

    /*
     * Git
     */

    if (resolvedCommand === 'git') {
      const gitCommand = rest.join(' ').toLowerCase();

      if (gitCommand === 'status') {
        addLine(
          'success',
          `
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/apps/TerminalApp.tsx

nothing else to commit.

Working tree clean enough for production.
`
        );
      } else if (gitCommand === 'log') {
        addLine(
          'output',
          `
commit a7f92d1
Author: Abhishek Kuntare
Date:   2026

feat: improve Windows Terminal experience

commit 93bd12a
Author: Abhishek Kuntare
Date:   2026

feat: add portfolio operating system

commit 4219aa8
Author: Abhishek Kuntare
Date:   2026

feat: add interactive developer workstation
`
        );
      } else if (gitCommand === 'branch') {
        addLine(
          'output',
          `
* main
  development
  feature/terminal
`
        );
      } else if (gitCommand === 'diff') {
        addLine(
          'output',
          'No differences in virtual working tree.'
        );
      } else if (gitCommand === 'remote -v') {
        addLine(
          'output',
          `
origin  https://github.com/Abhishekkuntare/abhishek-os (fetch)
origin  https://github.com/Abhishekkuntare/abhishek-os (push)
`
        );
      } else {
        addLine(
          'error',
          `git: '${gitCommand}' is not a recognized command.`
        );
      }

      setIsRunning(false);
      return;
    }

    /*
     * npm
     */

    if (resolvedCommand === 'npm') {
      const npmCommand = rest.join(' ');

      if (
        npmCommand === '--version' ||
        npmCommand === '-v'
      ) {
        addLine('output', '11.6.0');
      } else if (
        npmCommand.includes('run portfolio') ||
        npmCommand.includes('run dev')
      ) {
        addLine(
          'success',
          `
> abhishek-os@2.0.0 portfolio
> vite

✓ VITE ready in 120ms

➜ Local:   http://localhost:5173/
➜ Network: use --host to expose
➜ Status:  All systems operational
`
        );
      } else if (npmCommand === 'install') {
        addLine(
          'success',
          'Dependencies already installed. 0 vulnerabilities found.'
        );
      } else {
        addLine(
          'output',
          `npm ${npmCommand || ''}\n\nCommand completed in virtual environment.`
        );
      }

      setIsRunning(false);
      return;
    }

    /*
     * node
     */

    if (resolvedCommand === 'node') {
      if (
        rest.includes('--version') ||
        rest.includes('-v')
      ) {
        addLine('output', 'v22.14.0');
      } else {
        addLine(
          'output',
          'Node.js interactive runtime simulated by Abhishek OS.'
        );
      }

      setIsRunning(false);
      return;
    }

    /*
     * python
     */

    if (resolvedCommand === 'python') {
      if (
        rest.includes('--version') ||
        rest.includes('-V')
      ) {
        addLine('output', 'Python 3.13.2');
      } else {
        addLine(
          'output',
          'Python 3.13.2 (Abhishek OS virtual runtime)'
        );
      }

      setIsRunning(false);
      return;
    }

    /*
     * pip
     */

    if (resolvedCommand === 'pip') {
      addLine(
        'output',
        'pip 25.0 from virtual-environment'
      );

      setIsRunning(false);
      return;
    }

    /*
     * Portfolio commands
     */

    if (resolvedCommand === 'about') {
      addLine(
        'output',
        `
NAME:     ${PROFILE_INFO.name}
ROLE:     ${PROFILE_INFO.role}
LOCATION: ${PROFILE_INFO.location}

${PROFILE_INFO.bio}
`
      );

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'projects') {
      const output = projects
        .map(
          (project, index) =>
            `[${String(index + 1).padStart(2, '0')}] ${
              project.title
            }
    Category: ${project.category}
    Year: ${project.year}
    Stack: ${project.technologies.join(', ')}
    ${project.short_description}`
        )
        .join('\n\n');

      addLine(
        'output',
        output || 'No projects found.'
      );

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'skills') {
      addLine(
        'output',
        skills
          .map(skill => `• ${skill.name} [${skill.category}]`)
          .join('\n')
      );

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'experience') {
      addLine(
        'output',
        experiences
          .map(
            experience =>
              `• ${experience.role} @ ${
                experience.company
              }\n  ${experience.start_date} – ${
                experience.end_date
              }\n  ${experience.location}\n  Tech: ${experience.technologies.join(
                ', '
              )}`
          )
          .join('\n\n')
      );

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'education') {
      addLine(
        'output',
        `
${education.institution}

${education.degree}
${education.field}

CGPA: ${education.cgpa}
${education.start_date} – ${education.end_date}
`
      );

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'certifications') {
      addLine(
        'info',
        'Opening Certifications Vault...'
      );

      openApp('certifications');

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'contact') {
      addLine(
        'output',
        `
Email:    ${PROFILE_INFO.email}
Phone:    ${PROFILE_INFO.phone}
GitHub:   ${PROFILE_INFO.github}
LinkedIn: ${PROFILE_INFO.linkedin}
`
      );

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'resume') {
      addLine(
        'success',
        'Launching Resume Viewer...'
      );

      openApp('resume');

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'browser') {
      addLine(
        'info',
        'Launching Abhishek Browser...'
      );

      openApp('browser');

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'youtube') {
      addLine(
        'info',
        'Launching YouTube Studio...'
      );

      openApp('youtube');

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'spotify') {
      addLine(
        'info',
        'Launching Spotify...'
      );

      openApp('spotify');

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'github') {
      addLine(
        'info',
        `Opening GitHub: ${PROFILE_INFO.github}`
      );

      window.open(
        PROFILE_INFO.github,
        '_blank',
        'noopener,noreferrer'
      );

      setIsRunning(false);
      return;
    }

    /*
     * code / notepad / explorer
     */

    if (
      resolvedCommand === 'code' ||
      resolvedCommand === 'notepad' ||
      resolvedCommand === 'explorer'
    ) {
      addLine(
        'info',
        `Launching ${resolvedCommand} in Abhishek OS...`
      );

      setIsRunning(false);
      return;
    }

    /*
     * Easter eggs
     */

    if (resolvedCommand === '42') {
      addLine(
        'success',
        '✨ The answer to life, the universe, and everything: 42.'
      );

      setIsRunning(false);
      return;
    }

    if (resolvedCommand === 'coffee') {
      addLine(
        'success',
        '☕ Coffee.exe started successfully. Developer productivity +100%.'
      );

      setIsRunning(false);
      return;
    }

    if (
      resolvedCommand === 'sudo' &&
      subCommand.toLowerCase() === 'hire abhishek'
    ) {
      addLine(
        'success',
        `
[sudo] recruiter privileges granted.

🚀 Hiring protocol initialized.

Candidate:
Abhishek Kuntare

Status:
READY FOR PRODUCTION

Recommendation:
HIRE ABHISHEK.
`
      );

      setIsRunning(false);
      return;
    }

    /*
     * sudo
     */

    if (resolvedCommand === 'sudo') {
      addLine(
        'error',
        `sudo: ${subCommand || 'command'}: permission denied`
      );

      setIsRunning(false);
      return;
    }

    /*
     * unknown command
     */

    addLine(
      'error',
      `${command}: command not found\nType "help" to see available commands.`
    );

    setIsRunning(false);
  };

  /*
   * ---------------------------------------------------------
   * Keyboard controls
   * ---------------------------------------------------------
   */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const value = input;

      setInput('');

      executeCommand(value);

      return;
    }

    /*
     * Arrow Up
     */

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (history.length === 0) return;

      const nextIndex = Math.min(
        historyIndex + 1,
        history.length - 1
      );

      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);

      return;
    }

    /*
     * Arrow Down
     */

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;

        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }

      return;
    }

    /*
     * Tab autocomplete
     */

    if (event.key === 'Tab') {
      event.preventDefault();

      const value = input.trim().toLowerCase();

      if (!value) return;

      const matches = COMMON_COMMANDS.filter(command =>
        command.toLowerCase().startsWith(value)
      );

      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        addLine(
          'info',
          matches.join('    ')
        );
      }

      return;
    }

    /*
     * Ctrl + L
     */

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === 'l'
    ) {
      event.preventDefault();
      setLines([]);
      return;
    }

    /*
     * Ctrl + U
     */

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === 'u'
    ) {
      event.preventDefault();
      setInput('');
      return;
    }

    /*
     * Ctrl + C
     */

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === 'c'
    ) {
      event.preventDefault();

      if (input) {
        addLine(
          'error',
          `${SHELL_PROMPTS[shell]} ${input}^C`
        );

        setInput('');
      }

      setIsRunning(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * Copy terminal output
   * ---------------------------------------------------------
   */

  const copyTerminal = async () => {
    const text = lines
      .map(line => line.text)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      console.warn('Clipboard unavailable');
    }
  };

  /*
   * ---------------------------------------------------------
   * Quick command
   * ---------------------------------------------------------
   */

  const runQuickCommand = (command: string) => {
    setShowCommandPalette(false);
    setInput('');
    executeCommand(command);
  };

  return (
    <div
      ref={terminalRef}
      className={`
        relative
        flex flex-col
        h-full w-full
        overflow-hidden
        bg-[#0b0d0f]
        text-slate-200
        font-mono
        select-none
        ${isMaximized ? 'rounded-none' : ''}
      `}
    >
      {/* =====================================================
          TOP WINDOW BAR
      ===================================================== */}

      <header
        className="
          h-11
          shrink-0
          flex items-center
          justify-between
          px-3
          bg-[#111315]
          border-b border-white/[0.08]
        "
      >
        {/* Left */}

        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              w-7 h-7
              rounded-md
              bg-sky-500/15
              border border-sky-400/20
              flex items-center justify-center
              shadow-[0_0_14px_rgba(56,189,248,0.12)]
            "
          >
            <TerminalIcon className="w-4 h-4 text-sky-400" />
          </div>

          <div className="flex flex-col leading-none min-w-0">
            <span className="text-[11px] font-semibold text-slate-200 truncate">
              {SHELL_LABELS[shell]}
            </span>

            <span className="text-[9px] text-slate-500 truncate">
              Abhishek OS Terminal
            </span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Center */}

        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          <div
            className="
              flex items-center gap-2
              px-3 py-1.5
              rounded-lg
              bg-white/[0.035]
              border border-white/[0.06]
            "
          >
            <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />

            <span className="text-[10px] text-slate-400">
              {currentPath}
            </span>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setShowCommandPalette(prev => !prev)
            }
            className="
              p-1.5 rounded-md
              text-slate-400
              hover:text-white
              hover:bg-white/[0.08]
              transition-colors
            "
            title="Command palette"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={copyTerminal}
            className="
              p-1.5 rounded-md
              text-slate-400
              hover:text-white
              hover:bg-white/[0.08]
              transition-colors
            "
            title="Copy terminal"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setIsMaximized(prev => !prev)
            }
            className="
              p-1.5 rounded-md
              text-slate-400
              hover:text-white
              hover:bg-white/[0.08]
              transition-colors
            "
            title="Maximize"
          >
            {isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* =====================================================
          TAB BAR
      ===================================================== */}

      <div
        className="
          h-9
          shrink-0
          flex items-center
          bg-[#0e1012]
          border-b border-white/[0.06]
          px-2
        "
      >
        <div
          className="
            h-8
            min-w-[190px]
            px-3
            flex items-center
            gap-2
            rounded-t-md
            bg-[#151719]
            border-x border-t border-white/[0.07]
          "
        >
          <TerminalIcon className="w-3.5 h-3.5 text-sky-400" />

          <span className="text-[10px] text-slate-300 flex-1">
            {SHELL_LABELS[shell]}
          </span>

          <button
            type="button"
            onClick={() => setLines([])}
            className="text-slate-500 hover:text-white"
            title="Clear"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          className="
            ml-1
            w-7 h-7
            rounded-md
            flex items-center justify-center
            text-slate-500
            hover:text-white
            hover:bg-white/[0.06]
          "
          title="New tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          {(
            Object.keys(SHELL_LABELS) as ShellType[]
          ).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setShell(type)}
              className={`
                px-2 py-1
                rounded-md
                text-[9px]
                transition-all
                ${
                  shell === type
                    ? 'bg-sky-500/15 text-sky-300'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
                }
              `}
            >
              {SHELL_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          COMMAND PALETTE
      ===================================================== */}

      {showCommandPalette && (
        <div
          className="
            absolute
            top-20
            right-3
            z-50
            w-72
            rounded-xl
            overflow-hidden
            border border-white/10
            bg-[#17191c]/95
            backdrop-blur-xl
            shadow-2xl
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
          "
        >
          <div className="p-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-sky-400" />

              <span className="text-[10px] font-semibold text-slate-300">
                Quick Commands
              </span>
            </div>
          </div>

          <div className="p-2 max-h-80 overflow-y-auto">
            {COMMON_COMMANDS.map(command => (
              <button
                key={command}
                type="button"
                onClick={() => runQuickCommand(command)}
                className="
                  w-full
                  px-2.5 py-2
                  rounded-md
                  text-left
                  text-[10px]
                  text-slate-400
                  hover:text-white
                  hover:bg-sky-500/10
                  transition-colors
                "
              >
                {command}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          TERMINAL CONTENT
      ===================================================== */}

      <main
        onClick={() => inputRef.current?.focus()}
        className="
          flex-1
          overflow-y-auto
          px-4
          sm:px-5
          py-4
          scrollbar-thin
          scrollbar-thumb-white/10
        "
      >
        <div className="max-w-6xl">
          {lines.map(line => (
            <div
              key={line.id}
              className={`
                whitespace-pre-wrap
                break-words
                leading-relaxed
                mb-2
                text-[11px]
                sm:text-xs
                ${
                  line.type === 'command'
                    ? 'text-sky-400 font-semibold'
                    : ''
                }
                ${
                  line.type === 'output'
                    ? 'text-slate-300'
                    : ''
                }
                ${
                  line.type === 'error'
                    ? 'text-red-400'
                    : ''
                }
                ${
                  line.type === 'success'
                    ? 'text-emerald-400'
                    : ''
                }
                ${
                  line.type === 'info'
                    ? 'text-slate-400'
                    : ''
                }
              `}
            >
              {line.text}
            </div>
          ))}

          {isRunning && (
            <div className="flex items-center gap-2 text-sky-400 text-[10px] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>Executing...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* =====================================================
          QUICK ACTION BAR
      ===================================================== */}

      <div
        className="
          shrink-0
          px-3
          py-2
          border-t border-white/[0.06]
          bg-[#0e1012]
          overflow-x-auto
        "
      >
        <div className="flex items-center gap-1.5">
          {[
            {
              label: 'Help',
              command: 'help',
              icon: Sparkles,
            },
            {
              label: 'Projects',
              command: 'projects',
              icon: FolderOpen,
            },
            {
              label: 'Skills',
              command: 'skills',
              icon: Monitor,
            },
            {
              label: 'Git',
              command: 'git status',
              icon: Github,
            },
            {
              label: 'Resume',
              command: 'resume',
              icon: ExternalLink,
            },
          ].map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.command}
                type="button"
                onClick={() =>
                  runQuickCommand(item.command)
                }
                className="
                  flex items-center
                  gap-1.5
                  px-2.5 py-1.5
                  rounded-md
                  border border-white/[0.06]
                  bg-white/[0.025]
                  text-[9px]
                  text-slate-400
                  hover:text-white
                  hover:bg-white/[0.07]
                  hover:border-sky-400/20
                  transition-all
                  whitespace-nowrap
                "
              >
                <Icon className="w-3 h-3" />

                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setLines([])}
            className="
              ml-auto
              flex items-center
              gap-1.5
              px-2.5 py-1.5
              rounded-md
              text-[9px]
              text-slate-500
              hover:text-red-400
              hover:bg-red-500/5
              transition-colors
            "
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      {/* =====================================================
          INPUT / PROMPT
      ===================================================== */}

      <footer
        className="
          shrink-0
          px-4
          py-3
          bg-[#0b0d0f]
          border-t border-white/[0.06]
        "
      >
        <div className="flex items-center gap-2">
          <span
            className="
              shrink-0
              text-[10px]
              sm:text-xs
              font-semibold
              text-sky-400
            "
          >
            {SHELL_PROMPTS[shell]}
          </span>

          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={isRunning}
            onChange={event =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="
              flex-1
              min-w-0
              bg-transparent
              outline-none
              border-none
              text-[10px]
              sm:text-xs
              text-white
              caret-sky-400
              placeholder:text-slate-700
            "
            placeholder="Type a command..."
          />

          {input && (
            <button
              type="button"
              onClick={() => {
                executeCommand(input);
                setInput('');
              }}
              className="
                shrink-0
                p-1.5
                rounded-md
                bg-sky-500
                text-slate-950
                hover:bg-sky-400
                transition-colors
              "
              title="Run command"
            >
              <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2 text-[8px] text-slate-600">
          <span>↑↓ History</span>
          <span>Tab Complete</span>
          <span>Ctrl+L Clear</span>
          <span>Ctrl+C Cancel</span>

          <span className="ml-auto flex items-center gap-1">
            <Circle className="w-1.5 h-1.5 fill-emerald-400 text-emerald-400" />
            Online
          </span>
        </div>
      </footer>
    </div>
  );
};