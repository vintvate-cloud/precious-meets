// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "resend-email-api-plugin",
        configureServer(server) {
          const env = loadEnv(server.config.mode || "development", process.cwd(), "");
          const verificationsFilePath = path.resolve(process.cwd(), "data", "verifications.json");
          const applicationsFilePath = path.resolve(process.cwd(), "data", "applications.json");

          const readJsonSafe = (filePath: string) => {
            try {
              if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
              }
            } catch (e) {}
            return [];
          };

          const writeJsonSafe = (filePath: string, data: any) => {
            try {
              const dir = path.dirname(filePath);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
            } catch (e) {
              console.error("[Vite API] Failed to write data file:", e);
            }
          };

          server.middlewares.use("/api/verifications", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            if (req.method === "GET") {
              const list = readJsonSafe(verificationsFilePath);
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true, data: list }));
              return;
            }
            if (req.method === "POST") {
              let bodyStr = "";
              req.on("data", (chunk: any) => {
                bodyStr += chunk;
              });
              req.on("end", () => {
                try {
                  const payload = JSON.parse(bodyStr || "{}");
                  let list = readJsonSafe(verificationsFilePath);
                  if (Array.isArray(payload)) {
                    list = payload;
                  } else if (payload && payload.email) {
                    list = [
                      payload,
                      ...list.filter((x: any) => x.email?.toLowerCase() !== payload.email?.toLowerCase()),
                    ];
                  }
                  writeJsonSafe(verificationsFilePath, list);
                  res.statusCode = 200;
                  res.end(JSON.stringify({ ok: true, data: list }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ ok: false, error: err.message }));
                }
              });
              return;
            }
            if (req.method === "DELETE") {
              try {
                const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
                const id = url.searchParams.get("id");
                const email = url.searchParams.get("email")?.toLowerCase().trim();
                let list = readJsonSafe(verificationsFilePath);
                list = list.filter((item: any) => {
                  if (id && item.id === id) return false;
                  if (id && item.id === `ver_${id}`) return false;
                  if (email && item.email?.toLowerCase().trim() === email) return false;
                  return true;
                });
                writeJsonSafe(verificationsFilePath, list);
                res.statusCode = 200;
                res.end(JSON.stringify({ ok: true, data: list }));
                return;
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ ok: false, error: err.message }));
                return;
              }
            }
            res.statusCode = 405;
            res.end("Method Not Allowed");
          });

          server.middlewares.use("/api/applications", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            if (req.method === "GET") {
              const list = readJsonSafe(applicationsFilePath);
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true, data: list }));
              return;
            }
            if (req.method === "POST") {
              let bodyStr = "";
              req.on("data", (chunk: any) => {
                bodyStr += chunk;
              });
              req.on("end", () => {
                try {
                  const payload = JSON.parse(bodyStr || "{}");
                  let list = readJsonSafe(applicationsFilePath);
                  if (Array.isArray(payload)) {
                    list = payload;
                  } else if (payload && payload.applicantEmail) {
                    const idx = list.findIndex(
                      (x: any) => x.applicantEmail?.toLowerCase() === payload.applicantEmail?.toLowerCase()
                    );
                    if (idx >= 0) list[idx] = payload;
                    else list.unshift(payload);
                  }
                  writeJsonSafe(applicationsFilePath, list);
                  res.statusCode = 200;
                  res.end(JSON.stringify({ ok: true, data: list }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ ok: false, error: err.message }));
                }
              });
              return;
            }
            if (req.method === "DELETE") {
              try {
                const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
                const id = url.searchParams.get("id");
                const email = url.searchParams.get("email")?.toLowerCase().trim();
                let list = readJsonSafe(applicationsFilePath);
                list = list.filter((item: any) => {
                  if (id && item.id === id) return false;
                  if (id && `ver_${item.id}` === id) return false;
                  if (email && item.applicantEmail?.toLowerCase().trim() === email) return false;
                  return true;
                });
                writeJsonSafe(applicationsFilePath, list);
                res.statusCode = 200;
                res.end(JSON.stringify({ ok: true, data: list }));
                return;
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ ok: false, error: err.message }));
                return;
              }
            }
            res.statusCode = 405;
            res.end("Method Not Allowed");
          });

          server.middlewares.use("/api/send-email", async (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end("Method Not Allowed");
              return;
            }
            let bodyStr = "";
            req.on("data", (chunk: any) => {
              bodyStr += chunk;
            });
            req.on("end", async () => {
              try {
                const body = JSON.parse(bodyStr || "{}");
                const apiKey =
                  env.RESEND_API_KEY ||
                  env.VITE_RESEND_API_KEY ||
                  process.env.RESEND_API_KEY ||
                  process.env.VITE_RESEND_API_KEY ||
                  "";
                const from =
                  body.from ||
                  env.RESEND_FROM_EMAIL ||
                  env.VITE_RESEND_FROM_EMAIL ||
                  process.env.RESEND_FROM_EMAIL ||
                  process.env.VITE_RESEND_FROM_EMAIL ||
                  "Precious Meets <invitations@cikka.club>";

                const response = await fetch("https://api.resend.com/emails", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${apiKey.trim()}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    from: from.trim(),
                    to: Array.isArray(body.to) ? body.to : [body.to],
                    subject: body.subject,
                    html: body.html,
                  }),
                });

                const resData = await response.json();
                res.setHeader("Content-Type", "application/json");
                res.statusCode = response.status;
                res.end(JSON.stringify({ ok: response.ok, status: response.status, data: resData }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: false, error: err.message || String(err) }));
              }
            });
          });
        },
      },
    ],
  },
});

