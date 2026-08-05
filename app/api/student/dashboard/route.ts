import { proxyToOdoo } from "@/lib/proxy";

export async function GET(request: Request) {
  return proxyToOdoo("/api/student/dashboard", request, { method: "GET" });
}
