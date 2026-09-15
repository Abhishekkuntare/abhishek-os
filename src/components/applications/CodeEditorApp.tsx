

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useOS } from "../../context/OSContext";
import { VFSFile } from "../../types";

import {
  getAllVFSFiles,
  saveVFSFile,
  createVFSFile,
  deleteVFSFile,
} from "../../lib/vfs";

import { checkAndUnlockAchievement } from "../../lib/achievements";

import {
  Code2,
  FileCode2,
  FilePlus2,
  FolderOpen,
  Save,
  Play,
  Square,
  Terminal as TerminalIcon,
  GitBranch,
  Search,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronDown,
  X,
  RefreshCw,
  Sparkles,
  Bot,
  Wand2,
  Bug,
  Lightbulb,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Settings2,
  Command,
  Monitor,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  PanelLeft,
  PanelBottom,
  FileText,
  Keyboard,
  MoreHorizontal,
  PlayCircle,
  Circle,
  RotateCcw,
  Smartphone,
  Globe,
  TerminalSquare,
  SearchCode,
  GitCommitHorizontal,
  Folder,
  FolderClosed,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  Zap,
} from "lucide-react";

/* ==========================================================================
   TYPES
   ========================================================================== */

type EditorLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "cpp"
  | "c"
  | "java"
  | "html"
  | "css"
  | "json"
  | "markdown"
  | "text";

type SidebarTab =
  | "explorer"
  | "search"
  | "source-control";

interface EditorTab {
  path: string;
  name: string;
}

interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  output?: string;
  exitCode?: number;
  durationMs?: number;
}

interface AIResult {
  code?: string;
  text?: string;
  explanation?: string;
}

type PaletteAction = {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
};

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const LANGUAGE_BY_EXTENSION: Record<string, EditorLanguage> = {
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  java: "java",
  html: "html",
  htm: "html",
  css: "css",
  json: "json",
  md: "markdown",
  txt: "text",
};

const LANGUAGE_LABELS: Record<EditorLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  cpp: "C++",
  c: "C",
  java: "Java",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  markdown: "Markdown",
  text: "Plain Text",
};

const STARTER_FILES = [
  {
    path: "/Projects/hello.ts",
    name: "hello.ts",
    content: `const name: string = "Abhishek";

function greet(user: string): string {
  return \`Hello, \${user}!\`;
}

console.log(greet(name));
`,
  },
  {
    path: "/Projects/main.cpp",
    name: "main.cpp",
    content: `#include <iostream>
using namespace std;

int main() {
  int a, b;

  cout << "Enter two numbers: ";
  cin >> a >> b;

  cout << "Sum = " << a + b << endl;

  return 0;
}
`,
  },
  {
    path: "/Projects/main.py",
    name: "main.py",
    content: `a = int(input("Enter first number: "))
b = int(input("Enter second number: "))

print("Sum =", a + b)
`,
  },
  {
    path: "/Projects/index.html",
    name: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Abhishek Web Preview</title>

  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 40px;
      background: #0b1220;
      color: white;
    }

    button {
      padding: 10px 16px;
      border-radius: 8px;
      border: 0;
      cursor: pointer;
    }
  </style>
</head>

<body>
  <h1>Hello from Abhishek Code Studio</h1>
  <p>Edit this HTML and press Run.</p>

  <button onclick="sayHello()">
    Click me
  </button>

  <script>
    function sayHello() {
      alert("Hello from the browser preview!");
    }
  </script>
</body>
</html>
`,
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getExtension(path: string) {
  const parts = path.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function detectLanguage(path: string): EditorLanguage {
  return LANGUAGE_BY_EXTENSION[getExtension(path)] || "text";
}

function normalizePath(path: string) {
  if (!path) return "/";
  if (!path.startsWith("/")) return `/${path}`;

  return path
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/");
}

function dirname(path: string) {
  const normalized = normalizePath(path);
  const index = normalized.lastIndexOf("/");

  if (index <= 0) return "/";

  return normalized.slice(0, index);
}

function basename(path: string) {
  return normalizePath(path).split("/").pop() || "";
}

function getFileIcon(path: string) {
  const language = detectLanguage(path);

  if (language === "html") return "HTML";
  if (language === "css") return "CSS";
  if (language === "javascript") return "JS";
  if (language === "typescript") return "TS";
  if (language === "python") return "PY";
  if (language === "cpp") return "C++";
  if (language === "c") return "C";
  if (language === "java") return "JAVA";
  if (language === "json") return "{}";
  if (language === "markdown") return "MD";

  return "TXT";
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

const CodeEditorApp: React.FC = () => {
  const { playSystemSound } = useOS();

  /* ------------------------------------------------------------------------
     REFS
  ------------------------------------------------------------------------ */

  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumberRef = useRef<HTMLDivElement | null>(null);
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);
  const terminalInputRef = useRef<HTMLInputElement | null>(null);
  const paletteInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const executionAbortRef = useRef<AbortController | null>(null);

  const resizeTargetRef = useRef<
    "sidebar" | "terminal" | "ai" | null
  >(null);

  /* ------------------------------------------------------------------------
     FILES
  ------------------------------------------------------------------------ */

  const [projectFiles, setProjectFiles] = useState<VFSFile[]>([]);
  const [fileContents, setFileContents] = useState<
    Record<string, string>
  >({});

  const [openTabs, setOpenTabs] = useState<EditorTab[]>([
    {
      path: "/Projects/hello.ts",
      name: "hello.ts",
    },
  ]);

  const [activeFilePath, setActiveFilePath] =
    useState("/Projects/hello.ts");

  const [isDirty, setIsDirty] = useState<
    Record<string, boolean>
  >({});

  /* ------------------------------------------------------------------------
     UI
  ------------------------------------------------------------------------ */

  const [sidebarTab, setSidebarTab] =
    useState<SidebarTab>("explorer");

  const [sidebarWidth, setSidebarWidth] =
    useState(270);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  const [isTerminalOpen, setIsTerminalOpen] =
    useState(true);

  const [terminalHeight, setTerminalHeight] =
    useState(245);

  const [isFullscreenEditor, setIsFullscreenEditor] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isPaletteOpen, setIsPaletteOpen] =
    useState(false);

  const [paletteQuery, setPaletteQuery] =
    useState("");

  const [showShortcuts, setShowShortcuts] =
    useState(false);

  const [showMoreMenu, setShowMoreMenu] =
    useState(false);

  /* ------------------------------------------------------------------------
     EDITOR
  ------------------------------------------------------------------------ */

  const [cursorPosition, setCursorPosition] = useState({
    line: 1,
    column: 1,
  });

  const [editorScrollTop, setEditorScrollTop] =
    useState(0);

  /* ------------------------------------------------------------------------
     TERMINAL
  ------------------------------------------------------------------------ */

  const [terminalLogs, setTerminalLogs] =
    useState<string[]>([
      "Abhishek Code Studio Terminal",
      "Virtual PowerShell • Developer Edition",
      "",
      "Type 'help' to see available commands.",
      "",
    ]);

  const [terminalCommand, setTerminalCommand] =
    useState("");

  const [commandHistory, setCommandHistory] =
    useState<string[]>([]);

  const [historyIndex, setHistoryIndex] =
    useState(-1);

  const [currentDirectory, setCurrentDirectory] =
    useState("/Projects");

  /* ------------------------------------------------------------------------
     EXECUTION
  ------------------------------------------------------------------------ */

  const [isRunning, setIsRunning] =
    useState(false);

  const [stdin, setStdin] =
    useState("");

  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);

  /* ------------------------------------------------------------------------
     AI
  ------------------------------------------------------------------------ */

  const [isAIOpen, setIsAIOpen] =
    useState(false);

  const [aiWidth, setAIWidth] =
    useState(390);

  const [aiPrompt, setAIPrompt] =
    useState("");

  const [isAILoading, setIsAILoading] =
    useState(false);

  const [aiResult, setAIResult] =
    useState<AIResult | null>(null);

  /* ------------------------------------------------------------------------
     PREVIEW
  ------------------------------------------------------------------------ */

  const [showPreview, setShowPreview] =
    useState(false);

  const [previewKey, setPreviewKey] =
    useState(0);

  /* ------------------------------------------------------------------------
     SOURCE CONTROL
  ------------------------------------------------------------------------ */

  const [commitMessage, setCommitMessage] =
    useState("");

  /* ==========================================================================
     DERIVED
     ========================================================================== */

  const activeContent =
    fileContents[activeFilePath] ?? "";

  const activeLanguage =
    detectLanguage(activeFilePath);

  const activeTab =
    openTabs.find(
      (tab) => tab.path === activeFilePath
    );

  const lineCount = Math.max(
    1,
    activeContent.split("\n").length
  );

  const virtualPathFiles = projectFiles.map(
    (file) => normalizePath(file.path)
  );

  /* ==========================================================================
     FILE REFRESH
     ========================================================================== */

  const refreshProjectFiles = useCallback(
    async () => {
      try {
        const files = await getAllVFSFiles();

        setProjectFiles(files);

        const contentMap: Record<
          string,
          string
        > = {};

        for (const file of files) {
          contentMap[
            normalizePath(file.path)
          ] = file.content || "";
        }

        setFileContents((previous) => ({
          ...contentMap,
          ...previous,
        }));
      } catch (error) {
        console.error(
          "Unable to load VFS:",
          error
        );
      }
    },
    []
  );

  useEffect(() => {
    void refreshProjectFiles();
  }, [refreshProjectFiles]);

  /* ==========================================================================
     STARTER FILES
     ========================================================================== */

  useEffect(() => {
    let cancelled = false;

    async function ensureStarterFiles() {
      try {
        const files = await getAllVFSFiles();

        if (cancelled) return;

        const existingPaths = new Set(
          files.map((file) =>
            normalizePath(file.path)
          )
        );

        const missing =
          STARTER_FILES.filter(
            (file) =>
              !existingPaths.has(file.path)
          );

        for (const file of missing) {
          try {
            await createVFSFile(
              dirname(file.path),
              file.name,
              file.content,
              getExtension(file.path),
              "text/plain"
            );
          } catch (error) {
            console.warn(
              `Could not create ${file.path}`,
              error
            );
          }
        }

        await refreshProjectFiles();

        setFileContents((previous) => {
          const next = { ...previous };

          for (const file of STARTER_FILES) {
            if (!(file.path in next)) {
              next[file.path] = file.content;
            }
          }

          return next;
        });
      } catch (error) {
        console.error(error);
      }
    }

    void ensureStarterFiles();

    return () => {
      cancelled = true;
    };
  }, [refreshProjectFiles]);

  /* ==========================================================================
     OPEN FILE
     ========================================================================== */

  const handleOpenFile = useCallback(
    async (file: VFSFile) => {
      const path = normalizePath(file.path);

      setFileContents((previous) => {
        if (path in previous) return previous;

        return {
          ...previous,
          [path]: file.content || "",
        };
      });

      setOpenTabs((previous) => {
        if (
          previous.some(
            (tab) => tab.path === path
          )
        ) {
          return previous;
        }

        return [
          ...previous,
          {
            path,
            name: basename(path),
          },
        ];
      });

      setActiveFilePath(path);

      playSystemSound("open");
    },
    [playSystemSound]
  );

  /* ==========================================================================
     CLOSE TAB
     ========================================================================== */

  const handleCloseTab = useCallback(
    (path: string) => {
      const dirty = isDirty[path];

      if (dirty) {
        const confirmed = window.confirm(
          `${basename(
            path
          )} has unsaved changes.\n\nClose anyway?`
        );

        if (!confirmed) return;
      }

      setOpenTabs((previous) => {
        const index =
          previous.findIndex(
            (tab) => tab.path === path
          );

        const next = previous.filter(
          (tab) => tab.path !== path
        );

        if (path === activeFilePath) {
          const nextTab =
            next[index] ||
            next[index - 1] ||
            next[0];

          setActiveFilePath(
            nextTab?.path || ""
          );
        }

        return next;
      });

      setIsDirty((previous) => {
        const next = { ...previous };
        delete next[path];
        return next;
      });
    },
    [activeFilePath, isDirty]
  );

  /* ==========================================================================
     EDITOR CHANGE
     ========================================================================== */

  const handleContentChange = useCallback(
    (value: string) => {
      if (!activeFilePath) return;

      setFileContents((previous) => ({
        ...previous,
        [activeFilePath]: value,
      }));

      setIsDirty((previous) => ({
        ...previous,
        [activeFilePath]: true,
      }));
    },
    [activeFilePath]
  );

  /* ==========================================================================
     CURSOR
     ========================================================================== */

  const updateCursorPosition = useCallback(
    (textarea: HTMLTextAreaElement) => {
      const beforeCursor = textarea.value.slice(
        0,
        textarea.selectionStart
      );

      const lines = beforeCursor.split("\n");

      setCursorPosition({
        line: lines.length,
        column:
          lines[lines.length - 1].length + 1,
      });
    },
    []
  );

  /* ==========================================================================
     SAVE
     ========================================================================== */

  const handleSaveCurrent = useCallback(
    async () => {
      if (!activeFilePath) return;

      const content =
        fileContents[activeFilePath] ?? "";

      try {
        await saveVFSFile({
          path: activeFilePath,
          content,
        } as any);

        setIsDirty((previous) => ({
          ...previous,
          [activeFilePath]: false,
        }));

        setProjectFiles((previous) =>
          previous.map((file) =>
            normalizePath(file.path) ===
            activeFilePath
              ? {
                  ...file,
                  content,
                }
              : file
          )
        );

        setTerminalLogs((previous) => [
          ...previous,
          `✓ Saved ${activeFilePath}`,
        ]);

        playSystemSound("notify");

        try {
          await checkAndUnlockAchievement(
            "code-editor"
          );
        } catch {
          // Achievement API is optional.
        }
      } catch (error) {
        console.error(error);

        setTerminalLogs((previous) => [
          ...previous,
          `✗ Failed to save ${activeFilePath}`,
        ]);
      }
    },
    [
      activeFilePath,
      fileContents,
      playSystemSound,
    ]
  );

  /* ==========================================================================
     NEW FILE
     ========================================================================== */

  const handleNewFile = async () => {
    const name = window.prompt(
      "Enter file name",
      "new-file.ts"
    );

    if (!name) return;

    const cleanName = name.trim();

    if (!cleanName) return;

    const path = `/Projects/${cleanName}`;

    if (
      projectFiles.some(
        (file) =>
          normalizePath(file.path) === path
      )
    ) {
      window.alert(
        "A file with this name already exists."
      );

      return;
    }

    try {
      await createVFSFile(
        "/Projects",
        cleanName,
        "",
        getExtension(cleanName),
        "text/plain"
      );

      await refreshProjectFiles();

      setFileContents((previous) => ({
        ...previous,
        [path]: "",
      }));

      setOpenTabs((previous) => [
        ...previous,
        {
          path,
          name: cleanName,
        },
      ]);

      setActiveFilePath(path);

      playSystemSound("open");
    } catch (error) {
      console.error(error);

      window.alert(
        "Unable to create the file."
      );
    }
  };

  /* ==========================================================================
     DELETE
     ========================================================================== */

  const handleDeleteFile = async (
    file: VFSFile
  ) => {
    const path = normalizePath(file.path);

    const confirmed = window.confirm(
      `Delete ${basename(path)}?`
    );

    if (!confirmed) return;

    try {
      await deleteVFSFile(path);

      if (
        openTabs.some(
          (tab) => tab.path === path
        )
      ) {
        handleCloseTab(path);
      }

      setProjectFiles((previous) =>
        previous.filter(
          (item) =>
            normalizePath(item.path) !== path
        )
      );

      setFileContents((previous) => {
        const next = { ...previous };
        delete next[path];
        return next;
      });

      playSystemSound("click");
    } catch (error) {
      console.error(error);

      window.alert(
        "Unable to delete the file."
      );
    }
  };

  /* ==========================================================================
     JAVASCRIPT EXECUTION
     ========================================================================== */

  const runJavaScriptLocally = async () => {
    const code = activeContent;

    setTerminalLogs((previous) => [
      ...previous,
      `> ${activeTab?.name || "script.js"}`,
      "Running JavaScript in secure browser sandbox...",
    ]);

    return new Promise<ExecutionResult>(
      (resolve) => {
        const iframe =
          document.createElement("iframe");

        iframe.sandbox.add("allow-scripts");

        iframe.style.display = "none";

        document.body.appendChild(iframe);

        let finished = false;

        const finish = (
          result: ExecutionResult
        ) => {
          if (finished) return;

          finished = true;

          window.clearTimeout(timeout);
          window.removeEventListener(
            "message",
            listener
          );

          iframe.remove();

          resolve(result);
        };

        const timeout = window.setTimeout(
          () => {
            finish({
              stderr:
                "Execution timed out after 5 seconds.",
              exitCode: 124,
            });
          },
          5000
        );

        const listener = (
          event: MessageEvent
        ) => {
          if (
            !event.data ||
            event.data.__abhishekEditor !==
              true
          ) {
            return;
          }

          finish({
            stdout: event.data.stdout || "",
            stderr: event.data.stderr || "",
            exitCode:
              event.data.exitCode ?? 0,
          });
        };

        window.addEventListener(
          "message",
          listener
        );

        const safeCode = JSON.stringify(
          code
        ).replace(/</g, "\\u003c");

        const html = `
<!doctype html>
<html>
<body>
<script>
(function () {
  const source = ${safeCode};
  const output = [];

  const originalLog = console.log;

  console.log = function () {
    output.push(
      Array.from(arguments)
        .map(function (x) {
          try {
            return typeof x === "object"
              ? JSON.stringify(x)
              : String(x);
          } catch {
            return String(x);
          }
        })
        .join(" ")
    );

    originalLog.apply(console, arguments);
  };

  try {
    const runner = new Function(source);
    runner();

    parent.postMessage(
      {
        __abhishekEditor: true,
        stdout: output.join("\\n"),
        exitCode: 0
      },
      "*"
    );
  } catch (error) {
    parent.postMessage(
      {
        __abhishekEditor: true,
        stdout: output.join("\\n"),
        stderr:
          error && error.stack
            ? error.stack
            : String(error),
        exitCode: 1
      },
      "*"
    );
  }
})();
<\/script>
</body>
</html>
`;

        iframe.srcdoc = html;
      }
    );
  };

  /* ==========================================================================
     PREVIEW
     ========================================================================== */

  const htmlPreview = useMemo(() => {
    if (activeLanguage === "html") {
      return activeContent;
    }

    if (activeLanguage === "css") {
      return `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
${activeContent}
</style>
</head>

<body>
<h1>CSS Preview</h1>
<p>Edit your CSS and press Run again.</p>
<button>Example Button</button>
</body>
</html>
`;
    }

    return "";
  }, [activeContent, activeLanguage]);

  /* ==========================================================================
     RUN CODE
     ========================================================================== */

  async function handleRunCode() {
    if (!activeFilePath) return;

    await handleSaveCurrent();

    setIsRunning(true);
    setExecutionResult(null);
    setIsTerminalOpen(true);

    setTerminalLogs((previous) => [
      ...previous,
      "",
      `> Running ${basename(
        activeFilePath
      )}`,
    ]);

    try {
      if (
        activeLanguage === "html" ||
        activeLanguage === "css"
      ) {
        setPreviewKey(
          (previous) => previous + 1
        );

        setShowPreview(true);

        setTerminalLogs((previous) => [
          ...previous,
          "✓ Browser preview started.",
        ]);

        setExecutionResult({
          stdout:
            "Preview opened successfully.",
          exitCode: 0,
        });

        return;
      }

      if (activeLanguage === "javascript") {
        const result =
          await runJavaScriptLocally();

        setExecutionResult(result);

        setTerminalLogs((previous) => [
          ...previous,
          ...(result.stdout
            ? result.stdout.split("\n")
            : []),
          ...(result.stderr
            ? [
                `ERROR: ${result.stderr}`,
              ]
            : []),
          `Process exited with code ${
            result.exitCode ?? 0
          }.`,
        ]);

        return;
      }

      const executionUrl =
        import.meta.env
          .VITE_EXECUTION_API_URL ||
        "/api/execute";
      const controller = new AbortController();
      executionAbortRef.current = controller;

      const response = await fetch(
        executionUrl,
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            language: activeLanguage,
            code: activeContent,
            stdin,
            filename:
              basename(activeFilePath),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Execution server returned ${response.status}`
        );
      }

      const result =
        (await response.json()) as ExecutionResult;

      setExecutionResult(result);

      setTerminalLogs((previous) => [
        ...previous,
        ...(result.stdout
          ? result.stdout.split("\n")
          : []),
        ...(result.stderr
          ? [
              `ERROR: ${result.stderr}`,
            ]
          : []),
        "",
        `Process exited with code ${
          result.exitCode ?? 0
        }${
          result.durationMs
            ? ` in ${result.durationMs}ms`
            : ""
        }.`,
      ]);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Unknown execution error.";

      setExecutionResult({
        stderr: message,
        exitCode: 1,
      });

      setTerminalLogs((previous) => [
        ...previous,
        `✗ ${message}`,
        "",
        "For Python/C/C++/Java execution, start the execution server.",
      ]);
    } finally {
      executionAbortRef.current = null;
      setIsRunning(false);
    }
  }

  /* ==========================================================================
     STOP
     ========================================================================== */

  const handleStopCode = () => {
    executionAbortRef.current?.abort();
    executionAbortRef.current = null;
    setIsRunning(false);

    setTerminalLogs((previous) => [
      ...previous,
      "^C Process stopped.",
    ]);
  };

  /* ==========================================================================
     TERMINAL
     ========================================================================== */

  const terminalHelp = [
    "Abhishek Code Studio Terminal",
    "",
    "File commands:",
    "  ls / dir                 List files",
    "  pwd                      Show current directory",
    "  cd <path>                Change directory",
    "  cat <file>               Show file",
    "  type <file>              Windows alias for cat",
    "  head <file>              Show first lines",
    "  tail <file>              Show last lines",
    "  find <text>              Search files",
    "  clear / cls              Clear terminal",
    "",
    "Development:",
    "  run                      Run current file",
    "  npm                      Show npm commands",
    "  node                     Node information",
    "  python                   Python information",
    "  gcc                      C compiler information",
    "  g++                      C++ compiler information",
    "  javac                    Java compiler information",
    "  java                     Java runtime information",
    "",
    "Git:",
    "  git status",
    "  git branch",
    "  git log",
    "",
    "System:",
    "  whoami",
    "  hostname",
    "  ver",
    "  systeminfo",
    "  uname",
    "  date",
    "  time",
    "  env",
    "  history",
    "",
    "Portfolio:",
    "  about",
    "  projects",
    "  skills",
    "  experience",
    "  education",
    "  contact",
    "  resume",
  ];

  const findMatchingFile = (
    argument: string
  ) => {
    if (!argument) {
      return projectFiles.find(
        (file) =>
          normalizePath(file.path) ===
          activeFilePath
      );
    }

    const normalized =
      normalizePath(argument);

    return (
      projectFiles.find(
        (file) =>
          normalizePath(file.path) ===
          normalized
      ) ||
      projectFiles.find(
        (file) =>
          basename(file.path).toLowerCase() ===
          basename(argument).toLowerCase()
      )
    );
  };

  const executeTerminalCommand = async (
    rawCommand: string
  ) => {
    const command = rawCommand.trim();

    if (!command) return;

    setCommandHistory((previous) => [
      ...previous,
      command,
    ]);

    setHistoryIndex(-1);

    setTerminalLogs((previous) => [
      ...previous,
      `PS C:\\AbhishekOS${currentDirectory.replace(
        "/",
        "\\"
      )}> ${command}`,
    ]);

    const parts =
      command.match(
        /(?:[^\s"]+|"[^"]*")+/g
      ) || [];

    const cmd = (
      parts[0] || ""
    )
      .replace(/^"|"$/g, "")
      .toLowerCase();

    const args = parts
      .slice(1)
      .map((item) =>
        item.replace(/^"|"$/g, "")
      );

    if (
      cmd === "clear" ||
      cmd === "cls"
    ) {
      setTerminalLogs([]);

      return;
    }

    if (
      cmd === "help" ||
      cmd === "?"
    ) {
      setTerminalLogs((previous) => [
        ...previous,
        ...terminalHelp,
      ]);

      return;
    }

    if (cmd === "pwd") {
      setTerminalLogs((previous) => [
        ...previous,
        currentDirectory,
      ]);

      return;
    }

    if (
      cmd === "ls" ||
      cmd === "dir"
    ) {
      const visibleFiles =
        virtualPathFiles.filter(
          (path) =>
            path.startsWith(
              currentDirectory
            )
        );

      setTerminalLogs((previous) => [
        ...previous,
        ...(visibleFiles.length
          ? visibleFiles.map(
              (path) => `  ${path}`
            )
          : ["  Directory is empty."]),
      ]);

      return;
    }

    if (cmd === "cd") {
      const requested =
        args[0] || "/Projects";

      let nextPath =
        requested.startsWith("/")
          ? normalizePath(requested)
          : normalizePath(
              `${currentDirectory}/${requested}`
            );

      if (nextPath === "/") {
        setCurrentDirectory("/");

        setTerminalLogs((previous) => [
          ...previous,
          "Changed directory to /",
        ]);

        return;
      }

      if (
        virtualPathFiles.some(
          (path) =>
            path.startsWith(
              `${nextPath}/`
            )
        )
      ) {
        setCurrentDirectory(nextPath);

        setTerminalLogs((previous) => [
          ...previous,
          `Changed directory to ${nextPath}`,
        ]);

        return;
      }

      if (
        nextPath === "/Projects"
      ) {
        setCurrentDirectory(nextPath);

        setTerminalLogs((previous) => [
          ...previous,
          `Changed directory to ${nextPath}`,
        ]);

        return;
      }

      setTerminalLogs((previous) => [
        ...previous,
        `The system cannot find the path specified: ${nextPath}`,
      ]);

      return;
    }

    if (
      cmd === "cat" ||
      cmd === "type"
    ) {
      const file = findMatchingFile(
        args[0] || activeFilePath
      );

      if (!file) {
        setTerminalLogs((previous) => [
          ...previous,
          `File not found: ${
            args[0] || ""
          }`,
        ]);

        return;
      }

      const content =
        fileContents[
          normalizePath(file.path)
        ] ??
        file.content ??
        "";

      setTerminalLogs((previous) => [
        ...previous,
        ...content.split("\n"),
      ]);

      return;
    }

    if (cmd === "head") {
      const file = findMatchingFile(
        args[0] || activeFilePath
      );

      if (!file) {
        setTerminalLogs((previous) => [
          ...previous,
          "File not found.",
        ]);

        return;
      }

      const content =
        fileContents[
          normalizePath(file.path)
        ] ??
        file.content ??
        "";

      setTerminalLogs((previous) => [
        ...previous,
        ...content
          .split("\n")
          .slice(0, 10),
      ]);

      return;
    }

    if (cmd === "tail") {
      const file = findMatchingFile(
        args[0] || activeFilePath
      );

      if (!file) {
        setTerminalLogs((previous) => [
          ...previous,
          "File not found.",
        ]);

        return;
      }

      const content =
        fileContents[
          normalizePath(file.path)
        ] ??
        file.content ??
        "";

      setTerminalLogs((previous) => [
        ...previous,
        ...content
          .split("\n")
          .slice(-10),
      ]);

      return;
    }

    if (
      cmd === "find" ||
      cmd === "grep" ||
      cmd === "findstr"
    ) {
      const query =
        args.join(" ").toLowerCase();

      const matches =
        projectFiles.filter(
          (file) => {
            const content =
              fileContents[
                normalizePath(
                  file.path
                )
              ] ??
              file.content ??
              "";

            return (
              normalizePath(
                file.path
              )
                .toLowerCase()
                .includes(query) ||
              content
                .toLowerCase()
                .includes(query)
            );
          }
        );

      setTerminalLogs((previous) => [
        ...previous,
        ...(matches.length
          ? matches.map(
              (file) =>
                normalizePath(
                  file.path
                )
            )
          : ["No matches found."]),
      ]);

      return;
    }

    if (cmd === "echo") {
      setTerminalLogs((previous) => [
        ...previous,
        args.join(" "),
      ]);

      return;
    }

    if (cmd === "whoami") {
      setTerminalLogs((previous) => [
        ...previous,
        "abhishek",
      ]);

      return;
    }

    if (cmd === "hostname") {
      setTerminalLogs((previous) => [
        ...previous,
        "ABHISHEK-WORKSTATION",
      ]);

      return;
    }

    if (cmd === "ver") {
      setTerminalLogs((previous) => [
        ...previous,
        "AbhishekOS [Virtual Developer Workstation]",
        "Windows 11-style portfolio environment",
      ]);

      return;
    }

    if (cmd === "uname") {
      setTerminalLogs((previous) => [
        ...previous,
        "AbhishekOS 11.0 Virtual-Developer x64",
      ]);

      return;
    }

    if (
      cmd === "systeminfo"
    ) {
      setTerminalLogs((previous) => [
        ...previous,
        "Host Name:       ABHISHEK-WORKSTATION",
        "OS:              AbhishekOS Developer Edition",
        "Architecture:    x64",
        "CPU:             Browser Virtual CPU",
        "Runtime:         React + Vite",
        "Editor:          Abhishek Code Studio",
        "Terminal:        PowerShell / Unix compatible",
      ]);

      return;
    }

    if (cmd === "date") {
      setTerminalLogs((previous) => [
        ...previous,
        new Date().toLocaleDateString(),
      ]);

      return;
    }

    if (cmd === "time") {
      setTerminalLogs((previous) => [
        ...previous,
        new Date().toLocaleTimeString(),
      ]);

      return;
    }

    if (
      cmd === "env" ||
      cmd === "set"
    ) {
      setTerminalLogs((previous) => [
        ...previous,
        "NODE_ENV=development",
        "EDITOR=Abhishek Code Studio",
        "SHELL=Virtual PowerShell",
        "OS=AbhishekOS",
        "ARCH=x64",
      ]);

      return;
    }

    if (cmd === "history") {
      setTerminalLogs((previous) => [
        ...previous,
        ...commandHistory.map(
          (item, index) =>
            `${index + 1}  ${item}`
        ),
      ]);

      return;
    }

    if (
      cmd === "run" ||
      cmd === "execute"
    ) {
      await handleRunCode();

      return;
    }

    if (cmd === "npm") {
      setTerminalLogs((previous) => [
        ...previous,
        "npm <command>",
        "",
        "Common commands:",
        "  npm install",
        "  npm run dev",
        "  npm run build",
        "  npm run preview",
        "  npm test",
      ]);

      return;
    }

    if (cmd === "node") {
      setTerminalLogs((previous) => [
        ...previous,
        "Node.js execution is available through the configured execution server.",
        `Current editor: ${
          LANGUAGE_LABELS[
            activeLanguage
          ]
        }`,
      ]);

      return;
    }

    if (
      cmd === "python" ||
      cmd === "python3"
    ) {
      setTerminalLogs((previous) => [
        ...previous,
        "Python 3.x",
        "Use Run or `run` to execute the active Python file.",
      ]);

      return;
    }

    if (cmd === "gcc") {
      setTerminalLogs((previous) => [
        ...previous,
        "GCC C compiler",
        "Use Run to compile and execute C programs.",
      ]);

      return;
    }

    if (
      cmd === "g++" ||
      cmd === "cpp"
    ) {
      setTerminalLogs((previous) => [
        ...previous,
        "GNU C++ compiler",
        "Use Run to compile and execute C++ programs.",
      ]);

      return;
    }

    if (cmd === "java") {
      setTerminalLogs((previous) => [
        ...previous,
        "Java Runtime Environment",
        "Use Run to compile and execute Java programs.",
      ]);

      return;
    }

    if (cmd === "javac") {
      setTerminalLogs((previous) => [
        ...previous,
        "Java compiler",
        "Use Run to compile Java programs.",
      ]);

      return;
    }

    if (cmd === "git") {
      const subcommand =
        args[0]?.toLowerCase();

      if (
        subcommand === "status"
      ) {
        const modified =
          Object.entries(isDirty)
            .filter(
              ([, dirty]) => dirty
            )
            .map(([path]) => path);

        setTerminalLogs((previous) => [
          ...previous,
          "On branch main",
          "",
          modified.length
            ? "Changes not staged for commit:"
            : "nothing to commit, working tree clean",
          ...modified.map(
            (path) =>
              `  modified: ${path}`
          ),
        ]);

        return;
      }

      if (
        subcommand === "branch"
      ) {
        setTerminalLogs((previous) => [
          ...previous,
          "* main",
        ]);

        return;
      }

      if (subcommand === "log") {
        setTerminalLogs((previous) => [
          ...previous,
          "commit virtual-main",
          "Author: Abhishek Kuntare",
          "Message: Portfolio workstation commit",
        ]);

        return;
      }

      setTerminalLogs((previous) => [
        ...previous,
        "git status",
        "git branch",
        "git log",
        "git add",
        "git commit",
      ]);

      return;
    }

    const portfolioCommands = [
      "about",
      "projects",
      "skills",
      "experience",
      "education",
      "contact",
      "resume",
    ];

    if (
      portfolioCommands.includes(cmd)
    ) {
      setTerminalLogs((previous) => [
        ...previous,
        `Portfolio command '${cmd}' recognized.`,
        "Use the desktop applications for the full interactive experience.",
      ]);

      return;
    }

    setTerminalLogs((previous) => [
      ...previous,
      `'${command}' is not recognized as a virtual terminal command.`,
      "Type 'help' for available commands.",
    ]);
  };

  /* ==========================================================================
     TERMINAL SUBMIT
     ========================================================================== */

  const submitTerminalCommand = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const command = terminalCommand;

    setTerminalCommand("");

    await executeTerminalCommand(
      command
    );
  };

  /* ==========================================================================
     SEARCH
     ========================================================================== */

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query =
      searchQuery.toLowerCase();

    return projectFiles.filter(
      (file) => {
        const content =
          fileContents[
            normalizePath(file.path)
          ] ??
          file.content ??
          "";

        return (
          normalizePath(
            file.path
          )
            .toLowerCase()
            .includes(query) ||
          content
            .toLowerCase()
            .includes(query)
        );
      }
    );
  }, [
    searchQuery,
    projectFiles,
    fileContents,
  ]);

  /* ==========================================================================
     AI
     ========================================================================== */

  const callAI = async (
    action:
      | "generate"
      | "explain"
      | "fix"
      | "refactor"
  ) => {
    const prompt =
      aiPrompt.trim() ||
      (action === "generate"
        ? "Write the requested program."
        : `${action} the current code.`);

    setIsAILoading(true);
    setAIResult(null);

    try {
      const aiUrl =
        import.meta.env.VITE_AI_API_URL ||
        "/api/ai";

      const response = await fetch(
        aiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action,
            prompt,
            code: activeContent,
            language: activeLanguage,
            filename:
              basename(activeFilePath),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `AI server returned ${response.status}`
        );
      }

      const result =
        (await response.json()) as AIResult;

      setAIResult(result);

      if (result.code) {
        setFileContents((previous) => ({
          ...previous,
          [activeFilePath]:
            result.code!,
        }));

        setIsDirty((previous) => ({
          ...previous,
          [activeFilePath]: true,
        }));
      }
    } catch (error) {
      console.error(error);

      setAIResult({
        text:
          "AI service is not configured. Add VITE_AI_API_URL or expose /api/ai from your backend.",
      });
    } finally {
      setIsAILoading(false);
    }
  };

  /* ==========================================================================
     COPY
     ========================================================================== */

  const copyCurrentCode = async () => {
    try {
      await navigator.clipboard.writeText(
        activeContent
      );

      setTerminalLogs((previous) => [
        ...previous,
        "✓ Current file copied to clipboard.",
      ]);
    } catch {
      window.alert(
        "Clipboard access is not available."
      );
    }
  };

  /* ==========================================================================
     DOWNLOAD
     ========================================================================== */

  const downloadCurrentCode = () => {
    if (!activeFilePath) return;

    const blob = new Blob(
      [activeContent],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download =
      basename(activeFilePath);

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
  };

  /* ==========================================================================
     COMMIT
     ========================================================================== */

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      window.alert(
        "Enter a commit message."
      );

      return;
    }

    setTerminalLogs((previous) => [
      ...previous,
      `git commit -m "${commitMessage}"`,
      `[main virtual] ${commitMessage}`,
      "1 virtual commit created.",
    ]);

    setCommitMessage("");
  };

  /* ==========================================================================
     LINE NUMBERS
     ========================================================================== */

  const lineNumbers = useMemo(() => {
    return Array.from(
      {
        length: lineCount,
      },
      (_, index) => index + 1
    ).join("\n");
  }, [lineCount]);

  /* ==========================================================================
     SORT FILES
     ========================================================================== */

  const sortedFiles = useMemo(() => {
    return [...projectFiles].sort(
      (a, b) =>
        a.path.localeCompare(
          b.path
        )
    );
  }, [projectFiles]);

  /* ==========================================================================
     TERMINAL AUTO SCROLL
     ========================================================================== */

  useEffect(() => {
    const element =
      terminalScrollRef.current;

    if (!element) return;

    element.scrollTop =
      element.scrollHeight;
  }, [terminalLogs]);

  /* ==========================================================================
     RESIZE
     ========================================================================== */

  useEffect(() => {
    const handlePointerMove = (
      event: PointerEvent
    ) => {
      const target =
        resizeTargetRef.current;

      if (!target) return;

      if (target === "sidebar") {
        setSidebarWidth(
          Math.min(
            420,
            Math.max(
              210,
              event.clientX - 44
            )
          )
        );
      }

      if (target === "terminal") {
        const viewportHeight =
          window.innerHeight;

        const nextHeight =
          viewportHeight -
          event.clientY;

        setTerminalHeight(
          Math.min(
            520,
            Math.max(130, nextHeight)
          )
        );
      }

      if (target === "ai") {
        setAIWidth(
          Math.min(
            520,
            Math.max(
              320,
              window.innerWidth -
                event.clientX
            )
          )
        );
      }
    };

    const handlePointerUp = () => {
      resizeTargetRef.current = null;

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, []);

  const beginResize = (
    target:
      | "sidebar"
      | "terminal"
      | "ai"
  ) => {
    resizeTargetRef.current = target;

    document.body.style.cursor =
      target === "terminal"
        ? "row-resize"
        : "col-resize";

    document.body.style.userSelect =
      "none";
  };

  /* ==========================================================================
     KEYBOARD SHORTCUTS
     ========================================================================== */

  useEffect(() => {
    const handleGlobalKeyDown = (
      event: KeyboardEvent
    ) => {
      const modifier =
        event.ctrlKey ||
        event.metaKey;

      if (
        modifier &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();

        void handleSaveCurrent();

        return;
      }

      if (
        modifier &&
        event.key === "Enter"
      ) {
        event.preventDefault();

        void handleRunCode();

        return;
      }

      if (
        modifier &&
        event.key.toLowerCase() === "p" &&
        event.shiftKey
      ) {
        event.preventDefault();

        setIsPaletteOpen(true);
        setPaletteQuery("");

        return;
      }

      if (
        modifier &&
        event.key.toLowerCase() === "p"
      ) {
        event.preventDefault();

        setIsPaletteOpen(true);
        setPaletteQuery("");

        return;
      }

      if (
        modifier &&
        event.key.toLowerCase() === "j"
      ) {
        event.preventDefault();

        setIsTerminalOpen(
          (previous) => !previous
        );

        return;
      }

      if (
        modifier &&
        event.key.toLowerCase() === "b"
      ) {
        event.preventDefault();

        setIsSidebarOpen(
          (previous) => !previous
        );

        return;
      }

      if (event.key === "Escape") {
        setIsPaletteOpen(false);
        setShowShortcuts(false);
        setShowMoreMenu(false);

        if (isAIOpen) {
          setIsAIOpen(false);
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleGlobalKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleGlobalKeyDown
      );
    };
  }, [
    handleSaveCurrent,
    isAIOpen,
  ]);

  /* ==========================================================================
     PALETTE
     ========================================================================== */

  const paletteActions: PaletteAction[] =
    [
      {
        id: "new",
        label: "Create New File",
        description:
          "Create a file inside /Projects",
        shortcut: "Ctrl+N",
        icon: <FilePlus2 size={15} />,
        action: () => {
          setIsPaletteOpen(false);
          void handleNewFile();
        },
      },
      {
        id: "save",
        label: "Save Current File",
        description:
          "Save the active file to VFS",
        shortcut: "Ctrl+S",
        icon: <Save size={15} />,
        action: () => {
          setIsPaletteOpen(false);
          void handleSaveCurrent();
        },
      },
      {
        id: "run",
        label: "Run Current File",
        description:
          "Execute the active program",
        shortcut: "Ctrl+Enter",
        icon: <Play size={15} />,
        action: () => {
          setIsPaletteOpen(false);
          void handleRunCode();
        },
      },
      {
        id: "terminal",
        label: "Toggle Terminal",
        description:
          "Show or hide the terminal",
        shortcut: "Ctrl+J",
        icon: <TerminalIcon size={15} />,
        action: () => {
          setIsPaletteOpen(false);

          setIsTerminalOpen(
            (previous) => !previous
          );
        },
      },
      {
        id: "sidebar",
        label: "Toggle Explorer",
        description:
          "Show or hide the sidebar",
        shortcut: "Ctrl+B",
        icon: <PanelLeft size={15} />,
        action: () => {
          setIsPaletteOpen(false);

          setIsSidebarOpen(
            (previous) => !previous
          );
        },
      },
      {
        id: "ai",
        label: "Open Code AI",
        description:
          "Open the developer assistant",
        icon: <Sparkles size={15} />,
        action: () => {
          setIsPaletteOpen(false);
          setIsAIOpen(true);
        },
      },
      {
        id: "preview",
        label: "Open Browser Preview",
        description:
          "Preview HTML or CSS",
        icon: <Monitor size={15} />,
        action: () => {
          setIsPaletteOpen(false);

          if (
            activeLanguage === "html" ||
            activeLanguage === "css"
          ) {
            setShowPreview(true);
          }
        },
      },
      {
        id: "shortcuts",
        label: "Keyboard Shortcuts",
        description:
          "View available editor shortcuts",
        icon: <Keyboard size={15} />,
        action: () => {
          setIsPaletteOpen(false);
          setShowShortcuts(true);
        },
      },
      {
        id: "fullscreen",
        label: "Toggle Fullscreen Editor",
        description:
          "Expand editor to the full window",
        icon: <Maximize2 size={15} />,
        action: () => {
          setIsPaletteOpen(false);

          setIsFullscreenEditor(
            (previous) => !previous
          );
        },
      },
    ];

  const filteredPaletteActions =
    paletteActions.filter(
      (item) =>
        item.label
          .toLowerCase()
          .includes(
            paletteQuery.toLowerCase()
          ) ||
        item.description
          .toLowerCase()
          .includes(
            paletteQuery.toLowerCase()
          )
    );

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <div
      className={
        isFullscreenEditor
          ? "fixed inset-0 z-[99999] flex flex-col overflow-hidden bg-[#070a0f] text-slate-100"
          : "relative flex h-full min-h-0 w-full overflow-hidden bg-[#070a0f] text-slate-100"
      }
    >
      {/* =====================================================================
          TOP HEADER
      ===================================================================== */}

      <header className="relative z-40 flex h-12 shrink-0 items-center border-b border-white/[0.08] bg-[#0b0f15]/95 backdrop-blur-xl">
        {/* Brand */}
        <div className="flex h-full w-[220px] shrink-0 items-center gap-3 border-r border-white/[0.07] px-3">
          <button
            onClick={() =>
              setIsSidebarOpen(
                (previous) => !previous
              )
            }
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white md:hidden"
          >
            <PanelLeft size={16} />
          </button>

          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-sky-400/10">
            <Code2 size={16} />

            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0b0f15]" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[11px] font-bold tracking-tight text-white">
              Abhishek Code Studio
            </div>

            <div className="truncate text-[8px] text-slate-600">
              Developer Workstation
            </div>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1 px-3 lg:flex">
          <button
            onClick={() =>
              void handleNewFile()
            }
            className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <FilePlus2
              size={14}
              className="transition group-hover:text-sky-400"
            />
            New
          </button>

          <button
            onClick={() =>
              void handleSaveCurrent()
            }
            className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Save
              size={14}
              className="transition group-hover:text-emerald-400"
            />
            Save
          </button>

          {!isRunning ? (
            <button
              onClick={() =>
                void handleRunCode()
              }
              className="group flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/10 transition hover:bg-emerald-500/15"
            >
              <Play
                size={13}
                fill="currentColor"
              />
              Run
            </button>
          ) : (
            <button
              onClick={handleStopCode}
              className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[10px] text-red-300 ring-1 ring-red-400/10 transition hover:bg-red-500/15"
            >
              <Square
                size={12}
                fill="currentColor"
              />
              Stop
            </button>
          )}

          <button
            onClick={() =>
              setIsTerminalOpen(
                (previous) => !previous
              )
            }
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] transition ${
              isTerminalOpen
                ? "bg-white/[0.06] text-white"
                : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <TerminalIcon size={13} />
            Terminal
          </button>
        </div>

        {/* Center breadcrumb */}
        <div className="absolute left-1/2 hidden max-w-[35%] -translate-x-1/2 items-center gap-2 md:flex">
          <span className="truncate text-[9px] text-slate-600">
            {activeFilePath ||
              "No file selected"}
          </span>

          {activeFilePath && (
            <>
              <ChevronRight
                size={10}
                className="shrink-0 text-slate-700"
              />

              <span className="shrink-0 rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[8px] text-slate-500">
                {
                  LANGUAGE_LABELS[
                    activeLanguage
                  ]
                }
              </span>
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 px-2">
          {activeFilePath && (
            <div className="mr-1 hidden items-center gap-2 px-2 sm:flex">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDirty[activeFilePath]
                    ? "bg-amber-400"
                    : "bg-emerald-400"
                }`}
              />

              <span className="text-[8px] text-slate-600">
                {isDirty[activeFilePath]
                  ? "Unsaved"
                  : "Saved"}
              </span>
            </div>
          )}

          <button
            onClick={() => {
              setIsPaletteOpen(true);
              setPaletteQuery("");
            }}
            className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[9px] text-slate-500 transition hover:border-white/[0.12] hover:text-slate-300 sm:flex"
          >
            <Search size={12} />
            Search commands
            <kbd className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[7px] text-slate-600">
              Ctrl P
            </kbd>
          </button>

          <button
            onClick={() =>
              setIsAIOpen(
                (previous) => !previous
              )
            }
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9px] font-medium transition ${
              isAIOpen
                ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                : "border-violet-400/10 bg-violet-500/[0.06] text-violet-300 hover:bg-violet-500/10"
            }`}
          >
            <Sparkles size={13} />
            <span className="hidden xs:inline">
              AI
            </span>
          </button>

          <button
            onClick={() =>
              setIsFullscreenEditor(
                (previous) => !previous
              )
            }
            className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white sm:block"
            title="Fullscreen"
          >
            {isFullscreenEditor ? (
              <Minimize2 size={14} />
            ) : (
              <Maximize2 size={14} />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() =>
                setShowMoreMenu(
                  (previous) => !previous
                )
              }
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
            >
              <MoreHorizontal size={15} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-10 z-[80] w-48 overflow-hidden rounded-xl border border-white/[0.09] bg-[#10151d]/98 p-1.5 shadow-2xl backdrop-blur-2xl">
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowShortcuts(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[9px] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                >
                  <Keyboard size={13} />
                  Keyboard Shortcuts
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setIsPaletteOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[9px] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                >
                  <Command size={13} />
                  Command Palette
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setIsTerminalOpen(
                      (previous) =>
                        !previous
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[9px] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                >
                  <PanelBottom size={13} />
                  Toggle Terminal
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN
      ===================================================================== */}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ===================================================================
            ACTIVITY BAR
        =================================================================== */}

        <aside className="z-30 flex w-11 shrink-0 flex-col items-center border-r border-white/[0.07] bg-[#090d13] py-2">
          <button
            onClick={() =>
              setSidebarTab("explorer")
            }
            className={`mb-1 rounded-lg p-2 transition ${
              sidebarTab === "explorer"
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-slate-600 hover:bg-white/[0.04] hover:text-slate-300"
            }`}
            title="Explorer"
          >
            <FolderOpen size={17} />
          </button>

          <button
            onClick={() =>
              setSidebarTab("search")
            }
            className={`mb-1 rounded-lg p-2 transition ${
              sidebarTab === "search"
                ? "bg-white/[0.08] text-white"
                : "text-slate-600 hover:bg-white/[0.04] hover:text-slate-300"
            }`}
            title="Search"
          >
            <SearchCode size={17} />
          </button>

          <button
            onClick={() =>
              setSidebarTab(
                "source-control"
              )
            }
            className={`rounded-lg p-2 transition ${
              sidebarTab ===
              "source-control"
                ? "bg-white/[0.08] text-white"
                : "text-slate-600 hover:bg-white/[0.04] hover:text-slate-300"
            }`}
            title="Source Control"
          >
            <GitBranch size={17} />
          </button>

          <div className="mt-auto flex flex-col items-center">
            <button
              onClick={() =>
                void refreshProjectFiles()
              }
              className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>

            <button
              onClick={() =>
                setShowShortcuts(true)
              }
              className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
              title="Keyboard shortcuts"
            >
              <Keyboard size={15} />
            </button>
          </div>
        </aside>

        {/* ===================================================================
            SIDEBAR
        =================================================================== */}

        {isSidebarOpen && (
          <aside
            style={{
              width:
                window.innerWidth < 768
                  ? undefined
                  : sidebarWidth,
            }}
            className="absolute inset-y-12 left-11 z-50 flex w-[calc(100vw-44px)] shrink-0 border-r border-white/[0.08] bg-[#0b0f15]/98 shadow-2xl backdrop-blur-2xl md:relative md:inset-auto md:z-auto md:block md:shadow-none"
          >
            {/* Explorer */}
            {sidebarTab ===
              "explorer" && (
              <div className="flex h-full flex-col">
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.05] px-3">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Explorer
                    </div>

                    <div className="mt-0.5 text-[8px] text-slate-700">
                      {projectFiles.length} files
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        void handleNewFile()
                      }
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                      title="New file"
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      onClick={() =>
                        void refreshProjectFiles()
                      }
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                      title="Refresh"
                    >
                      <RefreshCw
                        size={13}
                      />
                    </button>

                    <button
                      onClick={() =>
                        setIsSidebarOpen(
                          false
                        )
                      }
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06] hover:text-white md:hidden"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div className="border-b border-white/[0.05] px-2 py-2">
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-2.5">
                    <Search
                      size={12}
                      className="text-slate-600"
                    />

                    <input
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target
                            .value
                        )
                      }
                      placeholder="Filter files..."
                      className="h-8 min-w-0 flex-1 bg-transparent text-[9px] text-white outline-none placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 border-b border-white/[0.05] px-3 py-2.5">
                  <ChevronDown
                    size={12}
                    className="text-slate-500"
                  />

                  <Folder
                    size={13}
                    className="text-sky-400/70"
                  />

                  <span className="text-[9px] font-bold tracking-wider text-slate-400">
                    PROJECTS
                  </span>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto py-1">
                  {sortedFiles.length ===
                  0 ? (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] text-slate-700">
                        <FolderClosed
                          size={22}
                        />
                      </div>

                      <div className="text-[10px] font-medium text-slate-500">
                        No files found
                      </div>

                      <button
                        onClick={() =>
                          void handleNewFile()
                        }
                        className="mt-3 rounded-lg bg-sky-500/10 px-3 py-1.5 text-[8px] text-sky-300 hover:bg-sky-500/15"
                      >
                        Create file
                      </button>
                    </div>
                  ) : (
                    sortedFiles
                      .filter((file) =>
                        searchQuery
                          ? basename(
                              file.path
                            )
                              .toLowerCase()
                              .includes(
                                searchQuery.toLowerCase()
                              )
                          : true
                      )
                      .map((file) => {
                        const path =
                          normalizePath(
                            file.path
                          );

                        const active =
                          path ===
                          activeFilePath;

                        const dirty =
                          isDirty[path];

                        return (
                          <div
                            key={path}
                            onClick={() =>
                              void handleOpenFile(
                                file
                              )
                            }
                            className={`group mx-1 flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] transition ${
                              active
                                ? "bg-sky-500/[0.10] text-white ring-1 ring-sky-400/[0.08]"
                                : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-300"
                            }`}
                          >
                            <span
                              className={`flex h-5 min-w-[25px] items-center justify-center rounded font-mono text-[7px] font-bold ${
                                active
                                  ? "bg-sky-500/10 text-sky-300"
                                  : "bg-white/[0.025] text-slate-600"
                              }`}
                            >
                              {getFileIcon(
                                path
                              )}
                            </span>

                            <span className="min-w-0 flex-1 truncate">
                              {basename(
                                path
                              )}
                            </span>

                            {dirty && (
                              <Circle
                                size={5}
                                fill="currentColor"
                                className="shrink-0 text-amber-400"
                              />
                            )}

                            <button
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                void handleDeleteFile(
                                  file
                                );
                              }}
                              className="hidden rounded p-1 text-slate-700 hover:bg-red-500/10 hover:text-red-400 group-hover:block"
                              title="Delete"
                            >
                              <Trash2
                                size={11}
                              />
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>

                <div className="border-t border-white/[0.06] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Cpu
                      size={12}
                      className="text-sky-400/70"
                    />

                    <span className="text-[8px] font-semibold text-slate-500">
                      WORKSPACE
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[8px] text-slate-700">
                    <div>
                      root /Projects
                    </div>

                    <div>
                      {projectFiles.length} files
                    </div>

                    <div>
                      Virtual File System
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search */}
            {sidebarTab === "search" && (
              <div className="flex h-full flex-col">
                <div className="border-b border-white/[0.05] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Search
                    </div>

                    <button
                      onClick={() =>
                        setSearchQuery("")
                      }
                      className="rounded p-1 text-slate-600 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/20 px-2.5">
                    <Search
                      size={13}
                      className="text-slate-600"
                    />

                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target
                            .value
                        )
                      }
                      placeholder="Search across files..."
                      className="h-9 min-w-0 flex-1 bg-transparent text-[9px] text-white outline-none placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
                  {!searchQuery ? (
                    <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                      <SearchCode
                        size={25}
                        className="mb-3 text-slate-700"
                      />

                      <div className="text-[10px] text-slate-500">
                        Search your workspace
                      </div>

                      <div className="mt-1 text-[8px] leading-4 text-slate-700">
                        Search filenames and
                        file contents.
                      </div>
                    </div>
                  ) : searchResults.length ===
                    0 ? (
                    <div className="py-10 text-center text-[9px] text-slate-700">
                      No results found.
                    </div>
                  ) : (
                    searchResults.map(
                      (file) => (
                        <button
                          key={file.path}
                          onClick={() =>
                            void handleOpenFile(
                              file
                            )
                          }
                          className="group w-full rounded-lg px-2.5 py-2.5 text-left transition hover:bg-white/[0.04]"
                        >
                          <div className="flex items-center gap-2">
                            <FileCode2
                              size={13}
                              className="text-sky-400/60"
                            />

                            <span className="truncate text-[9px] font-medium text-slate-300">
                              {basename(
                                file.path
                              )}
                            </span>
                          </div>

                          <div className="mt-1 truncate pl-5 text-[7px] text-slate-700">
                            {file.path}
                          </div>
                        </button>
                      )
                    )
                  )}
                </div>
              </div>
            )}

            {/* Source control */}
            {sidebarTab ===
              "source-control" && (
              <div className="flex h-full flex-col">
                <div className="border-b border-white/[0.05] p-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Source Control
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                        <GitBranch
                          size={14}
                        />
                      </div>

                      <div>
                        <div className="text-[9px] font-semibold text-white">
                          main
                        </div>

                        <div className="text-[7px] text-slate-700">
                          Virtual repository
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 rounded-xl border border-white/[0.06] bg-black/10 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                        Changes
                      </span>

                      <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[7px] text-amber-400">
                        {
                          Object.values(
                            isDirty
                          ).filter(Boolean)
                            .length
                        }
                      </span>
                    </div>

                    {Object.entries(
                      isDirty
                    ).filter(
                      ([, dirty]) => dirty
                    ).length === 0 ? (
                      <div className="flex items-center gap-2 text-[8px] text-slate-700">
                        <CheckCircle2
                          size={12}
                          className="text-emerald-400/60"
                        />
                        Working tree clean
                      </div>
                    ) : (
                      Object.entries(
                        isDirty
                      )
                        .filter(
                          ([, dirty]) =>
                            dirty
                        )
                        .map(
                          ([path]) => (
                            <button
                              key={path}
                              onClick={() =>
                                setActiveFilePath(
                                  path
                                )
                              }
                              className="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/[0.04]"
                            >
                              <Circle
                                size={5}
                                fill="currentColor"
                                className="text-amber-400"
                              />

                              <span className="truncate text-[8px] text-slate-500">
                                {basename(
                                  path
                                )}
                              </span>
                            </button>
                          )
                        )
                    )}
                  </div>

                  <textarea
                    value={commitMessage}
                    onChange={(event) =>
                      setCommitMessage(
                        event.target.value
                      )
                    }
                    placeholder="Commit message..."
                    className="mb-2 h-24 w-full resize-none rounded-xl border border-white/[0.07] bg-black/20 p-3 text-[9px] text-white outline-none placeholder:text-slate-700 focus:border-sky-400/20"
                  />

                  <button
                    onClick={handleCommit}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500/10 py-2.5 text-[9px] font-medium text-sky-300 ring-1 ring-sky-400/10 transition hover:bg-sky-500/15"
                  >
                    <GitCommitHorizontal
                      size={13}
                    />
                    Commit Changes
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Sidebar resize handle */}
        {isSidebarOpen && (
          <div
            onPointerDown={() =>
              beginResize("sidebar")
            }
            className="group relative z-20 hidden w-1 shrink-0 cursor-col-resize bg-transparent md:block"
          >
            <div className="absolute inset-y-0 left-0 w-px bg-white/[0.03] transition group-hover:bg-sky-400/40" />
          </div>
        )}

        {/* ===================================================================
            EDITOR
        =================================================================== */}

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#080b10]">
          {/* Tabs */}
          <div className="flex h-10 shrink-0 overflow-x-auto border-b border-white/[0.06] bg-[#090d13] scrollbar-none">
            {openTabs.map((tab) => {
              const active =
                tab.path ===
                activeFilePath;

              const dirty =
                isDirty[tab.path];

              return (
                <div
                  key={tab.path}
                  className={`group relative flex min-w-[125px] max-w-[190px] shrink-0 items-center gap-2 border-r border-white/[0.05] px-2.5 transition ${
                    active
                      ? "bg-[#0d121a] text-white"
                      : "text-slate-600 hover:bg-white/[0.02] hover:text-slate-300"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-x-0 bottom-0 h-px bg-sky-400/70" />
                  )}

                  <span
                    className={`flex h-5 min-w-[24px] items-center justify-center rounded font-mono text-[7px] font-bold ${
                      active
                        ? "bg-sky-500/10 text-sky-300"
                        : "bg-white/[0.02] text-slate-700"
                    }`}
                  >
                    {getFileIcon(
                      tab.path
                    )}
                  </span>

                  <button
                    onClick={() =>
                      setActiveFilePath(
                        tab.path
                      )
                    }
                    className="min-w-0 flex-1 truncate text-left text-[9px]"
                  >
                    {tab.name}
                  </button>

                  {dirty ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  ) : (
                    <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700 group-hover:block" />
                  )}

                  <button
                    onClick={() =>
                      handleCloseTab(
                        tab.path
                      )
                    }
                    className="rounded p-1 text-slate-700 opacity-0 transition hover:bg-white/[0.08] hover:text-white group-hover:opacity-100"
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}

            <div className="flex min-w-10 flex-1 items-center justify-end px-2">
              <button
                onClick={() =>
                  void handleNewFile()
                }
                className="rounded-lg p-1.5 text-slate-700 transition hover:bg-white/[0.05] hover:text-slate-300"
                title="New file"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          {activeFilePath && (
            <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/[0.035] bg-[#0a0e14] px-3 text-[8px] text-slate-700">
              <Folder size={10} />

              <span>
                Projects
              </span>

              <ChevronRight
                size={9}
              />

              <span className="text-slate-500">
                {basename(
                  activeFilePath
                )}
              </span>

              <div className="ml-auto flex items-center gap-2">
                {isDirty[
                  activeFilePath
                ] && (
                  <span className="flex items-center gap-1 text-amber-400/70">
                    <Circle
                      size={4}
                      fill="currentColor"
                    />
                    Modified
                  </span>
                )}

                <span className="hidden sm:block">
                  {
                    LANGUAGE_LABELS[
                      activeLanguage
                    ]
                  }
                </span>
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {!activeFilePath ? (
              <div className="flex h-full items-center justify-center bg-[#080b10]">
                <div className="max-w-sm px-6 text-center">
                  <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02] shadow-2xl">
                    <Code2
                      size={34}
                      className="text-sky-400/60"
                    />

                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-sky-400/70 blur-[2px]" />
                  </div>

                  <h2 className="text-sm font-semibold text-slate-300">
                    Abhishek Code Studio
                  </h2>

                  <p className="mt-2 text-[9px] leading-5 text-slate-700">
                    Open a file from Explorer
                    to start building.
                  </p>

                  <div className="mt-5 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        void handleNewFile()
                      }
                      className="rounded-xl bg-sky-500/10 px-4 py-2 text-[9px] text-sky-300 ring-1 ring-sky-400/10 hover:bg-sky-500/15"
                    >
                      New File
                    </button>

                    <button
                      onClick={() =>
                        setIsPaletteOpen(
                          true
                        )
                      }
                      className="rounded-xl bg-white/[0.03] px-4 py-2 text-[9px] text-slate-500 ring-1 ring-white/[0.06] hover:text-white"
                    >
                      Command Palette
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex h-full overflow-hidden">
                {/* Active line glow */}
                <div
                  className="pointer-events-none absolute left-0 right-0 z-[1] h-6 border-y border-white/[0.025] bg-white/[0.012]"
                  style={{
                    top:
                      (cursorPosition.line -
                        1) *
                        24 +
                      16 -
                      editorScrollTop,
                  }}
                />

                {/* Line numbers */}
                <div
                  ref={lineNumberRef}
                  className="pointer-events-none z-10 w-14 shrink-0 select-none overflow-hidden border-r border-white/[0.035] bg-[#080b10] py-4 text-right font-mono text-[10px] leading-6 text-slate-700"
                >
                  <div
                    style={{
                      transform: `translateY(-${editorScrollTop}px)`,
                    }}
                  >
                    {lineNumbers
                      .split("\n")
                      .map(
                        (number) => (
                          <div
                            key={number}
                            className={`h-6 pr-3 ${
                              Number(
                                number
                              ) ===
                              cursorPosition.line
                                ? "text-sky-400/80"
                                : ""
                            }`}
                          >
                            {number}
                          </div>
                        )
                      )}
                  </div>
                </div>

                {/* Editor */}
                <textarea
                  ref={editorRef}
                  value={activeContent}
                  onChange={(event) => {
                    handleContentChange(
                      event.target.value
                    );

                    updateCursorPosition(
                      event.currentTarget
                    );
                  }}
                  onClick={(event) =>
                    updateCursorPosition(
                      event.currentTarget
                    )
                  }
                  onKeyUp={(event) =>
                    updateCursorPosition(
                      event.currentTarget
                    )
                  }
                  onSelect={(event) =>
                    updateCursorPosition(
                      event.currentTarget
                    )
                  }
                  onScroll={(event) => {
                    setEditorScrollTop(
                      event.currentTarget
                        .scrollTop
                    );

                    if (
                      lineNumberRef.current
                    ) {
                      lineNumberRef.current.scrollTop =
                        event.currentTarget.scrollTop;
                    }
                  }}
                  onKeyDown={(event) => {
                    if (
                      (event.ctrlKey ||
                        event.metaKey) &&
                      event.key.toLowerCase() ===
                        "s"
                    ) {
                      event.preventDefault();

                      void handleSaveCurrent();

                      return;
                    }

                    if (
                      (event.ctrlKey ||
                        event.metaKey) &&
                      event.key === "Enter"
                    ) {
                      event.preventDefault();

                      void handleRunCode();

                      return;
                    }

                    if (event.key === "Tab") {
                      event.preventDefault();

                      const textarea =
                        event.currentTarget;

                      const start =
                        textarea.selectionStart;

                      const end =
                        textarea.selectionEnd;

                      const value =
                        textarea.value;

                      const next =
                        value.substring(
                          0,
                          start
                        ) +
                        "  " +
                        value.substring(
                          end
                        );

                      handleContentChange(
                        next
                      );

                      requestAnimationFrame(
                        () => {
                          textarea.selectionStart =
                            start + 2;

                          textarea.selectionEnd =
                            start + 2;

                          updateCursorPosition(
                            textarea
                          );
                        }
                      );
                    }
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="relative z-[2] h-full min-w-0 flex-1 resize-none overflow-auto border-0 bg-transparent px-4 py-4 font-mono text-[12px] leading-6 text-slate-300 outline-none placeholder:text-slate-700"
                  style={{
                    tabSize: 2,
                    caretColor: "#38bdf8",
                  }}
                />

                {/* Editor toolbar */}
                <div className="absolute right-3 top-3 z-20 flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-[#0c1119]/90 p-1 shadow-2xl backdrop-blur-xl">
                  <button
                    onClick={() =>
                      void handleSaveCurrent()
                    }
                    title="Save"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <Save size={13} />
                  </button>

                  <button
                    onClick={
                      copyCurrentCode
                    }
                    title="Copy"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <Copy size={13} />
                  </button>

                  <button
                    onClick={
                      downloadCurrentCode
                    }
                    title="Download"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <Download
                      size={13}
                    />
                  </button>

                  <div className="mx-1 h-4 w-px bg-white/[0.07]" />

                  <button
                    onClick={() =>
                      setIsAIOpen(true)
                    }
                    title="AI"
                    className="rounded-lg p-2 text-violet-300 transition hover:bg-violet-500/10"
                  >
                    <Sparkles
                      size={13}
                    />
                  </button>

                  <button
                    onClick={() =>
                      void handleRunCode()
                    }
                    title="Run"
                    className="rounded-lg p-2 text-emerald-400 transition hover:bg-emerald-500/10"
                  >
                    <Play
                      size={13}
                      fill="currentColor"
                    />
                  </button>
                </div>

                {/* Language badge */}
                <div className="absolute bottom-3 right-3 z-10 rounded-lg border border-white/[0.06] bg-[#0c1119]/90 px-2 py-1 font-mono text-[7px] text-slate-600 backdrop-blur">
                  {
                    LANGUAGE_LABELS[
                      activeLanguage
                    ]
                  }
                </div>
              </div>
            )}
          </div>

          {/* =================================================================
              TERMINAL
          ================================================================= */}

          {isTerminalOpen && (
            <>
              <div
                onPointerDown={() =>
                  beginResize("terminal")
                }
                className="group relative z-20 h-1 shrink-0 cursor-row-resize bg-transparent"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06] transition group-hover:bg-sky-400/40" />
              </div>

              <section
                style={{
                  height: terminalHeight,
                }}
                className="flex shrink-0 flex-col border-t border-white/[0.07] bg-[#070a0f]"
              >
                {/* terminal header */}
                <div className="flex h-9 shrink-0 items-center border-b border-white/[0.05] bg-[#0b0f15] px-3">
                  <div className="flex items-center gap-2">
                    <TerminalSquare
                      size={13}
                      className="text-emerald-400/70"
                    />

                    <span className="text-[9px] font-bold tracking-wider text-slate-400">
                      TERMINAL
                    </span>

                    <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[7px] text-slate-600">
                      PowerShell
                    </span>

                    <span className="hidden rounded bg-emerald-400/[0.06] px-1.5 py-0.5 text-[7px] text-emerald-400/60 sm:block">
                      {currentDirectory}
                    </span>
                  </div>

                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() =>
                        setTerminalLogs([])
                      }
                      className="rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
                      title="Clear"
                    >
                      <Trash2
                        size={11}
                      />
                    </button>

                    <button
                      onClick={() =>
                        setTerminalLogs(
                          (previous) => [
                            ...previous,
                            "",
                            "Terminal refreshed.",
                          ]
                        )
                      }
                      className="rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
                      title="Refresh"
                    >
                      <RotateCcw
                        size={11}
                      />
                    </button>

                    <button
                      onClick={() =>
                        setIsTerminalOpen(
                          false
                        )
                      }
                      className="rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
                      title="Close terminal"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* output */}
                <div
                  ref={
                    terminalScrollRef
                  }
                  className="min-h-0 flex-1 overflow-y-auto px-4 py-2.5 font-mono text-[9px] leading-5"
                >
                  {terminalLogs.map(
                    (line, index) => (
                      <div
                        key={`${index}-${line}`}
                        className={
                          line.startsWith(
                            "ERROR"
                          ) ||
                          line.startsWith("✗")
                            ? "text-red-400"
                            : line.startsWith(
                                "✓"
                              )
                            ? "text-emerald-400"
                            : line.startsWith(
                                ">"
                              )
                            ? "text-sky-300"
                            : "text-slate-500"
                        }
                      >
                        {line ||
                          "\u00A0"}
                      </div>
                    )
                  )}
                </div>

                {/* stdin */}
                <div className="hidden items-center gap-2 border-t border-white/[0.04] px-3 py-1.5 sm:flex">
                  <span className="text-[7px] uppercase tracking-wider text-slate-700">
                    stdin
                  </span>

                  <input
                    value={stdin}
                    onChange={(event) =>
                      setStdin(
                        event.target
                          .value
                      )
                    }
                    placeholder="Program input..."
                    className="min-w-0 flex-1 bg-transparent font-mono text-[8px] text-slate-400 outline-none placeholder:text-slate-800"
                  />
                </div>

                {/* prompt */}
                <form
                  onSubmit={
                    submitTerminalCommand
                  }
                  className="flex shrink-0 items-center gap-2 border-t border-white/[0.05] px-3 py-2"
                >
                  <span className="font-mono text-[9px] font-bold text-emerald-400">
                    PS
                  </span>

                  <span className="hidden font-mono text-[8px] text-slate-700 sm:block">
                    C:\AbhishekOS
                    {currentDirectory.replace(
                      "/",
                      "\\"
                    )}
                    &gt;
                  </span>

                  <input
                    ref={
                      terminalInputRef
                    }
                    value={terminalCommand}
                    onChange={(event) =>
                      setTerminalCommand(
                        event.target
                          .value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        "ArrowUp"
                      ) {
                        event.preventDefault();

                        if (
                          !commandHistory.length
                        )
                          return;

                        const nextIndex =
                          historyIndex ===
                          -1
                            ? commandHistory.length -
                              1
                            : Math.max(
                                0,
                                historyIndex -
                                  1
                              );

                        setHistoryIndex(
                          nextIndex
                        );

                        setTerminalCommand(
                          commandHistory[
                            nextIndex
                          ] || ""
                        );
                      }

                      if (
                        event.key ===
                        "ArrowDown"
                      ) {
                        event.preventDefault();

                        if (
                          historyIndex ===
                          -1
                        )
                          return;

                        const nextIndex =
                          historyIndex +
                          1;

                        if (
                          nextIndex >=
                          commandHistory.length
                        ) {
                          setHistoryIndex(
                            -1
                          );

                          setTerminalCommand(
                            ""
                          );

                          return;
                        }

                        setHistoryIndex(
                          nextIndex
                        );

                        setTerminalCommand(
                          commandHistory[
                            nextIndex
                          ] || ""
                        );
                      }
                    }}
                    className="min-w-0 flex-1 bg-transparent font-mono text-[9px] text-white outline-none placeholder:text-slate-800"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Type a command..."
                  />
                </form>
              </section>
            </>
          )}
        </main>
      </div>

      {/* =====================================================================
          AI PANEL
      ===================================================================== */}

      {isAIOpen && (
        <aside
          style={{
            width:
              window.innerWidth < 768
                ? undefined
                : aiWidth,
          }}
          className="absolute inset-y-12 right-0 z-[70] flex w-[calc(100vw-16px)] max-w-[520px] flex-col overflow-hidden border-l border-violet-400/[0.14] bg-[#0a0d14]/98 shadow-2xl backdrop-blur-2xl md:inset-y-12 md:right-0 md:w-[390px]"
        >
          <div
            onPointerDown={() =>
              beginResize("ai")
            }
            className="absolute inset-y-0 left-0 hidden w-1 cursor-col-resize md:block"
          />

          {/* AI header */}
          <div className="flex h-12 shrink-0 items-center gap-3 border-b border-white/[0.07] px-4">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/10">
              <Bot size={15} />

              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-bold text-white">
                Code AI
              </div>

              <div className="text-[8px] text-slate-600">
                Abhishek Developer Assistant
              </div>
            </div>

            <button
              onClick={() =>
                setIsAIOpen(false)
              }
              className="ml-auto rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          {/* AI content */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="relative mb-4 overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.08] to-sky-500/[0.025] p-4">
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-violet-300"
                />

                <span className="text-[10px] font-semibold text-violet-200">
                  AI coding assistant
                </span>
              </div>

              <p className="relative mt-2 text-[8px] leading-5 text-slate-600">
                Generate code, explain logic,
                fix bugs and improve the active
                file.
              </p>

              <div className="relative mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[7px] text-slate-600">
                  {LANGUAGE_LABELS[
                    activeLanguage
                  ]}
                </span>

                <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[7px] text-slate-600">
                  {lineCount} lines
                </span>
              </div>
            </div>

            <textarea
              value={aiPrompt}
              onChange={(event) =>
                setAIPrompt(
                  event.target.value
                )
              }
              placeholder="Tell AI what you want to build..."
              className="mb-3 h-28 w-full resize-none rounded-2xl border border-white/[0.07] bg-black/20 p-3 text-[9px] leading-5 text-white outline-none placeholder:text-slate-700 transition focus:border-violet-400/20 focus:bg-black/30"
            />

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  callAI("generate")
                }
                disabled={isAILoading}
                className="group rounded-xl border border-violet-400/10 bg-violet-500/[0.08] p-3 text-left transition hover:bg-violet-500/[0.13] disabled:opacity-50"
              >
                <Wand2
                  size={14}
                  className="mb-2 text-violet-300 transition group-hover:scale-110"
                />

                <div className="text-[9px] font-semibold text-violet-200">
                  Generate
                </div>

                <div className="mt-1 text-[7px] text-slate-700">
                  Create new code
                </div>
              </button>

              <button
                onClick={() =>
                  callAI("explain")
                }
                disabled={isAILoading}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:bg-white/[0.045] disabled:opacity-50"
              >
                <Lightbulb
                  size={14}
                  className="mb-2 text-amber-300"
                />

                <div className="text-[9px] font-semibold text-slate-300">
                  Explain
                </div>

                <div className="mt-1 text-[7px] text-slate-700">
                  Understand the code
                </div>
              </button>

              <button
                onClick={() =>
                  callAI("fix")
                }
                disabled={isAILoading}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:bg-white/[0.045] disabled:opacity-50"
              >
                <Bug
                  size={14}
                  className="mb-2 text-red-300"
                />

                <div className="text-[9px] font-semibold text-slate-300">
                  Fix
                </div>

                <div className="mt-1 text-[7px] text-slate-700">
                  Find and fix issues
                </div>
              </button>

              <button
                onClick={() =>
                  callAI("refactor")
                }
                disabled={isAILoading}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:bg-white/[0.045] disabled:opacity-50"
              >
                <Zap
                  size={14}
                  className="mb-2 text-sky-300"
                />

                <div className="text-[9px] font-semibold text-slate-300">
                  Refactor
                </div>

                <div className="mt-1 text-[7px] text-slate-700">
                  Improve structure
                </div>
              </button>
            </div>

            {isAILoading && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-violet-400/10 bg-violet-500/[0.05] p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                  <Loader2
                    size={14}
                    className="animate-spin text-violet-300"
                  />
                </div>

                <div>
                  <div className="text-[9px] font-medium text-violet-200">
                    AI is working...
                  </div>

                  <div className="mt-0.5 text-[7px] text-slate-700">
                    Analyzing your active file
                  </div>
                </div>
              </div>
            )}

            {aiResult && (
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20">
                <div className="flex items-center gap-2 border-b border-white/[0.05] px-3 py-2.5">
                  <Bot
                    size={13}
                    className="text-violet-300"
                  />

                  <span className="text-[9px] font-semibold text-slate-300">
                    AI Response
                  </span>
                </div>

                <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap p-3 font-mono text-[8px] leading-5 text-slate-500">
                  {aiResult.text ||
                    aiResult.explanation ||
                    aiResult.code ||
                    "No response."}
                </pre>
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.06] p-3">
            <div className="flex items-center gap-2 text-[7px] text-slate-700">
              <AlertCircle size={10} />

              API keys must stay on the
              server.
            </div>
          </div>
        </aside>
      )}

      {/* =====================================================================
          STATUS BAR
      ===================================================================== */}

      <footer className="flex h-6 shrink-0 items-center bg-[#0876a8] px-2.5 text-[8px] text-white">
        <div className="flex items-center gap-1.5">
          <GitBranch size={10} />
          main
        </div>

        <div className="ml-3 hidden items-center gap-1 sm:flex">
          <span className="opacity-50">
            •
          </span>

          <span>
            {isDirty[
              activeFilePath
            ]
              ? "Modified"
              : "Ready"}
          </span>
        </div>

        <div className="ml-3 hidden items-center gap-1 md:flex">
          <span className="opacity-50">
            •
          </span>

          <span>
            Ln {cursorPosition.line},
            Col {cursorPosition.column}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:block">
            {
              LANGUAGE_LABELS[
                activeLanguage
              ]
            }
          </span>

          <span>UTF-8</span>

          <span className="hidden sm:block">
            Spaces: 2
          </span>

          <span className="flex items-center gap-1">
            {isRunning ? (
              <>
                <Loader2
                  size={9}
                  className="animate-spin"
                />
                Running
              </>
            ) : (
              <>
                <Check size={9} />
                Ready
              </>
            )}
          </span>
        </div>
      </footer>

      {/* =====================================================================
          BROWSER PREVIEW
      ===================================================================== */}

      {showPreview && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-5">
          <div className="flex h-[94vh] w-[98vw] max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0b0e13] shadow-2xl">
            <div className="flex h-12 shrink-0 items-center gap-3 border-b border-white/[0.07] px-3 sm:px-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Globe size={14} />
              </div>

              <div>
                <div className="text-[10px] font-semibold text-white">
                  Browser Preview
                </div>

                <div className="hidden text-[7px] text-slate-700 sm:block">
                  {
                    basename(
                      activeFilePath
                    )
                  }
                </div>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() =>
                    setPreviewKey(
                      (previous) =>
                        previous + 1
                    )
                  }
                  className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
                  title="Refresh preview"
                >
                  <RefreshCw
                    size={13}
                  />
                </button>

                <button
                  onClick={() =>
                    setShowPreview(false)
                  }
                  className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 bg-white">
              <iframe
                key={previewKey}
                title="Code Preview"
                sandbox="allow-scripts allow-forms"
                srcDoc={htmlPreview}
                className="h-full w-full border-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          COMMAND PALETTE
      ===================================================================== */}

      {isPaletteOpen && (
        <div
          className="fixed inset-0 z-[110000] flex items-start justify-center bg-black/65 px-3 pt-[10vh] backdrop-blur-sm sm:px-0"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsPaletteOpen(false);
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#10151d]/98 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <Search
                size={16}
                className="text-slate-600"
              />

              <input
                ref={
                  paletteInputRef
                }
                autoFocus
                value={paletteQuery}
                onChange={(event) =>
                  setPaletteQuery(
                    event.target.value
                  )
                }
                placeholder="Search commands..."
                className="h-12 min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-slate-700"
              />

              <kbd className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 font-mono text-[7px] text-slate-700">
                ESC
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-1.5">
              {filteredPaletteActions.length ===
              0 ? (
                <div className="px-4 py-10 text-center">
                  <Command
                    size={24}
                    className="mx-auto mb-3 text-slate-700"
                  />

                  <div className="text-[9px] text-slate-600">
                    No commands found
                  </div>
                </div>
              ) : (
                filteredPaletteActions.map(
                  (item) => (
                    <button
                      key={item.id}
                      onClick={
                        item.action
                      }
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.05]"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-slate-500 transition group-hover:bg-sky-500/10 group-hover:text-sky-300">
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-medium text-slate-300 group-hover:text-white">
                          {item.label}
                        </div>

                        <div className="mt-0.5 truncate text-[7px] text-slate-700">
                          {item.description}
                        </div>
                      </div>

                      {item.shortcut && (
                        <kbd className="hidden rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 font-mono text-[7px] text-slate-700 sm:block">
                          {
                            item.shortcut
                          }
                        </kbd>
                      )}
                    </button>
                  )
                )
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2">
              <span className="text-[7px] text-slate-700">
                Abhishek Code Studio
              </span>

              <span className="text-[7px] text-slate-800">
                {filteredPaletteActions.length}{" "}
                commands
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SHORTCUTS
      ===================================================================== */}

      {showShortcuts && (
        <div className="fixed inset-0 z-[110000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d1219]/98 shadow-2xl">
            <div className="flex h-12 items-center gap-2 border-b border-white/[0.06] px-4">
              <Keyboard
                size={15}
                className="text-sky-400"
              />

              <span className="text-[10px] font-semibold">
                Keyboard Shortcuts
              </span>

              <button
                onClick={() =>
                  setShowShortcuts(
                    false
                  )
                }
                className="ml-auto rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-1 p-3">
              {[
                [
                  "Save file",
                  "Ctrl / Cmd + S",
                ],
                [
                  "Run file",
                  "Ctrl / Cmd + Enter",
                ],
                [
                  "Command palette",
                  "Ctrl / Cmd + Shift + P",
                ],
                [
                  "Quick command search",
                  "Ctrl / Cmd + P",
                ],
                [
                  "Toggle sidebar",
                  "Ctrl / Cmd + B",
                ],
                [
                  "Toggle terminal",
                  "Ctrl / Cmd + J",
                ],
                [
                  "Close overlays",
                  "Escape",
                ],
                [
                  "Terminal history",
                  "↑ / ↓",
                ],
                [
                  "Indent",
                  "Tab",
                ],
              ].map(
                ([label, shortcut]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/[0.025]"
                  >
                    <span className="text-[9px] text-slate-500">
                      {label}
                    </span>

                    <kbd className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[7px] text-slate-600">
                      {shortcut}
                    </kbd>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ERROR TOAST
      ===================================================================== */}

      {executionResult &&
        executionResult.exitCode !== 0 && (
          <div className="pointer-events-none fixed bottom-9 right-3 z-[120] w-[calc(100vw-24px)] max-w-[430px] overflow-hidden rounded-2xl border border-red-400/15 bg-[#130b0e]/95 shadow-2xl backdrop-blur-xl sm:right-4">
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <AlertCircle
                  size={14}
                />
              </div>

              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-red-300">
                  Program Error
                </div>

                <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-[8px] leading-5 text-red-300/60">
                  {executionResult.stderr ||
                    "Program exited with an error."}
                </pre>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CodeEditorApp;
export { CodeEditorApp };