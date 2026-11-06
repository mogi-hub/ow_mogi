"use client";
import { useEffect, useState } from "react";

export default function RsvpForm({ join, out }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { try { setName(localStorage.getItem("ow-name") || ""); } catch {} }, []);

  const key = name.trim().replace(/\s+/g, " ").toLowerCase();
  const mine = join.some(r => r.name.toLowerCase() === key) ? "join"
             : out.some(r => r.name.toLowerCase() === key) ? "out" : null;

  async function send(status) {
    if (!name.trim()) { setMsg("먼저 닉네임을 입력해 주세요."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/respond", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, status }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      try { localStorage.setItem("ow-name", name.trim()); } catch {}
      setMsg(status === "join" ? "✅ 참여로 등록됐어요!" : "✅ 미참여로 등록됐어요.");
    } catch (e) { setMsg(e.message || "실패했어요. 다시 눌러 주세요."); }
    setBusy(false);
  }
  const cls = (st, base) => `btn ${base} clip` + (mine === st ? " on" : mine ? " dim" : "");

  return (
    <section className="hud clip">
      <input value={name} onChange={e => setName(e.target.value)} maxLength={24} autoComplete="off"
             placeholder="BattleTag 또는 닉네임을 입력하세요" />
      <div className="choices">
        <button className={cls("join", "j")} disabled={busy} onClick={() => send("join")}>🟢 참여</button>
        <button className={cls("out", "o")} disabled={busy} onClick={() => send("out")}>🔴 미참여</button>
      </div>
      <div className="msg">{msg}</div>
    </section>
  );
}
