// Server-side only. Runs in Node, not the browser — so cross-origin
// rules simply don't apply here, which is the whole point: rather
// than depend on Odoo's CORS configuration behaving correctly, the
// browser only ever talks to this Next.js app (same origin), and
// this code makes the actual Odoo call server-to-server.

const ODOO_BASE = process.env.ODOO_BASE_URL || "http://localhost:8019";

export async function proxyToOdoo(
  odooPath: string,
  request: Request,
  init: RequestInit = {}
): Promise<Response> {
  const authHeader = request.headers.get("authorization");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authHeader) headers["Authorization"] = authHeader;

  const odooRes = await fetch(`${ODOO_BASE}${odooPath}`, {
    ...init,
    headers,
  });

  const text = await odooRes.text();
  return new Response(text, {
    status: odooRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
