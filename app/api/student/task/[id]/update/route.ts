import { proxyToOdoo } from "@/lib/proxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.text();
  return proxyToOdoo(`/api/student/task/${id}/update`, request, { method: "POST", body });
}
