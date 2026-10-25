// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

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

