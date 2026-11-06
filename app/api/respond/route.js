import { admin } from "@/lib/supabaseServer";

export async function POST(req) {
  const { name, status } = await req.json().catch(() => ({}));
  const clean = String(name || "").trim().replace(/\s+/g, " ").slice(0, 24);
  if (!clean || !["join", "out"].includes(status))
    return Response.json({ error: "이름과 참여 여부를 확인해 주세요." }, { status: 400 });
  const { error } = await admin.from("responses").upsert(
    { name_key: clean.toLowerCase(), name: clean, status, updated_at: new Date().toISOString() },
    { onConflict: "name_key" }
  );
  if (error) return Response.json({ error: "저장에 실패했어요. 다시 눌러 주세요." }, { status: 500 });
  return Response.json({ ok: true });
}
