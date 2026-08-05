import { proxyToOdoo } from "@/lib/proxy";

export async function POST(request: Request) {
  const body = await request.text();
  return proxyToOdoo("/api/student/doubts", request, { method: "POST", body });
}
