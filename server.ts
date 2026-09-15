// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import fs from "fs/promises";
// import os from "os";
// import path from "path";
// import crypto from "crypto";
// import { spawn } from "child_process";
// import { GoogleGenAI } from "@google/genai";

// dotenv.config();

// const app = express();

// /*
// |--------------------------------------------------------------------------
// | Configuration
// |--------------------------------------------------------------------------
// */

// const PORT = Number(process.env.SERVER_PORT || 8787);

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// /*
// |--------------------------------------------------------------------------
// | Middleware
// |--------------------------------------------------------------------------
// */

// app.use(
//   cors({
//     origin: true,
//     credentials: false,
//   })
// );

// app.use(
//   express.json({
//     limit: "1mb",
//   })
// );

// /*
// |--------------------------------------------------------------------------
// | AI
// |--------------------------------------------------------------------------
// */

// const ai = GEMINI_API_KEY
//   ? new GoogleGenAI({
//       apiKey: GEMINI_API_KEY,
//     })
//   : null;

// if (!GEMINI_API_KEY) {
//   console.warn(
//     "⚠ GEMINI_API_KEY is not configured. /api/ai will be unavailable."
//   );
// }

// /*
// |--------------------------------------------------------------------------
// | Types
// |--------------------------------------------------------------------------
// */

// type SupportedLanguage =
//   | "javascript"
//   | "typescript"
//   | "python"
//   | "cpp"
//   | "c"
//   | "java";

// interface ExecuteRequest {
//   language: SupportedLanguage;
//   code: string;
//   stdin?: string;
//   filename?: string;
// }

// interface ExecuteResult {
//   stdout: string;
//   stderr: string;
//   exitCode: number;
//   durationMs: number;
// }

// /*
// |--------------------------------------------------------------------------
// | Health Check
// |--------------------------------------------------------------------------
// */

// app.get("/api/health", (_req, res) => {
//   res.json({
//     ok: true,
//     service: "Abhishek Code Studio Server",
//     port: PORT,
//     ai: Boolean(ai),
//     platform: process.platform,
//     node: process.version,
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | Utility: Run Process
// |--------------------------------------------------------------------------
// */

// function runProcess(
//   command: string,
//   args: string[],
//   cwd: string,
//   stdin = "",
//   timeoutMs = 10000
// ): Promise<ExecuteResult> {
//   return new Promise((resolve) => {
//     const startedAt = Date.now();

//     let stdout = "";
//     let stderr = "";
//     let finished = false;

//     let child;

//     try {
//       child = spawn(command, args, {
//         cwd,
//         shell: false,
//         windowsHide: true,
//       });
//     } catch (error) {
//       resolve({
//         stdout: "",
//         stderr:
//           error instanceof Error
//             ? error.message
//             : "Failed to start process.",
//         exitCode: 1,
//         durationMs: Date.now() - startedAt,
//       });

//       return;
//     }

//     const finish = (exitCode: number) => {
//       if (finished) {
//         return;
//       }

//       finished = true;

//       resolve({
//         stdout,
//         stderr,
//         exitCode,
//         durationMs: Date.now() - startedAt,
//       });
//     };

//     const timeout = setTimeout(() => {
//       if (finished) {
//         return;
//       }

//       stderr += "\nProcess terminated: timeout.";

//       try {
//         child.kill("SIGKILL");
//       } catch {
//         // Ignore kill errors.
//       }

//       finish(124);
//     }, timeoutMs);

//     child.stdout?.on("data", (data: Buffer) => {
//       stdout += data.toString();
//     });

//     child.stderr?.on("data", (data: Buffer) => {
//       stderr += data.toString();
//     });

//     child.on("error", (error) => {
//       clearTimeout(timeout);

//       stderr +=
//         error instanceof Error
//           ? error.message
//           : "Process execution failed.";

//       finish(1);
//     });

//     child.on("close", (code) => {
//       clearTimeout(timeout);

//       finish(code ?? 0);
//     });

//     if (stdin) {
//       try {
//         child.stdin.write(stdin);
//       } catch {
//         // Ignore stdin write errors.
//       }
//     }

//     try {
//       child.stdin.end();
//     } catch {
//       // Ignore stdin close errors.
//     }
//   });
// }

// /*
// |--------------------------------------------------------------------------
// | Utility: Temporary Workspace
// |--------------------------------------------------------------------------
// */

// async function createWorkspace(
//   code: string,
//   filename: string
// ) {
//   const id = crypto
//     .randomBytes(12)
//     .toString("hex");

//   const directory = await fs.mkdtemp(
//     path.join(
//       os.tmpdir(),
//       `abhishek-code-${id}-`
//     )
//   );

//   const safeFilename = path.basename(filename);

//   const filePath = path.join(
//     directory,
//     safeFilename
//   );

//   await fs.writeFile(
//     filePath,
//     code,
//     "utf8"
//   );

//   return {
//     directory,
//     filePath,
//     filename: safeFilename,
//   };
// }

// async function cleanupWorkspace(
//   directory: string
// ) {
//   try {
//     await fs.rm(directory, {
//       recursive: true,
//       force: true,
//     });
//   } catch {
//     // Ignore cleanup failures.
//   }
// }

// /*
// |--------------------------------------------------------------------------
// | Utility: Filename
// |--------------------------------------------------------------------------
// */

// function getFilename(
//   language: SupportedLanguage,
//   requestedFilename?: string
// ) {
//   let filename =
//     requestedFilename?.trim() || "main";

//   filename = path.basename(filename);

//   const extensions: Record<
//     SupportedLanguage,
//     string
//   > = {
//     javascript: ".js",
//     typescript: ".ts",
//     python: ".py",
//     cpp: ".cpp",
//     c: ".c",
//     java: ".java",
//   };

//   const extension =
//     extensions[language];

//   if (!filename.toLowerCase().endsWith(extension)) {
//     filename =
//       filename.replace(
//         /\.[^/.]+$/,
//         ""
//       ) + extension;
//   }

//   return filename;
// }

// /*
// |--------------------------------------------------------------------------
// | Java Filename Helper
// |--------------------------------------------------------------------------
// |
// | Java requires:
// |
// | public class Main
// |
// | to be saved as:
// |
// | Main.java
// |
// |--------------------------------------------------------------------------
// */

// function getJavaFilename(
//   code: string,
//   requestedFilename?: string
// ) {
//   const publicClassMatch = code.match(
//     /\bpublic\s+class\s+([A-Za-z_$][\w$]*)/
//   );

//   if (publicClassMatch?.[1]) {
//     return `${publicClassMatch[1]}.java`;
//   }

//   return getFilename(
//     "java",
//     requestedFilename
//   );
// }

// /*
// |--------------------------------------------------------------------------
// | /api/ai
// |--------------------------------------------------------------------------
// */

// app.post(
//   "/api/ai",
//   async (req, res) => {
//     try {
//       if (!ai) {
//         res.status(500).json({
//           text:
//             "GEMINI_API_KEY is not configured on the server.",
//         });

//         return;
//       }

//       const {
//         action = "generate",
//         prompt = "",
//         code = "",
//         language = "javascript",
//         filename = "main",
//       } = req.body ?? {};

//       const instruction = `
// You are the AI coding assistant inside Abhishek Code Studio.

// File:
// ${filename}

// Language:
// ${language}

// Requested action:
// ${action}

// User request:
// ${prompt}

// Current code:
// ----------------
// ${code}
// ----------------

// Rules:

// 1. If action is "generate", produce complete working code.
// 2. If action is "fix", return corrected complete code.
// 3. If action is "refactor", improve the code while preserving behavior.
// 4. If action is "explain", explain the code clearly.
// 5. For code-generation actions, return ONLY the code.
// 6. Do not use markdown fences around generated code.
// 7. Keep the solution practical and executable.
// 8. Include all necessary imports.
// 9. Never expose API keys, credentials, tokens, or secrets.
// 10. If the requested language is C++, use standard C++17.
// 11. If the requested language is C, use standard C.
// 12. If the requested language is Python, produce Python 3 compatible code.
// 13. If the requested language is Java, provide a complete Java program.
// 14. For Java, make the public class name compatible with the filename.
// 15. If the user asks to add two numbers, create a complete runnable program that reads or clearly defines the inputs.
// 16. Do not add explanations around generated code.
// `;

//       const response =
//         await ai.models.generateContent({
//           model: "gemini-2.5-flash",
//           contents: instruction,
//         });

//       const text =
//         response.text?.trim() || "";

//       if (action === "explain") {
//         res.json({
//           text,
//         });

//         return;
//       }

//       const cleanedCode = text
//         .replace(
//           /^```[a-zA-Z0-9+#-]*\s*/i,
//           ""
//         )
//         .replace(
//           /\s*```$/i,
//           ""
//         )
//         .trim();

//       res.json({
//         code: cleanedCode,
//       });
//     } catch (error) {
//       console.error(
//         "AI error:",
//         error
//       );

//       res.status(500).json({
//         text:
//           error instanceof Error
//             ? error.message
//             : "AI request failed.",
//       });
//     }
//   }
// );

// /*
// |--------------------------------------------------------------------------
// | /api/execute
// |--------------------------------------------------------------------------
// */

// app.post(
//   "/api/execute",
//   async (req, res) => {
//     let workspace:
//       | Awaited<
//           ReturnType<typeof createWorkspace>
//         >
//       | null = null;

//     try {
//       const body =
//         req.body as Partial<ExecuteRequest>;

//       if (
//         !body ||
//         typeof body.code !== "string" ||
//         typeof body.language !== "string"
//       ) {
//         res.status(400).json({
//           stdout: "",
//           stderr:
//             "Invalid execution request. Expected language and code.",
//           exitCode: 1,
//           durationMs: 0,
//         });

//         return;
//       }

//       const language =
//         body.language as SupportedLanguage;

//       const supportedLanguages:
//         SupportedLanguage[] = [
//           "javascript",
//           "typescript",
//           "python",
//           "cpp",
//           "c",
//           "java",
//         ];

//       if (
//         !supportedLanguages.includes(
//           language
//         )
//       ) {
//         res.status(400).json({
//           stdout: "",
//           stderr:
//             `Language "${language}" is not supported.`,
//           exitCode: 1,
//           durationMs: 0,
//         });

//         return;
//       }

//       const stdin =
//         typeof body.stdin === "string"
//           ? body.stdin
//           : "";

//       /*
//       |--------------------------------------------------------------------------
//       | Filename
//       |--------------------------------------------------------------------------
//       */

//       let filename =
//         language === "java"
//           ? getJavaFilename(
//               body.code,
//               body.filename
//             )
//           : getFilename(
//               language,
//               body.filename
//             );

//       /*
//       |--------------------------------------------------------------------------
//       | Create temporary workspace
//       |--------------------------------------------------------------------------
//       */

//       workspace =
//         await createWorkspace(
//           body.code,
//           filename
//         );

//       /*
//       |--------------------------------------------------------------------------
//       | Java
//       |--------------------------------------------------------------------------
//       */

//       if (language === "java") {
//         const className =
//           filename.replace(
//             /\.java$/i,
//             ""
//           );

//         const compile =
//           await runProcess(
//             "javac",
//             [
//               workspace.filePath,
//             ],
//             workspace.directory,
//             "",
//             10000
//           );

//         if (
//           compile.exitCode !== 0
//         ) {
//           res.json({
//             stdout:
//               compile.stdout,
//             stderr:
//               compile.stderr,
//             exitCode:
//               compile.exitCode,
//             durationMs:
//               compile.durationMs,
//           });

//           return;
//         }

//         const result =
//           await runProcess(
//             "java",
//             [
//               "-cp",
//               workspace.directory,
//               className,
//             ],
//             workspace.directory,
//             stdin,
//             10000
//           );

//         res.json({
//           stdout:
//             result.stdout,
//           stderr:
//             compile.stderr +
//             result.stderr,
//           exitCode:
//             result.exitCode,
//           durationMs:
//             compile.durationMs +
//             result.durationMs,
//         });

//         return;
//       }

//       /*
//       |--------------------------------------------------------------------------
//       | Python
//       |--------------------------------------------------------------------------
//       */

//       if (language === "python") {
//         const pythonCommand =
//           process.platform ===
//           "win32"
//             ? "python"
//             : "python3";

//         const result =
//           await runProcess(
//             pythonCommand,
//             [
//               workspace.filePath,
//             ],
//             workspace.directory,
//             stdin,
//             10000
//           );

//         res.json(result);

//         return;
//       }

//       /*
//       |--------------------------------------------------------------------------
//       | C
//       |--------------------------------------------------------------------------
//       */

//       if (language === "c") {
//         const outputPath =
//           path.join(
//             workspace.directory,
//             process.platform ===
//             "win32"
//               ? "program.exe"
//               : "program"
//           );

//         const compile =
//           await runProcess(
//             "gcc",
//             [
//               workspace.filePath,
//               "-O2",
//               "-o",
//               outputPath,
//             ],
//             workspace.directory,
//             "",
//             10000
//           );

//         if (
//           compile.exitCode !== 0
//         ) {
//           res.json({
//             stdout:
//               compile.stdout,
//             stderr:
//               compile.stderr,
//             exitCode:
//               compile.exitCode,
//             durationMs:
//               compile.durationMs,
//           });

//           return;
//         }

//         const result =
//           await runProcess(
//             outputPath,
//             [],
//             workspace.directory,
//             stdin,
//             10000
//           );

//         res.json({
//           stdout:
//             result.stdout,
//           stderr:
//             compile.stderr +
//             result.stderr,
//           exitCode:
//             result.exitCode,
//           durationMs:
//             compile.durationMs +
//             result.durationMs,
//         });

//         return;
//       }

//       /*
//       |--------------------------------------------------------------------------
//       | C++
//       |--------------------------------------------------------------------------
//       */

//       if (language === "cpp") {
//         const outputPath =
//           path.join(
//             workspace.directory,
//             process.platform ===
//             "win32"
//               ? "program.exe"
//               : "program"
//           );

//         const compile =
//           await runProcess(
//             "g++",
//             [
//               workspace.filePath,
//               "-std=c++17",
//               "-O2",
//               "-o",
//               outputPath,
//             ],
//             workspace.directory,
//             "",
//             10000
//           );

//         if (
//           compile.exitCode !== 0
//         ) {
//           res.json({
//             stdout:
//               compile.stdout,
//             stderr:
//               compile.stderr,
//             exitCode:
//               compile.exitCode,
//             durationMs:
//               compile.durationMs,
//           });

//           return;
//         }

//         const result =
//           await runProcess(
//             outputPath,
//             [],
//             workspace.directory,
//             stdin,
//             10000
//           );

//         res.json({
//           stdout:
//             result.stdout,
//           stderr:
//             compile.stderr +
//             result.stderr,
//           exitCode:
//             result.exitCode,
//           durationMs:
//             compile.durationMs +
//             result.durationMs,
//         });

//         return;
//       }

//       /*
//       |--------------------------------------------------------------------------
//       | JavaScript
//       |--------------------------------------------------------------------------
//       */

//       if (
//         language ===
//         "javascript"
//       ) {
//         const result =
//           await runProcess(
//             process.execPath,
//             [
//               workspace.filePath,
//             ],
//             workspace.directory,
//             stdin,
//             10000
//           );

//         res.json(result);

//         return;
//       }

//       /*
//       |--------------------------------------------------------------------------
//       | TypeScript
//       |--------------------------------------------------------------------------
//       */

//       if (
//         language ===
//         "typescript"
//       ) {
//         const result =
//           await runProcess(
//             process.platform ===
//             "win32"
//               ? "npx.cmd"
//               : "npx",
//             [
//               "tsx",
//               workspace.filePath,
//             ],
//             workspace.directory,
//             stdin,
//             10000
//           );

//         res.json(result);

//         return;
//       }

//       /*
//       |--------------------------------------------------------------------------
//       | Fallback
//       |--------------------------------------------------------------------------
//       */

//       res.status(400).json({
//         stdout: "",
//         stderr:
//           `Language "${language}" is not supported.`,
//         exitCode: 1,
//         durationMs: 0,
//       });
//     } catch (error) {
//       console.error(
//         "Execution error:",
//         error
//       );

//       res.status(500).json({
//         stdout: "",
//         stderr:
//           error instanceof Error
//             ? error.message
//             : "Execution server error.",
//         exitCode: 1,
//         durationMs: 0,
//       });
//     } finally {
//       if (workspace) {
//         await cleanupWorkspace(
//           workspace.directory
//         );
//       }
//     }
//   }
// );

// /*
// |--------------------------------------------------------------------------
// | Server
// |--------------------------------------------------------------------------
// */

// app.listen(
//   PORT,
//   () => {
//     console.log("");
//     console.log(
//       "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
//     );
//     console.log(
//       "  Abhishek Code Studio Server"
//     );
//     console.log(
//       "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
//     );
//     console.log(
//       `  Server: http://localhost:${PORT}`
//     );
//     console.log(
//       `  Health: http://localhost:${PORT}/api/health`
//     );
//     console.log(
//       `  AI:     http://localhost:${PORT}/api/ai`
//     );
//     console.log(
//       `  Code:   http://localhost:${PORT}/api/execute`
//     );
//     console.log(
//       `  OS:     ${process.platform}`
//     );
//     console.log(
//       `  Node:   ${process.version}`
//     );
//     console.log(
//       "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
//     );
//     console.log("");
//   }
// );

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";
import { spawn } from "child_process";
import { GoogleGenAI } from "@google/genai";
import { transform } from "esbuild";
import youtubeRouter from "./server/routes/youtube";

dotenv.config();

const app = express();

/* ==========================================================================
| Configuration
|========================================================================== */

const PORT = Number(process.env.PORT || process.env.SERVER_PORT || 8787);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

/* ==========================================================================
| Middleware
|========================================================================== */

app.use(
  cors({
    origin: CLIENT_ORIGIN === "*" ? true : CLIENT_ORIGIN,
    credentials: false,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

/* ==========================================================================
| AI
|========================================================================== */

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    })
  : null;

if (!GEMINI_API_KEY) {
  console.warn(
    "⚠ GEMINI_API_KEY is not configured. /api/ai will be unavailable."
  );
}

/* ==========================================================================
| YouTube
|========================================================================== */

if (!YOUTUBE_API_KEY) {
  console.warn(
    "⚠ YOUTUBE_API_KEY is not configured. /api/youtube will be unavailable."
  );
}

const YOUTUBE_API_BASE =
  "https://www.googleapis.com/youtube/v3";

/* ==========================================================================
| Types
|========================================================================== */

type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "cpp"
  | "c"
  | "java";

interface ExecuteRequest {
  language: SupportedLanguage;
  code: string;
  stdin?: string;
  filename?: string;
}

interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

/* ==========================================================================
| YouTube Types
|========================================================================== */

type YouTubeSearchOrder =
  | "relevance"
  | "date"
  | "rating"
  | "viewCount"
  | "title";

type YouTubeSafeSearch =
  | "none"
  | "moderate"
  | "strict";

interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface YouTubeSnippet {
  title?: string;
  description?: string;
  channelId?: string;
  channelTitle?: string;
  publishedAt?: string;
  liveBroadcastContent?: string;
  thumbnails?: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
}

interface YouTubeStatistics {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

interface YouTubeContentDetails {
  duration?: string;
  dimension?: string;
  definition?: string;
  caption?: string;
  licensedContent?: boolean;
}

interface YouTubeStatus {
  embeddable?: boolean;
  privacyStatus?: string;
}

interface YouTubeVideoResource {
  id: string;
  snippet?: YouTubeSnippet;
  statistics?: YouTubeStatistics;
  contentDetails?: YouTubeContentDetails;
  status?: YouTubeStatus;
}

interface YouTubeSearchResource {
  id?: {
    kind?: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet?: YouTubeSnippet;
}

interface YouTubeChannelResource {
  id: string;
  snippet?: {
    thumbnails?: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
  };
}

interface YouTubeApiResponse<T> {
  items?: T[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo?: {
    totalResults?: number;
    resultsPerPage?: number;
  };
}

interface NormalizedYouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  publishedAt: string;
  thumbnail: string;
  thumbnailMedium: string;
  thumbnailHigh: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  definition: string;
  caption: string;
  liveBroadcastContent: string;
  embeddable: boolean;
  youtubeUrl: string;
  embedUrl: string;
}

/* ==========================================================================
| Health Check
|========================================================================== */

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Abhishek Code Studio Server",
    port: PORT,
    ai: Boolean(ai),
    youtube: Boolean(YOUTUBE_API_KEY),
    platform: process.platform,
    node: process.version,
  });
});

/* ==========================================================================
| Utility: Run Process
|========================================================================== */

function runProcess(
  command: string,
  args: string[],
  cwd: string,
  stdin = "",
  timeoutMs = 10000
): Promise<ExecuteResult> {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    let stdout = "";
    let stderr = "";
    let finished = false;

    let child;

    try {
      child = spawn(command, args, {
        cwd,
        shell: false,
        windowsHide: true,
      });
    } catch (error) {
      resolve({
        stdout: "",
        stderr:
          error instanceof Error
            ? error.message
            : "Failed to start process.",
        exitCode: 1,
        durationMs: Date.now() - startedAt,
      });

      return;
    }

    const finish = (exitCode: number) => {
      if (finished) {
        return;
      }

      finished = true;

      resolve({
        stdout,
        stderr,
        exitCode,
        durationMs: Date.now() - startedAt,
      });
    };

    const timeout = setTimeout(() => {
      if (finished) {
        return;
      }

      stderr += "\nProcess terminated: timeout.";

      try {
        child.kill("SIGKILL");
      } catch {
        // Ignore kill errors.
      }

      finish(124);
    }, timeoutMs);

    child.stdout?.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timeout);

      stderr +=
        error instanceof Error
          ? error.message
          : "Process execution failed.";

      finish(1);
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      finish(code ?? 0);
    });

    if (stdin) {
      try {
        child.stdin.write(stdin);
      } catch {
        // Ignore stdin write errors.
      }
    }

    try {
      child.stdin.end();
    } catch {
      // Ignore stdin close errors.
    }
  });
}

/* ==========================================================================
| Utility: Temporary Workspace
|========================================================================== */

async function createWorkspace(
  code: string,
  filename: string
) {
  const id = crypto
    .randomBytes(12)
    .toString("hex");

  const directory = await fs.mkdtemp(
    path.join(
      os.tmpdir(),
      `abhishek-code-${id}-`
    )
  );

  const safeFilename = path.basename(filename);

  const filePath = path.join(
    directory,
    safeFilename
  );

  await fs.writeFile(
    filePath,
    code,
    "utf8"
  );

  return {
    directory,
    filePath,
    filename: safeFilename,
  };
}

async function cleanupWorkspace(
  directory: string
) {
  try {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  } catch {
    // Ignore cleanup failures.
  }
}

/* ==========================================================================
| Utility: Filename
|========================================================================== */

function getFilename(
  language: SupportedLanguage,
  requestedFilename?: string
) {
  let filename =
    requestedFilename?.trim() || "main";

  filename = path.basename(filename);

  const extensions: Record<
    SupportedLanguage,
    string
  > = {
    javascript: ".js",
    typescript: ".ts",
    python: ".py",
    cpp: ".cpp",
    c: ".c",
    java: ".java",
  };

  const extension =
    extensions[language];

  if (
    !filename
      .toLowerCase()
      .endsWith(extension)
  ) {
    filename =
      filename.replace(
        /\.[^/.]+$/,
        ""
      ) + extension;
  }

  return filename;
}

/* ==========================================================================
| Java Filename Helper
|========================================================================== */

function getJavaFilename(
  code: string,
  requestedFilename?: string
) {
  const publicClassMatch =
    code.match(
      /\bpublic\s+class\s+([A-Za-z_$][\w$]*)/
    );

  if (publicClassMatch?.[1]) {
    return `${publicClassMatch[1]}.java`;
  }

  return getFilename(
    "java",
    requestedFilename
  );
}

/* ==========================================================================
| YouTube Utility: API Request
|========================================================================== */

async function youtubeRequest<T>(
  endpoint: string,
  params: Record<
    string,
    string | number | undefined
  >
): Promise<T> {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "YOUTUBE_API_KEY is not configured on the server."
    );
  }

  const url = new URL(
    `${YOUTUBE_API_BASE}/${endpoint}`
  );

  url.searchParams.set(
    "key",
    YOUTUBE_API_KEY
  );

  for (const [key, value] of Object.entries(
    params
  )) {
    if (
      value !== undefined &&
      value !== ""
    ) {
      url.searchParams.set(
        key,
        String(value)
      );
    }
  }

  const response = await fetch(
    url.toString()
  );

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `YouTube API request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return data as T;
}

/* ==========================================================================
| YouTube Utility: Simple Server Cache
|========================================================================== */

interface YouTubeCacheEntry {
  expiresAt: number;
  data: unknown;
}

const youtubeCache =
  new Map<
    string,
    YouTubeCacheEntry
  >();

const YOUTUBE_CACHE_TTL =
  60 * 1000;

function getYouTubeCache<T>(
  key: string
): T | null {
  const cached =
    youtubeCache.get(key);

  if (!cached) {
    return null;
  }

  if (
    cached.expiresAt <
    Date.now()
  ) {
    youtubeCache.delete(key);
    return null;
  }

  return cached.data as T;
}

function setYouTubeCache(
  key: string,
  data: unknown
) {
  youtubeCache.set(key, {
    data,
    expiresAt:
      Date.now() +
      YOUTUBE_CACHE_TTL,
  });

  // Keep memory under control.
  if (
    youtubeCache.size > 100
  ) {
    const firstKey =
      youtubeCache.keys().next()
        .value;

    if (firstKey) {
      youtubeCache.delete(
        firstKey
      );
    }
  }
}

/* ==========================================================================
| YouTube Utility: Thumbnail
|========================================================================== */

function getBestThumbnail(
  thumbnails:
    | YouTubeSnippet["thumbnails"]
    | undefined
) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

function getMediumThumbnail(
  thumbnails:
    | YouTubeSnippet["thumbnails"]
    | undefined
) {
  return (
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

function getHighThumbnail(
  thumbnails:
    | YouTubeSnippet["thumbnails"]
    | undefined
) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.high?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

/* ==========================================================================
| YouTube Utility: Channel Thumbnails
|========================================================================== */

async function getChannelThumbnails(
  channelIds: string[]
) {
  const uniqueIds = [
    ...new Set(
      channelIds.filter(Boolean)
    ),
  ];

  if (!uniqueIds.length) {
    return new Map<
      string,
      string
    >();
  }

  const response =
    await youtubeRequest<
      YouTubeApiResponse<YouTubeChannelResource>
    >(
      "channels",
      {
        part: "snippet",
        id: uniqueIds.join(","),
      }
    );

  const result =
    new Map<
      string,
      string
    >();

  for (const channel of
    response.items || []) {
    const thumbnail =
      channel.snippet
        ?.thumbnails
        ?.high?.url ||
      channel.snippet
        ?.thumbnails
        ?.medium?.url ||
      channel.snippet
        ?.thumbnails
        ?.default?.url ||
      "";

    result.set(
      channel.id,
      thumbnail
    );
  }

  return result;
}

/* ==========================================================================
| YouTube Utility: Normalize Video
|========================================================================== */

function normalizeVideo(
  video: YouTubeVideoResource,
  channelThumbnail = ""
): NormalizedYouTubeVideo {
  const snippet =
    video.snippet || {};

  const contentDetails =
    video.contentDetails || {};

  const statistics =
    video.statistics || {};

  const status =
    video.status || {};

  const id = video.id;

  const youtubeUrl =
    `https://www.youtube.com/watch?v=${id}`;

  const embedUrl =
    `https://www.youtube.com/embed/${id}`;

  return {
    id,

    title:
      snippet.title || "Untitled video",

    description:
      snippet.description || "",

    channelId:
      snippet.channelId || "",

    channelTitle:
      snippet.channelTitle ||
      "Unknown channel",

    channelThumbnail,

    publishedAt:
      snippet.publishedAt || "",

    thumbnail:
      getBestThumbnail(
        snippet.thumbnails
      ),

    thumbnailMedium:
      getMediumThumbnail(
        snippet.thumbnails
      ),

    thumbnailHigh:
      getHighThumbnail(
        snippet.thumbnails
      ),

    duration:
      contentDetails.duration ||
      "PT0S",

    viewCount:
      Number(
        statistics.viewCount || 0
      ),

    likeCount:
      Number(
        statistics.likeCount || 0
      ),

    commentCount:
      Number(
        statistics.commentCount || 0
      ),

    definition:
      contentDetails.definition ||
      "",

    caption:
      contentDetails.caption ||
      "",

    liveBroadcastContent:
      snippet.liveBroadcastContent ||
      "none",

    embeddable:
      status.embeddable !== false,

    youtubeUrl,

    embedUrl,
  };
}

/* ==========================================================================
| YouTube Utility: Search Videos
|========================================================================== */

async function searchYouTubeVideos({
  query,
  order,
  regionCode,
  safeSearch,
  pageToken,
  maxResults,
}: {
  query: string;
  order: YouTubeSearchOrder;
  regionCode: string;
  safeSearch: YouTubeSafeSearch;
  pageToken?: string;
  maxResults: number;
}) {
  const cacheKey = JSON.stringify({
    type: "search",
    query,
    order,
    regionCode,
    safeSearch,
    pageToken,
    maxResults,
  });

  const cached =
    getYouTubeCache<{
      items: NormalizedYouTubeVideo[];
      nextPageToken?: string;
      prevPageToken?: string;
      totalResults: number;
      resultsPerPage: number;
    }>(cacheKey);

  if (cached) {
    return cached;
  }

  const searchResponse =
    await youtubeRequest<
      YouTubeApiResponse<YouTubeSearchResource>
    >(
      "search",
      {
        part: "snippet",
        q: query,
        type: "video",
        order,
        regionCode,
        safeSearch,
        videoEmbeddable: "true",
        maxResults,
        pageToken,
      }
    );

  const searchItems =
    searchResponse.items || [];

  const videoIds =
    searchItems
      .map(
        (item) =>
          item.id?.videoId
      )
      .filter(
        (
          id
        ): id is string =>
          Boolean(id)
      );

  if (!videoIds.length) {
    const emptyResult = {
      items: [],
      nextPageToken:
        searchResponse.nextPageToken,
      prevPageToken:
        searchResponse.prevPageToken,
      totalResults:
        searchResponse.pageInfo
          ?.totalResults || 0,
      resultsPerPage:
        searchResponse.pageInfo
          ?.resultsPerPage || 0,
    };

    setYouTubeCache(
      cacheKey,
      emptyResult
    );

    return emptyResult;
  }

  const videoResponse =
    await youtubeRequest<
      YouTubeApiResponse<YouTubeVideoResource>
    >(
      "videos",
      {
        part:
          "snippet,contentDetails,statistics,status",
        id: videoIds.join(","),
      }
    );

  const videoMap =
    new Map<
      string,
      YouTubeVideoResource
    >();

  for (const video of
    videoResponse.items || []) {
    videoMap.set(
      video.id,
      video
    );
  }

  const channelIds =
    videoIds
      .map(
        (id) =>
          videoMap.get(id)
            ?.snippet
            ?.channelId
      )
      .filter(
        (
          id
        ): id is string =>
          Boolean(id)
      );

  const channelThumbnails =
    await getChannelThumbnails(
      channelIds
    );

  const items =
    videoIds
      .map((id) =>
        videoMap.get(id)
      )
      .filter(
        (
          video
        ): video is YouTubeVideoResource =>
          Boolean(video)
      )
      .filter(
        (video) =>
          video.status
            ?.embeddable !== false
      )
      .map((video) =>
        normalizeVideo(
          video,
          channelThumbnails.get(
            video.snippet
              ?.channelId || ""
          ) || ""
        )
      );

  const result = {
    items,
    nextPageToken:
      searchResponse.nextPageToken,
    prevPageToken:
      searchResponse.prevPageToken,
    totalResults:
      searchResponse.pageInfo
        ?.totalResults || 0,
    resultsPerPage:
      searchResponse.pageInfo
        ?.resultsPerPage || 0,
  };

  setYouTubeCache(
    cacheKey,
    result
  );

  return result;
}

/* ==========================================================================
| YouTube Utility: Trending
|========================================================================== */

async function getTrendingVideos({
  regionCode,
  maxResults,
}: {
  regionCode: string;
  maxResults: number;
}) {
  const cacheKey =
    JSON.stringify({
      type: "trending",
      regionCode,
      maxResults,
    });

  const cached =
    getYouTubeCache<{
      items: NormalizedYouTubeVideo[];
      nextPageToken?: string;
      prevPageToken?: string;
      totalResults: number;
      resultsPerPage: number;
    }>(cacheKey);

  if (cached) {
    return cached;
  }

  const response =
    await youtubeRequest<
      YouTubeApiResponse<YouTubeVideoResource>
    >(
      "videos",
      {
        part:
          "snippet,contentDetails,statistics,status",
        chart: "mostPopular",
        regionCode,
        maxResults,
      }
    );

  const videos =
    (response.items || [])
      .filter(
        (video) =>
          video.status
            ?.embeddable !== false
      );

  const channelIds =
    videos
      .map(
        (video) =>
          video.snippet
            ?.channelId
      )
      .filter(
        (
          id
        ): id is string =>
          Boolean(id)
      );

  const channelThumbnails =
    await getChannelThumbnails(
      channelIds
    );

  const items =
    videos.map((video) =>
      normalizeVideo(
        video,
        channelThumbnails.get(
          video.snippet
            ?.channelId || ""
        ) || ""
      )
    );

  const result = {
    items,
    nextPageToken:
      response.nextPageToken,
    prevPageToken:
      response.prevPageToken,
    totalResults:
      response.pageInfo
        ?.totalResults || 0,
    resultsPerPage:
      response.pageInfo
        ?.resultsPerPage || 0,
  };

  setYouTubeCache(
    cacheKey,
    result
  );

  return result;
}

/* ==========================================================================
| YouTube Utility: Single Video
|========================================================================== */

async function getYouTubeVideo(
  videoId: string
) {
  const cacheKey =
    `video:${videoId}`;

  const cached =
    getYouTubeCache<NormalizedYouTubeVideo>(
      cacheKey
    );

  if (cached) {
    return cached;
  }

  const response =
    await youtubeRequest<
      YouTubeApiResponse<YouTubeVideoResource>
    >(
      "videos",
      {
        part:
          "snippet,contentDetails,statistics,status",
        id: videoId,
      }
    );

  const video =
    response.items?.[0];

  if (!video) {
    throw new Error(
      "YouTube video was not found."
    );
  }

  if (
    video.status?.embeddable === false
  ) {
    throw new Error(
      "This YouTube video does not allow embedded playback. Open it directly on YouTube."
    );
  }

  const channelThumbnail =
    video.snippet?.channelId
      ? (
          await getChannelThumbnails([
            video.snippet
              .channelId,
          ])
        ).get(
          video.snippet
            .channelId
        ) || ""
      : "";

  const normalized =
    normalizeVideo(
      video,
      channelThumbnail
    );

  setYouTubeCache(
    cacheKey,
    normalized
  );

  return normalized;
}

/* ==========================================================================
| /api/youtube/search
|========================================================================== */

app.get(
  "/api/youtube/search",
  async (req, res) => {
    try {
      if (!YOUTUBE_API_KEY) {
        res.status(503).json({
          error:
            "YOUTUBE_API_KEY is not configured on the server.",
        });

        return;
      }

      const query =
        typeof req.query.q === "string"
          ? req.query.q.trim()
          : "";

      if (!query) {
        res.status(400).json({
          error:
            "Search query is required.",
        });

        return;
      }

      const allowedOrders:
        YouTubeSearchOrder[] = [
          "relevance",
          "date",
          "rating",
          "viewCount",
          "title",
        ];

      const requestedOrder =
        typeof req.query.order ===
        "string"
          ? req.query.order
          : "relevance";

      const order =
        allowedOrders.includes(
          requestedOrder as YouTubeSearchOrder
        )
          ? (requestedOrder as YouTubeSearchOrder)
          : "relevance";

      const allowedSafeSearch:
        YouTubeSafeSearch[] = [
          "none",
          "moderate",
          "strict",
        ];

      const requestedSafeSearch =
        typeof req.query.safeSearch ===
        "string"
          ? req.query.safeSearch
          : "moderate";

      const safeSearch =
        allowedSafeSearch.includes(
          requestedSafeSearch as YouTubeSafeSearch
        )
          ? (requestedSafeSearch as YouTubeSafeSearch)
          : "moderate";

      const regionCode =
        typeof req.query.regionCode ===
        "string"
          ? req.query.regionCode
              .trim()
              .toUpperCase()
          : "IN";

      const pageToken =
        typeof req.query.pageToken ===
        "string"
          ? req.query.pageToken
          : undefined;

      const requestedMaxResults =
        Number(
          req.query.maxResults
        ) || 24;

      const maxResults =
        Math.min(
          Math.max(
            requestedMaxResults,
            1
          ),
          50
        );

      const result =
        await searchYouTubeVideos({
          query,
          order,
          regionCode,
          safeSearch,
          pageToken,
          maxResults,
        });

      res.json(result);
    } catch (error) {
      console.error(
        "YouTube search error:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "YouTube search failed.",
      });
    }
  }
);

/* ==========================================================================
| /api/youtube/trending
|========================================================================== */

app.get(
  "/api/youtube/trending",
  async (req, res) => {
    try {
      if (!YOUTUBE_API_KEY) {
        res.status(503).json({
          error:
            "YOUTUBE_API_KEY is not configured on the server.",
        });

        return;
      }

      const regionCode =
        typeof req.query.regionCode ===
        "string"
          ? req.query.regionCode
              .trim()
              .toUpperCase()
          : "IN";

      const requestedMaxResults =
        Number(
          req.query.maxResults
        ) || 24;

      const maxResults =
        Math.min(
          Math.max(
            requestedMaxResults,
            1
          ),
          50
        );

      const result =
        await getTrendingVideos({
          regionCode,
          maxResults,
        });

      res.json(result);
    } catch (error) {
      console.error(
        "YouTube trending error:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "YouTube trending request failed.",
      });
    }
  }
);

/* ==========================================================================
| /api/youtube/video
|========================================================================== */
app.use(
  "/api/youtube",
  youtubeRouter
);

app.get(
  "/api/youtube/video",
  async (req, res) => {
    try {
      if (!YOUTUBE_API_KEY) {
        res.status(503).json({
          error:
            "YOUTUBE_API_KEY is not configured on the server.",
        });

        return;
      }

      const videoId =
        typeof req.query.id === "string"
          ? req.query.id.trim()
          : "";

      if (!videoId) {
        res.status(400).json({
          error:
            "YouTube video ID is required.",
        });

        return;
      }

      // Basic YouTube ID validation.
      if (
        !/^[A-Za-z0-9_-]{6,20}$/.test(
          videoId
        )
      ) {
        res.status(400).json({
          error:
            "Invalid YouTube video ID.",
        });

        return;
      }

      const video =
        await getYouTubeVideo(
          videoId
        );

      res.json(video);
    } catch (error) {
      console.error(
        "YouTube video error:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve YouTube video.",
      });
    }
  }
);

/* ==========================================================================
| /api/ai
|========================================================================== */

app.post(
  "/api/ai",
  async (req, res) => {
    try {
      if (!ai) {
        res.status(500).json({
          text:
            "GEMINI_API_KEY is not configured on the server.",
        });

        return;
      }

      const {
        action = "generate",
        prompt = "",
        code = "",
        language = "javascript",
        filename = "main",
      } = req.body ?? {};

      const instruction = `
You are the AI coding assistant inside Abhishek Code Studio.

File:
${filename}

Language:
${language}

Requested action:
${action}

User request:
${prompt}

Current code:
----------------
${code}
----------------

Rules:

1. If action is "generate", produce complete working code.
2. If action is "fix", return corrected complete code.
3. If action is "refactor", improve the code while preserving behavior.
4. If action is "explain", explain the code clearly.
5. For code-generation actions, return ONLY the code.
6. Do not use markdown fences around generated code.
7. Keep the solution practical and executable.
8. Include all necessary imports.
9. Never expose API keys, credentials, tokens, or secrets.
10. If the requested language is C++, use standard C++17.
11. If the requested language is C, use standard C.
12. If the requested language is Python, produce Python 3 compatible code.
13. If the requested language is Java, provide a complete Java program.
14. For Java, make the public class name compatible with the filename.
15. If the user asks to add two numbers, create a complete runnable program that reads or clearly defines the inputs.
16. Do not add explanations around generated code.
`;

      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: instruction,
        });

      const text =
        response.text?.trim() || "";

      if (action === "explain") {
        res.json({
          text,
        });

        return;
      }

      const cleanedCode = text
        .replace(
          /^```[a-zA-Z0-9+#-]*\s*/i,
          ""
        )
        .replace(
          /\s*```$/i,
          ""
        )
        .trim();

      res.json({
        code: cleanedCode,
      });
    } catch (error) {
      console.error(
        "AI error:",
        error
      );

      res.status(500).json({
        text:
          error instanceof Error
            ? error.message
            : "AI request failed.",
      });
    }
  }
);

/* ==========================================================================
| /api/execute
|========================================================================== */

app.post(
  "/api/execute",
  async (req, res) => {
    let workspace:
      | Awaited<
          ReturnType<
            typeof createWorkspace
          >
        >
      | null = null;

    try {
      const body =
        req.body as Partial<ExecuteRequest>;

      if (
        !body ||
        typeof body.code !==
          "string" ||
        typeof body.language !==
          "string"
      ) {
        res.status(400).json({
          stdout: "",
          stderr:
            "Invalid execution request. Expected language and code.",
          exitCode: 1,
          durationMs: 0,
        });

        return;
      }

      const language =
        body.language as SupportedLanguage;

      const supportedLanguages:
        SupportedLanguage[] = [
          "javascript",
          "typescript",
          "python",
          "cpp",
          "c",
          "java",
        ];

      if (
        !supportedLanguages.includes(
          language
        )
      ) {
        res.status(400).json({
          stdout: "",
          stderr:
            `Language "${language}" is not supported.`,
          exitCode: 1,
          durationMs: 0,
        });

        return;
      }

      const stdin =
        typeof body.stdin ===
        "string"
          ? body.stdin
          : "";

      /* ----------------------------------------------------------------------
      | Filename
      |----------------------------------------------------------------------- */

      const filename =
        language === "java"
          ? getJavaFilename(
              body.code,
              body.filename
            )
          : getFilename(
              language,
              body.filename
            );

      /* ----------------------------------------------------------------------
      | Create temporary workspace
      |----------------------------------------------------------------------- */

      workspace =
        await createWorkspace(
          body.code,
          filename
        );

      /* ----------------------------------------------------------------------
      | Java
      |----------------------------------------------------------------------- */

      if (language === "java") {
        const className =
          filename.replace(
            /\.java$/i,
            ""
          );

        const compile =
          await runProcess(
            "javac",
            [
              workspace.filePath,
            ],
            workspace.directory,
            "",
            10000
          );

        if (
          compile.exitCode !== 0
        ) {
          res.json({
            stdout:
              compile.stdout,
            stderr:
              compile.stderr,
            exitCode:
              compile.exitCode,
            durationMs:
              compile.durationMs,
          });

          return;
        }

        const result =
          await runProcess(
            "java",
            [
              "-cp",
              workspace.directory,
              className,
            ],
            workspace.directory,
            stdin,
            10000
          );

        res.json({
          stdout:
            result.stdout,
          stderr:
            compile.stderr +
            result.stderr,
          exitCode:
            result.exitCode,
          durationMs:
            compile.durationMs +
            result.durationMs,
        });

        return;
      }

      /* ----------------------------------------------------------------------
      | Python
      |----------------------------------------------------------------------- */

      if (language === "python") {
        const pythonCommand =
          process.platform ===
          "win32"
            ? "python"
            : "python3";

        const result =
          await runProcess(
            pythonCommand,
            [
              workspace.filePath,
            ],
            workspace.directory,
            stdin,
            10000
          );

        res.json(result);

        return;
      }

      /* ----------------------------------------------------------------------
      | C
      |----------------------------------------------------------------------- */

      if (language === "c") {
        const outputPath =
          path.join(
            workspace.directory,
            process.platform ===
            "win32"
              ? "program.exe"
              : "program"
          );

        const compile =
          await runProcess(
            "gcc",
            [
              workspace.filePath,
              "-O2",
              "-o",
              outputPath,
            ],
            workspace.directory,
            "",
            10000
          );

        if (
          compile.exitCode !== 0
        ) {
          res.json({
            stdout:
              compile.stdout,
            stderr:
              compile.stderr,
            exitCode:
              compile.exitCode,
            durationMs:
              compile.durationMs,
          });

          return;
        }

        const result =
          await runProcess(
            outputPath,
            [],
            workspace.directory,
            stdin,
            10000
          );

        res.json({
          stdout:
            result.stdout,
          stderr:
            compile.stderr +
            result.stderr,
          exitCode:
            result.exitCode,
          durationMs:
            compile.durationMs +
            result.durationMs,
        });

        return;
      }

      /* ----------------------------------------------------------------------
      | C++
      |----------------------------------------------------------------------- */

      if (language === "cpp") {
        const outputPath =
          path.join(
            workspace.directory,
            process.platform ===
            "win32"
              ? "program.exe"
              : "program"
          );

        const compile =
          await runProcess(
            "g++",
            [
              workspace.filePath,
              "-std=c++17",
              "-O2",
              "-o",
              outputPath,
            ],
            workspace.directory,
            "",
            10000
          );

        if (
          compile.exitCode !== 0
        ) {
          res.json({
            stdout:
              compile.stdout,
            stderr:
              compile.stderr,
            exitCode:
              compile.exitCode,
            durationMs:
              compile.durationMs,
          });

          return;
        }

        const result =
          await runProcess(
            outputPath,
            [],
            workspace.directory,
            stdin,
            10000
          );

        res.json({
          stdout:
            result.stdout,
          stderr:
            compile.stderr +
            result.stderr,
          exitCode:
            result.exitCode,
          durationMs:
            compile.durationMs +
            result.durationMs,
        });

        return;
      }

      /* ----------------------------------------------------------------------
      | JavaScript
      |----------------------------------------------------------------------- */

      if (
        language ===
        "javascript"
      ) {
        const result =
          await runProcess(
            process.execPath,
            [
              workspace.filePath,
            ],
            workspace.directory,
            stdin,
            10000
          );

        res.json(result);

        return;
      }

      /* ----------------------------------------------------------------------
      | TypeScript
      |----------------------------------------------------------------------- */

      if (
        language ===
        "typescript"
      ) {
        // Compile in the server's installed toolchain. Running `npx` from the
        // temporary workspace can trigger a network install (or fail to find
        // the project's local tsx binary).
        const compiled = await transform(
          body.code,
          {
            loader: "ts",
            format: "cjs",
            target: "es2020",
            sourcefile: filename,
          }
        );
        const compiledPath = `${workspace.filePath}.cjs`;
        await fs.writeFile(
          compiledPath,
          compiled.code,
          "utf8"
        );

        const result =
          await runProcess(
            process.execPath,
            [
              compiledPath,
            ],
            workspace.directory,
            stdin,
            10000
          );

        res.json(result);

        return;
      }

      /* ----------------------------------------------------------------------
      | Fallback
      |----------------------------------------------------------------------- */

      res.status(400).json({
        stdout: "",
        stderr:
          `Language "${language}" is not supported.`,
        exitCode: 1,
        durationMs: 0,
      });
    } catch (error) {
      console.error(
        "Execution error:",
        error
      );

      res.status(500).json({
        stdout: "",
        stderr:
          error instanceof Error
            ? error.message
            : "Execution server error.",
        exitCode: 1,
        durationMs: 0,
      });
    } finally {
      if (workspace) {
        await cleanupWorkspace(
          workspace.directory
        );
      }
    }
  }
);

/* ==========================================================================
| Server
|========================================================================== */

app.listen(
  PORT,
  () => {
    console.log("");

    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log(
      "  Abhishek Code Studio Server"
    );

    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log(
      `  Server:   http://localhost:${PORT}`
    );

    console.log(
      `  Health:   http://localhost:${PORT}/api/health`
    );

    console.log(
      `  AI:       http://localhost:${PORT}/api/ai`
    );

    console.log(
      `  Code:     http://localhost:${PORT}/api/execute`
    );

    console.log(
      `  YouTube:  http://localhost:${PORT}/api/youtube/search`
    );

    console.log(
      `  Trending: http://localhost:${PORT}/api/youtube/trending`
    );

    console.log(
      `  Video:    http://localhost:${PORT}/api/youtube/video`
    );

    console.log(
      `  AI:       ${ai ? "enabled" : "disabled"}`
    );

    console.log(
      `  YouTube:  ${YOUTUBE_API_KEY ? "enabled" : "disabled"}`
    );

    console.log(
      `  OS:       ${process.platform}`
    );

    console.log(
      `  Node:     ${process.version}`
    );

    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log("");
  }
);