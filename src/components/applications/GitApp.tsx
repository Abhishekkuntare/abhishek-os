import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  FileCode2,
  Plus,
  RefreshCw,
  Terminal as TerminalIcon,
  ChevronRight,
  ChevronDown,
  Upload,
  Copy,
  Check,
  X,
  Trash2,
  Play,
  Search,
  ShieldCheck,
  AlertCircle,
  Eye,
  Folder,
  File,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Hash,
  Clock3,
  HardDrive,
} from "lucide-react";

import { Buffer } from "buffer";
import git from "isomorphic-git";
import LightningFS from "@isomorphic-git/lightning-fs";

import { useOS } from "../../context/OSContext";

/* =========================================================
   BROWSER BUFFER POLYFILL
========================================================= */

if (
  typeof globalThis !== "undefined" &&
  !(globalThis as any).Buffer
) {
  (globalThis as any).Buffer = Buffer;
}

if (
  typeof window !== "undefined" &&
  !(window as any).Buffer
) {
  (window as any).Buffer = Buffer;
}

/* =========================================================
   TYPES
========================================================= */

type StatusKind =
  | "unmodified"
  | "modified"
  | "added"
  | "deleted"
  | "untracked"
  | "renamed";

interface GitStatusItem {
  filepath: string;
  status: StatusKind;
  staged: boolean;
}

interface CommitInfo {
  oid: string;
  message: string;
  author: string;
  email: string;
  timestamp: number;
  branch: string;
}

interface TerminalLine {
  id: number;
  type: "command" | "output" | "error" | "success" | "info";
  text: string;
}

interface DiffLine {
  type: "add" | "del" | "ctx";
  text: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const FS_NAME = "abhishek-os-git-studio-v2";
const REPO_DIR = "/workspace";

const AUTHOR_NAME = "Abhishek Kuntare";
const AUTHOR_EMAIL = "abhishekkuntare02@gmail.com";

/*
 * One persistent browser filesystem.
 */
const fs = new LightningFS(FS_NAME);
const pfs = fs.promises;

/* =========================================================
   HELPERS
========================================================= */

const isNotFoundError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  return (
    /notfound/i.test(message) ||
    /could not find/i.test(message) ||
    /does not exist/i.test(message) ||
    /no such file/i.test(message)
  );
};

const safeDecode = (
  data: Uint8Array | string
) => {
  if (typeof data === "string") {
    return data;
  }

  return new TextDecoder().decode(data);
};

const formatDate = (
  timestamp: number
) => {
  return new Date(
    timestamp * 1000
  ).toLocaleString();
};

/* =========================================================
   PATH HELPERS
========================================================= */

const normalizePath = (
  input: string,
  cwd: string
) => {
  let value = input.trim();

  if (!value) {
    return cwd;
  }

  /*
   * Remove surrounding quotes.
   */
  value = value.replace(
    /^["']|["']$/g,
    ""
  );

  /*
   * Expand ~ as the repository root.
   */
  if (
    value === "~" ||
    value.startsWith("~/")
  ) {
    value =
      REPO_DIR +
      value.slice(1);
  }

  /*
   * Absolute path.
   */
  if (value.startsWith("/")) {
    cwd = "/";
  } else {
    value =
      `${cwd}/${value}`;
  }

  const parts =
    value.split("/");

  const result: string[] = [];

  for (const part of parts) {
    if (
      !part ||
      part === "."
    ) {
      continue;
    }

    if (part === "..") {
      if (result.length) {
        result.pop();
      }
      continue;
    }

    result.push(part);
  }

  return "/" + result.join("/");
};

const displayPath = (
  absolutePath: string
) => {
  if (
    absolutePath === REPO_DIR
  ) {
    return "~";
  }

  if (
    absolutePath.startsWith(
      `${REPO_DIR}/`
    )
  ) {
    return (
      "~" +
      absolutePath.slice(
        REPO_DIR.length
      )
    );
  }

  return absolutePath;
};

const shellTokenize = (
  input: string
) => {
  const matches =
    input.match(
      /"[^"]*"|'[^']*'|[^\s]+/g
    ) || [];

  return matches.map((item) =>
    item.replace(
      /^["']|["']$/g,
      ""
    )
  );
};

const getBaseName = (
  filepath: string
) => {
  const parts =
    filepath.split("/");

  return (
    parts[parts.length - 1] ||
    filepath
  );
};

const getParentPath = (
  filepath: string
) => {
  const index =
    filepath.lastIndexOf("/");

  if (index <= 0) {
    return "/";
  }

  return filepath.slice(
    0,
    index
  );
};

/* =========================================================
   GIT APP
========================================================= */

const GitApp: React.FC = () => {
  const { openApp } = useOS();

  const terminalEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const terminalInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const initializationRef =
    useRef<Promise<void> | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [initialized, setInitialized] =
    useState(false);

  const [repoError, setRepoError] =
    useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<
      "graph" | "changes" | "terminal"
    >("graph");

  const [branch, setBranch] =
    useState("main");
 const [termin] =
    useState("main");

  const [branches, setBranches] =
    useState<string[]>([]);

  const [commits, setCommits] =
    useState<CommitInfo[]>([]);

  const [selectedCommit, setSelectedCommit] =
    useState<string | null>(null);

  const [statuses, setStatuses] =
    useState<GitStatusItem[]>([]);

  const [commitMessage, setCommitMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [operationBusy, setOperationBusy] =
    useState(false);

  const [showBranchMenu, setShowBranchMenu] =
    useState(false);

  const [showNewBranch, setShowNewBranch] =
    useState(false);

  const [newBranchName, setNewBranchName] =
    useState("");

  const [diffFile, setDiffFile] =
    useState<string | null>(null);

  const [diff, setDiff] =
    useState<DiffLine[]>([]);

  const [copied, setCopied] =
    useState(false);
    

  /* =======================================================
     REAL TERMINAL STATE
  ======================================================= */

  const [terminalCwd, setTerminalCwd] =
    useState(REPO_DIR);

  const [terminalHistory, setTerminalHistory] =
    useState<string[]>([]);

  const [historyIndex, setHistoryIndex] =
    useState(-1);

  const [terminalLines, setTerminalLines] =
    useState<TerminalLine[]>([
      {
        id: 1,
        type: "success",
        text:
          "Abhishek OS Git Terminal v1.0",
      },
      {
        id: 2,
        type: "info",
        text:
          "Browser shell connected to LightningFS.",
      },
      {
        id: 3,
        type: "info",
        text:
          'Type "help" to see available commands.',
      },
    ],
  );

  /* =======================================================
     TERMINAL OUTPUT
  ======================================================= */

  const addTerminal = useCallback(
    (
      type: TerminalLine["type"],
      text: string
    ) => {
      setTerminalLines(
        (previous) => [
          ...previous,
          {
            id:
              Date.now() +
              Math.floor(
                Math.random() * 10000
              ),
            type,
            text,
          },
        ]
      );
    },
    []
  );

  const clearTerminal = useCallback(
    () => {
      setTerminalLines([]);
    },
    []
  );


    const [terminalInput, setTerminalInput] = useState<string>('');
  /* =======================================================
     DIRECTORY HELPERS
  ======================================================= */

  const ensureDirectory =
    useCallback(
      async (path: string) => {
        if (
          path === "/" ||
          !path
        ) {
          return;
        }

        const parts =
          path
            .split("/")
            .filter(Boolean);

        let current = "";

        for (const part of parts) {
          current += `/${part}`;

          try {
            await pfs.mkdir(
              current
            );
          } catch (error) {
            if (
              !isNotFoundError(
                error
              )
            ) {
              /*
               * Directory probably already exists.
               */
            }
          }
        }
      },
      []
    );

  const pathExists =
    useCallback(
      async (path: string) => {
        try {
          await pfs.stat(path);
          return true;
        } catch {
          return false;
        }
      },
      []
    );

  const isDirectory =
    useCallback(
      async (path: string) => {
        try {
          const stat =
            await pfs.stat(path);

          return (
            stat.isDirectory()
          );
        } catch {
          return false;
        }
      },
      []
    );

  /* =======================================================
     REPOSITORY EXISTS
  ======================================================= */

  const repositoryExists =
    useCallback(
      async () => {
        try {
          await pfs.stat(
            `${REPO_DIR}/.git`
          );

          return true;
        } catch {
          return false;
        }
      },
      []
    );

  /* =======================================================
     HEAD
  ======================================================= */

  const hasHeadCommit =
    useCallback(
      async () => {
        try {
          const oid =
            await git.resolveRef({
              fs,
              dir: REPO_DIR,
              ref: "HEAD",
            });

          return Boolean(oid);
        } catch {
          return false;
        }
      },
      []
    );

  /* =======================================================
     INITIALIZE REPOSITORY
  ======================================================= */

  const refreshRepository =
    useCallback(
      async () => {
        /*
         * These are deliberately sequential.
         */
        await refreshCurrentBranch();
        await refreshBranches();
        await refreshStatus();
        await refreshLog();
      },
      []
    );

  const initializeRepository =
    useCallback(
      async () => {
        /*
         * Prevent duplicate initialization.
         */
        if (
          initializationRef.current
        ) {
          return initializationRef.current;
        }

        const task =
          (async () => {
            setLoading(true);
            setRepoError(null);

            try {
              await ensureDirectory(
                REPO_DIR
              );

              const exists =
                await repositoryExists();

              if (!exists) {
                await git.init({
                  fs,
                  dir: REPO_DIR,
                  defaultBranch:
                    "main",
                });
              }

              const hasCommit =
                await hasHeadCommit();

              if (!hasCommit) {
                const readme =
                  `# Abhishek OS\n\n` +
                  `Git repository managed by Abhishek Git Studio.\n\n` +
                  `This repository uses isomorphic-git and LightningFS.\n`;

                await pfs.writeFile(
                  `${REPO_DIR}/README.md`,
                  readme,
                  "utf8"
                );

                await git.add({
                  fs,
                  dir: REPO_DIR,
                  filepath:
                    "README.md",
                });

                await git.commit({
                  fs,
                  dir: REPO_DIR,
                  message:
                    "chore: initialize Abhishek OS repository",
                  author: {
                    name: AUTHOR_NAME,
                    email:
                      AUTHOR_EMAIL,
                  },
                });
              }

              if (
                !(await hasHeadCommit())
              ) {
                throw new Error(
                  "Git repository was initialized but the first commit could not be created."
                );
              }

              setInitialized(true);

              addTerminal(
                "success",
                "✓ Real Git repository ready."
              );

              addTerminal(
                "info",
                `Repository: ${REPO_DIR}`
              );

              addTerminal(
                "info",
                "Storage: browser IndexedDB"
              );

              await refreshRepository();
            } catch (error) {
              console.error(
                "Git initialization failed:",
                error
              );

              const message =
                error instanceof Error
                  ? error.message
                  : String(error);

              setRepoError(message);

              addTerminal(
                "error",
                `Git initialization failed: ${message}`
              );
            } finally {
              setLoading(false);
              initializationRef.current =
                null;
            }
          })();

        initializationRef.current =
          task;

        return task;
      },
      [
        addTerminal,
        ensureDirectory,
        repositoryExists,
        hasHeadCommit,
        refreshRepository,
      ]
    );

  /* =======================================================
     CURRENT BRANCH
  ======================================================= */

  const refreshCurrentBranch =
    useCallback(
      async () => {
        try {
          const hasCommit =
            await hasHeadCommit();

          if (!hasCommit) {
            setBranch("main");
            return "main";
          }

          const current =
            await git.currentBranch({
              fs,
              dir: REPO_DIR,
              fullname: false,
            });

          const value =
            current || "main";

          setBranch(value);

          return value;
        } catch (error) {
          if (
            isNotFoundError(error)
          ) {
            setBranch("main");
            return "main";
          }

          console.error(error);

          return "main";
        }
      },
      [hasHeadCommit]
    );

  /* =======================================================
     BRANCHES
  ======================================================= */

  const refreshBranches =
    useCallback(
      async () => {
        try {
          const list =
            await git.listBranches({
              fs,
              dir: REPO_DIR,
            });

          setBranches(list);

          if (!list.length) {
            setBranch("main");
            return;
          }

          await refreshCurrentBranch();
        } catch (error) {
          console.error(
            "Branch refresh failed:",
            error
          );

          setBranches(
            (previous) =>
              previous.length
                ? previous
                : ["main"]
          );
        }
      },
      [refreshCurrentBranch]
    );

  /* =======================================================
     STATUS
  ======================================================= */

  const refreshStatus =
    useCallback(
      async () => {
        try {
          const matrix =
            await git.statusMatrix({
              fs,
              dir: REPO_DIR,
            });

          const result: GitStatusItem[] =
            [];

          for (const row of matrix) {
            const filepath =
              String(row[0]);

            const head =
              Number(row[1]);

            const workdir =
              Number(row[2]);

            const stage =
              Number(row[3]);

            let status: StatusKind =
              "unmodified";

            if (
              head === 0 &&
              workdir === 2 &&
              stage === 0
            ) {
              status = "untracked";
            } else if (
              head === 0 &&
              workdir === 2 &&
              stage === 2
            ) {
              status = "added";
            } else if (
              head === 1 &&
              workdir === 2 &&
              stage === 1
            ) {
              status = "modified";
            } else if (
              head === 1 &&
              workdir === 0
            ) {
              status = "deleted";
            } else if (
              stage === 2
            ) {
              status = "modified";
            }

            if (
              status !==
              "unmodified"
            ) {
              result.push({
                filepath,
                status,
                staged:
                  stage === 2,
              });
            }
          }

          setStatuses(result);

          return result;
        } catch (error) {
          console.error(
            "Status refresh failed:",
            error
          );

          return [];
        }
      },
      []
    );

  /* =======================================================
     LOG
  ======================================================= */

  const refreshLog =
    useCallback(
      async () => {
        try {
          const hasCommit =
            await hasHeadCommit();

          if (!hasCommit) {
            setCommits([]);
            setSelectedCommit(null);
            return [];
          }

          const logs =
            await git.log({
              fs,
              dir: REPO_DIR,
              depth: 100,
            });

          const current =
            (await git.currentBranch({
              fs,
              dir: REPO_DIR,
              fullname: false,
            })) || "main";

          const result =
            logs.map(
              (entry) => ({
                oid: entry.oid,
                message:
                  entry.commit.message.trim(),
                author:
                  entry.commit.author
                    .name,
                email:
                  entry.commit.author
                    .email,
                timestamp:
                  entry.commit.author
                    .timestamp,
                branch: current,
              })
            );

          setCommits(result);

          setSelectedCommit(
            (previous) =>
              previous &&
              result.some(
                (item) =>
                  item.oid === previous
              )
                ? previous
                : result[0]?.oid ||
                    null
          );

          return result;
        } catch (error) {
          if (
            isNotFoundError(error)
          ) {
            setCommits([]);
            setSelectedCommit(null);
            return [];
          }

          console.error(
            "Log refresh failed:",
            error
          );

          return [];
        }
      },
      [hasHeadCommit]
    );

  /* =======================================================
     REFRESH REPOSITORY
  ======================================================= */

  const refreshAll =
    useCallback(
      async () => {
        if (!initialized) {
          return;
        }

        await refreshCurrentBranch();
        await refreshBranches();
        await refreshStatus();
        await refreshLog();
      },
      [
        initialized,
        refreshCurrentBranch,
        refreshBranches,
        refreshStatus,
        refreshLog,
      ]
    );

  /* =======================================================
     STARTUP
  ======================================================= */

  useEffect(() => {
    initializeRepository();
  }, [initializeRepository]);

  /* =======================================================
     STAGE
  ======================================================= */

  const stageFile =
    async (filepath: string) => {
      try {
        setOperationBusy(true);

        await git.add({
          fs,
          dir: REPO_DIR,
          filepath,
        });

        await refreshStatus();
      } catch (error) {
        addTerminal(
          "error",
          `Stage failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
      }
    };

  /* =======================================================
     STAGE ALL
  ======================================================= */

  const stageAll =
    async () => {
      try {
        setOperationBusy(true);

        const matrix =
          await git.statusMatrix({
            fs,
            dir: REPO_DIR,
          });

        for (
          const row of matrix
        ) {
          const filepath =
            String(row[0]);

          const head =
            Number(row[1]);

          const workdir =
            Number(row[2]);

          const stage =
            Number(row[3]);

          if (
            workdir === 2 ||
            stage === 2
          ) {
            if (
              head === 1 &&
              workdir === 0
            ) {
              try {
                await git.remove({
                  fs,
                  dir: REPO_DIR,
                  filepath,
                });
              } catch {
                // Continue.
              }
            } else {
              await git.add({
                fs,
                dir: REPO_DIR,
                filepath,
              });
            }
          }
        }

        await refreshStatus();
      } catch (error) {
        addTerminal(
          "error",
          `Stage all failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
      }
    };

  /* =======================================================
     UNSTAGE
  ======================================================= */

  const unstageFile =
    async (filepath: string) => {
      try {
        setOperationBusy(true);

        await git.resetIndex({
          fs,
          dir: REPO_DIR,
          filepath,
        });

        await refreshStatus();
      } catch (error) {
        addTerminal(
          "error",
          `Unstage failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
      }
    };

  /* =======================================================
     COMMIT
  ======================================================= */

  const createCommit =
    async () => {
      const message =
        commitMessage.trim();

      if (!message) {
        return;
      }

      try {
        setOperationBusy(true);

        await stageAll();

        const matrix =
          await git.statusMatrix({
            fs,
            dir: REPO_DIR,
          });

        const hasChanges =
          matrix.some(
            (row) =>
              Number(row[1]) !==
                Number(row[2]) ||
              Number(row[2]) !==
                Number(row[3])
          );

        if (!hasChanges) {
          addTerminal(
            "error",
            "Nothing to commit."
          );
          return;
        }

        const oid =
          await git.commit({
            fs,
            dir: REPO_DIR,
            message,
            author: {
              name: AUTHOR_NAME,
              email: AUTHOR_EMAIL,
            },
          });

        setCommitMessage("");

        setSelectedCommit(oid);

        addTerminal(
          "success",
          `[${branch} ${oid.slice(
            0,
            7
          )}] ${message}`
        );

        await refreshAll();

        setActiveTab("graph");
      } catch (error) {
        addTerminal(
          "error",
          `Commit failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
      }
    };

  /* =======================================================
     CREATE BRANCH
  ======================================================= */

  const createBranch =
    async () => {
      const name =
        newBranchName.trim();

      if (!name) return;

      try {
        setOperationBusy(true);

        if (
          !(await hasHeadCommit())
        ) {
          throw new Error(
            "Cannot create a branch before the repository has a commit."
          );
        }

        await git.branch({
          fs,
          dir: REPO_DIR,
          ref: name,
        });

        addTerminal(
          "success",
          `Created branch '${name}'`
        );

        setNewBranchName("");
        setShowNewBranch(false);

        await refreshBranches();
      } catch (error) {
        addTerminal(
          "error",
          `Branch creation failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
      }
    };

  /* =======================================================
     CHECKOUT
  ======================================================= */

  const checkoutBranch =
    async (name: string) => {
      if (!name) return;

      try {
        setOperationBusy(true);

        await git.checkout({
          fs,
          dir: REPO_DIR,
          ref: name,
        });

        setBranch(name);

        addTerminal(
          "success",
          `Switched to branch '${name}'`
        );

        await refreshAll();

        setShowBranchMenu(false);
      } catch (error) {
        addTerminal(
          "error",
          `Checkout failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
      }
    };

  /* =======================================================
     DELETE BRANCH
  ======================================================= */

  const deleteBranch =
    async (name: string) => {
      if (name === branch) {
        addTerminal(
          "error",
          "Cannot delete the currently checked-out branch."
        );
        return;
      }

      try {
        setOperationBusy(true);

        await git.deleteBranch({
          fs,
          dir: REPO_DIR,
          ref: name,
        });

        addTerminal(
          "success",
          `Deleted branch '${name}'`
        );

        await refreshBranches();
      } catch (error) {
        addTerminal(
          "error",
          `Delete branch failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
      }
    };

  /* =======================================================
     READ COMMIT FILE
  ======================================================= */

  const readFileFromCommit =
    async (
      oid: string,
      filepath: string
    ): Promise<string> => {
      const commit =
        await git.readCommit({
          fs,
          dir: REPO_DIR,
          oid,
        });

      const tree =
        await git.readTree({
          fs,
          dir: REPO_DIR,
          oid: commit.commit.tree,
        });

      const parts =
        filepath.split("/");

      const walk =
        async (
          entries: any[],
          remaining: string[]
        ): Promise<string> => {
          if (
            !remaining.length
          ) {
            return "";
          }

          const name =
            remaining[0];

          const entry =
            entries.find(
              (item) =>
                item.path === name
            );

          if (!entry) {
            return "";
          }

          if (
            entry.type ===
              "blob" &&
            remaining.length === 1
          ) {
            const blob =
              await git.readBlob({
                fs,
                dir: REPO_DIR,
                oid: entry.oid,
              });

            return safeDecode(
              blob.blob
            );
          }

          if (
            entry.type === "tree"
          ) {
            const child =
              await git.readTree({
                fs,
                dir: REPO_DIR,
                oid: entry.oid,
              });

            return walk(
              child.tree,
              remaining.slice(1)
            );
          }

          return "";
        };

      return walk(
        tree.tree,
        parts
      );
    };

  /* =======================================================
     DIFF
  ======================================================= */

  const loadDiff =
    async (
      filepath: string,
      commitOid?: string
    ) => {
      try {
        let oldContent = "";
        let newContent = "";

        if (commitOid) {
          try {
            oldContent =
              await readFileFromCommit(
                commitOid,
                filepath
              );
          } catch {
            oldContent = "";
          }
        }

        try {
          const current =
            await pfs.readFile(
              `${REPO_DIR}/${filepath}`,
              "utf8"
            );

          newContent =
            typeof current ===
            "string"
              ? current
              : safeDecode(
                  current
                );
        } catch {
          newContent = "";
        }

        const oldLines =
          oldContent.split("\n");

        const newLines =
          newContent.split("\n");

        const result: DiffLine[] =
          [];

        const max =
          Math.max(
            oldLines.length,
            newLines.length
          );

        for (
          let i = 0;
          i < max;
          i++
        ) {
          const oldLine =
            oldLines[i];

          const newLine =
            newLines[i];

          if (
            oldLine === newLine
          ) {
            if (
              newLine !==
              undefined
            ) {
              result.push({
                type: "ctx",
                text: `  ${newLine}`,
              });
            }
          } else {
            if (
              oldLine !==
              undefined
            ) {
              result.push({
                type: "del",
                text: `- ${oldLine}`,
              });
            }

            if (
              newLine !==
              undefined
            ) {
              result.push({
                type: "add",
                text: `+ ${newLine}`,
              });
            }
          }
        }

        setDiff(result);
        setDiffFile(filepath);
      } catch (error) {
        addTerminal(
          "error",
          `Diff failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     IMPORT FILES
  ======================================================= */

  const importFiles =
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files =
        event.target.files;

      if (!files?.length) {
        return;
      }

      try {
        setOperationBusy(true);

        for (
          const file of Array.from(
            files
          )
        ) {
          const relativePath =
            (file as any)
              .webkitRelativePath ||
            file.name;

          const cleanPath =
            relativePath.replace(
              /^\/+/,
              ""
            );

          const parts =
            cleanPath.split("/");

          parts.pop();

          let current =
            REPO_DIR;

          for (
            const part of parts
          ) {
            current += `/${part}`;

            await ensureDirectory(
              current
            );
          }

          const content =
            await file.arrayBuffer();

          await pfs.writeFile(
            `${REPO_DIR}/${cleanPath}`,
            new Uint8Array(content)
          );
        }

        await refreshStatus();

        setActiveTab("changes");

        addTerminal(
          "success",
          `Imported ${files.length} file${
            files.length === 1
              ? ""
              : "s"
          }.`
        );
      } catch (error) {
        addTerminal(
          "error",
          `Import failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      } finally {
        setOperationBusy(false);
        event.target.value = "";
      }
    };

  /* =======================================================
     EXPORT
  ======================================================= */

  const exportFile =
    async (
      filepath: string
    ) => {
      try {
        const data =
          await pfs.readFile(
            `${REPO_DIR}/${filepath}`
          );

        const blob =
          new Blob([data], {
            type:
              "application/octet-stream",
          });

        const url =
          URL.createObjectURL(
            blob
          );

        const anchor =
          document.createElement(
            "a"
          );

        anchor.href = url;
        anchor.download =
          getBaseName(filepath);

        document.body.appendChild(
          anchor
        );

        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
      } catch (error) {
        addTerminal(
          "error",
          `Export failed: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: LS
  ======================================================= */

  const terminalLs =
    async (
      args: string[]
    ) => {
      let target =
        terminalCwd;

      let showHidden = false;
      let longFormat = false;

      const paths: string[] =
        [];

      for (
        const arg of args
      ) {
        if (
          arg === "-a" ||
          arg === "--all"
        ) {
          showHidden = true;
        } else if (
          arg === "-l"
        ) {
          longFormat = true;
        } else if (
          arg === "-la" ||
          arg === "-al"
        ) {
          showHidden = true;
          longFormat = true;
        } else if (
          arg.startsWith("-")
        ) {
          /*
           * Ignore unsupported flags
           * gracefully.
           */
        } else {
          paths.push(arg);
        }
      }

      if (paths.length) {
        target =
          normalizePath(
            paths[0],
            terminalCwd
          );
      }

      try {
        const stat =
          await pfs.stat(
            target
          );

        if (
          !stat.isDirectory()
        ) {
          addTerminal(
            "output",
            getBaseName(target)
          );
          return;
        }

        const entries =
          await pfs.readdir(
            target
          );

        const visible =
          showHidden
            ? entries
            : entries.filter(
                (name) =>
                  !name.startsWith(
                    "."
                  )
              );

        visible.sort(
          (a, b) =>
            a.localeCompare(
              b
            )
        );

        if (!longFormat) {
          addTerminal(
            "output",
            visible
              .map(
                (name) =>
                  name
              )
              .join("    ") ||
              ""
          );

          return;
        }

        const rows: string[] =
          [];

        for (
          const name of visible
        ) {
          const full =
            `${target}/${name}`;

          const entryStat =
            await pfs.stat(
              full
            );

          const directory =
            entryStat.isDirectory();

          rows.push(
            `${directory ? "d" : "-"}  ${
              directory
                ? "DIR"
                : "FILE"
            }  ${name}`
          );
        }

        addTerminal(
          "output",
          rows.join("\n")
        );
      } catch {
        addTerminal(
          "error",
          `ls: cannot access '${target}': No such file or directory`
        );
      }
    };

  /* =======================================================
     TERMINAL: PWD
  ======================================================= */

  const terminalPwd =
    () => {
      addTerminal(
        "output",
        terminalCwd
      );
    };

  /* =======================================================
     TERMINAL: CD
  ======================================================= */

  const terminalCd =
    async (
      args: string[]
    ) => {
      const target =
        args[0] ||
        REPO_DIR;

      const resolved =
        normalizePath(
          target,
          terminalCwd
        );

      try {
        const stat =
          await pfs.stat(
            resolved
          );

        if (
          !stat.isDirectory()
        ) {
          addTerminal(
            "error",
            `cd: not a directory: ${target}`
          );
          return;
        }

        setTerminalCwd(
          resolved
        );
      } catch {
        addTerminal(
          "error",
          `cd: no such directory: ${target}`
        );
      }
    };

  /* =======================================================
     TERMINAL: CAT
  ======================================================= */

  const terminalCat =
    async (
      args: string[]
    ) => {
      if (!args.length) {
        addTerminal(
          "error",
          "cat: missing file operand"
        );
        return;
      }

      for (
        const argument of args
      ) {
        const filepath =
          normalizePath(
            argument,
            terminalCwd
          );

        try {
          const stat =
            await pfs.stat(
              filepath
            );

          if (
            stat.isDirectory()
          ) {
            addTerminal(
              "error",
              `cat: ${argument}: Is a directory`
            );
            continue;
          }

          const content =
            await pfs.readFile(
              filepath,
              "utf8"
            );

          addTerminal(
            "output",
            typeof content ===
              "string"
              ? content
              : safeDecode(
                  content
                )
          );
        } catch {
          addTerminal(
            "error",
            `cat: ${argument}: No such file or directory`
          );
        }
      }
    };

  /* =======================================================
     TERMINAL: TOUCH
  ======================================================= */

  const terminalTouch =
    async (
      args: string[]
    ) => {
      if (!args.length) {
        addTerminal(
          "error",
          "touch: missing file operand"
        );
        return;
      }

      for (
        const argument of args
      ) {
        const filepath =
          normalizePath(
            argument,
            terminalCwd
          );

        try {
          const exists =
            await pathExists(
              filepath
            );

          if (!exists) {
            await ensureDirectory(
              getParentPath(
                filepath
              )
            );

            await pfs.writeFile(
              filepath,
              "",
              "utf8"
            );
          }
        } catch (error) {
          addTerminal(
            "error",
            `touch: ${argument}: ${
              error instanceof Error
                ? error.message
                : String(error)
            }`
          );
        }
      }

      await refreshStatus();
    };

  /* =======================================================
     TERMINAL: MKDIR
  ======================================================= */

  const terminalMkdir =
    async (
      args: string[]
    ) => {
      if (!args.length) {
        addTerminal(
          "error",
          "mkdir: missing operand"
        );
        return;
      }

      for (
        const argument of args
      ) {
        const path =
          normalizePath(
            argument,
            terminalCwd
          );

        try {
          await ensureDirectory(
            path
          );
        } catch (error) {
          addTerminal(
            "error",
            `mkdir: ${argument}: ${
              error instanceof Error
                ? error.message
                : String(error)
            }`
          );
        }
      }

      await refreshStatus();
    };

  /* =======================================================
     TERMINAL: RM
  ======================================================= */

  const terminalRm =
    async (
      args: string[]
    ) => {
      const recursive =
        args.includes("-r") ||
        args.includes("-rf") ||
        args.includes("-fr");

      const targets =
        args.filter(
          (arg) =>
            !arg.startsWith("-")
        );

      if (!targets.length) {
        addTerminal(
          "error",
          "rm: missing operand"
        );
        return;
      }

      for (
        const argument of targets
      ) {
        const filepath =
          normalizePath(
            argument,
            terminalCwd
          );

        try {
          const stat =
            await pfs.stat(
              filepath
            );

          if (
            stat.isDirectory()
          ) {
            if (!recursive) {
              addTerminal(
                "error",
                `rm: ${argument}: Is a directory`
              );
              continue;
            }

            await removeDirectoryRecursive(
              filepath
            );
          } else {
            await pfs.unlink(
              filepath
            );
          }
        } catch {
          addTerminal(
            "error",
            `rm: cannot remove '${argument}': No such file or directory`
          );
        }
      }

      await refreshStatus();
    };

  /* =======================================================
     TERMINAL: RMDIR
  ======================================================= */

  const terminalRmdir =
    async (
      args: string[]
    ) => {
      if (!args.length) {
        addTerminal(
          "error",
          "rmdir: missing operand"
        );
        return;
      }

      for (
        const argument of args
      ) {
        const filepath =
          normalizePath(
            argument,
            terminalCwd
          );

        try {
          const entries =
            await pfs.readdir(
              filepath
            );

          if (entries.length) {
            addTerminal(
              "error",
              `rmdir: failed to remove '${argument}': Directory not empty`
            );
            continue;
          }

          await pfs.rmdir(
            filepath
          );
        } catch {
          addTerminal(
            "error",
            `rmdir: failed to remove '${argument}'`
          );
        }
      }

      await refreshStatus();
    };

  /* =======================================================
     TERMINAL: RECURSIVE DELETE
  ======================================================= */

  const removeDirectoryRecursive =
    async (
      directory: string
    ): Promise<void> => {
      const entries =
        await pfs.readdir(
          directory
        );

      for (
        const name of entries
      ) {
        const child =
          `${directory}/${name}`;

        const stat =
          await pfs.stat(
            child
          );

        if (
          stat.isDirectory()
        ) {
          await removeDirectoryRecursive(
            child
          );
        } else {
          await pfs.unlink(
            child
          );
        }
      }

      await pfs.rmdir(
        directory
      );
    };

  /* =======================================================
     TERMINAL: CP
  ======================================================= */

  const terminalCp =
    async (
      args: string[]
    ) => {
      if (
        args.length <
        2
      ) {
        addTerminal(
          "error",
          "cp: missing destination file operand"
        );
        return;
      }

      const source =
        normalizePath(
          args[0],
          terminalCwd
        );

      const destination =
        normalizePath(
          args[
            args.length - 1
          ],
          terminalCwd
        );

      try {
        const sourceStat =
          await pfs.stat(
            source
          );

        if (
          sourceStat.isDirectory()
        ) {
          addTerminal(
            "error",
            "cp: directory copying is not supported without -r"
          );
          return;
        }

        let finalDestination =
          destination;

        if (
          await isDirectory(
            destination
          )
        ) {
          finalDestination =
            `${destination}/${getBaseName(
              source
            )}`;
        }

        await ensureDirectory(
          getParentPath(
            finalDestination
          )
        );

        const data =
          await pfs.readFile(
            source
          );

        await pfs.writeFile(
          finalDestination,
          data
        );

        await refreshStatus();
      } catch (error) {
        addTerminal(
          "error",
          `cp: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: MV
  ======================================================= */

  const terminalMv =
    async (
      args: string[]
    ) => {
      if (
        args.length <
        2
      ) {
        addTerminal(
          "error",
          "mv: missing destination file operand"
        );
        return;
      }

      const source =
        normalizePath(
          args[0],
          terminalCwd
        );

      let destination =
        normalizePath(
          args[
            args.length - 1
          ],
          terminalCwd
        );

      try {
        if (
          await isDirectory(
            destination
          )
        ) {
          destination =
            `${destination}/${getBaseName(
              source
            )}`;
        }

        await ensureDirectory(
          getParentPath(
            destination
          )
        );

        const sourceStat =
          await pfs.stat(
            source
          );

        if (
          sourceStat.isDirectory()
        ) {
          addTerminal(
            "error",
            "mv: moving directories is not supported"
          );
          return;
        }

        const data =
          await pfs.readFile(
            source
          );

        await pfs.writeFile(
          destination,
          data
        );

        await pfs.unlink(
          source
        );

        await refreshStatus();
      } catch (error) {
        addTerminal(
          "error",
          `mv: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: TREE
  ======================================================= */

  const terminalTree =
    async (
      args: string[]
    ) => {
      const target =
        normalizePath(
          args[0] || ".",
          terminalCwd
        );

      try {
        const stat =
          await pfs.stat(
            target
          );

        if (
          !stat.isDirectory()
        ) {
          addTerminal(
            "output",
            getBaseName(target)
          );
          return;
        }

        const lines: string[] =
          [
            getBaseName(
              target
            ) || "/",
          ];

        const walk =
          async (
            directory: string,
            prefix: string
          ) => {
            const entries =
              await pfs.readdir(
                directory
              );

            entries.sort();

            for (
              let i = 0;
              i <
              entries.length;
              i++
            ) {
              const name =
                entries[i];

              const child =
                `${directory}/${name}`;

              const childStat =
                await pfs.stat(
                  child
                );

              const last =
                i ===
                entries.length - 1;

              lines.push(
                `${prefix}${
                  last
                    ? "└── "
                    : "├── "
                }${name}${
                  childStat.isDirectory()
                    ? "/"
                    : ""
                }`
              );

              if (
                childStat.isDirectory()
              ) {
                await walk(
                  child,
                  prefix +
                    (last
                      ? "    "
                      : "│   ")
                );
              }
            }
          };

        await walk(
          target,
          ""
        );

        addTerminal(
          "output",
          lines.join("\n")
        );
      } catch {
        addTerminal(
          "error",
          `tree: ${args[0] || "."}: No such directory`
        );
      }
    };

  /* =======================================================
     TERMINAL: FIND
  ======================================================= */

  const terminalFind =
    async (
      args: string[]
    ) => {
      const target =
        normalizePath(
          args[0] || ".",
          terminalCwd
        );

      const results: string[] =
        [];

      const walk =
        async (
          directory: string
        ) => {
          const entries =
            await pfs.readdir(
              directory
            );

          for (
            const name of entries
          ) {
            const child =
              `${directory}/${name}`;

            results.push(
              child
            );

            const stat =
              await pfs.stat(
                child
              );

            if (
              stat.isDirectory()
            ) {
              await walk(
                child
              );
            }
          }
        };

      try {
        await walk(target);

        const pattern =
          args.find(
            (arg) =>
              arg.startsWith("-name=")
          );

        let output =
          results;

        if (pattern) {
          const name =
            pattern
              .slice(6)
              .replace(
                /^["']|["']$/g,
                ""
              );

          output =
            results.filter(
              (path) =>
                getBaseName(
                  path
                ) === name
            );
        }

        addTerminal(
          "output",
          output
            .map(
              (path) =>
                path.startsWith(
                  REPO_DIR
                )
                  ? "~" +
                    path.slice(
                      REPO_DIR.length
                    )
                  : path
            )
            .join("\n")
        );
      } catch {
        addTerminal(
          "error",
          `find: ${target}: No such directory`
        );
      }
    };

  /* =======================================================
     TERMINAL: GREP
  ======================================================= */

  const terminalGrep =
    async (
      args: string[]
    ) => {
      if (
        args.length <
        2
      ) {
        addTerminal(
          "error",
          "grep: usage: grep <pattern> <file>"
        );
        return;
      }

      const pattern =
        args[0];

      const target =
        normalizePath(
          args[1],
          terminalCwd
        );

      try {
        const content =
          await pfs.readFile(
            target,
            "utf8"
          );

        const text =
          typeof content ===
          "string"
            ? content
            : safeDecode(
                content
              );

        const lines =
          text.split("\n");

        const matches =
          lines
            .map(
              (line, index) => ({
                line,
                index:
                  index + 1,
              })
            )
            .filter(
              (item) =>
                item.line
                  .toLowerCase()
                  .includes(
                    pattern.toLowerCase()
                  )
            );

        addTerminal(
          "output",
          matches
            .map(
              (item) =>
                `${item.index}:${item.line}`
            )
            .join("\n")
        );
      } catch {
        addTerminal(
          "error",
          `grep: ${args[1]}: No such file`
        );
      }
    };

  /* =======================================================
     TERMINAL: HEAD / TAIL
  ======================================================= */

  const terminalHeadTail =
    async (
      command: "head" | "tail",
      args: string[]
    ) => {
      if (!args.length) {
        addTerminal(
          "error",
          `${command}: missing file operand`
        );
        return;
      }

      const target =
        normalizePath(
          args[
            args.length - 1
          ],
          terminalCwd
        );

      let count = 10;

      const numberIndex =
        args.findIndex(
          (arg) =>
            /^-\d+$/.test(
              arg
            )
        );

      if (
        numberIndex !== -1
      ) {
        count = Number(
          args[
            numberIndex
          ].slice(1)
        );
      }

      try {
        const content =
          await pfs.readFile(
            target,
            "utf8"
          );

        const text =
          typeof content ===
          "string"
            ? content
            : safeDecode(
                content
              );

        const lines =
          text.split("\n");

        const output =
          command === "head"
            ? lines.slice(
                0,
                count
              )
            : lines.slice(
                -count
              );

        addTerminal(
          "output",
          output.join("\n")
        );
      } catch {
        addTerminal(
          "error",
          `${command}: ${args[args.length - 1]}: No such file`
        );
      }
    };

  /* =======================================================
     TERMINAL: WC
  ======================================================= */

  const terminalWc =
    async (
      args: string[]
    ) => {
      if (!args.length) {
        addTerminal(
          "error",
          "wc: missing file operand"
        );
        return;
      }

      const target =
        normalizePath(
          args[
            args.length - 1
          ],
          terminalCwd
        );

      try {
        const content =
          await pfs.readFile(
            target,
            "utf8"
          );

        const text =
          typeof content ===
          "string"
            ? content
            : safeDecode(
                content
              );

        const lines =
          text
            ? text.split(
                "\n"
              ).length
            : 0;

        const words =
          text.trim()
            ? text
                .trim()
                .split(
                  /\s+/
                ).length
            : 0;

        const chars =
          text.length;

        addTerminal(
          "output",
          `${lines} ${words} ${chars} ${getBaseName(
            target
          )}`
        );
      } catch {
        addTerminal(
          "error",
          `wc: ${args[args.length - 1]}: No such file`
        );
      }
    };

  /* =======================================================
     TERMINAL: ECHO
  ======================================================= */

  const terminalEcho =
    async (
      args: string[]
    ) => {
      const text =
        args.join(" ");

      addTerminal(
        "output",
        text
      );
    };

  /* =======================================================
     TERMINAL: HISTORY
  ======================================================= */

  const terminalHistoryCommand =
    () => {
      addTerminal(
        "output",
        terminalHistory
          .map(
            (command, index) =>
              `${String(
                index + 1
              ).padStart(
                3,
                " "
              )}  ${command}`
          )
          .join("\n")
      );
    };

  /* =======================================================
     TERMINAL: HELP
  ======================================================= */

  const terminalHelp =
    () => {
      addTerminal(
        "output",
        `Abhishek OS Terminal

FILE SYSTEM
  pwd                         Show current directory
  ls                          List files
  ls -la                      List all files
  cd <dir>                    Change directory
  cd ..                       Go to parent directory
  tree                        Show directory tree
  find .                      Find files
  cat <file>                  Print file
  head <file>                 First 10 lines
  tail <file>                 Last 10 lines
  grep <text> <file>          Search inside file
  wc <file>                   Count lines/words/chars
  touch <file>                Create file
  mkdir <dir>                 Create directory
  rm <file>                   Delete file
  rm -r <dir>                 Delete directory
  rmdir <dir>                 Delete empty directory
  cp <src> <dest>             Copy file
  mv <src> <dest>             Move/rename file

SHELL
  clear                       Clear terminal
  echo <text>                 Print text
  printf <text>               Print text
  history                     Command history
  whoami                      Current user
  date                        Current date/time
  help                        Show this help

GIT
  git status                  Show working tree status
  git add .                   Stage everything
  git add <file>              Stage file
  git restore --staged <file> Unstage file
  git commit -m "message"     Create commit
  git log                     Show commit history
  git branch                  List branches
  git branch <name>           Create branch
  git checkout <branch>       Switch branch
  git switch <branch>         Switch branch
  git diff                    Show working tree diff
  git remote                  Show remotes
  git show <commit>           Show commit
  git rev-parse HEAD          Show current commit
  git rev-parse --abbrev-ref HEAD
                              Show current branch
  git config                  Show Git identity

The terminal operates on:
  ${REPO_DIR}

Storage:
  LightningFS + IndexedDB

Note:
  This is a browser virtual shell.
  Commands requiring a real OS process such as
  npm, node, python, powershell, sudo and docker
  cannot execute inside the browser.`
      );
    };

  /* =======================================================
     TERMINAL: GIT STATUS
  ======================================================= */

  const terminalGitStatus =
    async () => {
      const current =
        await refreshCurrentBranch();

      const currentStatuses =
        await refreshStatus();

      if (
        currentStatuses.length ===
        0
      ) {
        addTerminal(
          "output",
          `On branch ${current}

nothing to commit, working tree clean`
        );

        return;
      }

      const staged =
        currentStatuses.filter(
          (item) =>
            item.staged
        );

      const unstaged =
        currentStatuses.filter(
          (item) =>
            !item.staged
        );

      const lines: string[] =
        [
          `On branch ${current}`,
          "",
        ];

      if (
        staged.length
      ) {
        lines.push(
          "Changes to be committed:"
        );

        for (
          const item of staged
        ) {
          lines.push(
            `  ${item.status.padEnd(
              12
            )}${item.filepath}`
          );
        }

        lines.push("");
      }

      if (
        unstaged.length
      ) {
        lines.push(
          "Changes not staged for commit:"
        );

        for (
          const item of unstaged
        ) {
          lines.push(
            `  ${item.status.padEnd(
              12
            )}${item.filepath}`
          );
        }

        lines.push("");
      }

      addTerminal(
        "output",
        lines.join("\n")
      );
    };

  /* =======================================================
     TERMINAL: GIT BRANCH
  ======================================================= */

  const terminalGitBranch =
    async (
      args: string[]
    ) => {
      /*
       * git branch <name>
       */
      if (
        args[0] &&
        !args[0].startsWith("-")
      ) {
        const name =
          args[0];

        try {
          await git.branch({
            fs,
            dir: REPO_DIR,
            ref: name,
          });

          await refreshBranches();

          addTerminal(
            "success",
            `Created branch '${name}'`
          );
        } catch (error) {
          addTerminal(
            "error",
            `fatal: ${
              error instanceof Error
                ? error.message
                : String(error)
            }`
          );
        }

        return;
      }

      const list =
        await git.listBranches({
          fs,
          dir: REPO_DIR,
        });

      const current =
        await refreshCurrentBranch();

      addTerminal(
        "output",
        list
          .map(
            (name) =>
              `${name === current ? "* " : "  "}${name}`
          )
          .join("\n")
      );
    };

  /* =======================================================
     TERMINAL: GIT LOG
  ======================================================= */

  const terminalGitLog =
    async (
      args: string[]
    ) => {
      const depthArg =
        args.find(
          (arg) =>
            /^-\d+$/.test(
              arg
            )
        );

      const depth =
        depthArg
          ? Number(
              depthArg.slice(1)
            )
          : 20;

      try {
        const logs =
          await git.log({
            fs,
            dir: REPO_DIR,
            depth,
          });

        if (!logs.length) {
          addTerminal(
            "output",
            "No commits yet."
          );
          return;
        }

        const output =
          logs
            .map(
              (entry) =>
                `commit ${entry.oid}
Author: ${entry.commit.author.name} <${entry.commit.author.email}>
Date:   ${formatDate(
                  entry.commit.author
                    .timestamp
                )}

    ${entry.commit.message.trim()}`
            )
            .join(
              "\n\n"
            );

        addTerminal(
          "output",
          output
        );
      } catch (error) {
        addTerminal(
          "error",
          `fatal: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: GIT COMMIT
  ======================================================= */

  const terminalGitCommit =
    async (
      args: string[]
    ) => {
      const mIndex =
        args.findIndex(
          (item) =>
            item === "-m"
        );

      if (
        mIndex === -1
      ) {
        addTerminal(
          "error",
          'git commit: missing -m "message"'
        );
        return;
      }

      const message =
        args[
          mIndex + 1
        ];

      if (!message) {
        addTerminal(
          "error",
          "git commit: empty commit message"
        );
        return;
      }

      try {
        await stageAll();

        const matrix =
          await git.statusMatrix({
            fs,
            dir: REPO_DIR,
          });

        const hasChanges =
          matrix.some(
            (row) =>
              Number(row[1]) !==
                Number(row[2]) ||
              Number(row[2]) !==
                Number(row[3])
          );

        if (!hasChanges) {
          addTerminal(
            "error",
            "nothing to commit, working tree clean"
          );
          return;
        }

        const oid =
          await git.commit({
            fs,
            dir: REPO_DIR,
            message,
            author: {
              name: AUTHOR_NAME,
              email: AUTHOR_EMAIL,
            },
          });

        await refreshAll();

        addTerminal(
          "success",
          `[${branch} ${oid.slice(
            0,
            7
          )}] ${message}`
        );
      } catch (error) {
        addTerminal(
          "error",
          `fatal: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: GIT CHECKOUT / SWITCH
  ======================================================= */

  const terminalGitCheckout =
    async (
      args: string[]
    ) => {
      if (!args[0]) {
        addTerminal(
          "error",
          "git checkout: branch name required"
        );
        return;
      }

      await checkoutBranch(
        args[0]
      );
    };

  /* =======================================================
     TERMINAL: GIT DIFF
  ======================================================= */

  const terminalGitDiff =
    async (
      args: string[]
    ) => {
      const currentStatuses =
        await refreshStatus();

      const target =
        args[0] ||
        currentStatuses[0]
          ?.filepath;

      if (!target) {
        addTerminal(
          "output",
          "No changes."
        );
        return;
      }

      try {
        const filepath =
          normalizePath(
            target,
            terminalCwd
          );

        const relative =
          filepath.startsWith(
            `${REPO_DIR}/`
          )
            ? filepath.slice(
                REPO_DIR.length + 1
              )
            : target;

        await loadDiff(
          relative
        );

        addTerminal(
          "success",
          `Diff loaded for ${relative}`
        );
      } catch (error) {
        addTerminal(
          "error",
          `fatal: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: GIT REMOTE
  ======================================================= */

  const terminalGitRemote =
    async (
      args: string[]
    ) => {
      try {
        const remotes =
          await git.listRemotes({
            fs,
            dir: REPO_DIR,
          });

        if (
          !remotes.length
        ) {
          addTerminal(
            "output",
            ""
          );
          return;
        }

        addTerminal(
          "output",
          remotes
            .map(
              (remote) =>
                `${remote.remote}\t${remote.url}`
            )
            .join("\n")
        );
      } catch (error) {
        addTerminal(
          "error",
          `fatal: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: GIT SHOW
  ======================================================= */

  const terminalGitShow =
    async (
      args: string[]
    ) => {
      let oid =
        args[0] ||
        "HEAD";

      try {
        if (
          oid === "HEAD"
        ) {
          oid =
            await git.resolveRef({
              fs,
              dir: REPO_DIR,
              ref: "HEAD",
            });
        }

        const commit =
          await git.readCommit({
            fs,
            dir: REPO_DIR,
            oid,
          });

        addTerminal(
          "output",
          `commit ${oid}
Author: ${commit.commit.author.name} <${commit.commit.author.email}>
Date:   ${formatDate(
            commit.commit.author
              .timestamp
          )}

    ${commit.commit.message.trim()}`
        );
      } catch (error) {
        addTerminal(
          "error",
          `fatal: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: GIT REV-PARSE
  ======================================================= */

  const terminalGitRevParse =
    async (
      args: string[]
    ) => {
      const ref =
        args[0] ||
        "HEAD";

      try {
        if (
          ref ===
            "--abbrev-ref" &&
          args[1] === "HEAD"
        ) {
          const current =
            await refreshCurrentBranch();

          addTerminal(
            "output",
            current
          );

          return;
        }

        const resolved =
          await git.resolveRef({
            fs,
            dir: REPO_DIR,
            ref,
          });

        addTerminal(
          "output",
          resolved
        );
      } catch (error) {
        addTerminal(
          "error",
          `fatal: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    };

  /* =======================================================
     TERMINAL: GIT CONFIG
  ======================================================= */

  const terminalGitConfig =
    () => {
      addTerminal(
        "output",
        `user.name=${AUTHOR_NAME}
user.email=${AUTHOR_EMAIL}`
      );
    };

  /* =======================================================
     REAL TERMINAL COMMAND EXECUTOR
  ======================================================= */

  const executeGitCommand =
    async (
      rawInput: string
    ) => {
      const raw =
        rawInput.trim();

      if (!raw) {
        return;
      }

      /*
       * Add command to shell history.
       */
      setTerminalHistory(
        (previous) => [
          ...previous,
          raw,
        ]
      );

      setHistoryIndex(-1);

      /*
       * Show shell prompt command.
       */
      addTerminal(
        "command",
        `${displayPath(
          terminalCwd
        )} $ ${raw}`
      );

      const command =
        shellTokenize(raw);

      const executable =
        command[0]?.toLowerCase();

      const args =
        command.slice(1);

      try {
        switch (
          executable
        ) {
          /* =========================================
             SHELL
          ========================================= */

          case "clear":
          case "cls": {
            clearTerminal();
            break;
          }

          case "pwd": {
            terminalPwd();
            break;
          }

          case "ls":
          case "dir": {
            await terminalLs(
              args
            );
            break;
          }

          case "cd": {
            await terminalCd(
              args
            );
            break;
          }

          case "cat": {
            await terminalCat(
              args
            );
            break;
          }

          case "touch": {
            await terminalTouch(
              args
            );
            break;
          }

          case "mkdir": {
            await terminalMkdir(
              args
            );
            break;
          }

          case "rm": {
            await terminalRm(
              args
            );
            break;
          }

          case "rmdir": {
            await terminalRmdir(
              args
            );
            break;
          }

          case "cp": {
            await terminalCp(
              args
            );
            break;
          }

          case "mv": {
            await terminalMv(
              args
            );
            break;
          }

          case "tree": {
            await terminalTree(
              args
            );
            break;
          }

          case "find": {
            await terminalFind(
              args
            );
            break;
          }

          case "grep": {
            await terminalGrep(
              args
            );
            break;
          }

          case "head": {
            await terminalHeadTail(
              "head",
              args
            );
            break;
          }

          case "tail": {
            await terminalHeadTail(
              "tail",
              args
            );
            break;
          }

          case "wc": {
            await terminalWc(
              args
            );
            break;
          }

          case "echo": {
            await terminalEcho(
              args
            );
            break;
          }

          case "printf": {
            await terminalEcho(
              args
            );
            break;
          }

          case "history": {
            terminalHistoryCommand();
            break;
          }

          case "whoami": {
            addTerminal(
              "output",
              AUTHOR_NAME
            );
            break;
          }

          case "date": {
            addTerminal(
              "output",
              new Date().toString()
            );
            break;
          }

          case "help": {
            terminalHelp();
            break;
          }

          /* =========================================
             GIT
          ========================================= */

          case "git": {
            const sub =
              args[0]?.toLowerCase();

            const gitArgs =
              args.slice(1);

            switch (
              sub
            ) {
              case "status":
                await terminalGitStatus();
                break;

              case "add":
                if (
                  gitArgs[0] ===
                  "."
                ) {
                  await stageAll();

                  addTerminal(
                    "success",
                    "All changes staged."
                  );
                } else if (
                  gitArgs[0]
                ) {
                  await stageFile(
                    gitArgs[0]
                  );

                  addTerminal(
                    "success",
                    `Staged ${gitArgs[0]}`
                  );
                } else {
                  addTerminal(
                    "error",
                    "Nothing specified, nothing added."
                  );
                }
                break;

              case "restore":
                if (
                  gitArgs[0] ===
                    "--staged" &&
                  gitArgs[1]
                ) {
                  await unstageFile(
                    gitArgs[1]
                  );

                  addTerminal(
                    "success",
                    `Unstaged ${gitArgs[1]}`
                  );
                } else {
                  addTerminal(
                    "error",
                    "Supported: git restore --staged <file>"
                  );
                }
                break;

              case "commit":
                await terminalGitCommit(
                  gitArgs
                );
                break;

              case "log":
                await terminalGitLog(
                  gitArgs
                );
                break;

              case "branch":
                await terminalGitBranch(
                  gitArgs
                );
                break;

              case "checkout":
              case "switch":
                await terminalGitCheckout(
                  gitArgs
                );
                break;

              case "diff":
                await terminalGitDiff(
                  gitArgs
                );
                break;

              case "remote":
                await terminalGitRemote(
                  gitArgs
                );
                break;

              case "show":
                await terminalGitShow(
                  gitArgs
                );
                break;

              case "rev-parse":
                await terminalGitRevParse(
                  gitArgs
                );
                break;

              case "config":
                terminalGitConfig();
                break;

              case "help":
              case undefined:
                terminalHelp();
                break;

              default:
                addTerminal(
                  "error",
                  `git: '${sub}' is not a supported command`
                );
                break;
            }

            break;
          }

          /* =========================================
             EMPTY
          ========================================= */

          case "":
          case undefined:
            break;

          /* =========================================
             UNKNOWN
          ========================================= */

          default:
            addTerminal(
              "error",
              `${executable}: command not found`
            );
            addTerminal(
              "info",
              'Type "help" to see available commands.'
            );
            break;
        }
      } catch (error) {
        addTerminal(
          "error",
          error instanceof Error
            ? error.message
            : String(error)
        );
      }

      setTerminalInput("");
    };

  /* =======================================================
     TERMINAL KEYBOARD
  ======================================================= */

  const handleTerminalKeyDown =
    (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (
        event.key ===
        "ArrowUp"
      ) {
        event.preventDefault();

        if (
          !terminalHistory.length
        ) {
          return;
        }

        const nextIndex =
          historyIndex === -1
            ? terminalHistory.length -
              1
            : Math.max(
                0,
                historyIndex - 1
              );

        setHistoryIndex(
          nextIndex
        );

        setTerminalInput(
          terminalHistory[
            nextIndex
          ]
        );
      }

      if (
        event.key ===
        "ArrowDown"
      ) {
        event.preventDefault();

        if (
          historyIndex === -1
        ) {
          return;
        }

        const nextIndex =
          historyIndex +
          1;

        if (
          nextIndex >=
          terminalHistory.length
        ) {
          setHistoryIndex(-1);
          setTerminalInput("");
          return;
        }

        setHistoryIndex(
          nextIndex
        );

        setTerminalInput(
          terminalHistory[
            nextIndex
          ]
        );
      }

      if (
        event.key ===
        "Tab"
      ) {
        event.preventDefault();

        const value =
          terminalInput;

        const tokens =
          shellTokenize(
            value
          );

        const last =
          tokens[
            tokens.length - 1
          ] || "";

        const base =
          last.includes("/")
            ? last.slice(
                0,
                last.lastIndexOf(
                  "/"
                ) + 1
              )
            : "";

        const prefix =
          last.slice(
            last.lastIndexOf(
              "/"
            ) + 1
          );

        const directory =
          normalizePath(
            base || ".",
            terminalCwd
          );

        pfs.readdir(
          directory
        )
          .then(
            (entries) => {
              const matches =
                entries.filter(
                  (entry) =>
                    entry.startsWith(
                      prefix
                    )
                );

              if (
                matches.length ===
                1
              ) {
                const completed =
                  `${base}${matches[0]}`;

                const before =
                  value.slice(
                    0,
                    value.length -
                      last.length
                  );

                setTerminalInput(
                  before +
                    completed
                );
              }
            }
          )
          .catch(() => {});
      }
    };

  /* =======================================================
     TERMINAL SCROLL
  ======================================================= */

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [terminalLines]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredCommits =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return commits;
      }

      return commits.filter(
        (commit) =>
          commit.message
            .toLowerCase()
            .includes(query) ||
          commit.author
            .toLowerCase()
            .includes(query) ||
          commit.oid
            .toLowerCase()
            .includes(query)
      );
    }, [
      commits,
      search,
    ]);

  /* =======================================================
     COPY HASH
  ======================================================= */

  const copyHash =
    async (
      hash: string
    ) => {
      try {
        await navigator.clipboard.writeText(
          hash
        );

        setCopied(true);

        setTimeout(
          () =>
            setCopied(
              false
            ),
          1500
        );
      } catch {
        // Clipboard unavailable.
      }
    };

  /* =======================================================
     LOADING UI
  ======================================================= */

  if (loading) {
    return (
      <div className="h-full w-full bg-[#060a12] flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-sky-500/30 blur-2xl animate-pulse" />

            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center shadow-2xl">
              <GitBranch className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>

          <h2 className="mt-5 text-sm font-bold">
            Starting Git Studio
          </h2>

          <p className="mt-1 text-[10px] text-slate-600">
            Initializing real Git repository...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR UI
  ======================================================= */

  if (
    repoError &&
    !initialized
  ) {
    return (
      <div className="h-full w-full bg-[#060a12] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold">
                Git initialization failed
              </h2>

              <p className="text-[10px] text-slate-500">
                The repository could not be started.
              </p>
            </div>
          </div>

          <pre className="mt-4 rounded-xl bg-black/30 p-3 text-[10px] text-red-300 whitespace-pre-wrap overflow-auto">
            {repoError}
          </pre>

          <button
            onClick={
              initializeRepository
            }
            className="mt-4 w-full h-9 rounded-lg bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="h-full w-full overflow-hidden bg-[#070b14] text-slate-200 flex flex-col font-sans">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="h-14 shrink-0 border-b border-white/[0.08] bg-[#0c1220]/95 backdrop-blur-xl px-3 md:px-5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-xl" />

            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center">
              <GitBranch className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white truncate">
                Abhishek Git Studio
              </h1>

              <span className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400">
                <ShieldCheck className="h-2.5 w-2.5" />
                REAL GIT
              </span>
            </div>

            <p className="text-[9px] text-slate-600">
              local repository • IndexedDB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={
              refreshAll
            }
            disabled={
              operationBusy
            }
            title="Refresh"
            className="h-8 w-8 rounded-lg border border-white/[0.07] bg-white/[0.035] flex items-center justify-center hover:bg-white/[0.08] active:scale-90 transition-all"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                operationBusy
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>

          <label
            title="Import files"
            className="h-8 w-8 rounded-lg border border-white/[0.07] bg-white/[0.035] flex items-center justify-center hover:bg-white/[0.08] active:scale-90 transition-all cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />

            <input
              type="file"
              multiple
              className="hidden"
              onChange={
                importFiles
              }
            />
          </label>
        </div>
      </header>

      {/* ===================================================
          BRANCH / TABS
      =================================================== */}

      <div className="h-11 shrink-0 border-b border-white/[0.06] bg-[#0a101c] px-3 md:px-5 flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() =>
              setShowBranchMenu(
                (value) =>
                  !value
              )
            }
            className="h-7 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center gap-2 hover:bg-white/[0.08] transition-all"
          >
            <GitBranch className="h-3.5 w-3.5 text-sky-400" />

            <span className="font-mono text-[10px] font-bold">
              {branch}
            </span>

            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          {showBranchMenu && (
            <div className="absolute z-50 top-9 left-0 w-64 rounded-xl border border-white/[0.1] bg-[#101827]/95 backdrop-blur-2xl shadow-2xl p-2">
              <div className="px-2 py-1.5 text-[8px] uppercase tracking-widest font-bold text-slate-600">
                Branches
              </div>

              {branches.map(
                (name) => (
                  <div
                    key={name}
                    className="flex items-center gap-1"
                  >
                    <button
                      onClick={() =>
                        checkoutBranch(
                          name
                        )
                      }
                      className="flex-1 flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/[0.06]"
                    >
                      <GitBranch
                        className={`h-3.5 w-3.5 ${
                          name ===
                          branch
                            ? "text-sky-400"
                            : "text-slate-600"
                        }`}
                      />

                      <span className="text-[10px]">
                        {name}
                      </span>

                      {name ===
                        branch && (
                        <Check className="ml-auto h-3 w-3 text-sky-400" />
                      )}
                    </button>

                    {name !==
                      branch && (
                      <button
                        onClick={() =>
                          deleteBranch(
                            name
                          )
                        }
                        className="h-7 w-7 rounded-md flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )
              )}

              <div className="border-t border-white/[0.06] mt-1 pt-1">
                {!showNewBranch ? (
                  <button
                    onClick={() =>
                      setShowNewBranch(
                        true
                      )
                    }
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/[0.06] text-[10px] text-sky-400"
                  >
                    <Plus className="h-3 w-3" />
                    New branch
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <input
                      autoFocus
                      value={
                        newBranchName
                      }
                      onChange={(e) =>
                        setNewBranchName(
                          e.target
                            .value
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key ===
                          "Enter"
                        ) {
                          createBranch();
                        }

                        if (
                          e.key ===
                          "Escape"
                        ) {
                          setShowNewBranch(
                            false
                          );
                        }
                      }}
                      placeholder="feature/my-feature"
                      className="flex-1 min-w-0 h-8 rounded-md bg-black/30 border border-white/[0.07] px-2 text-[9px] outline-none focus:border-sky-500/40"
                    />

                    <button
                      onClick={
                        createBranch
                      }
                      className="h-8 w-8 rounded-md bg-sky-500 text-slate-950 flex items-center justify-center"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-black/20 border border-white/[0.05] p-0.5">
          {(
            [
              ["graph", "Graph"],
              ["changes", "Changes"],
              [
                "terminal",
                "Terminal",
              ],
            ] as const
          ).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() =>
                  setActiveTab(
                    id
                  )
                }
                className={`px-2.5 md:px-3 py-1.5 rounded-md text-[9px] font-bold transition-all ${
                  activeTab === id
                    ? "bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/10"
                    : "text-slate-600 hover:text-white"
                }`}
              >
                {label}

                {id ===
                  "changes" &&
                  statuses.length >
                    0 && (
                    <span className="ml-1 px-1 rounded-full bg-orange-400 text-slate-950 text-[7px]">
                      {
                        statuses.length
                      }
                    </span>
                  )}
              </button>
            )
          )}
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="flex-1 min-h-0 overflow-hidden">
        {/* =================================================
            GRAPH
        ================================================= */}

        {activeTab ===
          "graph" && (
          <div className="h-full flex flex-col lg:flex-row">
            <section className="h-1/2 lg:h-full lg:w-[48%] border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col">
              <div className="h-11 shrink-0 px-3 flex items-center justify-between border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-3.5 w-3.5 text-sky-400" />

                  <span className="text-[9px] uppercase tracking-widest font-bold">
                    Commit History
                  </span>

                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-600">
                    {
                      commits.length
                    }
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-700" />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target
                          .value
                      )
                    }
                    placeholder="Search"
                    className="w-28 md:w-40 h-7 pl-7 rounded-md bg-white/[0.035] border border-white/[0.06] text-[9px] outline-none focus:border-sky-500/40"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredCommits.map(
                  (
                    commit,
                    index
                  ) => {
                    const selected =
                      commit.oid ===
                      selectedCommit;

                    return (
                      <div
                        key={
                          commit.oid
                        }
                        onClick={() =>
                          setSelectedCommit(
                            commit.oid
                          )
                        }
                        className={`relative flex gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selected
                            ? "bg-sky-500/[0.08] border-sky-400/30"
                            : "bg-white/[0.018] border-white/[0.05] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className={`h-3.5 w-3.5 rounded-full border-2 ${
                              selected
                                ? "bg-sky-400 border-white shadow-[0_0_12px_rgba(56,189,248,.5)]"
                                : "bg-[#101827] border-sky-500/40"
                            }`}
                          />

                          {index <
                            filteredCommits.length -
                              1 && (
                            <div className="w-px flex-1 min-h-8 bg-gradient-to-b from-sky-500/30 to-white/[0.04]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <code className="text-[9px] text-sky-400 font-bold">
                              {commit.oid.slice(
                                0,
                                7
                              )}
                            </code>

                            <span className="text-[8px] text-slate-700">
                              {formatDate(
                                commit.timestamp
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] font-semibold text-white">
                            {
                              commit.message
                            }
                          </p>

                          <p className="mt-1 text-[8px] text-slate-600 truncate">
                            {
                              commit.author
                            }
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}

                {filteredCommits.length ===
                  0 && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <GitCommit className="h-8 w-8 text-slate-800 mb-2" />

                    <p className="text-[10px] text-slate-600">
                      No commits
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="h-1/2 lg:h-full lg:flex-1 min-w-0 flex flex-col">
              <div className="h-11 shrink-0 px-3 border-b border-white/[0.05] flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest font-bold">
                  Commit Details
                </span>

                {selectedCommit && (
                  <button
                    onClick={() =>
                      copyHash(
                        selectedCommit
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[8px] font-mono"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}

                    {selectedCommit.slice(
                      0,
                      7
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {selectedCommit ? (
                  (() => {
                    const commit =
                      commits.find(
                        (item) =>
                          item.oid ===
                          selectedCommit
                      );

                    if (!commit)
                      return null;

                    return (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                          <div className="flex gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-500/10 flex items-center justify-center">
                              <GitCommit className="h-5 w-5 text-sky-400" />
                            </div>

                            <div className="min-w-0">
                              <h2 className="text-sm font-bold text-white">
                                {
                                  commit.message
                                }
                              </h2>

                              <p className="mt-1 text-[9px] text-slate-600">
                                {
                                  commit.author
                                }{" "}
                                •{" "}
                                {
                                  commit.email
                                }
                              </p>

                              <p className="mt-1 text-[8px] text-slate-700">
                                {formatDate(
                                  commit.timestamp
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-bold text-slate-700 mb-2">
                            Commit SHA
                          </p>

                          <div className="rounded-xl bg-black/20 border border-white/[0.05] p-3">
                            <code className="text-[8px] text-slate-500 break-all">
                              {
                                commit.oid
                              }
                            </code>
                          </div>
                        </div>

                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-bold text-slate-700 mb-2">
                            Working Tree
                          </p>

                          {statuses.length ===
                          0 ? (
                            <div className="rounded-xl border border-white/[0.05] p-6 text-center">
                              <CheckCircle2 className="h-7 w-7 mx-auto text-emerald-500/30 mb-2" />

                              <p className="text-[9px] text-slate-600">
                                Working tree
                                clean
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {statuses.map(
                                (
                                  item
                                ) => (
                                  <button
                                    key={
                                      item.filepath
                                    }
                                    onClick={() =>
                                      loadDiff(
                                        item.filepath,
                                        commit.oid
                                      )
                                    }
                                    className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05] hover:bg-white/[0.06] text-left"
                                  >
                                    <FileCode2 className="h-3.5 w-3.5 text-sky-400" />

                                    <span className="font-mono text-[9px] truncate flex-1">
                                      {
                                        item.filepath
                                      }
                                    </span>

                                    <ChevronRight className="h-3 w-3 text-slate-700" />
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-700">
                    Select a commit
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* =================================================
            CHANGES
        ================================================= */}

        {activeTab ===
          "changes" && (
          <div className="h-full overflow-y-auto p-3 md:p-5">
            <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Working Tree
                    </h2>

                    <p className="text-[9px] text-slate-600">
                      Real Git status
                    </p>
                  </div>

                  <button
                    onClick={
                      stageAll
                    }
                    disabled={
                      statuses.length ===
                        0 ||
                      operationBusy
                    }
                    className="h-8 px-3 rounded-lg bg-sky-500 text-slate-950 text-[9px] font-bold disabled:opacity-30"
                  >
                    Stage All
                  </button>
                </div>

                <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.018]">
                  {statuses.length ===
                  0 ? (
                    <div className="py-16 text-center">
                      <CheckCircle2 className="h-9 w-9 mx-auto text-emerald-500/30 mb-3" />

                      <p className="text-[10px] font-bold text-slate-500">
                        Working tree clean
                      </p>
                    </div>
                  ) : (
                    statuses.map(
                      (item) => (
                        <div
                          key={
                            item.filepath
                          }
                          className="group flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]"
                        >
                          <div className="h-7 w-7 rounded-lg bg-sky-500/10 flex items-center justify-center">
                            <FileCode2 className="h-3.5 w-3.5 text-sky-400" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-[10px] truncate">
                              {
                                item.filepath
                              }
                            </p>

                            <p className="text-[8px] text-slate-700">
                              {
                                item.status
                              }
                            </p>
                          </div>

                          {item.staged ? (
                            <button
                              onClick={() =>
                                unstageFile(
                                  item.filepath
                                )
                              }
                              className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[8px] font-bold"
                            >
                              Unstage
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                stageFile(
                                  item.filepath
                                )
                              }
                              className="px-2 py-1 rounded-md bg-sky-500/10 text-sky-400 text-[8px] font-bold"
                            >
                              Stage
                            </button>
                          )}

                          <button
                            onClick={() =>
                              loadDiff(
                                item.filepath
                              )
                            }
                            className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-white/[0.07]"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    )
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#101827] to-[#0b111d] p-4 h-fit">
                <div className="flex items-center gap-2 mb-4">
                  <GitCommit className="h-4 w-4 text-sky-400" />

                  <div>
                    <h3 className="text-xs font-bold">
                      Commit Changes
                    </h3>

                    <p className="text-[8px] text-slate-700">
                      {branch}
                    </p>
                  </div>
                </div>

                <textarea
                  value={
                    commitMessage
                  }
                  onChange={(e) =>
                    setCommitMessage(
                      e.target
                        .value
                    )
                  }
                  placeholder='feat: add something new'
                  className="w-full h-28 resize-none rounded-xl bg-black/20 border border-white/[0.07] p-3 text-[10px] font-mono outline-none focus:border-sky-500/40"
                />

                <button
                  onClick={
                    createCommit
                  }
                  disabled={
                    !commitMessage.trim() ||
                    statuses.length ===
                      0 ||
                    operationBusy
                  }
                  className="mt-3 w-full h-10 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 text-[10px] font-bold disabled:opacity-30"
                >
                  {operationBusy
                    ? "Working..."
                    : `Commit to ${branch}`}
                </button>
              </section>
            </div>
          </div>
        )}

        {/* =================================================
            TERMINAL
        ================================================= */}

        {activeTab ===
          "terminal" && (
          <div className="h-full flex flex-col bg-[#05080f]">
            <div className="h-10 shrink-0 px-4 flex items-center gap-2 border-b border-white/[0.05]">
              <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />

              <span className="text-[9px] font-mono text-slate-600 truncate">
                {displayPath(
                  terminalCwd
                )}
              </span>

              <span className="ml-auto hidden sm:block text-[8px] text-emerald-500/60">
                LIGHTNINGFS
              </span>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 font-mono text-[10px] cursor-text"
              onClick={() =>
                terminalInputRef.current?.focus()
              }
            >
              {terminalLines.map(
                (line) => (
                  <div
                    key={
                      line.id
                    }
                    className="mb-2 whitespace-pre-wrap break-words"
                  >
                    {line.type ===
                    "command" ? (
                      <div className="text-white">
                        {line.text}
                      </div>
                    ) : (
                      <div
                        className={
                          line.type ===
                          "error"
                            ? "text-red-400"
                            : line.type ===
                              "success"
                            ? "text-emerald-400"
                            : line.type ===
                              "info"
                            ? "text-sky-400/80"
                            : "text-slate-400"
                        }
                      >
                        {
                          line.text
                        }
                      </div>
                    )}
                  </div>
                )
              )}

              <div
                ref={
                  terminalEndRef
                }
              />
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                executeGitCommand(
                  terminalInput
                );
              }}
              className="min-h-12 shrink-0 border-t border-white/[0.06] px-4 flex items-center gap-2"
            >
              <span className="text-emerald-400 font-mono text-[10px] shrink-0">
                {displayPath(
                  terminalCwd
                )}
              </span>

              <span className="text-emerald-400 font-mono text-xs">
                $
              </span>

              <input
                ref={
                  terminalInputRef
                }
                autoFocus
                value={
                  terminalInput
                }
                onChange={(e) =>
                  setTerminalInput(
                    e.target
                      .value
                  )
                }
                onKeyDown={
                  handleTerminalKeyDown
                }
                placeholder="type help..."
                className="flex-1 min-w-0 bg-transparent outline-none text-[10px] font-mono text-white"
                spellCheck={false}
                autoComplete="off"
              />

              <button
                type="submit"
                className="h-7 w-7 shrink-0 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-all"
              >
                <Play className="h-3 w-3" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ===================================================
          DIFF MODAL
      =================================================== */}

      {diffFile && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center">
          <div className="w-full md:w-[90vw] md:max-w-5xl h-[85vh] md:h-[80vh] rounded-t-2xl md:rounded-2xl border border-white/[0.1] bg-[#0a101b] overflow-hidden flex flex-col shadow-2xl">
            <div className="h-12 shrink-0 px-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <FileCode2 className="h-4 w-4 text-sky-400" />

                <span className="font-mono text-[10px] truncate">
                  {diffFile}
                </span>
              </div>

              <button
                onClick={() => {
                  setDiffFile(
                    null
                  );
                  setDiff([]);
                }}
                className="h-7 w-7 rounded-md hover:bg-white/[0.07] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#05080e] p-3 font-mono text-[9px]">
              {diff.length ===
              0 ? (
                <div className="text-center text-slate-700 py-10">
                  No textual changes detected.
                </div>
              ) : (
                diff.map(
                  (
                    line,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className={`px-3 py-1 whitespace-pre-wrap ${
                        line.type ===
                        "add"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : line.type ===
                            "del"
                          ? "bg-red-500/10 text-red-300"
                          : "text-slate-600"
                      }`}
                    >
                      {
                        line.text
                      }
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="h-7 shrink-0 border-t border-white/[0.05] bg-[#090e18] px-3 md:px-5 flex items-center justify-between text-[8px] font-mono text-slate-700">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <GitBranch className="h-3 w-3 text-sky-500" />
            {branch}
          </span>

          <span>•</span>

          <span>
            {statuses.length} changes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            isomorphic-git
          </span>

          <span>•</span>

          <span className="text-emerald-500/60">
            BROWSER GIT TERMINAL
          </span>
        </div>
      </footer>
    </div>
  );
};

export default GitApp;