import { proxyToOdoo } from "@/lib/proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToOdoo(`/api/student/quiz/${id}/attend-url`, request, { method: "GET" });
}
