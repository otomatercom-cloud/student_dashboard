import { proxyToOdoo } from "@/lib/proxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToOdoo(`/api/student/task/${id}/toggle`, request, { method: "POST" });
}
