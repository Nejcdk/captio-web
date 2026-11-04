// A picked file of up to 4 MB, passed straight on to the speech service's
// files API (bigger ones go through Storage, see ../route.ts). The body is
// the file itself; its name comes in x-file-name.

import { env, errorResponse, HttpError, requireUser } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 4.4 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const user = await requireUser(req);
    const body = await req.arrayBuffer();
    if (!body.byteLength) throw new HttpError(400, "empty file");
    if (body.byteLength > MAX_BYTES) throw new HttpError(413, "file too large for a direct upload");
    const name = decodeURIComponent(req.headers.get("x-file-name") ?? "audio") || "audio";
    const form = new FormData();
    form.append("file", new Blob([body], { type: req.headers.get("content-type") ?? "application/octet-stream" }), name);
    form.append("client_reference_id", `web_${user.id}`.slice(0, 120));
    const res = await fetch("https://api.soniox.com/v1/files", {
      method: "POST",
      headers: { Authorization: `Bearer ${env("SONIOX_API_KEY")}` },
      body: form,
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; error_type?: string; error_message?: string };
    if (!res.ok || !data.id) {
      return Response.json({ error: data.error_type ?? `file_upload_failed_${res.status}`, message: data.error_message }, { status: 502 });
    }
    return Response.json({ fileId: data.id });
  } catch (e) {
    return errorResponse(e);
  }
}
