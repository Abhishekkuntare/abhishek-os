import express from "express";
import cors from "cors";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";
import { spawn } from "child_process";
import { transform } from "esbuild";

const app = express();

const PORT = Number(
  process.env.EXECUTION_PORT || 8787
);

app.use(cors());

app.use(
  express.json({
    limit: "1mb",
  })
);

type SupportedLanguage =
  | "javascript"
  | "typescript"
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

function runProcess(
  command: string,
  args: string[],
  cwd: string,
  stdin: string,
  timeoutMs = 10000
): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}> {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    const child = spawn(command, args, {
      cwd,
      shell: false,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    let finished = false;

    const finish = (
      exitCode: number
    ) => {
      if (finished) return;

      finished = true;

      resolve({
        stdout,
        stderr,
        exitCode,
        durationMs:
          Date.now() - startedAt,
      });
    };

    const timeout = setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {}

      stderr += "\nProcess terminated: timeout.";

      finish(124);
    }, timeoutMs);

    child.stdout.on(
      "data",
      (data) => {
        stdout += data.toString();
      }
    );

    child.stderr.on(
      "data",
      (data) => {
        stderr += data.toString();
      }
    );

    child.on("error", (error) => {
      clearTimeout(timeout);

      stderr += error.message;

      finish(1);
    });

    child.on(
      "close",
      (code) => {
        clearTimeout(timeout);

        finish(code ?? 0);
      }
    );

    if (stdin) {
      child.stdin.write(stdin);
    }

    child.stdin.end();
  });
}

async function createWorkspace(
  code: string,
  filename: string
) {
  const id = crypto
    .randomBytes(12)
    .toString("hex");

  const directory =
    await fs.mkdtemp(
      path.join(
        os.tmpdir(),
        `abhishek-code-${id}-`
      )
    );

  const filePath = path.join(
    directory,
    filename
  );

  await fs.writeFile(
    filePath,
    code,
    "utf8"
  );

  return {
    directory,
    filePath,
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
  } catch {}
}

app.post(
  "/api/execute",
  async (req, res) => {
    const body =
      req.body as ExecuteRequest;

    if (
      !body ||
      typeof body.code !== "string" ||
      !body.language
    ) {
      res.status(400).json({
        stderr:
          "Invalid execution request.",
        exitCode: 1,
      });

      return;
    }

    const language =
      body.language;

    const stdin =
      body.stdin || "";

    let filename =
      body.filename || "main";

    let extension = "";

    if (language === "javascript") {
      extension = ".js";
    }

    if (language === "typescript") {
      extension = ".ts";
    }

    if (language === "python") {
      extension = ".py";
    }

    if (language === "cpp") {
      extension = ".cpp";
    }

    if (language === "c") {
      extension = ".c";
    }

    if (language === "java") {
      extension = ".java";
    }

    if (
      !filename.endsWith(extension)
    ) {
      filename =
        filename.replace(
          /\.[^/.]+$/,
          ""
        ) + extension;
    }

    /*
     * Java requires the filename to match
     * the public class name.
     *
     * For production, a proper Java source
     * parser/compiler workflow is recommended.
     */

    const workspace =
      await createWorkspace(
        body.code,
        filename
      );

    try {
      if (language === "javascript") {
        res.json(
          await runProcess(
            process.execPath,
            [workspace.filePath],
            workspace.directory,
            stdin
          )
        );
        return;
      }

      if (language === "typescript") {
        const compiled = await transform(body.code, {
          loader: "ts",
          format: "cjs",
          target: "es2020",
          sourcefile: filename,
        });
        const compiledPath = `${workspace.filePath}.cjs`;
        await fs.writeFile(compiledPath, compiled.code, "utf8");
        res.json(
          await runProcess(
            process.execPath,
            [compiledPath],
            workspace.directory,
            stdin
          )
        );
        return;
      }

      /* --------------------------------------------------------------- */
      /* Python                                                          */
      /* --------------------------------------------------------------- */

      if (language === "python") {
        const pythonCommand =
          process.platform === "win32"
            ? "python"
            : "python3";

        const result =
          await runProcess(
            pythonCommand,
            [workspace.filePath],
            workspace.directory,
            stdin
          );

        res.json(result);
        return;
      }

      /* --------------------------------------------------------------- */
      /* C                                                                */
      /* --------------------------------------------------------------- */

      if (language === "c") {
        const executable =
          process.platform === "win32"
            ? "program.exe"
            : "./program";

        const compile =
          await runProcess(
            "gcc",
            [
              workspace.filePath,
              "-O2",
              "-o",
              path.join(
                workspace.directory,
                "program" +
                  (process.platform ===
                  "win32"
                    ? ".exe"
                    : "")
              ),
            ],
            workspace.directory,
            ""
          );

        if (compile.exitCode !== 0) {
          res.json(compile);
          return;
        }

        const result =
          await runProcess(
            executable,
            [],
            workspace.directory,
            stdin
          );

        res.json({
          stdout: result.stdout,
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

      /* --------------------------------------------------------------- */
      /* C++                                                              */
      /* --------------------------------------------------------------- */

      if (language === "cpp") {
        const executable =
          process.platform === "win32"
            ? "program.exe"
            : "./program";

        const outputPath =
          path.join(
            workspace.directory,
            "program" +
              (process.platform ===
              "win32"
                ? ".exe"
                : "")
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
            ""
          );

        if (compile.exitCode !== 0) {
          res.json(compile);
          return;
        }

        const result =
          await runProcess(
            executable,
            [],
            workspace.directory,
            stdin
          );

        res.json({
          stdout: result.stdout,
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

      /* --------------------------------------------------------------- */
      /* Java                                                             */
      /* --------------------------------------------------------------- */

      if (language === "java") {
        const sourceName =
          filename.replace(
            /\.java$/i,
            ""
          );

        const compile =
          await runProcess(
            "javac",
            [workspace.filePath],
            workspace.directory,
            ""
          );

        if (compile.exitCode !== 0) {
          res.json(compile);
          return;
        }

        const result =
          await runProcess(
            "java",
            [
              "-cp",
              workspace.directory,
              sourceName,
            ],
            workspace.directory,
            stdin
          );

        res.json({
          stdout: result.stdout,
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

      /* --------------------------------------------------------------- */
      /* Unsupported                                                       */
      /* --------------------------------------------------------------- */

      res.status(400).json({
        stderr:
          `Language '${language}' is not supported by the execution server.`,
        exitCode: 1,
      });
    } finally {
      await cleanupWorkspace(
        workspace.directory
      );
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `Abhishek Code Execution Server running on http://localhost:${PORT}`
  );
});