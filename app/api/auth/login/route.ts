import { proxyToOdoo } from "@/lib/proxy";

export async function POST(request: Request) {
  const body = await request.text();
  return proxyToOdoo("/api/auth/login", request, { method: "POST", body });
}
