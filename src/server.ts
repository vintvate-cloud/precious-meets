import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/send-email" && request.method === "POST") {
        try {
          const body = (await request.json()) as {
            to: string | string[];
            subject: string;
            html: string;
            from?: string;
          };
          const apiKey =
            (typeof process !== "undefined" && (process.env?.RESEND_API_KEY || process.env?.VITE_RESEND_API_KEY)) ||
            ((env as any)?.RESEND_API_KEY || (env as any)?.VITE_RESEND_API_KEY) ||
            "";
          const from =
            body.from ||
            (typeof process !== "undefined" && (process.env?.RESEND_FROM_EMAIL || process.env?.VITE_RESEND_FROM_EMAIL)) ||
            ((env as any)?.RESEND_FROM_EMAIL || (env as any)?.VITE_RESEND_FROM_EMAIL) ||
            "Precious Meets <invitations@preciousmeets.com>";

          let resendRes = await fetch("https://api.resend.com/emails", {
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

          let resData: any = await resendRes.json();

          // Fallback 1: Domain unverified fallback to onboarding@resend.dev
          if (!resendRes.ok && resData?.message?.includes("domain is not verified")) {
            resendRes = await fetch("https://api.resend.com/emails", {
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
            resData = await resendRes.json();
          }

          // Fallback 2: Sandbox recipient restriction fallback
          if (!resendRes.ok && (resData?.message?.includes("testing emails to your own email address") || resData?.message?.includes("validation_error"))) {
            const targetTo = Array.isArray(body.to) ? body.to.join(", ") : body.to;
            resendRes = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey.trim()}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Precious Meets <onboarding@resend.dev>",
                to: ["preciousmeetsdeveloper@gmail.com"],
                subject: `[For: ${targetTo}] ${body.subject}`,
                html: `<div style="background:#fff3cd;padding:12px;margin-bottom:16px;border:1px solid #ffeeba;border-radius:4px;font-family:sans-serif;font-size:12px;color:#856404;">
                  <strong>⚠️ Resend Sandbox Delivery Note:</strong> This email was addressed to <strong>${targetTo}</strong>. Because custom domain <code>preciousmeets.com</code> is pending verification on <a href="https://resend.com/domains" target="_blank">resend.com/domains</a>, it was delivered to the registered testing account.
                </div>${body.html}`,
              }),
            });
            resData = await resendRes.json();
          }

          return new Response(
            JSON.stringify({ ok: resendRes.ok, status: resendRes.status, data: resData }),
            {
              status: resendRes.status,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (apiErr: any) {
          return new Response(
            JSON.stringify({ ok: false, error: apiErr.message || String(apiErr) }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  },
};
