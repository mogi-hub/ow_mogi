import { admin } from "@/lib/supabaseServer";
import { verify, setPassword } from "@/lib/auth";

const TEXT = { siteTitle: 40, headline: 60, eventTitle: 40, eventTime: 40 };
const COLORS = ["join", "out", "accent", "warn"];

export async function POST(req, { params }) {
  const body = await req.json().catch(() => ({}));
  if (!(await verify(body.password)))
    return Response.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 });

  switch (params.action) {
    case "verify":
      return Response.json({ ok: true });

    case "reset": {
      const { error } = await admin.from("responses").delete().neq("name_key", "");
      if (error) return Response.json({ error: "초기화 실패" }, { status: 500 });
      return Response.json({ ok: true });
    }

    case "settings": {
      const s = body.settings || {}, rows = [];
      for (const [k, max] of Object.entries(TEXT))
        if (typeof s[k] === "string" && s[k].trim()) rows.push({ k, v: s[k].trim().slice(0, max) });
      for (const k of COLORS)
        if (/^#[0-9a-f]{6}$/i.test(s[k] || "")) rows.push({ k, v: s[k] });
      const n = parseInt(s.expectedPlayers, 10);
      if (n >= 1 && n <= 200) rows.push({ k: "expectedPlayers", v: String(n) });
      if (rows.length) {
        const { error } = await admin.from("settings").upsert(rows, { onConflict: "k" });
        if (error) return Response.json({ error: "저장 실패" }, { status: 500 });
      }
      return Response.json({ ok: true });
    }

    case "password": {
      const np = String(body.newPassword || "");
      if (np.length < 6) return Response.json({ error: "새 비밀번호는 6자 이상이어야 해요." }, { status: 400 });
      const { error } = await setPassword(np);
      if (error) return Response.json({ error: "변경 실패 (supabase.sql의 secrets 테이블을 만들었는지 확인)" }, { status: 500 });
      return Response.json({ ok: true });
    }
  }
  return Response.json({ error: "not found" }, { status: 404 });
}
