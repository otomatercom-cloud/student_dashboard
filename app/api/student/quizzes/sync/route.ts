import { proxyToOdoo } from "@/lib/proxy";

export async function POST(request: Request) {
  return proxyToOdoo("/api/student/quizzes/sync", request, { method: "POST" });
}
