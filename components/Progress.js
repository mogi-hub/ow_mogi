"use client";
import { useEffect, useState } from "react";

function ago(t) {
  const d = Math.floor((Date.now() - t) / 1000);
  return d < 10 ? "just now" : d < 60 ? `${d}s ago` : d < 3600 ? `${Math.floor(d / 60)}m ago` : `${Math.floor(d / 3600)}h ago`;
}

export default function Progress({ join, out, updatedAt, expectedPlayers }) {
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(n => n + 1), 10000); return () => clearInterval(t); }, []);
  const answered = join.length + out.length;
  const total = Math.max(expectedPlayers, answered);
  const pct = total ? Math.round((join.length / total) * 100) : 0;
  return (
    <section className="hud clip" style={{ marginTop: 12 }}>
      <div className="meta"><span>응답률 <b>{answered} / {total}명 응답</b></span><span>참여율 {pct}%</span></div>
      <div className="bar"><i style={{ width: pct + "%" }} /></div>
      <div className="meta"><span>{updatedAt ? "Last updated: " + ago(updatedAt) : "아직 응답이 없어요"}</span><span>● LIVE</span></div>
    </section>
  );
}
