import { createServerFn } from "@tanstack/react-start";

export const sendEmailServer = createServerFn({ method: "POST" })
  .validator((data: { to: string; subject: string; html: string; from?: string }) => data)
  .handler(async ({ data }) => {
    const apiKey =
      (typeof process !== "undefined" && (process.env?.RESEND_API_KEY || process.env?.VITE_RESEND_API_KEY)) ||
      "";
    const fromAddress =
      data.from ||
      (typeof process !== "undefined" && process.env?.RESEND_FROM_EMAIL) ||
      "Precious Meets <invitations@preciousmeets.com>";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress.trim(),
        to: [data.to],
        subject: data.subject,
        html: data.html,
      }),
    });
    const json = await res.json();
    return { ok: res.ok, status: res.status, data: json };
  });
