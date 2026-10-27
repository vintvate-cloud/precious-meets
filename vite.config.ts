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
                const freshEnv = loadEnv(server.config.mode || "development", process.cwd(), "");
                const apiKey =
                  freshEnv.RESEND_API_KEY ||
                  freshEnv.VITE_RESEND_API_KEY ||
                  process.env.RESEND_API_KEY ||
                  process.env.VITE_RESEND_API_KEY ||
                  "";
                const from =
                  body.from ||
                  freshEnv.RESEND_FROM_EMAIL ||
                  freshEnv.VITE_RESEND_FROM_EMAIL ||
                  process.env.RESEND_FROM_EMAIL ||
                  process.env.VITE_RESEND_FROM_EMAIL ||
                  "Precious Meets <invitations@preciousmeets.com>";

                let response = await fetch("https://api.resend.com/emails", {
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

                let resData: any = await response.json();

                // Fallback 1: If domain preciousmeets.com is not verified yet, fallback to onboarding@resend.dev
                if (!response.ok && resData?.message?.includes("domain is not verified")) {
                  console.warn("[resend-email-api-plugin] Domain preciousmeets.com unverified on Resend. Retrying with onboarding@resend.dev...");
                  response = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${apiKey.trim()}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      from: "Precious Meets <onboarding@resend.dev>",
                      to: Array.isArray(body.to) ? body.to : [body.to],
                      subject: body.subject,
                      html: body.html,
                    }),
                  });
                  resData = await response.json();
                }

                // Fallback 2: If Resend sandbox restricts delivery to account owner email
                if (!response.ok && (resData?.message?.includes("testing emails to your own email address") || resData?.message?.includes("validation_error"))) {
                  const match = resData?.message?.match(/to your own email address \(([^)]+)\)/);
                  const fallbackOwnerEmail = (match && match[1]) ? match[1] : "preciousmeetsdeveloper@gmail.com";
                  const targetTo = Array.isArray(body.to) ? body.to.join(", ") : body.to;
                  console.warn(`[resend-email-api-plugin] Resend sandbox restriction: routing test email for ${targetTo} to verified sandbox address ${fallbackOwnerEmail}...`);
                  response = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${apiKey.trim()}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      from: "Precious Meets <onboarding@resend.dev>",
                      to: [fallbackOwnerEmail],
                      subject: `[For: ${targetTo}] ${body.subject}`,
                      html: `<div style="background:#fff3cd;padding:12px;margin-bottom:16px;border:1px solid #ffeeba;border-radius:4px;font-family:sans-serif;font-size:12px;color:#856404;">
                        <strong>⚠️ Resend Sandbox Delivery Note:</strong> This test email was originally addressed to <strong>${targetTo}</strong>. Because the custom domain <code>preciousmeets.com</code> is pending DNS verification on <a href="https://resend.com/domains" target="_blank">resend.com/domains</a>, Resend delivered it to the registered sandbox testing account (<strong>${fallbackOwnerEmail}</strong>). Once the domain is verified, emails will go directly to recipient inboxes.
                      </div>${body.html}`,
                    }),
                  });
                  resData = await response.json();
                }

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

